import { CV_EXT, CV_MAX_MB } from "@/data/careers";
import { validateContact } from "@/lib/contact-form";
import { MailConfigError, sendMail, type MailAttachment } from "@/lib/mail";

/**
 * POST /api/invia  (multipart/form-data)
 * Riceve i form del sito (campo `tipo`: "contatti" | "candidatura"), controlla i dati lato server
 * e inoltra tutto a MAIL_TO con Resend. Chi ha scritto finisce in Reply-To.
 */

const MAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
const field = (fd: FormData, k: string, max = 4000) => String(fd.get(k) ?? "").trim().slice(0, max);
const oneLine = (s: string) => s.replace(/[\r\n]+/g, " ");
const safeName = (s: string) => s.replace(/[^\w.\- ]/g, "_");

// Antispam leggero: al massimo 5 invii ogni 10 minuti per IP. È in memoria: con più istanze/serverless è un freno, non un limite rigido.
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
}

const fail = (error: string, status = 400) => Response.json({ error }, { status });

export async function POST(req: Request) {
  let fd: FormData;
  try {
    fd = await req.formData();
  } catch {
    return fail("Richiesta non valida.");
  }

  // honeypot: campo nascosto che solo i bot compilano. Rispondiamo "ok" senza inviare nulla.
  if (field(fd, "sito")) return Response.json({ ok: true });

  const tipo = field(fd, "tipo");
  if (tipo !== "contatti" && tipo !== "candidatura") return fail("Richiesta non valida.");

  const nome = field(fd, "nome", 160);
  const email = field(fd, "email", 200);
  const telefono = field(fd, "telefono", 40);
  const messaggio = field(fd, "messaggio");
  const privacy = fd.get("privacy") === "on";
  const files = fd.getAll("f").filter((f): f is File => f instanceof File && f.size > 0);

  if (tipo === "contatti") {
    // stesse regole e stessi messaggi del modulo nel browser
    const allegati = files.reduce((tot, f) => tot + f.size, 0);
    const errore = Object.values(validateContact({ nome, email, telefono, privacy, allegati }))[0];
    if (errore) return fail(errore);
  } else {
    if (!nome) return fail("Ci dici come ti chiami?");
    if (!MAIL_RE.test(email)) return fail("Controlla l’indirizzo email: manca qualcosa.");
    if (telefono && telefono.replace(/\D/g, "").length < 6) return fail("Controlla il numero di telefono.");
    if (!privacy) return fail("Serve il consenso al trattamento dei dati.");
  }

  const rows: [string, string][] = [
    ["Nome", nome],
    ["Email", email],
    ["Telefono", telefono || "-"],
  ];
  const attachments: MailAttachment[] = [];
  let subject: string;

  if (tipo === "candidatura") {
    const cv = fd.get("cv");
    if (!(cv instanceof File) || cv.size === 0) return fail("Allega il tuo CV.");
    if (!CV_EXT.some((x) => cv.name.toLowerCase().endsWith(x))) return fail("Il CV deve essere un PDF o un documento Word.");
    if (cv.size > CV_MAX_MB * 1024 * 1024) return fail(`Il file supera i ${CV_MAX_MB} MB.`);
    attachments.push({ filename: safeName(cv.name), content: Buffer.from(await cv.arrayBuffer()) });
    rows.push(["Area", field(fd, "area", 200) || "-"], ["Link", field(fd, "link", 400) || "-"]);
    subject = `Candidatura: ${oneLine(nome)}`;
  } else {
    const servizi = fd.getAll("servizi").map((x) => String(x).slice(0, 80)).slice(0, 12);
    rows.push(["Servizi", servizi.join(", ") || "-"]);
    for (const f of files) attachments.push({ filename: safeName(f.name), content: Buffer.from(await f.arrayBuffer()) });
    rows.push(["Allegati", attachments.map((a) => a.filename).join(", ") || "-"]);
    subject = `Nuova richiesta dal sito: ${oneLine(nome)}`;
  }
  rows.push(["Messaggio", messaggio || "-"]);

  const text = rows.map(([k, v]) => `${k}: ${v}`).join("\n");
  const html =
    `<table style="font:15px/1.5 Arial,sans-serif;border-collapse:collapse">` +
    rows
      .map(
        ([k, v]) =>
          `<tr><td style="padding:4px 16px 4px 0;color:#666;vertical-align:top">${esc(k)}</td>` +
          `<td style="padding:4px 0;white-space:pre-wrap">${esc(v)}</td></tr>`,
      )
      .join("") +
    `</table>`;

  // il freno conta solo gli invii validi: gli errori di compilazione non consumano il limite
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
  if (limited(ip)) return fail("Troppi invii ravvicinati: riprova tra qualche minuto.", 429);

  try {
    await sendMail({ subject, html, text, replyTo: email, attachments });
  } catch (e) {
    console.error("[invia]", e);
    return fail(
      e instanceof MailConfigError
        ? "Il servizio email non è ancora configurato."
        : "Non siamo riusciti a inviare il messaggio. Riprova tra poco.",
      502,
    );
  }
  return Response.json({ ok: true });
}
