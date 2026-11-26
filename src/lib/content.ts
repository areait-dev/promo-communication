/**
 * Contenuti del sito: progetti, servizi, team, posizioni aperte, recapiti e testi SEO di Yoast.
 *
 * Vengono da WordPress (wp.promocommunication.it). Per ogni raccolta, se WordPress non risponde o non ha ancora
 * contenuti pubblicati, si usano i dati di src/data: il sito resta identico e il build non si rompe.
 *
 * Cache: un'ora (cacheLife "hours"), etichetta "wp". In anteprima (Draft Mode) la cache è saltata e si leggono le bozze.
 * Il campo ACF → dato del sito è descritto in wordpress/README.md ("Mappa dei campi").
 */
import { cacheLife, cacheTag } from "next/cache";
import { draftMode } from "next/headers";
import { ALL_PROJECTS, type Block, type Project } from "@/data/projects";
import { ACC, FEAT, HOME_ORDER, SERVICES, SVC_CAT, type Service } from "@/data/services";
import { TEAM, type Member } from "@/data/team";
import { AREAS, OPEN_ROLES, type Role } from "@/data/careers";
import { ADDRESS, EMAIL, HOURS, MAP_POINT, PHONE, SOCIALS } from "@/data/contact";
import { acfOf, decode, imgUrl, lines, wpGet, type WpImage, type WpPost, type WpSeo, type WpTerm } from "./wordpress";

/* ---------------------------------------------------------------------------------------------------------------
 * Forma dei contenuti usata da pagine e componenti (la stessa di src/data)
 * ------------------------------------------------------------------------------------------------------------- */

export type Social = { id: "facebook" | "instagram" | "linkedin" | "youtube" | "tiktok"; name: string; href: string };

export type Contact = {
  phone: { label: string; href: string };
  address: readonly [string, string];
  email: string | null;
  hours: readonly string[] | null;
  mapPoint: { lat: number; lon: number };
  socials: Social[];
};

export type Services = {
  /** Servizi visibili, nell'ordine del campo "Ordine". */
  list: Service[];
  /** id → [classe del colore, sigla] (scheda dell'elenco servizi). */
  acc: Record<string, [string, string]>;
  /** id → voci "Cosa facciamo". */
  feat: Record<string, { intro: string; items: [string, string, string][] }>;
  /** id → categoria dei progetti da mostrare nella pagina del servizio. */
  cat: Record<string, string>;
  /** Ordine dei servizi nell'elenco della home. */
  homeOrder: string[];
};

export type Content = {
  /** Solo i progetti pubblicati (con anteprima): lista, filtri, pager e pagine di dettaglio. */
  projects: Project[];
  services: Services;
  team: Member[];
  roles: Role[];
  areas: readonly string[];
  contact: Contact;
  /** Testi SEO scritti in Yoast, per percorso pubblico ("/", "/chi-siamo", "/portfolio/pure-red"…). */
  seo: Record<string, WpSeo>;
  /** Data dell'ultima modifica in WordPress per percorso pubblico (sitemap). Solo dove il contenuto viene da li'. */
  modified: Record<string, string>;
};

/* ---------------------------------------------------------------------------------------------------------------
 * Dati locali (riserva)
 * ------------------------------------------------------------------------------------------------------------- */

const LOCAL: Content = {
  projects: ALL_PROJECTS.filter((p) => p.published),
  services: { list: SERVICES, acc: ACC, feat: FEAT, cat: SVC_CAT, homeOrder: HOME_ORDER },
  team: TEAM,
  roles: OPEN_ROLES,
  areas: AREAS,
  contact: {
    phone: PHONE,
    address: ADDRESS,
    email: EMAIL,
    hours: HOURS,
    mapPoint: MAP_POINT,
    socials: SOCIALS.map((s) => ({ ...s })),
  },
  seo: {},
  modified: {},
};

/* ---------------------------------------------------------------------------------------------------------------
 * Campi ACF (vedi scripts/genera-acf-json.mjs)
 * ------------------------------------------------------------------------------------------------------------- */

type BloccoAcf = { immagine?: WpImage; immagine_2?: WpImage; didascalia?: string; adattamento?: string; affiancate?: boolean };
type ProgettoAcf = {
  cliente: string;
  tipo: string;
  settore: string;
  ordine: number | string;
  in_arrivo: boolean;
  anteprima: WpImage;
  copertina: WpImage;
  presentazione: string;
  lavoro: string;
  etichette: string;
} & Record<`blocco_${number}`, BloccoAcf | undefined>;

