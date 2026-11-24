/** Pagina /lavora-con-noi. */

/** Testi presi dal sito (card del Team): modificabili qui. */
export const CAREERS_TITLE = "La prossima vignetta potresti essere tu";
export const CAREERS_LEAD =
  "Cerchiamo persone curiose, con idee chiare e voglia di mettersi in gioco. Se pensi di poter dare una spinta al nostro team, mandaci il tuo CV e raccontaci chi sei.";

export type Role = {
  /** Titolo del ruolo, es. "Social Media Manager". */
  title: string;
  /** Area, es. "Social e contenuti". */
  area: string;
  /** Sede / modalità, es. "Vittoria (RG) · in sede". */
  where?: string;
  /** Due righe su cosa si fa. */
  desc: string;
};

/**
 * TODO: posizioni aperte. Oggi la lista è vuota (non ho nessuna informazione sulle ricerche in corso):
 * finché è vuota la pagina mostra solo le candidature spontanee. Aggiungi qui i ruoli e compariranno come schede.
 */
export const OPEN_ROLES: Role[] = [];

/** Aree di interesse del form, ricavate dai ruoli già presenti nel Team e dai servizi del sito. */
export const AREAS = [
  "Comunicazione e ufficio stampa",
  "Grafica e art direction",
  "Social media e contenuti",
  "Sviluppo web e performance marketing",
  "Event management",
  "Altro / candidatura spontanea",
] as const;

/** Allegato CV: formati e peso massimo. */
export const CV_MAX_MB = 5;
export const CV_EXT = [".pdf", ".doc", ".docx"] as const;
