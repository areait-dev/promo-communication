# Audit del sito PromoCommunication

**Aggiornato il 20/11/2026** · Stack: Next.js 16.4.5 (App Router, Cache Components) · Testato sulla build di produzione locale (`npm run build && npm run start`) di `main` al commit `a929e47`, con Playwright/Chromium (1440×900 e 375–390px), axe-core e lettura del codice.

## Cosa resta aperto (in breve)

1. **I form non inviano nulla** (T-03): nessun contatto commerciale arriva.
2. **Privacy e dati societari assenti** (C-01): link `#` segnaposto, nessuna informativa.
3. **SEO di base mancante** (S-01…S-07): niente sitemap, robots, canonical, Open Graph, JSON-LD; stessa meta description ovunque.
4. **Proposta di valore poco chiara in home** (B-01) e title poco descrittivi (S-04).
5. **Accessibilità**: accordion con struttura ARIA non valida (A-01, *critical* axe), contrasto del rosso (A-02), H1 rotante con live region (A-03), titoli che saltano livello (A-04).
6. **Design**: hero di `/servizi` troppo alto (D-01), lista del portfolio senza immagini su desktop (D-02).
7. **404 non deterministico** per slug sconosciuti (T-04).

## Risolto dall'audit precedente

| Problema | Stato | Commit | Verifica |
|---|---|---|---|
| **T-01 Contenuto invisibile su mobile (≤960px)** | **Risolto** | `49eae22`, `43162ea` | A 390px tutti gli elementi `.pc-reveal` si rivelano (home 25/25, portfolio 5/5, pagina progetto 14/14); prima 0/25 e 0/5. |
| **T-02 Errore React #418 (hydration) su ogni pagina mobile** | **Risolto** | `49eae22`, `43162ea` | 0/3 caricamenti con errore con CPU rallentata 6 volte su home e portfolio, desktop e 390px (prima 4/4 su mobile). Nessun errore in console su 16 combinazioni pagina/viewport (dev server, CPU ×4). |
| **Errore di hydration su `pc-reveal is-in` (`src/app/page.tsx`)** | **Risolto** | `43162ea` | Causa: la logica dei reveal girava accanto a `<main>`, prima dell'idratazione della pagina. Ora sta in `PageFx`, dentro la pagina. |
| Chiavi React duplicate nel cambio pagina (trovate in dev) | **Risolto** | `a34220a` | Console dev pulita. |
| Avviso dev `instant-shell-url-data` sulle pagine di dettaglio | **Risolto** | `a34220a` | `export const instant = false` (slug tutti noti in build). |
| **Ripristino dello scroll con "Indietro" animato** (tornava a ~490–570px invece che a 1500px) | **Risolto** | `1de60eb` | Causa: `html { scroll-behavior: smooth }`. Rimosso. Home a 1500px → progetto/servizio → Indietro: 15/15 tornano subito a 1500px senza animazione (prima 0/15, ~630 ms), anche dopo caricamento a freddo. Le ancore interne (#…) restano morbide: lo smooth si attiva solo al clic e rispetta `prefers-reduced-motion`. `data-scroll-behavior` sul tag `<html>` non risolve da solo (provato). |
| Portfolio: nomi in `<span>`, `alt=""`, progetti senza anteprima nascosti | **Risolto** | `3e7db59` | 16 `<h2>` nella lista, alt descrittivi, 8 progetti non pubblicati nascosti. |
| Pulsante "Metti in pausa le animazioni" | **Rimosso su richiesta** | `a929e47` | 0 pulsanti su 8 pagine/viewport; il tema notte funziona e resta dopo il reload. Vedi A-08. |
| Cambio pagina con "sipario" lento | **Sostituito** da View Transitions | `9e4b1d9` | Nessun overlay; cross-fade di 350 ms; elementi condivisi card → hero (titolo e immagine). |
| Easing con rimbalzo, reveal tutti uguali, loop infiniti | **Modernizzati** | `0d88560`, `43162ea`, `7bd7028` | Vedi i messaggi dei commit. Restano in loop le scene dell'accordion (T-08). |

## Collegamento a WordPress (25/11/2026)

Progetti, servizi, team, posizioni aperte, recapiti, social e aree del modulo candidature arrivano da WordPress
(`wp.promocommunication.it`, REST con ACF) tramite `src/lib/content.ts`; `src/data` resta come **riserva** quando WordPress non
risponde o una raccolta è vuota. Cache di un'ora (`cacheLife("hours")`, tag `wp`). Anteprima delle bozze: `/api/preview`
(dal tasto Anteprima di WordPress) e `/api/preview/esci`, con barra `PreviewBar`.
Verifica: build con WordPress simulato (stesse risposte della REST reale) e senza WordPress; 13 pagine confrontate, testi, link,
immagini e JSON-LD identici (cambiano solo gli indirizzi delle immagini, ora su WordPress). Anteprima: 401 con segreto
sbagliato, 307 verso la pagina con quello giusto, barra solo in anteprima, uscita funzionante.
**Ancora nel codice**: i testi delle pagine (titoli, frasi, fumetti, footer, banner cookie, testi dei moduli). I campi esistono già
in WordPress (Pagine), vanno collegati.

## Prestazioni mobile (26/11/2026)

Branch `ottimizzazione-mobile` (non ancora unito a `main`). Aspetto e contenuti invariati.

### Misure prima/dopo

Lighthouse 13.6, mediana di 3 passate, build di produzione locale di `main` contro quella del branch, stesso computer,
Google Tag Manager spento. Valgono per il confronto: **vanno confermate su PageSpeed**. Home e /team sono misurate sul codice
finale; le altre pagine prima delle correzioni a team e titolo della home, che non le riguardano.

| Pagina | Modo | Punteggio | LCP (s) | Speed Index (s) | TBT (ms) | Peso (KB) |
|---|---|---|---|---|---|---|
| `/` | mobile | 100 → 100 | 1,21 → 1,21 | 1,62 → 1,69 | 44 → 49 | 919 → 475 |
| `/` | desktop | 100 → 100 | 0,33 → 0,33 | 0,54 → 0,55 | 0 → 0 | 965 → 613 |
| `/team` | mobile | 88 → 91 | 3,80 → 3,50 | 1,25 → 1,66 | 88 → 57 | 857 → 494 |
| `/team` | desktop | 97 → 99 | 1,28 → 0,86 | 0,38 → 0,42 | 0 → 0 | 921 → 582 |
| `/portfolio/pure-red` | mobile | 88 → 90 | 3,91 → 3,63 | 1,45 → 1,62 | 84 → 54 | 1715 → 617 |
| `/portfolio/pure-red` | desktop | 99 → 100 | 0,97 → 0,75 | 0,48 → 0,45 | 0 → 0 | 1755 → 820 |
| `/portfolio` | mobile | 100 → 100 | 1,21 → 1,21 | 1,60 → 1,49 | 61 → 52 | 1353 → 433 |
| `/portfolio` | desktop | 98 → 99 | 1,17 → 0,94 | 0,48 → 0,52 | 0 → 0 | 1285 → 570 |
| `/servizi/social-media` | mobile | 100 → 100 | 1,21 → 1,21 | 1,75 → 1,77 | 55 → 56 | 1464 → 817 |
| `/servizi/social-media` | desktop | 100 → 100 | 0,33 → 0,33 | 0,45 → 0,51 | 0 → 0 | 1624 → 942 |

### Fatto

| Intervento | Commit |
|---|---|
| Foto del team con `next/image` (qualità 85), lazy; solo la prima di /team ad alta priorità. Non si scaricano più sulle pagine che non le mostrano. | `76e03dc`, `1a6acae` |
| Immagini dei progetti con `next/image`; copertina ad alta priorità (chiude **T-05**). | `e39f5b3`, `05e6dc1` |
| Anteprime al passaggio del mouse ottimizzate e lazy. | `0696dc9` |
| Cache di 31 giorni per immagini ottimizzate e `public/img`; font Caveat con `next/font/local`. | `d0081ae` |
| Foto del team in home caricate una schermata prima di comparire. | `ba0affc` |
| **Errore React #418 su /team** (anche online): la descrizione di WordPress, già in `<p>`, finiva in un altro `<p>`. | `bead67e` |
| **Titolo "Boost" instabile in home** (anche online, 124 o 150px a 1440): la home rigenerata usciva con `data-view="index"` e perdeva tutti gli stili `[data-view="home"]`. | `3c53261` |

WordPress: se si sostituisce un'immagine, caricarla con un nome nuovo (altrimenti resta in cache fino a 31 giorni).

### LCP mobile di /team e pure-red

L'elemento è la foto del primo membro e la copertina del progetto. Sono scoperte subito (HTML), con `fetchPriority="high"`,
senza animazioni d'ingresso. La misura simulata (circa 3,5 s) è più severa di quella con rete e CPU rallentate davvero
(`--throttling-method=devtools`): **2,16 s** su /team e **2,28 s** su pure-red, quasi tutti spesi a scaricare l'immagine
mentre condivide la banda con font (50 KB) e CSS (33 KB). Nessuna correzione applicata: quelle possibili tolgono poco o
cambiano la resa.

### Provato e scartato

- `experimental.inlineCss`: peggiora (TBT in home mobile 45 → 202 ms, LCP fino a +0,33 s, circa 66 KB in più per pagina).
- Escludere i polyfill di Next (14 KiB): richiederebbe un alias e toglierebbe supporto a browser dichiarati.

### Ancora aperto

Richieste CSS che bloccano il rendering (`site.css`), JavaScript legacy, peso di Google Tag Manager.

## 1. Riepilogo e voti

I voti sono **giudizi miei per area**, non una metrica standard. Il sito ha un'identità forte e coerente e ora funziona su mobile; i punti deboli sono ciò che non si vede a colpo d'occhio: form finti, privacy, SEO e accessibilità strutturale.

| Area | Voto | Prima | Motivo in una riga |
|---|---|---|---|
| Design | **7/10** | 7 | Identità coerente e movimento più sobrio; pesano l'hero di `/servizi` e il portfolio desktop senza immagini. |
| Accessibilità | **5/10** | 5 | Focus visibile, reduced-motion e tema notte senza errori; ma 1 *critical* axe (accordion), contrasto, H1 con live region, titoli. |
| Copy | **7/10** | 7 | Tono vivo e coerente; CTA "Boost →" ambigua, note "Anteprima" ancora nei form. |
| Brand | **6/10** | 6 | Il tono c'è; la proposta di valore no. |
| SEO | **3/10** | 3 | Struttura decente, ma mancano sitemap, robots, canonical, OG, JSON-LD, meta description per pagina. |
| Tecnico | **6/10** | 3 | Mobile, hydration e scroll risolti, console pulita; restano form finto, 404 incoerente, immagini pesanti. |

## 2. Metodo e limiti

Strumenti: Playwright + Chromium (viewport 1440×900 e 375–390px), axe-core (WCAG 2.0/2.1 A/AA + best practice), curl sull'HTML generato, lettura del codice. Skill dei plugin Design, Marketing e SEO-AEO-GEO Ultimate usate nell'audit del 20/11 (non esiste un comando `/site-audit`; equivalente: `seo-aeo-geo-ultimate:seo-audit`).

**Non verificato:** screen reader reali, Safari/Firefox/dispositivi reali, HTTPS e header di sicurezza, Lighthouse e dati di campo (gli LCP locali sono instabili e non vanno citati), volumi di ricerca, competitor, backlink (i server MCP dei plugin non si sono connessi). Le keyword nel §4 sono ipotesi non validate.

## 3. Problemi aperti

Impegno: **S** = poche ore · **M** = 1–2 giorni · **L** = più giorni.

### Priorità ALTA

| ID | Area | Pagina | Descrizione | File | Correzione proposta | Impegno |
|---|---|---|---|---|---|---|
| T-03 | Tecnico/Business | `/`, `/contatti` | **I form non inviano nulla.** Dopo 2,2 s mostrano "Messaggio ricevuto…" e "In questa anteprima il messaggio non parte davvero"; sotto il pulsante: "Anteprima: il messaggio non viene inviato davvero". | `src/components/ContactForm.tsx` | Route handler/server action + invio email o CRM, anti-spam (honeypot/rate limit), stato di errore reale; togliere le note "anteprima". | M |
| C-01 | Compliance | Home, `/contatti`, footer | **Privacy/cookie assenti.** "informativa privacy", "Dati aziendali", "Company Profile" sono `href="#"` (6 link `#` in home); "Privacy · Cookie" è testo non cliccabile; mancano ragione sociale/P.IVA/sede legale. Il form raccoglie dati personali. *Segnalazione di rischio, non consulenza legale.* | `Footer.tsx`, `ContactForm.tsx` | Pagine informativa privacy/cookie, dati societari nel footer, banner cookie solo se servono cookie non tecnici. Da validare con il consulente legale. | M |
| S-01 | SEO | Tutte | **Nessun `sitemap.xml` e `robots.txt`** (entrambi 404, riverificato). | `src/app/` | `sitemap.ts` (8 pagine + 8 servizi + 16 progetti pubblicati) e `robots.ts`. | S |
| S-02 | SEO | Tutte | **Meta description identica ovunque**; nessuna specifica per servizi/progetti. | `layout.tsx`, ogni `page.tsx` | `description` per pagina (~160 caratteri) e `generateMetadata` con intro del progetto / testo del servizio. | S |
| S-03 | SEO | Tutte | **Nessun canonical, Open Graph, Twitter Card, `metadataBase`, immagine social.** | `layout.tsx` | `metadataBase`, `alternates.canonical`, `openGraph`, `twitter`; `opengraph-image` (si può usare la cover del progetto). | S–M |
| B-01 | Brand | Home | **Proposta di valore poco chiara.** H1 "Boost your Brand/Reputation/…" + "Diamo forma, voce e spazio…": non dice che è un'agenzia di comunicazione/marketing, per chi lavora, dove (Vittoria, RG), perché sceglierla. "Unit di Comunicazione & Marketing di Promotergroup" compare solo in `/chi-siamo`. | `src/app/page.tsx` | Riga di chiarimento sotto l'H1 (vedi §5). | S |
| A-01 | Accessibilità | `/servizi` | **axe *critical* `aria-required-children`:** il `role="tablist"` contiene direttamente i `role="tabpanel"`. | `Accordion.tsx` | `tablist` solo con i `tab`, `tabpanel` fuori (collegati con `aria-controls`/`aria-labelledby`); oppure pattern *accordion* (pulsanti + `aria-expanded`). | S–M |

### Priorità MEDIA

| ID | Area | Pagina | Descrizione | File | Correzione | Impegno |
|---|---|---|---|---|---|---|
| A-02 | Accessibilità | Portfolio | **Contrasto insufficiente:** `.pl-sector` rosso `#f40808` su bianco = 4,29:1 (13px; serve 4,5:1). axe: 16 nodi su `/portfolio`, desktop e mobile. Tema notte: 0 violazioni (4 pagine). *Introdotto da me nell'ultima revisione del portfolio.* | `site.css` | Rosso più scuro solo per testo piccolo in tema chiaro (circa `#e00000` ≈ 5:1, da validare col brand) o blu. | S |
| A-03 | Accessibilità | Home, `/servizi` | **H1 rotante + live region.** L'H1 contiene tutte le parole e lo slot ha `aria-live="polite"`: annuncio ogni 2 s. | `Boost.tsx` | Testo statico accessibile ("Boost your brand") + parole animate `aria-hidden`; togliere `aria-live`. | S |
| A-04 | Accessibilità | Tutte | **Ordine dei titoli:** footer con `h4` (`.ft-brand`) senza `h3`; `/servizi` salta da h1 a h3; `/chi-siamo` senza h2 di sezione. axe `heading-order` su 8/8 pagine. | `Footer.tsx`, `Accordion.tsx`, `chi-siamo/page.tsx` | Footer con `h2`/`h3` coerenti; accordion con `h2`; titoli di sezione reali. | S |
| A-05 | Accessibilità | Home, Chi siamo | **axe `aria-prohibited-attr`:** `.pc-marquee` è un `div` con `aria-label` senza ruolo. | `blocks.tsx` | `role="img"` con etichetta, oppure togliere l'etichetta e lasciare il contenuto `aria-hidden`. | S |
| A-06 | Accessibilità | Mobile | **Target piccoli:** burger 42×46, link del footer alti 19px (WCAG 2.5.8 chiede ≥24px). Nav desktop alta 28px. | `site.css`, `Footer.tsx` | Più area cliccabile con padding (senza cambiare l'aspetto), interlinea nel footer. | S |
| A-07 | Accessibilità | Mobile | **Testo da 11px** (settore e tag): 16 elementi su portfolio, 10 su una pagina servizio. *Introdotto da me.* | `site.css` | ≥12–13px su mobile. | S |
| A-08 | Accessibilità | Tutte | **Nessun controllo per fermare i movimenti automatici.** Dopo la rimozione del pulsante pausa (richiesta) restano marquee, parole che ruotano ogni 2 s, griglia elastica, scene dell'accordion. WCAG 2.2.2 (livello A) chiede un meccanismo per contenuti che si muovono oltre 5 s. Attenuanti: rispetta `prefers-reduced-motion`; la marquee si ferma al mouse. | `Boost.tsx`, `Accordion.tsx` | Decisione tua. Opzioni: pausa anche al focus e al passaggio del mouse per le parole che ruotano; oppure ripristinare un controllo discreto. | S |
| D-01 | Design | `/servizi` | **Hero troppo alto:** titolo + padding (246/326px) portano l'accordion sotto la piega a 1440×900. | `servizi/page.tsx`, `site.css` | Ridurre il padding come nel portfolio. | S |
| D-02 | Design | `/portfolio` desktop | **Lista di solo testo** finché non si passa il mouse; H1 su 4 righe a 1440px; ~260px di vuoto prima della CTA; tag a 12px. | `portfolio/page.tsx`, `site.css` | H1 su 2 righe, miniature anche su desktop, meno vuoto finale. | M |
| D-03 | Design | Tutte | **CTA band identica** su 7 pagine + titolo del footer + form in home. | `blocks.tsx`, `page.tsx` | Variare il testo per pagina (§5). | S |
| K-01 | Copy | `/team` → `/contatti` | **"Candidati"** porta a un form senza campo CV, ma il testo dice "mandaci il tuo CV". | `TeamScroll.tsx`, `ContactForm.tsx` | Allegato CV nel form contatti o email per le candidature. | S |
| K-02 | Copy | Home, `/contatti` | **Pulsante di invio "Boost →"** ambiguo. | `ContactForm.tsx` | "Invia il messaggio →". | S |
| K-03 | Copy/UX | `/contatti` | **Nessun indirizzo email**, né orari né mappa. | `contatti/page.tsx` | Email, orari, mappa o "Come arrivare". | S |
| S-04 | SEO | Tutte | **Title poco descrittivi:** home "Boost your brand — PromoCommunication"; servizi/progetti solo con il nome. | `layout.tsx`, `generateMetadata` | Proposte in §5. | S |
| S-05 | SEO | Tutte | **Link `#` segnaposto** (social, Dati aziendali, Company Profile, privacy): 6 nella home. | `Footer.tsx`, `ContactForm.tsx`, `contatti/page.tsx`, `Behaviors.tsx` | Link reali o rimuoverli. | S |
| S-06 | SEO | Tutte | **Dati strutturati assenti** (0 blocchi JSON-LD). | `layout.tsx`, `portfolio/[slug]/page.tsx` | `Organization` + `LocalBusiness` (Vittoria, RG), `BreadcrumbList`, `CreativeWork` per i progetti, `Service` per i servizi; solo dati reali e visibili. | M |
| S-07 | SEO/Contenuti | Progetti, Contatti | **Contenuti sottili:** `/contatti` ≈132 parole; pagine progetto ≈230 parole, senza risultati misurabili. | `src/data/projects.ts` | Obiettivo → azioni → risultato e una frase del cliente. | M–L |
| T-04 | Tecnico | Slug sconosciuti/non pubblicati | **404 non deterministico, riverificato:** `/portfolio/cultivar` risponde **200** alla prima richiesta e 404 alle successive; **`/servizi/xyz` risponde 200** (pagina not-found con `noindex`, ma stato 200 = soft-404). `/pagina-inesistente` è corretta (404). | `portfolio/[slug]/page.tsx`, `servizi/[slug]/page.tsx` | Verificare in produzione reale con Cache Components; valutare un controllo dello slug prima di qualsiasi accesso dinamico. | M |
| B-02 | Brand | Home, progetti | **Mancano prove:** nessun numero, risultato o logo cliente in evidenza; claim "centinaia di organizzazioni" non documentato. | `page.tsx` | Dimostrarlo o riformulare. | S |

### Priorità BASSA

| ID | Area | Pagina | Descrizione | File | Correzione | Impegno |
|---|---|---|---|---|---|---|
| T-08 | Tecnico | `/servizi` | **Le scene dell'accordion restano in loop** finché sono visibili (~110 dichiarazioni `infinite`). Sono in pausa fuori schermo e con la scheda chiusa; i loro `@keyframes` finiscono con una dissolvenza a zero, quindi giocarli una sola volta le farebbe sparire. | `site.css` | Ridisegnare il fotogramma finale di ogni scena (stato "a riposo") e farle partire una volta sola. | L |
| K-04 | Copy | Home, footer | "Promotergroup **Spa.**" vs "**S.p.a.**"; tassonomia mista "Web" / "Sito web" / "Digital & Web"; "Shooting foto/video". | `page.tsx`, `projects.ts` | Una sola forma per termine. | S |
| K-05 | Copy | `/servizi` | Link "Scopri →" ripetuto 8 volte con lo stesso testo. | `Accordion.tsx` | `aria-label="Scopri Brand Strategy"`. | S |
| S-08 | SEO/GEO | Tutte | Nessun `llms.txt` né FAQ (non è un requisito universale); collegare chiaramente PromoCommunication ↔ Promotergroup. | `src/app/` | Valutare dopo S-01…S-06. | M |
| S-09 | SEO | Servizi/progetti | Nessun link servizio ↔ progetto nella pagina progetto; niente breadcrumb. | `portfolio/[slug]/page.tsx` | Servizi come link + breadcrumb. | S |
| T-06 | Tecnico | Repo | Codice/risorse non usati: `src/lib/wordpress.ts`, `public/layout.jpg` (vecchia Coming Soon), `images.remotePatterns` per `wp.promocommunication.it`, regole CSS `.pl-img--soon` e `.pl-thumb--soon`. *Uso effettivo non verificato.* | vari | Pulizia dopo conferma. | S |
| T-07 | Tecnico | Tutte | Font `Heading Narrow` (`--font-logo`) mai caricato. *Uso non verificato.* | `site.css` | Caricarlo o rimuovere la variabile. | S |

### Cosa funziona bene (da non rompere)

- Identità coerente: blu `#001a70`, rosso, bolle, stella, marquee.
- `lang="it"`, viewport e `theme-color` presenti; un solo H1 per pagina.
- Focus visibile, link "salta al contenuto", tema notte senza errori di contrasto, regole `prefers-reduced-motion` (reveal, transizioni di pagina, anteprime, magnete, marquee), voci filtrate non raggiungibili (`inert`).
- Mobile: contenuto visibile, nessun overflow orizzontale, console pulita, CLS 0.
- Ripristino dello scroll con Indietro immediato; ancore interne morbide.

## 4. Brand e marketing

- **Tono di voce:** ironico e vicino, con metafore ricorrenti ("accendiamo la luce", "senza bacchetta magica", "il prossimo fumetto potresti essere tu"); coerente tra Home, Chi siamo, Team, Servizi. Nessuna guida di brand configurata: revisione generica.
- **Chi / per chi / perché:** *chi* è chiaro solo in Chi siamo; *per chi* e *dove* non si dice mai; *perché sceglierti* è implicito (Promotergroup) ma non dimostrato.
- **Claim:** "centinaia di organizzazioni" senza numero verificabile.
- **Keyword (ipotesi non validate):** agenzia di comunicazione Ragusa / Vittoria / Sicilia; comunicazione politica; ufficio stampa; personal branding; social media management; branding per aziende agricole/agroalimentari; sito web e SEO per imprese.

## 5. Riscritture proposte (tono attuale mantenuto)

| Elemento | Oggi | Proposta |
|---|---|---|
| Sottotitolo home | "Diamo forma, voce e spazio a quello che la tua impresa fa ogni giorno." | "Siamo l'agenzia di comunicazione e marketing di Promotergroup, a Vittoria (RG). Diamo forma, voce e spazio a quello che la tua impresa fa ogni giorno." |
| Title home | "Boost your brand — PromoCommunication" | "PromoCommunication — agenzia di comunicazione e marketing a Vittoria (RG)" |
| Meta description home | (generica) | "Strategia, brand identity, web, social, ufficio stampa ed eventi per imprese e istituzioni. Dalla Sicilia, con l'esperienza di Promotergroup." |
| Title servizio | "Brand Identity — PromoCommunication" | "Brand identity e rebranding per imprese — PromoCommunication" |
| Title progetto | "Pure Red — PromoCommunication" | "Pure Red: brand identity e lancio per OP Esperidio — PromoCommunication" |
| Pulsante form | "Boost →" | "Invia il messaggio →" |
| Nota sotto il form | "Anteprima: il messaggio non viene inviato davvero." | "Ti rispondiamo entro un giorno lavorativo." *(solo se è vero)* |
| Conferma form | "Messaggio ricevuto, forte e chiaro." + nota anteprima | "Messaggio ricevuto, forte e chiaro. Ti scriviamo presto." |
| CTA band | sempre "Raccontaci la tua idea, noi mettiamo il boost!" | Servizi: "Dimmi quale boost ti serve: parliamone." · Portfolio: "Ti piace come lavoriamo? Raccontaci il tuo progetto." · Team: "Ti presentiamo anche a voce: scrivici." |
| "Candidati" (Team) | "Candidati →" | "Mandaci il tuo CV →" (con campo allegato o email) |
| 404 | "Questa pagina non c'è." | "Questa pagina non c'è (o non ancora). Intanto guarda i nostri progetti." + Home / Portfolio |

## 6. Le 5 modifiche con più impatto, da fare per prime

1. **Far arrivare i messaggi (T-03) e mettere in regola privacy/dati societari (C-01).** Senza questo il sito non genera contatti e ne raccoglie in modo non conforme.
2. **SEO di base in un colpo (S-01…S-06).** `sitemap.ts`, `robots.ts`, `metadataBase` + canonical + Open Graph, meta description e title per pagina, JSON-LD `Organization`/`LocalBusiness`.
3. **Chiarire la proposta di valore (B-01, S-04, B-02).** Una riga in home e nel title: *agenzia di comunicazione*, *per chi*, *dove*; sostituire "centinaia" con un dato dimostrabile.
4. **Pacchetto accessibilità (A-01, A-02, A-03, A-04).** Accordion valido (*critical* axe), rosso più scuro per il testo piccolo, H1 rotante senza live region, ordine dei titoli; poi decidere su A-08.
5. **Servizi e portfolio sopra la piega (D-01, D-02).** Hero di `/servizi` più basso e miniature nel portfolio su desktop: oggi il contenuto principale parte sotto la piega o resta solo testo.

---

*Dati di test: `scratchpad/audit.json`, fuori dal progetto. Per i dettagli di ogni intervento vedi `git log` (`3e7db59` … `a929e47`).*