type VoceAcf = { titolo?: string; icona?: string; testo?: string };
type ServizioAcf = {
  boost: string;
  sigla: string;
  ordine: number | string;
  colore: string;
  categoria_progetto: { name?: string } | false | null;
  nascosto: boolean;
  descrizione: string;
  chiusa: string;
  etichette: string;
  intro_cosa_facciamo: string;
} & Record<`voce_${number}`, VoceAcf | undefined>;

type MembroAcf = { ruolo: string; colore: "b" | "r"; ordine: number | string; foto: WpImage; descrizione: string; linkedin?: string };
type PosizioneAcf = { area: string; sede: string; descrizione: string; ordine: number | string };

type ImpostazioniAcf = {
  contatti?: {
    email?: string;
    telefono_testo?: string;
    telefono_link?: string;
    indirizzo_1?: string;
    indirizzo_2?: string;
    cap?: string;
    orari?: string;
    mappa_lat?: number | string;
    mappa_lon?: number | string;
  };
  social?: Partial<Record<Social["id"], string>>;
};
type LavoraAcf = { aree?: string };

/** Ordine delle categorie come nei filtri del portfolio (WordPress le restituisce in ordine di numero). */
const CAT_ORDER = ["Brand Identity", "Digital & Web", "Social Media", "Shooting foto/video", "Event Management"];
const catRank = (c: string) => (CAT_ORDER.includes(c) ? CAT_ORDER.indexOf(c) : CAT_ORDER.length);

const num = (v: unknown, d = 0) => (Number.isFinite(Number(v)) && v !== "" && v !== null ? Number(v) : d);
const SOCIAL_NAMES: Record<Social["id"], string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  linkedin: "LinkedIn",
  youtube: "YouTube",
  tiktok: "TikTok",
};

/* ---------------------------------------------------------------------------------------------------------------
 * Conversione WordPress → forma del sito
 * ------------------------------------------------------------------------------------------------------------- */

function toProject(p: WpPost<ProgettoAcf>, terms: Map<number, string>): Project {
  const a = acfOf(p);
  const blocks: Block[] = [];
  const dims: Record<string, [number, number]> = {};
  const alts: Record<string, string> = {};
  const misura = (i: WpImage) => {
    if (i && i.url && i.alt?.trim()) alts[i.url] = i.alt.trim();
    if (i && i.url && i.width && i.height) dims[i.url] = [i.width, i.height];
  };
  misura(a.anteprima);
  misura(a.copertina);
  for (let i = 1; i <= 8; i++) {
    const b = a[`blocco_${i}`];
    const one = imgUrl(b?.immagine);
    const two = imgUrl(b?.immagine_2);
    if (!one && !two) continue;
    misura(b?.immagine);
    misura(b?.immagine_2);
    const block: Block = two && one ? { imgs: [one, two] } : { img: (one || two)! };
    if (b?.didascalia) block.cap = b.didascalia;
    if (b?.adattamento === "contain") block.fit = "contain";
    if (b?.affiancate) block.pair = true;
    blocks.push(block);
  }
  const img = imgUrl(a.anteprima);
  return {
    id: p.slug,
    name: decode(p.title.rendered),
    client: a.cliente || decode(p.title.rendered),
    kind: a.tipo || "",
    cats: (p["categorie-progetto"] || [])
      .map((id) => terms.get(id))
      .filter((x): x is string => !!x)
      .sort((x, y) => catRank(x) - catRank(y)),
    settore: a.settore || undefined,
    published: !!img,
    img,
    cover: imgUrl(a.copertina) || img,
    intro: a.presentazione || undefined,
    work: a.lavoro || undefined,
    tags: lines(a.etichette),
    blocks: blocks.length ? blocks : undefined,
    dims,
    alts,
    soon: !!a.in_arrivo,
    o: num(a.ordine),
  };
}

