# WordPress headless: campi ACF (versione gratuita)

`acf/promocommunication-acf.json` contiene tutto quello che serve in WordPress per far gestire dal pannello i contenuti che oggi stanno nei file `src/data`:

| Cosa | Tipo | Slug | Sostituisce |
| --- | --- | --- | --- |
| Progetti | tipo di contenuto | `progetto` | `src/data/projects.ts` |
| Categorie progetto | tassonomia | `categoria_progetto` | il campo `cats` dei progetti |
| Team | tipo di contenuto | `membro` | `src/data/team.ts` |
| Servizi | tipo di contenuto | `servizio` | `src/data/services.ts` |
| Posizioni aperte | tipo di contenuto | `posizione` | `OPEN_ROLES` in `src/data/careers.ts` |
| Pagine | tipo di contenuto | `pagina` | tutti i testi scritti nelle pagine e nei componenti, più contatti, menu, footer, moduli, banner cookie e SEO |

Ogni tipo ha il suo gruppo di campi (17 elementi in tutto, circa 320 campi). Il titolo del contenuto è il nome (progetto, persona, servizio, ruolo) e lo **slug** è l'identificativo usato negli URL del sito (es. `pure-red`, `social-media`).

## Plugin da installare

1. **Advanced Custom Fields** (gratuito, versione 6.1 o successiva: serve per importare tipi di contenuto e tassonomie)
2. **WPGraphQL**
3. **WPGraphQL for ACF** (espone i campi nello schema GraphQL)

## Pagine e impostazioni (tutti i testi del sito)

ACF gratuito non ha le "pagine opzioni", quindi i testi del sito vivono in un tipo di contenuto **Pagine**. Si crea **una voce per pagina**, si sceglie quale dal menu "Quale pagina" e compaiono solo i campi di quella pagina.

| Voce | Cosa si modifica |
| --- | --- |
| Home | parole del titolo "Boost your...", frase e pulsante, sezione "La nostra storia", titoli delle sezioni |
| Chi siamo | titolo, introduzione, le tre sezioni con le frasi nei fumetti |
| Servizi | parole del titolo, testi della pagina del singolo servizio |
| Portfolio | titolo, filtri e ordinamento, etichette della pagina del progetto |
| Team | titolo, frase, scheda "Lavora con noi" |
| Contatti | titolo e frase |
| Lavora con noi | titolo, frase, aree di interesse del modulo |
| Privacy e Cookie policy | titolo, data di aggiornamento e tutto il testo dell'informativa |
| Pagina non trovata | titolo e pulsante |
| Impostazioni del sito | menu, recapiti e orari, social, footer, blocco finale, banner cookie, testi e messaggi dei moduli, nome del sito, immagine di condivisione, codice Google Search Console, ID Google Tag Manager |

Ogni pagina, progetto e servizio ha anche un riquadro **SEO** (titolo, descrizione e immagine di condivisione).

Dove un testo ha una parola in corsivo si scrive `<em>parola</em>` nei campi di una riga. Nei campi con barra degli strumenti si usano grassetto, corsivo e link.

## Come importare

1. In WordPress: **ACF → Strumenti → Importa**.
2. Scegli `promocommunication-acf.json` e importa.
3. Vai su **Impostazioni → Permalink** e salva senza cambiare nulla (aggiorna gli indirizzi).
4. In **Progetti → Categorie progetto** crea queste 5 categorie, con questi nomi esatti:
   - Brand Identity
   - Digital & Web
   - Event Management
   - Shooting foto/video
   - Social Media

Il file segue il formato di esportazione di ACF 6, ma non l'ho potuto provare su un WordPress vero. Se l'importazione si ferma con un errore, mandami il messaggio e correggo il file.

## Cosa non c'è, perché ACF gratuito non lo ha

- **Ripetitore:** le liste sono campi fissi. La galleria di un progetto ha 8 blocchi, le voci "Cosa facciamo" di un servizio ne hanno 8 (oggi il massimo è 8 e 8). Etichette dei progetti e dei servizi sono un testo con una voce per riga, da dividere nel sito.
- **Galleria e pagine opzioni:** non ci sono, per questo i testi del sito stanno nel tipo "Pagine". Restano nel codice solo le illustrazioni dei servizi e l'aspetto (colori, animazioni).
- **Illustrazioni e icone SVG dei servizi:** restano nel codice, legate allo slug del servizio. Nel campo "Icona" si sceglie solo il nome dell'icona (come oggi in `ICONS`).

