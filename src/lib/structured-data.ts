/** Dati strutturati (schema.org). Solo informazioni gia' presenti sul sito o confermate dall'agenzia. */
import type { Contact } from "./content";
import { HOME_DESC, SITE_NAME, SITE_URL } from "./seo";

export const AGENCY_ID = `${SITE_URL}/#agency`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const ALT_NAME = "PromoCommunication";

/**
 * Giorni di apertura, confermati dall'agenzia il 26/11/2026 (nomi inglesi di schema.org). Le fasce orarie arrivano da
 * WordPress: qui si cambiano solo i giorni.
 */
const OPENING_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export const AREA_SERVED = [
  { "@type": "City", name: "Vittoria" },
  { "@type": "AdministrativeArea", name: "Provincia di Ragusa" },
  { "@type": "AdministrativeArea", name: "Sicilia" },
  { "@type": "Country", name: "Italia" },
];

/** "09:00 – 13:00" → una fascia di apertura per i giorni indicati. */
function openingHours(hours: readonly string[] | null) {
  if (!OPENING_DAYS.length || !hours) return undefined;
  const slots = hours
    .map((h) => h.match(/(\d{1,2}:\d{2})\D+(\d{1,2}:\d{2})/))
    .filter((m) => m !== null)
    .map((m) => ({ "@type": "OpeningHoursSpecification", dayOfWeek: OPENING_DAYS, opens: m[1].padStart(5, "0"), closes: m[2].padStart(5, "0") }));
  return slots.length ? slots : undefined;
}

/** Percorso "Home → sezione → pagina" di una scheda: [nome, indirizzo]. */
export function breadcrumbs(items: [string, string][]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [["Home", "/"] as [string, string], ...items].map(([name, path], i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
      item: SITE_URL + (path === "/" ? "" : path),
    })),
  };
}

export function serviceSchema(s: { id: string; name: string; p1: string }) {
  const url = `${SITE_URL}/servizi/${s.id}`;
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name: s.name,
    serviceType: s.name,
    description: s.p1 || undefined,
    url,
    provider: { "@id": AGENCY_ID },
    areaServed: AREA_SERVED,
  };
}

/** L'agenzia e il sito: presenti in tutte le pagine. */
export function siteGraph({ email, phone, address, socials, hours, mapPoint }: Contact) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfessionalService",
        "@id": AGENCY_ID,
        name: SITE_NAME,
        alternateName: ALT_NAME,
        url: SITE_URL,
        logo: `${SITE_URL}/icon.png`,
        image: `${SITE_URL}/og.png`,
        description: HOME_DESC,
        email: email ?? undefined,
        telephone: phone.label,
        address: { "@type": "PostalAddress", streetAddress: address[0], postalCode: "97019", addressLocality: "Vittoria", addressRegion: "RG", addressCountry: "IT" },
        geo: { "@type": "GeoCoordinates", latitude: mapPoint.lat, longitude: mapPoint.lon },
        areaServed: AREA_SERVED,
        openingHoursSpecification: openingHours(hours),
        parentOrganization: { "@type": "Organization", name: "Promotergroup S.p.A.", url: "https://www.promotergroup.eu" },
        sameAs: socials.map((x) => x.href),
      },
      { "@type": "WebSite", "@id": WEBSITE_ID, name: SITE_NAME, alternateName: ALT_NAME, url: SITE_URL, inLanguage: "it-IT", publisher: { "@id": AGENCY_ID } },
    ],
  };
}
