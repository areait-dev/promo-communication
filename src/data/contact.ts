/**
 * Privacy e Cookie Policy: PromoCommunication e' la divisione marketing di Promotergroup S.p.a. e non ha una P.IVA propria,
 * quindi l'informativa e' quella di Promotergroup.
 */
export const PRIVACY_URL = "https://www.promotergroup.eu/index.php/contattanoi/privacy-e-cookie-policy";

/** Recapiti dell'agenzia (gli stessi del footer). */
export const PHONE = { label: "+39 0932 862613", href: "tel:+390932862613" };
export const ADDRESS = ["Via del Carrubo sn", "Vittoria (RG)"] as const;

/**
 * Profili social.
 * TODO: sostituire "#" con gli URL reali (https://...). Finché l'href è "#" il link mostra l'avviso
 * "Collegamento da inserire"; con un URL vero si apre in una nuova scheda.
 */
export const SOCIALS = [
  { id: "facebook", name: "Facebook", href: "#" },
  { id: "instagram", name: "Instagram", href: "#" },
  { id: "linkedin", name: "LinkedIn", href: "#" },
  { id: "youtube", name: "YouTube", href: "#" },
] as const;
export type SocialId = (typeof SOCIALS)[number]["id"];

/* ===== Pagina /contatti ===== */

/** Sottotitolo sotto l'H1 di /contatti (modificabile). */
export const CONTACT_LEAD = "Scrivici due righe: ti rispondiamo entro 24 ore lavorative con una prima idea.";

/**
 * Se EMAIL o HOURS tornano null il pannello mostra "Da inserire" senza link.
 * TODO: HOURS e' senza giorni, indicarli se serve (es. "Lun–Ven 09:00 – 13:00").
 */
export const EMAIL: string | null = "info@promocommunication.it" as string | null;
export const HOURS: readonly string[] | null = ["09:00 – 13:00", "14:00 – 18:00"] as readonly string[] | null;

/**
 * Punto della mappa: coordinate che Google Maps assegna a "Via del Carrubo, Vittoria (RG)"
 * (confrontate con OpenStreetMap: scarto di circa 15 m). Il link "Apri in Google Maps" porta esattamente qui.
 */
export const MAP_POINT = { lat: 36.9673285, lon: 14.5568573 };
export const MAPS_LINK = `https://www.google.com/maps/search/?api=1&query=${MAP_POINT.lat},${MAP_POINT.lon}`;
/** Mappa incorporata (Google): ricerca per indirizzo. */
export const MAPS_EMBED = `https://www.google.com/maps?q=${encodeURIComponent("Via del Carrubo, Vittoria (RG)")}&output=embed`;

