# WordPress headless

WordPress (`wp.promocommunication.it`) è usato **solo come CMS**: il sito pubblico resta Next.js su Vercel.

- **ACF gratuito** (niente ripetitore, contenuto flessibile, galleria, clone, pagine opzioni).
- **Yoast SEO** per titolo, descrizione, immagine social e semafori (SEO e leggibilità). I semafori leggono i campi ACF grazie a
  **ACF Content Analysis for Yoast SEO**: le Pagine non hanno l'editor di testo, tutto sta nei campi.
- **I campi stanno nel progetto**, un file JSON per gruppo in `wordpress/acf-json/`, generati da `npm run acf:genera`.
  In WordPress si copiano in `wp-content/acf-json/` e si attivano con **Sincronizza**. Non si importano più a mano.
- **Tipi di contenuto e categorie sono registrati da codice** nel mu-plugin, non in ACF → Tipi di contenuto.
- **I testi del sito stanno nelle Pagine di WordPress**: una pagina per ogni pagina del sito, riconosciuta dallo **slug**.
  Ogni slug ha il suo gruppo di campi (regola ACF "Slug pagina" del mu-plugin): aprendo "Home" si vedono solo i campi della Home.
- I dati si leggono con la **REST nativa** (`/wp-json/wp/v2`, campi nella proprietà `acf`) oppure con **GraphQL** (WPGraphQL + WPGraphQL for ACF).

## Cosa c'è nel progetto

| Percorso | Cosa fa |
| --- | --- |
| `scripts/genera-acf-json.mjs` | Definisce tutti i campi. Si modifica qui, poi `npm run acf:genera` |
| `wordpress/acf-json/*.json` | 16 gruppi di campi, chiavi stabili `group_promo_*` / `field_promo_*` |
| `wordpress/mu-plugins/promocommunication-headless.php` | Tipi di contenuto, categorie, regola "Slug pagina", cartella `acf-json`, anteprima, reindirizzamento del front, indirizzi di Yoast verso il sito pubblico, sicurezza, password applicazione per GraphQL, aggiornamento immediato del sito |

Le chiavi nascono dal percorso del campo (es. `field_promo_home_storia_citazione`): se si rigenera senza cambiare nomi, ACF
riconosce gli stessi campi e i testi inseriti non si perdono. **Non rinominare un campo già usato**: per ACF sarebbe un campo nuovo.

## Contenuti

| Cosa | Tipo | REST | GraphQL | Sostituisce |
| --- | --- | --- | --- | --- |
| Progetti | `progetto` | `/progetti` | `progetti` | `src/data/projects.ts` |
| Categorie progetto | tassonomia `categoria_progetto` | `/categorie-progetto` | `categorieProgetto` | il campo `cats` dei progetti |
| Servizi | `servizio` | `/servizi` | `servizi` | `src/data/services.ts` |
| Team | `membro` | `/membri` | `membri` | `src/data/team.ts` |
| Posizioni aperte | `posizione` | `/posizioni` | `posizioni` | `OPEN_ROLES` in `src/data/careers.ts` |
| Testi del sito | Pagine (`page`) | `/pages?slug=home` | `pages` / `page(id: "home", idType: URI)` | testi scritti nelle pagine e nei componenti |

Le 5 categorie (Brand Identity, Digital & Web, Event Management, Shooting foto/video, Social Media) le crea il mu-plugin con
slug fissi (`brand-identity`, `digital-web`, `event-management`, `shooting-foto-video`, `social-media`). Non cambiare gli slug.

## Le Pagine (slug esatti)

Pagine → Aggiungi. Il titolo è libero, **lo slug deve essere questo**. Il mu-plugin lo ricava dal titolo al primo salvataggio:
controlla che sia giusto. I campi compaiono appena la pagina ha lo slug (salva la bozza e ricarica).

| Slug | Titolo suggerito | Gruppo di campi | Cosa si modifica |
| --- | --- | --- | --- |
| `home` | Home | Pagina · Home | parole del titolo "Boost your...", frase e pulsante, "La nostra storia", titoli delle sezioni |
| `chi-siamo` | Chi siamo | Pagina · Chi siamo | titolo, introduzione, le tre sezioni con le frasi nei fumetti |
| `servizi` | Servizi | Pagina · Servizi | parole del titolo, testi della pagina del singolo servizio |
| `portfolio` | Portfolio | Pagina · Portfolio | titolo, filtri e ordinamento, etichette della pagina del progetto |
| `team` | Team | Pagina · Team | titolo, frase, scheda "Lavora con noi" |
| `contatti` | Contatti | Pagina · Contatti | titolo e frase |
| `lavora-con-noi` | Lavora con noi | Pagina · Lavora con noi | titolo, frase, aree di interesse del modulo |
| `privacy` | Privacy e Cookie policy | Pagina · Privacy e Cookie policy | titolo, data di aggiornamento, testo dell'informativa |
| `pagina-non-trovata` | Pagina non trovata | Pagina · Pagina non trovata | titolo e pulsante della pagina 404 |
| `impostazioni` | Impostazioni del sito | Pagina · Impostazioni del sito | menu, recapiti e orari, social, footer, blocco finale, banner cookie, moduli, nome del sito, immagine di condivisione, Search Console, Tag Manager |