function toServices(posts: WpPost<ServizioAcf>[]): Services {
  const visible = posts
    .map((p) => ({ p, a: acfOf(p) }))
    .filter(({ a }) => !a.nascosto)
    .sort((x, y) => num(x.a.ordine, 99) - num(y.a.ordine, 99));
  const out: Services = { list: [], acc: {}, feat: {}, cat: {}, homeOrder: [] };
  for (const { p, a } of visible) {
    const id = p.slug;
    out.list.push({ id, name: decode(p.title.rendered), boost: a.boost || "", p1: a.descrizione || "", p2: a.chiusa || "", tags: lines(a.etichette) });
    out.acc[id] = [a.colore || "acc-blu", a.sigla || ""];
    const items: [string, string, string][] = [];
    for (let i = 1; i <= 8; i++) {
      const v = a[`voce_${i}`];
      if (v?.titolo) items.push([v.titolo, v.icona || "search", v.testo || ""]);
    }
    if (items.length || a.intro_cosa_facciamo) out.feat[id] = { intro: a.intro_cosa_facciamo || "", items };
    const cat = a.categoria_progetto && typeof a.categoria_progetto === "object" ? a.categoria_progetto.name : undefined;
    if (cat) out.cat[id] = decode(cat);
  }
  // Elenco della home: l'ordine di sempre per i servizi che esistono già, i nuovi in coda.
  const ids = out.list.map((s) => s.id);
  out.homeOrder = [...HOME_ORDER.filter((id) => ids.includes(id)), ...ids.filter((id) => !HOME_ORDER.includes(id))];
  return out;
}

function toMember(p: WpPost<MembroAcf>): Member & { o: number } {
  const a = acfOf(p);
  return { n: decode(p.title.rendered), r: a.ruolo || "", c: a.colore === "r" ? "r" : "b", img: imgUrl(a.foto), b: a.descrizione || "", li: (a.linkedin || "").trim() || undefined, o: num(a.ordine, 99) };
}

function toRole(p: WpPost<PosizioneAcf>): Role & { o: number } {
  const a = acfOf(p);
  return { title: decode(p.title.rendered), area: a.area || "", where: a.sede || undefined, desc: a.descrizione || "", o: num(a.ordine, 99) };
}

function toContact(a: ImpostazioniAcf | undefined): Contact {
  const c = a?.contatti || {};
  const l = LOCAL.contact;
  const socials = (Object.keys(SOCIAL_NAMES) as Social["id"][])
    .map((id) => ({ id, name: SOCIAL_NAMES[id], href: (a?.social?.[id] || "").trim() }))
    .filter((s) => s.href);
  const cityLine = [c.cap, c.indirizzo_2].filter(Boolean).join(" ");
  return {
    phone: c.telefono_testo ? { label: c.telefono_testo, href: c.telefono_link || "tel:" + c.telefono_testo.replace(/[^\d+]/g, "") } : l.phone,
    address: c.indirizzo_1 ? [c.indirizzo_1, cityLine || l.address[1]] : l.address,
    email: c.email || l.email,
    hours: lines(c.orari).length ? lines(c.orari) : l.hours,
    mapPoint: num(c.mappa_lat) && num(c.mappa_lon) ? { lat: num(c.mappa_lat), lon: num(c.mappa_lon) } : l.mapPoint,
    socials: socials.length ? socials : l.socials,
  };
}

/* ---------------------------------------------------------------------------------------------------------------
 * Lettura
 * ------------------------------------------------------------------------------------------------------------- */

const LIST = { per_page: 100 };

/** Pagine WordPress che hanno una pagina sul sito: slug → percorso (come pc_pagine() nel mu-plugin). */
const PAGE_PATHS: Record<string, string> = {
  home: "/",
  "chi-siamo": "/chi-siamo",
  servizi: "/servizi",
  portfolio: "/portfolio",
  team: "/team",
  contatti: "/contatti",
  "lavora-con-noi": "/lavora-con-noi",
  privacy: "/privacy",
};

/** Il campo pc_seo arriva come [] quando WordPress serializza un oggetto vuoto: qui diventa undefined. */
const seoOf = (p: { pc_seo?: WpSeo | [] }): WpSeo | undefined =>
  p.pc_seo && !Array.isArray(p.pc_seo) && Object.keys(p.pc_seo).length ? p.pc_seo : undefined;

