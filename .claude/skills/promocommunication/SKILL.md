---
name: promocommunication
description: Linee guida del sito PromoCommunication (brand, tono di voce, design token, movimento, accessibilità, SEO, convenzioni di codice e decisioni già prese). Da caricare ogni volta che si lavora su questo sito o si usano le skill di design, copy, brand e SEO su di esso.
---

# PromoCommunication: regole del sito

Sito in Next.js 16.4.5 (App Router, React 19.3, Cache Components) in italiano. Brand di Promotergroup S.p.a.: la Unit di Comunicazione & Marketing, a Vittoria (RG). Stato delle verifiche e dei problemi aperti: `AUDIT-SITO.md` (va aggiornato dopo ogni intervento grosso).

Questa skill **integra** le skill di design, copy, brand e SEO: quando ne usi una, applica anche questi criteri al posto di una revisione generica.

## 1. Cosa fa l'agenzia
**Decisione (20/11/2026): i servizi restano 8, come sul sito** (Brand Strategy, Brand Identity, Digital & Web, Social Media Management, Brand Reputation, Personal Branding, Event Management, Comunicazione Politica; dati in `src/data/services.ts`). Il documento dei testi ne descrive 6 "Boost": usalo come riferimento di voce, ma non togliere servizi dal sito. Team in `src/data/team.ts`, progetti in `src/data/projects.ts` (solo quelli con anteprima sono pubblicati).

## 2. Tono di voce (fonte ufficiale)
Fonte: documento "Promo Communication – Tone of Voice e testi del sito" (12/11/2026, Valentina Brafa), ricavato dalle bio del team e dal brand profile. Quando scrivi o riveda testi, applica queste regole al posto di qualsiasi tono generico.

**In una frase:** parliamo come un team creativo che conosce le imprese dall'interno. Giovani, mai improvvisati. Ironici, mai a spese di chi ci legge. Si dà del **tu** in tutte le pagine ("voi" solo per documenti formali e comunicazioni alla PA).

