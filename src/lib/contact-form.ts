/** Regole e messaggi del modulo di contatto, usati sia nel browser (ContactForm) sia sul server (/api/invia). */

/** Totale degli allegati. Vercel rifiuta le richieste oltre 4,5 MB: il resto serve ai campi di testo. */
export const ATTACH_MAX_MB = 4;

export type ContactField = "n" | "e" | "t" | "f" | "p";

export type ContactData = {
  nome: string;
  email: string;
  telefono: string;
  privacy: boolean;
  /** Somma delle dimensioni degli allegati, in byte. */
  allegati: number;
};

/** Errori per campo, nell'ordine in cui i campi compaiono nel modulo. */
export function validateContact(d: ContactData): Partial<Record<ContactField, string>> {
  const errs: Partial<Record<ContactField, string>> = {};
  if (!d.nome.trim()) errs.n = "Ci dici come ti chiami?";
  if (!d.email.trim()) errs.e = "Serve un indirizzo email per risponderti.";
  else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(d.email.trim())) errs.e = "Controlla l’indirizzo email: manca qualcosa.";
  if (d.telefono.trim() && d.telefono.replace(/\D/g, "").length < 6) errs.t = "Controlla il numero di telefono.";
  if (d.allegati > ATTACH_MAX_MB * 1024 * 1024) errs.f = `Gli allegati superano i ${ATTACH_MAX_MB} MB in totale.`;
  if (!d.privacy) errs.p = "Serve il consenso al trattamento dei dati per risponderti.";
  return errs;
}
