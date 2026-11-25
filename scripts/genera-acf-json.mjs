#!/usr/bin/env node
/**
 * Genera i gruppi di campi ACF (solo ACF GRATUITO) in /wordpress/acf-json, un file per gruppo.
 *
 *   npm run acf:genera
 *
 * I JSON generati sono versionati in Git. Per usarli: copia la cartella wordpress/acf-json in
 * wp-content/acf-json, poi in WordPress: ACF → Gruppi di campi → "Sincronizzazione disponibile" → Sincronizza.
 * Se cambi i campi, modifica QUESTO file e rigenera: le chiavi (group_promo_*, field_promo_*) nascono dal
 * percorso del campo e restano stabili, così ACF riconosce gli stessi campi e non perde i testi già inseriti.
 *
 * Vincoli: niente ripetitore, contenuto flessibile, galleria, clone, pagine opzioni (sono di ACF PRO).
 * Le liste sono campi fissi (8 blocchi, 8 voci, 8 parole) o textarea "una voce per riga".
 *
 * Dove compaiono i campi:
 *  - tipi di contenuto (progetto, membro, servizio, posizione): regola "Tipo di contenuto";
 *  - testi del sito: Pagine di WordPress, un gruppo per pagina, regola "Slug pagina"
 *    (registrata dal mu-plugin wordpress/mu-plugins/promocommunication-headless.php).
 * I tipi di contenuto e la tassonomia NON sono qui: li registra il mu-plugin.
 * Ogni gruppo è esposto sia alla REST (show_in_rest) sia a GraphQL (WPGraphQL for ACF).
 * La SEO (titolo, descrizione, immagine social, semafori) è di Yoast SEO: qui non ci sono campi SEO.
 */
import { mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const radice = join(dirname(fileURLToPath(import.meta.url)), "..");
const uscita = join(radice, "wordpress", "acf-json");

/** Slug delle Pagine WordPress che contengono i testi del sito (stessa mappa del mu-plugin). */
export const PAGINE = {
  home: "home",
  chiSiamo: "chi-siamo",
  servizi: "servizi",
  portfolio: "portfolio",
  team: "team",
  contatti: "contatti",
  lavoraConNoi: "lavora-con-noi",
  privacy: "privacy",
  nonTrovata: "pagina-non-trovata", // WordPress non accetta "404" come slug di una pagina
  impostazioni: "impostazioni",
};

// ---------------------------------------------------------------------------
// Costruttori di campi: ognuno ritorna (prefisso) => campo, così la chiave nasce dal percorso
// ---------------------------------------------------------------------------

/** snake_case → camelCase, come fa WPGraphQL for ACF (intro_1 → intro1, nome_az → nomeAz). */
const camel = (s) => s.replace(/_([a-z0-9])/g, (_, c) => c.toUpperCase());

const campo = (tipo, nome, etichetta, opz = {}, extra = {}) => (prefisso) => ({
  key: `field_promo_${prefisso}_${nome}`,
  label: etichetta,
  name: nome,
  "aria-label": "",
  type: tipo,
  instructions: opz.istruzioni ?? "",
  required: opz.obbligatorio ? 1 : 0,
  conditional_logic: 0,
  wrapper: { width: opz.larghezza ?? "", class: "", id: "" },
  ...extra,
  allow_in_bindings: 0,
  show_in_graphql: 1,
  graphql_field_name: camel(nome),
});

const testo = (n, e, o = {}) =>
  campo("text", n, e, o, { default_value: "", maxlength: "", placeholder: "", prepend: "", append: "" });

const area = (n, e, o = {}) =>
  campo("textarea", n, e, o, { default_value: "", maxlength: "", rows: o.righe ?? 4, placeholder: "", new_lines: "" });

const editor = (n, e, o = {}) =>
  campo("wysiwyg", n, e, o, { default_value: "", tabs: "all", toolbar: o.barra ?? "basic", media_upload: 0, delay: 0 });

const numero = (n, e, o = {}) =>
  campo("number", n, e, o, { default_value: 0, min: "", max: "", placeholder: "", step: "", prepend: "", append: "" });

const url = (n, e, o = {}) => campo("url", n, e, o, { default_value: "", placeholder: "https://" });

const immagine = (n, e, o = {}) =>
  campo("image", n, e, o, {
    return_format: "array",
    library: "all",
    min_width: "",
    min_height: "",
    min_size: "",
    max_width: "",
    max_height: "",
    max_size: "",
    mime_types: "jpg, jpeg, png, webp, svg",
    preview_size: "medium",
  });

const scelta = (n, e, scelte, o = {}) =>
  campo("select", n, e, o, {
    choices: scelte,
    default_value: o.predefinito ?? "",
    return_format: "value",
    multiple: 0,
    allow_null: 0,
    ui: 0,
    ajax: 0,
    placeholder: "",
  });

const siNo = (n, e, o = {}) =>
  campo("true_false", n, e, o, { message: "", default_value: 0, ui: 1, ui_on_text: "Sì", ui_off_text: "No" });

const categoria = (n, e, o = {}) =>
  campo("taxonomy", n, e, o, {
    taxonomy: "categoria_progetto",
    add_term: 0,
    save_terms: 0,
    load_terms: 0,
    return_format: "object",
    field_type: "select",
    allow_null: 1,
    bidirectional: 0,
    multiple: 0,
    bidirectional_target: [],
  });

/** Gruppo annidato: i sotto-campi prendono come prefisso il percorso del gruppo. */
const gruppo = (n, e, sotto, o = {}) => (prefisso) => {
  const { allow_in_bindings, ...base } = campo("group", n, e, o, { layout: "block" })(prefisso); // i gruppi non hanno questa opzione
  return { ...base, sub_fields: sotto.map((f) => f(`${prefisso}_${n}`)) };
};

/** n gruppi uguali: nome_1 … nome_n. */
const ripeti = (quanti, nome, etichetta, sotto, istruzioniPrima, istruzioniAltre) =>
  Array.from({ length: quanti }, (_, i) =>
    gruppo(`${nome}_${i + 1}`, `${etichetta} ${i + 1}`, sotto, {
      istruzioni: i === 0 ? istruzioniPrima : istruzioniAltre,
    }),
  );

// ---------------------------------------------------------------------------
// Gruppi di campi
// ---------------------------------------------------------------------------

const perTipo = (tipo) => [[{ param: "post_type", operator: "==", value: tipo }]];
const perPagina = (slug) => [[{ param: "page_slug", operator: "==", value: slug }]];

/**
 * @param id        parte stabile della chiave (group_promo_<id>, field_promo_<id>_…)
 * @param graphql   nome del gruppo in GraphQL
 * @param posizione regole di posizione ACF
 * @param pagina    true per i gruppi legati alle Pagine (il tipo GraphQL va indicato a mano:
 *                  WPGraphQL for ACF non conosce la regola "Slug pagina")
 */
const fieldGroup = ({ id, titolo, descrizione = "", graphql, posizione, campi, ordine = 0, pagina = false, modificato: mod }) => ({
  key: `group_promo_${id}`,
  title: titolo,
  fields: campi.map((f) => f(id)),
  location: posizione,
  menu_order: ordine,
  position: "normal",
  style: "default",
  label_placement: "top",
  instruction_placement: "label",
  hide_on_screen: "",
  active: true,
  description: descrizione,
  show_in_rest: 1,
  show_in_graphql: 1,
  graphql_field_name: graphql,
  map_graphql_types_from_location_rules: pagina ? 0 : 1,
  graphql_types: pagina ? ["Page"] : "",
  ...(mod ? { modified: mod } : {}),
});

const ICONE = [
  "adv", "app", "audit", "badge", "ballot", "book", "box", "browser", "bulb", "camera", "chart", "company",
  "compass", "conf", "desk", "eye", "grid", "heart", "inst", "leaf", "megaphone", "mic", "news", "pen", "plan",
  "poll", "refresh", "rocket", "search", "seo", "share", "shield", "stage", "story", "tag", "target", "user",
  "users", "voice",
];

const EDITOR = "Grassetto, corsivo e link si fanno dalla barra degli strumenti.";

const gruppi = [
  // --- Progetti ---------------------------------------------------------------
  fieldGroup({
    id: "progetto",
    titolo: "Progetto · dettagli",
    descrizione: "Campi della scheda e della pagina progetto. La categoria si sceglie nel riquadro 'Categorie progetto'; l'URL del progetto è il suo 'slug'.",
    graphql: "campiProgetto",
    posizione: perTipo("progetto"),
    campi: [
      testo("cliente", "Cliente", { istruzioni: "Nome del cliente come compare nel sito.", obbligatorio: true, larghezza: "50" }),
      testo("tipo", "Tipo di lavoro", { istruzioni: "Es. Brand Identity e lancio, Sito web, Video corporate.", obbligatorio: true, larghezza: "50" }),
      testo("settore", "Settore", { istruzioni: "Es. Agroalimentare, Sanità. Lascia vuoto se non lo conosci.", larghezza: "50" }),
      numero("ordine", "Ordine", { istruzioni: "Numero più basso = compare prima.", larghezza: "25" }),
      siNo("in_arrivo", "In arrivo", { istruzioni: "Se attivo il progetto compare come 'Progetto in arrivo', senza pagina di dettaglio.", larghezza: "25" }),
      immagine("anteprima", "Anteprima", { istruzioni: "Immagine della scheda nell'elenco. Senza anteprima il progetto non viene pubblicato sul sito.", larghezza: "50" }),
      immagine("copertina", "Copertina", { istruzioni: "Immagine grande in cima alla pagina del progetto.", larghezza: "50" }),
      area("presentazione", "Presentazione", { istruzioni: "Chi è il cliente e cosa fa (2-3 righe).", righe: 4 }),
      area("lavoro", "Cosa abbiamo fatto", { istruzioni: "Il lavoro svolto e il risultato.", righe: 5 }),
      area("etichette", "Etichette", { istruzioni: "Una per riga (massimo 7). Es. Brand Identity, SEO, Social Media.", righe: 5 }),
    ],
  }),
  fieldGroup({
    id: "progetto_galleria",
    titolo: "Progetto · galleria (fino a 8 blocchi)",
    descrizione: "ACF gratuito non ha il campo Ripetitore: la galleria è fatta di 8 blocchi fissi.",
    graphql: "galleriaProgetto",
    posizione: perTipo("progetto"),
    ordine: 1,
    campi: ripeti(8, "blocco", "Blocco", [
      immagine("immagine", "Immagine", { larghezza: "50" }),
      immagine("immagine_2", "Seconda immagine (opzionale)", { istruzioni: "Se la carichi, le due immagini vengono affiancate.", larghezza: "50" }),
      testo("didascalia", "Didascalia", { istruzioni: "Es. Logo e palette. Può restare vuota.", larghezza: "50" }),
      scelta("adattamento", "Adattamento", { "": "Riempi lo spazio (consigliato)", contain: "Mostra intera, senza tagliare" }, { larghezza: "25" }),
      siNo("affiancate", "Foto affiancate senza cornice", { istruzioni: "Stile 'foto' per le coppie di immagini.", larghezza: "25" }),
    ], "Le immagini della pagina progetto, nell'ordine dei blocchi. Lascia vuoti i blocchi che non servono.", "Lascia vuoto se non serve."),
  }),
  fieldGroup({
    id: "membro",
    titolo: "Membro · dettagli",
    descrizione: "Il nome è il titolo del contenuto.",
    graphql: "campiMembro",
    modificato: Math.floor(Date.UTC(2026, 10, 26) / 1000), // avanzata: aggiunto il campo LinkedIn, ACF segnala solo questo gruppo
    posizione: perTipo("membro"),
    campi: [
      testo("ruolo", "Ruolo", { istruzioni: "Es. Art Director & Graphic Designer.", obbligatorio: true, larghezza: "50" }),
      scelta("colore", "Colore del segnaposto", { b: "Blu", r: "Rosso" }, { istruzioni: "Usato dove manca la foto.", larghezza: "25", predefinito: "b" }),
      numero("ordine", "Ordine", { istruzioni: "Numero più basso = compare prima.", larghezza: "25" }),
      url("linkedin", "LinkedIn", { istruzioni: "Indirizzo del profilo LinkedIn (facoltativo). Se vuoto, sul sito compare il LinkedIn della società." }),
      immagine("foto", "Foto", { istruzioni: "Ritaglio con sfondo trasparente (webp o png), 1200 x 1000 px." }),
      editor("descrizione", "Descrizione", { istruzioni: "Grassetto e corsivo per le citazioni finali." }),
    ],
  }),

  // --- Servizi ----------------------------------------------------------------
  fieldGroup({
    id: "servizio",
    titolo: "Servizio · dettagli",
    descrizione: "Il nome è il titolo del contenuto e l'URL è lo 'slug' (es. social-media). L'illustrazione dell'elenco servizi resta nel codice, legata allo slug.",
    graphql: "campiServizio",
    posizione: perTipo("servizio"),
    campi: [
      testo("boost", "Titolo 'Boost your...'", { istruzioni: "Es. Boost your Brand.", obbligatorio: true, larghezza: "50" }),
      testo("sigla", "Sigla", { istruzioni: "Due lettere, per l'indice dell'elenco servizi. Es. BS.", obbligatorio: true, larghezza: "25" }),
      numero("ordine", "Ordine", { istruzioni: "Numero più basso = compare prima.", larghezza: "25" }),
      scelta("colore", "Colore della scheda", {
        "acc-red": "Rosso",
        "acc-blu": "Blu",
        "acc-el": "Blu elettrico",
        "acc-rosa": "Rosa",
        "acc-notte": "Blu notte",
        "acc-pietra": "Pietra",
        "acc-azz": "Azzurro",
        "acc-corallo": "Corallo",
      }, { istruzioni: "Colore della scheda nell'elenco servizi.", larghezza: "50", predefinito: "acc-blu" }),
      categoria("categoria_progetto", "Categoria dei progetti", { istruzioni: "Quali progetti del portfolio mostrare nella pagina del servizio. Vuoto = nessuno." }),
      siNo("nascosto", "Nascosto", { istruzioni: "Se attivo il servizio sparisce da tutto il sito, ma resta qui.", larghezza: "25" }),
      area("descrizione", "Descrizione", { istruzioni: "Primo paragrafo.", obbligatorio: true, righe: 6 }),
      area("chiusa", "Chiusa", { istruzioni: "La frase breve finale. Può restare vuota.", righe: 2 }),
      area("etichette", "Etichette", { istruzioni: "Una per riga. Es. Strategia di comunicazione.", righe: 6 }),
      area("intro_cosa_facciamo", "Introduzione 'Cosa facciamo'", { righe: 3 }),
    ],
  }),
  fieldGroup({
    id: "servizio_voci",
    titolo: "Servizio · 'Cosa facciamo' (fino a 8 voci)",
    descrizione: "Senza il campo Ripetitore di ACF Pro: 8 voci fisse.",
    graphql: "vociServizio",
    posizione: perTipo("servizio"),
    ordine: 1,
    campi: ripeti(8, "voce", "Voce", [
      testo("titolo", "Titolo", { larghezza: "50" }),
      scelta("icona", "Icona", Object.fromEntries(ICONE.map((i) => [i, i])), { larghezza: "50", predefinito: "search" }),
      area("testo", "Testo", { righe: 3 }),
    ], "Le voci 'Cosa facciamo' del servizio. Lascia vuote quelle che non servono.", "Lascia il titolo vuoto se non serve."),
  }),
  fieldGroup({
    id: "posizione",
    titolo: "Posizione · dettagli",
    descrizione: "Il ruolo è il titolo del contenuto. Se non ci sono posizioni pubblicate, il sito mostra solo le candidature spontanee.",
    graphql: "campiPosizione",
    posizione: perTipo("posizione"),
    campi: [
      testo("area", "Area", { istruzioni: "Es. Social e contenuti.", obbligatorio: true, larghezza: "50" }),
      testo("sede", "Sede e modalità", { istruzioni: "Es. Vittoria (RG), in sede.", larghezza: "50" }),
      area("descrizione", "Descrizione", { istruzioni: "Due righe su cosa si fa.", obbligatorio: true, righe: 4 }),
      numero("ordine", "Ordine", { istruzioni: "Numero più basso = compare prima.", larghezza: "25" }),
    ],
  }),

  // --- Pagine: un gruppo per pagina, legato allo slug ---------------------------
  fieldGroup({
    id: "home",
    titolo: "Pagina · Home",
    descrizione: "Testi della pagina 'Home'. I testi con una parola in corsivo usano <em>...</em>.",
    graphql: "paginaHome",
    posizione: perPagina(PAGINE.home),
    pagina: true,
    campi: [
      gruppo("parole", "Titolo 'Boost your...': parole che scorrono", ripeti(8, "parola", "Parola", [
        testo("testo", "Parola"),
        testo("link", "Dove porta", { istruzioni: "Es. /servizi/brand-identity. Vuoto = nessun link." }),
      ], "", ""), { istruzioni: "Fino a 8 parole, nell'ordine in cui scorrono. L'ultima resta ferma." }),
      testo("lead", "Frase sotto il titolo"),
      testo("pulsante_testo", "Pulsante: testo"),
      testo("pulsante_link", "Pulsante: dove porta", { istruzioni: "Es. /contatti" }),
      gruppo("storia", "Sezione 'La nostra storia'", [
        testo("citazione", "Citazione nel fumetto", { istruzioni: "Per mettere una parola in evidenza usa <em>parola</em>." }),
        testo("sottotitolo", "Sottotitolo del fumetto"),
        editor("testo", "Testo", { istruzioni: EDITOR }),
        testo("pulsante_testo", "Pulsante: testo"),
        testo("pulsante_link", "Pulsante: dove porta"),
      ]),
      testo("titolo_progetti", "Titolo sezione progetti"),
      testo("titolo_servizi", "Titolo sezione servizi"),
      testo("titolo_team", "Titolo sezione team"),
      testo("titolo_contatti", "Titolo sezione contatti"),
    ],
  }),
  fieldGroup({
    id: "chi_siamo",
    titolo: "Pagina · Chi siamo",
    descrizione: "Testi della pagina 'Chi siamo'.",
    graphql: "paginaChiSiamo",
    posizione: perPagina(PAGINE.chiSiamo),
    pagina: true,
    campi: [
      testo("titolo", "Titolo della pagina"),
      editor("intro_1", "Introduzione, primo paragrafo", { istruzioni: EDITOR }),
      editor("intro_2", "Introduzione, secondo paragrafo", { istruzioni: EDITOR }),
      gruppo("team", "Sezione 'Un team di professionisti'", [
        testo("citazione", "Frase nel fumetto"),
        editor("testo_1", "Primo paragrafo", { istruzioni: EDITOR }),
        editor("testo_2", "Secondo paragrafo", { istruzioni: EDITOR }),
        testo("pulsante_testo", "Pulsante: testo"),
        testo("pulsante_link", "Pulsante: dove porta"),
      ]),
      gruppo("luce", "Sezione 'Noi accendiamo la luce'", [
        editor("testo_1", "Primo paragrafo", { istruzioni: EDITOR }),
        editor("testo_2", "Secondo paragrafo", { istruzioni: EDITOR }),
        testo("citazione", "Frase nel fumetto"),
      ]),
      gruppo("lavoro", "Sezione 'Come lavoriamo'", [
        testo("citazione", "Frase nel fumetto"),
        editor("testo_1", "Primo paragrafo", { istruzioni: EDITOR }),
        editor("testo_2", "Secondo paragrafo", { istruzioni: EDITOR }),
      ]),
    ],
  }),
  fieldGroup({
    id: "servizi",
    titolo: "Pagina · Servizi",
    descrizione: "Testi della pagina 'Servizi' e della pagina del singolo servizio.",
    graphql: "paginaServizi",
    posizione: perPagina(PAGINE.servizi),
    pagina: true,
    campi: [
      area("parole", "Titolo 'Boost your...': parole che scorrono", { istruzioni: "Una per riga, fino a 8. L'ultima resta ferma.", righe: 3 }),
      gruppo("singolo", "Pagina del singolo servizio", [
        testo("titolo_progetti", "Titolo dei progetti", { istruzioni: "Usa {servizio} per inserire il nome. Es. Progetti di {servizio}." }),
        testo("progetti_vuoto", "Messaggio senza progetti", { istruzioni: "Es. I progetti di {servizio} arrivano presto." }),
        testo("titolo_contatto", "Titolo del modulo", { istruzioni: "Es. Vuoi saperne di più su {servizio}?" }),
        testo("lead_contatto", "Frase sopra il modulo"),
      ]),
    ],
  }),
  fieldGroup({
    id: "portfolio",
    titolo: "Pagina · Portfolio",
    descrizione: "Testi della pagina 'Portfolio' e della pagina del singolo progetto.",
    graphql: "paginaPortfolio",
    posizione: perPagina(PAGINE.portfolio),
    pagina: true,
    campi: [
      testo("titolo_1", "Titolo, prima riga"),
      testo("titolo_2", "Titolo, seconda riga"),
      gruppo("filtri", "Filtri ed elenco", [
        testo("tutti", "Etichetta 'Tutti'"),
        testo("ordina", "Etichetta 'Ordina per'"),
        testo("piu_recenti", "Ordine: più recenti"),
        testo("meno_recenti", "Ordine: meno recenti"),
        testo("nome_az", "Ordine: nome A-Z"),
        testo("nome_za", "Ordine: nome Z-A"),
      ]),
      gruppo("scheda", "Pagina del singolo progetto", [
        testo("cliente", "Etichetta 'Cliente'"),
        testo("servizi", "Etichetta 'Servizi'"),
        testo("titolo_cliente", "Titolo 'Il cliente'"),
        testo("titolo_lavoro", "Titolo 'Cosa abbiamo fatto'"),
        testo("altri", "Titolo 'Altri progetti'"),
        testo("precedente", "Link progetto precedente"),
        testo("successivo", "Link progetto successivo"),
      ]),
    ],
  }),
  fieldGroup({
    id: "team",
    titolo: "Pagina · Team",
    descrizione: "Testi della pagina 'Team'.",
    graphql: "paginaTeam",
    posizione: perPagina(PAGINE.team),
    pagina: true,
    campi: [
      testo("titolo", "Titolo della pagina"),
      testo("lead", "Frase sotto il titolo"),
      gruppo("lavora", "Scheda 'Lavora con noi'", [
        testo("citazione", "Frase nel fumetto"),
        testo("etichetta", "Etichetta sotto la frase"),
        area("testo", "Testo", { righe: 3 }),
        testo("pulsante_testo", "Pulsante: testo"),
        testo("card_titolo", "Home: titolo della scheda"),
        testo("card_ruolo", "Home: sottotitolo della scheda"),
      ]),
    ],
  }),
  fieldGroup({
    id: "contatti",
    titolo: "Pagina · Contatti",
    descrizione: "Testi della pagina 'Contatti'. Recapiti, orari e testi del modulo stanno in 'Impostazioni del sito'.",
    graphql: "paginaContatti",
    posizione: perPagina(PAGINE.contatti),
    pagina: true,
    campi: [
      testo("titolo", "Titolo della pagina"),
      testo("lead", "Frase sotto il titolo"),
    ],
  }),
  fieldGroup({
    id: "lavora_con_noi",
    titolo: "Pagina · Lavora con noi",
    descrizione: "Testi della pagina 'Lavora con noi'. Le posizioni si gestiscono in 'Posizioni aperte'.",
    graphql: "paginaLavoraConNoi",
    posizione: perPagina(PAGINE.lavoraConNoi),
    pagina: true,
    campi: [
      testo("titolo", "Titolo della pagina"),
      area("lead", "Frase sotto il titolo", { righe: 3 }),
      testo("titolo_posizioni", "Titolo 'Posizioni aperte'"),
      testo("pulsante_candidati", "Pulsante delle posizioni"),
      area("aree", "Aree di interesse del modulo", { istruzioni: "Una per riga. Compaiono nel menu a tendina del modulo.", righe: 3 }),
    ],
  }),
  fieldGroup({
    id: "privacy",
    titolo: "Pagina · Privacy e Cookie policy",
    descrizione: "Testi della pagina 'Privacy e Cookie policy'.",
    graphql: "paginaPrivacy",
    posizione: perPagina(PAGINE.privacy),
    pagina: true,
    campi: [
      testo("titolo", "Titolo della pagina"),
      testo("lead", "Frase sotto il titolo"),
      testo("aggiornamento", "Data di ultimo aggiornamento", { istruzioni: "Es. 24/11/2026" }),
      editor("contenuto", "Testo dell'informativa", {
        istruzioni: "Usa i titoli (H2 per le parti, H3 per i paragrafi). Il titolo 'Cookie policy' deve avere l'ancora 'cookie' per il link del banner.",
        barra: "full",
      }),
    ],
  }),
  fieldGroup({
    id: "pagina_non_trovata",
    titolo: "Pagina · Pagina non trovata",
    descrizione: "Testi della pagina di errore 404.",
    graphql: "paginaNonTrovata",
    posizione: perPagina(PAGINE.nonTrovata),
    pagina: true,
    campi: [
      testo("titolo", "Titolo"),
      testo("pulsante", "Pulsante: testo"),
    ],
  }),
  fieldGroup({
    id: "impostazioni",
    titolo: "Pagina · Impostazioni del sito",
    descrizione: "Menu, recapiti, social, footer, blocco finale, banner cookie, moduli e dati per i motori di ricerca. Valgono per tutto il sito; questa pagina non compare sul sito.",
    graphql: "impostazioniSito",
    posizione: perPagina(PAGINE.impostazioni),
    pagina: true,
    campi: [
      gruppo("menu", "Menu in alto", [
        testo("chi_siamo", "Voce 'Chi siamo'"),
        testo("servizi", "Voce 'Servizi'"),
        testo("portfolio", "Voce 'Portfolio'"),
        testo("team", "Voce 'Team'"),
        testo("contatti", "Voce 'Contatti'"),
        testo("tema", "Etichetta 'Tema' (menu mobile)"),
        testo("apri_menu", "Testo accessibile del pulsante menu"),
      ]),
      gruppo("contatti", "Recapiti", [
        testo("email", "Email"),
        testo("telefono_testo", "Telefono (come si legge)", { istruzioni: "Es. +39 0932 862613" }),
        testo("telefono_link", "Telefono (per il tocco)", { istruzioni: "Es. tel:+390932862613" }),
        testo("indirizzo_1", "Indirizzo, riga 1"),
        testo("indirizzo_2", "Indirizzo, riga 2"),
        testo("cap", "CAP"),
        area("orari", "Orari di apertura", { istruzioni: "Una riga per fascia. Es. Lun-Ven 09:00 - 13:00.", righe: 3 }),
        numero("mappa_lat", "Mappa: latitudine"),
        numero("mappa_lon", "Mappa: longitudine"),
        testo("mappa_titolo", "Mappa: titolo accessibile"),
        testo("etichetta_email", "Etichetta 'Email'"),
        testo("etichetta_telefono", "Etichetta 'Telefono'"),
        testo("etichetta_indirizzo", "Etichetta 'Indirizzo'"),
        testo("etichetta_orari", "Etichetta 'Orari di apertura'"),
        testo("etichetta_social", "Etichetta 'Social'"),
      ]),
      gruppo("social", "Social", [
        url("facebook", "Facebook"),
        url("instagram", "Instagram"),
        url("linkedin", "LinkedIn"),
        url("youtube", "YouTube"),
        url("tiktok", "TikTok"),
      ], { istruzioni: "Un social senza indirizzo non compare." }),
      gruppo("footer", "Footer", [
        testo("titolo_1", "Titolo grande, riga 1"),
        testo("titolo_2", "Titolo grande, riga 2"),
        testo("brand", "Frase sul brand"),
        testo("societa", "Riga della società", { istruzioni: "Es. Promotergroup S.p.A. · P.IVA 13178771005" }),
        testo("colonna_servizi", "Colonna 'Servizi'"),
        testo("colonna_contatti", "Colonna 'Contatti'"),
        testo("colonna_social", "Colonna 'Social'"),
        testo("scrivici", "Link 'Scrivici'"),
        testo("privacy", "Link 'Privacy e Cookie Policy'"),
        testo("cookie", "Link 'Gestisci cookie'"),
      ]),
      gruppo("cta", "Blocco finale con pulsante (in fondo a molte pagine)", [
        testo("titolo", "Titolo"),
        testo("pulsante", "Pulsante: testo"),
        testo("link", "Pulsante: dove porta"),
      ]),
      gruppo("cookie", "Banner cookie", [
        testo("titolo", "Titolo"),
        area("testo", "Testo", { istruzioni: "Il link alla cookie policy viene aggiunto in fondo.", righe: 3 }),
        testo("link", "Testo del link"),
        testo("rifiuta", "Pulsante Rifiuta"),
        testo("accetta", "Pulsante Accetta"),
      ]),
      gruppo("moduli", "Moduli (Contatti, home, Lavora con noi)", [
        testo("di_cosa", "Contatti: 'Di cosa hai bisogno?'"),
        testo("nome", "Etichetta nome"),
        testo("nome_cognome", "Etichetta nome e cognome"),
        testo("cognome", "Etichetta cognome"),
        testo("email", "Etichetta email"),
        testo("telefono", "Etichetta telefono"),
        testo("messaggio", "Etichetta messaggio"),
        testo("messaggio_home", "Home: segnaposto del messaggio"),
        testo("allegati", "Home: etichetta allegati"),
        testo("trascina", "Home: testo del riquadro file"),
        testo("consenso", "Testo del consenso privacy", { istruzioni: "Il link 'informativa privacy' viene aggiunto dopo." }),
        testo("invia_contatti", "Pulsante invio (Contatti)"),
        testo("invia_home", "Pulsante invio (home)"),
        testo("invia_candidatura", "Pulsante invio (candidatura)"),
        testo("invio_in_corso", "Testo 'Invio in corso'"),
        testo("ok_contatti", "Conferma Contatti: titolo"),
        area("ok_contatti_testo", "Conferma Contatti: testo", { righe: 3 }),
        testo("ok_candidatura", "Conferma candidatura: titolo"),
        area("ok_candidatura_testo", "Conferma candidatura: testo", { righe: 3 }),
        testo("errore_nome", "Errore: nome mancante"),
        testo("errore_email_mancante", "Errore: email mancante"),
        testo("errore_email_non_valida", "Errore: email non valida"),
        testo("errore_telefono", "Errore: telefono"),
        testo("errore_consenso_contatti", "Errore: consenso (Contatti)"),
        testo("errore_consenso_candidatura", "Errore: consenso (candidatura)"),
        testo("errore_cv", "Errore: CV non valido"),
        testo("errore_invio", "Errore: invio non riuscito"),
      ]),
      gruppo("sito", "Sito e ricerca", [
        testo("nome", "Nome del sito", { istruzioni: "Es. PromoCommunication" }),
        testo("titolo_home", "Titolo della home nei risultati di ricerca"),
        area("descrizione_home", "Descrizione della home nei risultati di ricerca", { righe: 3 }),
        immagine("immagine_condivisione", "Immagine di condivisione", { istruzioni: "1200 x 630 px. Usata quando una pagina non ha la sua." }),
        testo("google_verification", "Codice di verifica Google Search Console"),
        testo("gtm", "ID Google Tag Manager", { istruzioni: "Es. GTM-XXXXXXX. Vuoto = nessun tag." }),
        testo("societa_nome", "Società (dati strutturati)", { istruzioni: "Es. Promotergroup S.p.A." }),
        url("societa_url", "Sito della società"),
      ]),
    ],
  }),
];

// ---------------------------------------------------------------------------
// Scrittura: un file per gruppo, la cartella viene ripulita dai JSON vecchi
// ---------------------------------------------------------------------------

mkdirSync(uscita, { recursive: true });
for (const f of readdirSync(uscita)) {
  if (f.startsWith("group_promo_") && f.endsWith(".json")) rmSync(join(uscita, f));
}

const chiavi = new Set();
const controlla = (campi) => {
  for (const c of campi) {
    if (chiavi.has(c.key)) throw new Error(`Chiave duplicata: ${c.key}`);
    chiavi.add(c.key);
    if (c.sub_fields) controlla(c.sub_fields);
  }
};

const modificato = Math.floor(Date.UTC(2026, 10, 25) / 1000); // fisso: rigenerare non cambia i file se i campi non cambiano
for (const g of gruppi) {
  controlla(g.fields);
  writeFileSync(join(uscita, `${g.key}.json`), JSON.stringify({ modified: modificato, ...g }, null, 4) + "\n", "utf8");
}

console.log(`${gruppi.length} gruppi, ${chiavi.size} campi → ${uscita}`);