async function load(draft: boolean): Promise<Content> {
  "use cache";
  cacheLife("hours");
  cacheTag("wp");

  const [progetti, termini, servizi, membri, posizioni, pagine] = await Promise.all([
    wpGet<WpPost<ProgettoAcf>[]>("progetti", { ...LIST, _fields: "id,slug,status,modified_gmt,title,acf,categorie-progetto,pc_seo" }, draft),
    wpGet<WpTerm[]>("categorie-progetto", { ...LIST, _fields: "id,name,slug" }),
    wpGet<WpPost<ServizioAcf>[]>("servizi", { ...LIST, _fields: "id,slug,status,modified_gmt,title,acf,pc_seo" }, draft),
    wpGet<WpPost<MembroAcf>[]>("membri", { ...LIST, _fields: "id,slug,status,modified_gmt,title,acf" }, draft),
    wpGet<WpPost<PosizioneAcf>[]>("posizioni", { ...LIST, _fields: "id,slug,status,title,acf" }, draft),
    wpGet<WpPost<unknown>[]>("pages", { ...LIST, _fields: "id,slug,status,title,acf,pc_seo" }, draft),
  ]);
  const page = <A,>(slug: string) => (pagine || []).find((p) => p.slug === slug) as WpPost<A> | undefined;
  const impostazioni = page<ImpostazioniAcf>("impostazioni");
  const lavora = page<LavoraAcf>("lavora-con-noi");

  const seo: Record<string, WpSeo> = {};
  for (const p of pagine || []) {
    const s = PAGE_PATHS[p.slug] && seoOf(p);
    if (s) seo[PAGE_PATHS[p.slug]] = s;
  }
  for (const p of progetti || []) {
    const s = seoOf(p);
    if (s) seo[`/portfolio/${p.slug}`] = s;
  }
  for (const p of servizi || []) {
    const s = seoOf(p);
    if (s) seo[`/servizi/${p.slug}`] = s;
  }

  const modified: Record<string, string> = {};
  const segna = (path: string, data: string | undefined) => {
    if (data && !(modified[path] >= data + "Z")) modified[path] = data + "Z"; // resta la piu' recente
  };
  for (const p of progetti || []) {
    segna(`/portfolio/${p.slug}`, p.modified_gmt);
    segna("/portfolio", p.modified_gmt);
  }
  for (const p of servizi || []) {
    segna(`/servizi/${p.slug}`, p.modified_gmt);
    segna("/servizi", p.modified_gmt);
  }
  for (const p of membri || []) segna("/team", p.modified_gmt);

  const terms = new Map((termini || []).map((t) => [t.id, decode(t.name)]));
  const fromWp = (progetti || []).map((p) => toProject(p, terms)).filter((p) => p.published);
  const services = servizi && servizi.length ? toServices(servizi) : null;
  const team = (membri || []).map(toMember).sort((a, b) => a.o - b.o);
  const roles = (posizioni || []).map(toRole).sort((a, b) => a.o - b.o);
  const settings = impostazioni ? acfOf(impostazioni) : undefined;
  const aree = lavora ? lines(acfOf(lavora).aree) : [];

  return {
    // Una raccolta vuota in WordPress (ancora da riempire) non svuota il sito: restano i dati locali.
    projects: fromWp.length ? fromWp.sort((a, b) => b.o - a.o) : LOCAL.projects,
    services: services && services.list.length ? services : LOCAL.services,
    team: team.length ? team.map((m) => ({ n: m.n, r: m.r, c: m.c, img: m.img, b: m.b, li: m.li })) : LOCAL.team,
    // Le posizioni aperte possono essere davvero zero: se WordPress risponde, vale la sua lista.
    roles: posizioni ? roles.map((r) => ({ title: r.title, area: r.area, where: r.where, desc: r.desc })) : LOCAL.roles,
    areas: aree.length ? aree : LOCAL.areas,
    contact: toContact(settings),
    seo,
    modified,
  };
}

/** Contenuti per le pagine: in anteprima (Draft Mode) include le bozze e salta la cache. */
export async function getContent(): Promise<Content> {
  "use cache";
  cacheLife("hours");
  cacheTag("wp");
  const { isEnabled } = await draftMode();
  return load(isEnabled);
}

/** Solo contenuti pubblicati: per generateStaticParams e sitemap, che non hanno una richiesta. */
export async function getPublishedContent(): Promise<Content> {
  return load(false);
}

/* ---------------------------------------------------------------------------------------------------------------
 * Utilità
 * ------------------------------------------------------------------------------------------------------------- */

export const projectById = (c: Content, id: string) => c.projects.find((p) => p.id === id);
export const serviceById = (c: Content, id: string) => c.services.list.find((s) => s.id === id);

export const mapsLink = (m: Contact["mapPoint"]) => `https://www.google.com/maps/search/?api=1&query=${m.lat},${m.lon}`;
