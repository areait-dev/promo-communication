/**
 * Invio email con Resend (API REST via fetch: nessuna dipendenza in più). Da usare solo lato server.
 *
 * Variabili d'ambiente (vedi .env.example):
 *  - RESEND_API_KEY  chiave API di Resend (resend.com/api-keys)
 *  - MAIL_FROM       mittente, su un dominio verificato in Resend, es. "Promo Communication <sito@promocommunication.it>"
 *  - MAIL_TO         destinatario/i delle richieste, separati da virgola
 *
 * Senza queste variabili, in sviluppo l'email NON parte: viene stampata nel terminale e l'invio risulta riuscito.
 * In produzione la mancanza è un errore (il form mostra il messaggio di errore).
 */

export type MailAttachment = { filename: string; content: Buffer };

export type MailInput = {
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
  attachments?: MailAttachment[];
};

export class MailConfigError extends Error {}

export async function sendMail(m: MailInput): Promise<{ simulated: boolean }> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.MAIL_FROM;
  const to = (process.env.MAIL_TO ?? "")
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);

  if (!key || !from || !to.length) {
    if (process.env.NODE_ENV !== "production") {
      console.log(
        `\n[mail] RESEND_API_KEY / MAIL_FROM / MAIL_TO non impostati: email simulata.\n` +
          `Oggetto: ${m.subject}\nReply-To: ${m.replyTo ?? "-"}\n` +
          `Allegati: ${m.attachments?.map((a) => a.filename).join(", ") || "nessuno"}\n\n${m.text}\n`,
      );
      return { simulated: true };
    }
    throw new MailConfigError("Configurazione email mancante (RESEND_API_KEY, MAIL_FROM, MAIL_TO).");
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to,
      subject: m.subject,
      html: m.html,
      text: m.text,
      reply_to: m.replyTo,
      attachments: m.attachments?.map((a) => ({ filename: a.filename, content: a.content.toString("base64") })),
    }),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Resend ${res.status}: ${detail.slice(0, 300)}`);
  }
  return { simulated: false };
}