La 404 usa `pagina-non-trovata` perché WordPress non accetta uno slug solo numerico come `404`.
Nelle Pagine non c'è l'editor di testo: tutto sta nei campi. La SEO di ogni pagina, progetto e servizio si scrive nel riquadro di Yoast.

Dove un testo ha una parola in corsivo si scrive `<em>parola</em>` nei campi di una riga. Nei campi con barra degli strumenti
si usano grassetto, corsivo e link. Le liste sono campi fissi (8 blocchi di galleria, 8 voci "Cosa facciamo", 8 parole) o
textarea con una voce per riga.

## Installazione da zero

1. Plugin: **Advanced Custom Fields** gratuito 6.1+, **Yoast SEO**, **ACF Content Analysis for Yoast SEO**.
   Per GraphQL anche **WPGraphQL**, **WPGraphQL for ACF** e **Add WPGraphQL SEO**.
2. Copia `wordpress/mu-plugins/promocommunication-headless.php` in `wp-content/mu-plugins/` (crea la cartella se non c'è).
3. Copia la cartella `wordpress/acf-json/` in `wp-content/acf-json/`. La cartella deve essere scrivibile da WordPress:
   se modifichi un gruppo dal pannello, ACF aggiorna il file lì (riportalo poi nel progetto, o meglio modifica lo script).
4. ACF → Gruppi di campi → scheda **Sincronizzazione disponibile** → seleziona tutti → **Sincronizza**. Devono essere 16.
5. Impostazioni → Permalink → **Salva** senza cambiare nulla.
6. Crea le 10 Pagine della tabella sopra.
7. In `wp-config.php`, sopra la riga `That's all, stop editing!`:

```php
define( 'PC_FRONTEND_URL', 'https://www.promocommunication.it' );
define( 'PC_PREVIEW_SECRET', 'la-stessa-stringa-di-PREVIEW_SECRET-su-Vercel' );
define( 'PC_REVALIDATE_TOKEN', 'la-stessa-stringa-di-REVALIDATE_TOKEN-su-Vercel' );
```

Le due stringhe segrete si generano con `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
e vanno identiche su Vercel (`PREVIEW_SECRET`, `REVALIDATE_TOKEN`), poi un nuovo deploy.

8. Utente per l'anteprima: ruolo **Editor**, con una **Password applicazione**. Nome utente e password vanno su Vercel in
   `WORDPRESS_USER` e `WORDPRESS_APP_PASSWORD` (solo lato server).

## Yoast SEO

Quello che si scrive nel riquadro Yoast di una **pagina** (Home, Chi siamo, Servizi, Portfolio, Team, Contatti,
Lavora con noi, Privacy), di un **progetto** o di un **servizio** va sul sito. Il mu-plugin lo espone nel campo REST
`pc_seo`, con le variabili (`%%title%%`, `%%sep%%`, `%%sitename%%`…) già sostituite; `src/lib/content.ts` lo legge e
`pageMeta()` in `src/lib/seo.ts` lo usa al posto dei testi del codice.

| Riquadro Yoast | Sul sito | Se è vuoto |
| --- | --- | --- |
| Titolo SEO | `<title>` completo, così com'è (nessun " \| PromoCommunication" aggiunto) | "Titolo \| PromoCommunication" del codice |
| Meta descrizione | `description` | testo del codice (servizi e progetti: inizio della descrizione) |
| Social → Titolo / Descrizione | `og:` e Twitter | titolo e descrizione qui sopra |
| Social → Immagine | `og:image` | `/og.png` |
| Avanzate → "Consentire ai motori di ricerca di mostrare…?" = No | `noindex, follow` e fuori da `sitemap.xml` | indicizzata |

- Conta solo quello che è **scritto** nel riquadro: i modelli automatici di Yoast non sostituiscono i testi del sito.
- Dopo **Aggiorna** il sito si aggiorna subito (vedi Aggiornamento immediato).
- Team e posizioni aperte non hanno una pagina loro: il loro riquadro Yoast non va sul sito.
- **Separatore**: il sito usa `|`. Conviene lo stesso in Yoast → Impostazioni → Informazioni di base del sito, così
  l'anteprima di Google in WordPress coincide con il sito. Il mu-plugin fa valere `%%sitename%%` = "PromoCommunication".
- **Semafori**: SEO e leggibilità leggono i campi ACF della pagina (plugin ACF Content Analysis for Yoast SEO). La parola
  chiave si sceglie nel riquadro Yoast; serve solo ai semafori.
- **Indirizzi**: il mu-plugin riscrive canonical e `og:url` di Yoast verso il sito pubblico (serve `PC_FRONTEND_URL` in
  `wp-config.php`). Il canonical del sito lo scrive comunque Next.js.
- **Mappa del sito di Yoast**: spenta (Yoast → Impostazioni → Funzionalità del sito → Sitemaps XML). La sitemap la pubblica il sito Next.js.
- Il dominio di WordPress resta fuori da Google grazie all'intestazione `X-Robots-Tag` del mu-plugin.

## Collegamento del sito Next.js

Il sito legge da WordPress con `src/lib/content.ts` (REST nativa, `acf_format=standard`); il client è `src/lib/wordpress.ts`.

| Dato del sito | Da WordPress | Riserva in `src/data` |
| --- | --- | --- |
| Progetti (lista, filtri, pagine, slider della home) | Progetti pubblicati **con anteprima** | `projects.ts` |
| Servizi (elenco, home, footer, nastro, moduli) | Servizi non nascosti, ordinati per "Ordine" | `services.ts` |
| Team | Team, ordinato per "Ordine" | `team.ts` |
| Posizioni aperte | Posizioni aperte (anche zero) | `careers.ts` |
| Aree del modulo candidature | Pagina `lavora-con-noi` → Aree di interesse | `careers.ts` |
| Recapiti, orari, mappa, social | Pagina `impostazioni` → Recapiti e Social | `contact.ts` |
| Titolo, descrizione, immagine social, noindex | Riquadro Yoast di pagine, progetti e servizi (`pc_seo`) | testi in `src/app/**/page.tsx` |

- Se WordPress non risponde o una raccolta è vuota, il sito usa la riserva: il build non si rompe mai.
- **Aggiornamento immediato** (come Cultivar): quando un contenuto pubblicato cambia, il mu-plugin chiama `POST /api/revalidate`
  con l'intestazione `X-WP-Revalidate-Token` (`PC_REVALIDATE_TOKEN` = `REVALIDATE_TOKEN` su Vercel). Il sito fa scadere i dati
  con etichetta `wp` e alla visita successiva li rilegge: pochi secondi, nessun deploy. Senza il codice, le pagine si aggiornano
  comunque entro un'ora. Gli errori della chiamata sono in `wp-content/debug.log` (con `WP_DEBUG_LOG`).
- **Restano nel codice**: illustrazioni e icone SVG dei servizi, la parola "Political Campaign" della home e tutti i testi delle
  pagine (titoli, frasi, fumetti, footer, banner cookie, moduli). I campi delle Pagine sono pronti ma non ancora letti dal sito.
- Le immagini dei progetti e del team sono nella libreria media (`wp-content/uploads`), già consentite in `next.config.ts`.

### Anteprima delle bozze

Il tasto **Anteprima** di WordPress apre `https://www.promocommunication.it/api/preview?secret=…&type=…&id=…`. Il sito controlla il
segreto, legge il contenuto con la password applicazione e apre la pagina con le bozze e una barra "Esci dall'anteprima"
(`/api/preview/esci`). Servono su Vercel `WORDPRESS_URL`, `WORDPRESS_USER`, `WORDPRESS_APP_PASSWORD`, `PREVIEW_SECRET`, e in
`wp-config.php` `PC_FRONTEND_URL` e `PC_PREVIEW_SECRET` (uguale a `PREVIEW_SECRET`). Un progetto senza anteprima non ha una pagina
e quindi non si può vedere in anteprima.

## Passaggio dalla versione precedente (file unico importato)

Prima i campi erano in `wordpress/acf/promocommunication-acf.json`, importato da ACF → Strumenti, con un tipo di contenuto
"Pagine" (`pagina`) e un menu "Quale pagina". Per passare a questa versione, nell'ordine:

1. **Pagine (tipo `pagina`)**: sposta nel cestino le 10 voci e svuota il cestino. I loro testi erano vuoti.
2. **ACF → Tipi di contenuto**: sposta nel cestino Progetti, Team, Servizi, Posizioni aperte, Pagine e svuota il cestino.
   Da ora li registra il mu-plugin: i contenuti già inseriti restano.
3. **ACF → Tassonomie**: sposta nel cestino "Categorie progetto" e svuota il cestino. Le categorie create restano.
4. **ACF → Gruppi di campi**: sposta nel cestino gli 11 gruppi vecchi (Progetto: …, Membro: …, Servizio: …, Posizione: …,
   Pagina: …) e svuota il cestino.
5. Segui "Installazione da zero" dal passo 2 (il mu-plugin nuovo sostituisce il vecchio).

Il file `wordpress/acf/promocommunication-acf.json` non serve più.

## Esempi

REST:

```
GET https://wp.promocommunication.it/wp-json/wp/v2/pages?slug=home          → acf.parole, acf.lead, acf.storia…, yoast_head_json.title / .description
GET https://wp.promocommunication.it/wp-json/wp/v2/pages?slug=impostazioni  → acf.menu, acf.contatti, acf.social…
GET https://wp.promocommunication.it/wp-json/wp/v2/progetti?per_page=100&_embed
GET https://wp.promocommunication.it/wp-json/wp/v2/servizi?per_page=100
```

GraphQL:

```graphql
{
  home: page(id: "home", idType: URI) {
    paginaHome { lead storia { citazione testo } }
    seo { title metaDesc opengraphImage { sourceUrl } }
  }
  impostazioni: page(id: "impostazioni", idType: URI) {
    impostazioniSito { contatti { email telefonoTesto } social { instagram } }
  }
  progetti(first: 100) {
    nodes {
      slug
      title
      campiProgetto { cliente tipo ordine anteprima { node { sourceUrl } } }
      categorieProgetto { nodes { slug name } }
    }
  }
}
```

I nomi GraphQL dei gruppi: `campiProgetto`, `galleriaProgetto`, `campiMembro`, `campiServizio`, `vociServizio`, `campiPosizione`, `paginaHome`, `paginaChiSiamo`, `paginaServizi`, `paginaPortfolio`, `paginaTeam`,
`paginaContatti`, `paginaLavoraConNoi`, `paginaPrivacy`, `paginaNonTrovata`, `impostazioniSito`. La SEO di Yoast è nel campo `seo`.
I campi sono quelli ACF in camelCase (`pulsante_testo` → `pulsanteTesto`).

## Mappa dei campi

**Progetto** (`progetto`): titolo = `name`, `cliente` = `client`, `tipo` = `kind`, `settore`, `ordine` = `o`, `in_arrivo` = `soon`,
`anteprima` = `img` (senza anteprima il progetto non è pubblicato), `copertina` = `cover`, `presentazione` = `intro`, `lavoro` = `work`,
`etichette` = `tags` (una per riga), `blocco_1` … `blocco_8` = `blocks` (`immagine`, `immagine_2` → `imgs`, `didascalia` → `cap`,
`adattamento` → `fit`, `affiancate` → `pair`), categorie = `cats`. Al posto di `published`: pubblicato e con anteprima.

**Membro** (`membro`): titolo = nome, `ruolo`, `colore` (b/r), `ordine`, `foto`, `descrizione`.

**Servizio** (`servizio`): titolo = nome, `boost`, `sigla`, `ordine`, `colore` (classe della scheda), `categoria_progetto`
(sostituisce `SVC_CAT`), `nascosto` (sostituisce `HIDDEN_SERVICES`), `descrizione` (`p1`), `chiusa` (`p2`), `etichette`,
`intro_cosa_facciamo`, `voce_1` … `voce_8` (titolo, icona, testo). Illustrazioni e icone SVG restano nel codice, legate allo slug.

**Posizione** (`posizione`): titolo = ruolo, `area`, `sede`, `descrizione`, `ordine`.

## Problemi frequenti

- **I campi non compaiono su una Pagina**: lo slug non è esatto, oppure non hai fatto Sincronizza. Salva la bozza e ricarica.
- **Compaiono due menu "Progetti"**: il tipo di contenuto è ancora anche in ACF → Tipi di contenuto. Cestinalo lì (passo 2 sopra).
- **`acf` vuoto nella REST**: la pagina non ha lo slug giusto, oppure il gruppo non è sincronizzato.
- **Il sito non si aggiorna dopo una modifica**: controlla che `PC_REVALIDATE_TOKEN` in `wp-config.php` e `REVALIDATE_TOKEN` su
  Vercel siano identici e che dopo averli impostati ci sia stato un nuovo deploy. Il contenuto deve essere pubblicato.