## Come mappano i campi

**Progetto** (`progetto`)

| Campo ACF | Dato attuale |
| --- | --- |
| titolo | `name` |
| `cliente` | `client` |
| `tipo` | `kind` |
| `settore` | `settore` |
| `ordine` | `o` |
| `in_arrivo` | `soon` |
| `anteprima` | `img` (se manca, il progetto non è pubblicato) |
| `copertina` | `cover` |
| `presentazione` | `intro` |
| `lavoro` | `work` |
| `etichette` | `tags` (una per riga) |
| `blocco_1` ... `blocco_8` | `blocks`: `immagine`, `immagine_2` (le due insieme sono `imgs`), `didascalia` (`cap`), `adattamento` (`fit`), `affiancate` (`pair`) |
| categorie (riquadro laterale) | `cats` |

Al posto di `published`: un progetto compare sul sito solo se è **pubblicato** e ha l'anteprima.

**Membro** (`membro`): titolo = nome, `ruolo`, `colore` (b/r), `ordine`, `foto`, `descrizione` (con grassetto e corsivo).

**Servizio** (`servizio`): titolo = nome, `boost`, `sigla` (ACC), `ordine`, `colore` (classe della scheda), `categoria_progetto` (sostituisce `SVC_CAT`), `nascosto` (sostituisce `HIDDEN_SERVICES`), `descrizione` (`p1`), `chiusa` (`p2`), `etichette`, `intro_cosa_facciamo`, `voce_1` ... `voce_8` (titolo, icona, testo).

**Posizione** (`posizione`): titolo = ruolo, `area`, `sede`, `descrizione`, `ordine`.

## Esempio di richiesta GraphQL

```graphql
{
  progetti(first: 100) {
    nodes {
      slug
      title
      campiProgetto {
        cliente
        tipo
        ordine
        anteprima { node { sourceUrl } }
      }
      categorieProgetto { nodes { name } }
    }
  }
}
```

I nomi dei campi si vedono nel **GraphiQL IDE** di WPGraphQL: sono quelli dei campi ACF in camelCase.

## Plugin di collegamento (mu-plugin)

`mu-plugins/promocommunication-headless.php` fa quattro cose:

1. **Anteprima:** il tasto "Anteprima" dell'editor apre il sito Next su `/api/preview` (la pagina va ancora scritta nel sito).
2. **Reindirizzamento:** chi apre il front di `wp.promocommunication.it` finisce sul sito pubblico. Restano raggiungibili `wp-admin`, `wp-login`, REST, GraphQL e i file caricati. Il dominio di WordPress è anche escluso da Google.
3. **GraphQL con password applicazione:** serve per leggere le bozze con l'utente `headless`.
4. **Aggiornamento del sito:** quando si pubblica o si modifica un contenuto, avvisa Vercel con un Deploy Hook. Più salvataggi ravvicinati diventano una sola richiesta, dopo 60 secondi.

### Installazione

1. Copia il file in `wp-content/mu-plugins/` (se la cartella non esiste, creala). Non va attivato.
2. In `wp-config.php`, sopra la riga `That's all, stop editing!`, aggiungi:

```php
define( 'PC_FRONTEND_URL', 'https://www.promocommunication.it' );
define( 'PC_PREVIEW_SECRET', 'la-stessa-stringa-di-PREVIEW_SECRET-su-Vercel' );
define( 'PC_DEPLOY_HOOK', 'https://api.vercel.com/v1/integrations/deploy/...' ); // facoltativo
```

3. Il Deploy Hook si crea su Vercel: **Settings → Git → Deploy Hooks**, scegli il ramo `main` e copia l'indirizzo.

Il file non l'ho potuto provare su un WordPress vero e non ho potuto controllarne la sintassi PHP (qui PHP non è installato). Se dopo il caricamento compare un errore, mandami il messaggio.