**Le 6 firme**
1. Immagini concrete al posto degli aggettivi (almeno un'immagine "visibile" per blocco).
2. Una citazione pop come metafora del mestiere: fuori dal Team **una per pagina**, riconoscibile da chiunque.
3. Iperbole affettuosa, poi atterraggio concreto: prima il sorriso, poi la sostanza.
4. Doppio senso sulle parole, come tocco occasionale (al massimo uno per pagina, solo se nasce spontaneo). Le virgolette singole segnalano il gioco: 'imprese'.
5. Chiusa a effetto: ogni blocco finisce con una frase breve che si ricorda, mai con un riassunto.
6. Ritmo a strappi: apertura corta e piena, poi una o due frasi più lunghe. L'inglese del mestiere entra con leggerezza; il claim "Boost your ___" è il filo rosso.

**Mai**
- Parole vietate: "a 360 gradi", "soluzioni innovative", "eccellenza", "leader del settore", "sinergia", "valore aggiunto", "fare la differenza", "nell'era digitale".
- Tre aggettivi astratti in fila.
- Promettere risultati, crescite in percentuale o viralità; inventare numeri o clienti.
- Ironia sul cliente, sulla PA o sui momenti di crisi.
- Aprire un blocco con una domanda retorica (le domande vanno bene solo come invito all'azione).
- Più di una citazione pop per blocco fuori dal Team.

**Ironia per pagina (scala 0–5):** Home 2 · Chi siamo 3 · Servizi 2 (voci tecniche descrittive, servono alla SEO) · Brand Reputation 1 (calma, momenti delicati) · Team 4 · Contatti e form 3 (caldo e complice) · Footer e dati legali 0.

**Formule già approvate:** "Messaggio ricevuto, forte e chiaro." · "Si parte sempre da un caffè, o da un brief, che è la stessa cosa ma con più appunti." · "Teste diverse, stesso fumetto" · "Noi accendiamo la luce." Altre indicazioni: testi del documento = riferimento (sezioni Home, Chi siamo, Servizi, Team, Contatti, 404).

**Scrittura del nome (decisione 20/11/2026):** si scrive sempre **PromoCommunication** (tutto attaccato, come oggi sul sito), anche se il documento dei testi usa "Promo Communication". Promotergroup è già citata nel footer ("è un brand di Promotergroup…"): non ripeterla altrove nei testi. Non inventare mai dati: email, social, orari, posizioni aperte, risultati; se mancano, placeholder `TODO` in `src/data/`.

## 3. Design
- Token solo da `src/app/site.css` (`:root`), mai colori scritti a mano. Blu navy `--Blu #001a70` (`--blu-700`), blu notte `--blu-notte` (header e footer, `#000A33`; in tema scuro `#00051A`), rosso accento `--Red #f40808`. Sfumature `--blu-100/300/500/600`, `--rosso-100…500`.
- Font: **Outfit** (testo, `--font-body`) e **Funnel Display** (titoli, `--font-display`), caricati con `next/font` in `layout.tsx`.
- Motivo **fumetto**: angolo in basso a sinistra squadrato, "coda" triangolare (`.pc-bubble`, `.pc-btn::after`). Raggi: `--radius-bubble-sm/…/lg`, pillole `999px`. Card di form e pannelli: raggio uniforme 28px.
- Header e footer sono blu notte in entrambi i temi; il logo nell'header è sempre la versione con fumetto bianco.
- Icone: SVG a tratto, viewBox 24, linee arrotondate, `currentColor` (esempi: `SocialLinks.tsx`, `ContactPanel.tsx`).
- Ogni modifica va controllata in **tema chiaro e scuro**, a **1440px e 390px**. Il toggle del tema è uno switch sole/luna.
- Riusa i componenti esistenti: `pc-btn`, `pc-bubble`, `ct-*` (form e pannelli di Contatti e Lavora con noi), `Cta`, `Head`, `Marquee`. Nessuna libreria UI nuova senza chiedere.

## 4. Movimento
- Easing `--ease-out` e `--ease-pop` (senza rimbalzo); durate `--dur-base` 500ms, `--dur-slow` 800ms. Si animano solo `transform`, `opacity`, `filter`, `clip-path`, `translate`, `scale`.
- Reveal: `src/lib/reveal.ts`, avviato da `<PageFx />` che **va messo nella prima sezione di ogni pagina**. Non spostarlo fuori dalla pagina: causa errori di hydration.
- Rispetta sempre `prefers-reduced-motion`. Niente loop infiniti decorativi (restano: marquee, stella dell'hero lenta a 24s).
- **Decisioni già prese, non rimettere:** niente pulsante "pausa animazioni"; niente anteprima immagine all'hover nella lista "Cosa mettiamo in boost"; la marquee **non** reagisce allo scroll; niente `scroll-behavior: smooth` globale (rompe il ripristino dello scroll con Indietro: lo smooth è solo sulle ancore, in `Behaviors.tsx`); mappa dei Contatti = embed originale di Google con cornice in vetro, non una mappa ricostruita.

## 5. Accessibilità (WCAG 2.1 AA)
- Label associate, focus visibile (rosso nei form), zone di tocco ≥44px, errori sotto il campo con `aria-invalid`/`aria-describedby`, messaggi di invio in `aria-live`.
- Il rosso `#f40808` su bianco fa 4,29:1: **non** usarlo per testo piccolo (problema noto A-02). Verifica i contrasti in tema scuro.
- Controlla con axe e con uno screenshot reale, non solo a occhio.

## 6. SEO e contenuti
- Titolo pagina: `<Pagina> — PromoCommunication` (template in `layout.tsx`); `lang="it"`. Ogni pagina nuova ha il suo `metadata` e un solo H1.
- Non ancora presenti (vedi audit): sitemap, robots, canonical, Open Graph, JSON-LD, meta description per pagina. Se tocchi i metadata, parti da lì.

## 7. Convenzioni di codice
- CSS tutto in `src/app/site.css` (file con fine riga misti: negli script di modifica usa regex con `\r?\n`), prefissi `pc-` (sistema), `ct-` (contatti e candidature), `cr-` (ruoli). Dati in `src/data`, componenti in `src/components`, logica in `src/lib`.
- Pagine con slug: `generateStaticParams`, niente `dynamicParams`; `export const instant = false` nelle due pagine di dettaglio.
- Prima di scrivere codice Next.js leggi la guida in `node_modules/next/dist/docs/` (versione con differenze rispetto a quella nota).
- Non toccare `.env.local`, `.vercel`, configurazioni di produzione. Non fare push. Un commit per intervento, solo se richiesto.
- Server di sviluppo: la 3000/3001 può essere dell'utente. **Non fermare processi che non hai avviato tu**; per i test usa una porta tua (es. 3100) e controlla che sia libera.

## 8. Decisioni e punti aperti
**Decise (20/11/2026):**
- Servizi: restano gli 8 del sito. Il documento (6 Boost) non cambia l'elenco.
- Nome: PromoCommunication (attaccato); Promotergroup resta solo nella riga del footer. Nessuna modifica al sito.
- Team: restano le bio e i ruoli attuali del sito (non usare le versioni del documento, né la frase su MadRoom).
- Testi del documento: **non applicati al sito**. Il documento è il riferimento di voce per i testi futuri; quando si riscrive una pagina si parte da lì. Il form Contatti resta con la sua struttura (chip dei servizi, budget).

**Ancora aperti:** "Comunicazione della sostenibilità" (da confermare); eventuale card Foto/Video ("Boost your Image"); URL dei social; destinazione email dei form (e invio vero: T-03); informativa privacy e dati societari; giorni degli orari; posizioni aperte in `OPEN_ROLES`.
