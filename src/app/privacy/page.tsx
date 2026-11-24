import type { Metadata } from "next";
import Link from "next/link";
import { PageFx } from "@/components/PageFx";
import { ADDRESS, EMAIL, PHONE } from "@/data/contact";
import { vars } from "@/lib/ui";

export const metadata: Metadata = { title: "Privacy e Cookie Policy" };

/**
 * Privacy e Cookie Policy di PromoCommunication.
 * Adattata dall'informativa di Promotergroup S.p.a. (promotergroup.eu, ultimo aggiornamento 10/01/2022): PromoCommunication è la
 * divisione marketing di Promotergroup e non ha una P.IVA propria, quindi il Titolare resta Promotergroup S.p.a.
 * Sono state tolte le parti che riguardano funzioni che questo sito non ha (commenti, account, login, Gravatar) e descritto ciò che
 * il sito fa davvero: form di contatto e candidatura, localStorage per il tema, mappa di Google nella pagina Contatti.
 * TODO (da far verificare a chi segue la privacy di Promotergroup): tempi di conservazione, fornitori elencati, eventuali trasferimenti extra UE.
 */
const UPDATED = "24/11/2026";

export default function Privacy() {
  return (
    <>
      <section className="hero ct-hero ctl-host">
        <div className="wrap">
          <h1 className="pc-reveal page-h1" style={vars({ "--i": 1 })}>
            Privacy e Cookie Policy
          </h1>
          <p className="lead pc-reveal" style={vars({ "--i": 2 })}>
            Come trattiamo i tuoi dati quando visiti il sito o ci scrivi. In breve: solo quelli che ci servono per risponderti.
          </p>
        </div>
        <PageFx />
      </section>

      <section className="sec">
        <article className="wrap legal">
          <p className="legal__meta">Ultimo aggiornamento: {UPDATED}</p>

          <h2>Privacy policy</h2>

          <h3>Introduzione</h3>
          <p>
            PromoCommunication è la Unit di Comunicazione &amp; Marketing di Promotergroup S.p.a. e non vuole in alcun modo contribuire al
            dilagante fenomeno dello spamming su internet. I tuoi dati non verranno diffusi in rete né ceduti a terzi, fatti salvi gli
            obblighi di legge e le necessità tecniche legate all’erogazione del servizio.
          </p>

          <h3>Titolare del trattamento</h3>
          <p>
            Il Titolare del trattamento è Promotergroup S.p.a., nella persona del suo legale rappresentante. PromoCommunication è un
            brand di Promotergroup S.p.a. e non ha una partita IVA propria.
          </p>
          <p>
            Promotergroup S.p.a., {ADDRESS[0]}, 97019 {ADDRESS[1]}
            <br />
            Tel. <a href={PHONE.href}>{PHONE.label}</a>
            {EMAIL && (
              <>
                <br />
                Email: <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
              </>
            )}
          </p>
          <p>
            Il trattamento è realizzato con strumenti informatici dal Titolare e dagli incaricati da questo autorizzati, nel rispetto del
            Regolamento UE 679/2016 (GDPR), con la massima attenzione alla protezione dei dati da accessi fraudolenti.
          </p>

          <h3>Quali dati raccogliamo e perché</h3>
          <ul>
            <li>
              <strong>Moduli di contatto</strong> (home, pagina Contatti, pagine dei servizi): nome, cognome, email, telefono, servizi di
              interesse, messaggio ed eventuali file allegati. Li usiamo per rispondere alla tua richiesta.
            </li>
            <li>
              <strong>Candidature</strong> (pagina Lavora con noi): nome, email, telefono, area di interesse, link, messaggio e CV. Li usiamo
              per valutare la candidatura e, se serve, contattarti.
            </li>
            <li>
              <strong>Dati di navigazione</strong>: come ogni sito, i sistemi che lo fanno funzionare registrano dati tecnici (ad esempio
              l’indirizzo IP, il tipo di browser, data e ora della richiesta). Servono solo al funzionamento e alla sicurezza del sito.
            </li>
          </ul>
          <p>
            Il trattamento è finalizzato all’erogazione dei servizi richiesti e, solo se lo hai autorizzato espressamente, all’invio di
            informazioni promozionali. Ci basiamo sulla tua richiesta e sul tuo consenso, che ti chiediamo con la casella nei moduli.
          </p>

          <h3>Con chi condividiamo i dati</h3>
          <p>
            I dati non sono ceduti a terzi. Per far funzionare il sito e inoltrarci i messaggi ci serviamo di fornitori tecnici (hosting del
            sito e invio delle email dei moduli) che trattano i dati per nostro conto e solo per questo scopo.
          </p>

          <h3>Per quanto tempo conserviamo i dati</h3>
          <p>
            Conserviamo i dati dei moduli per il tempo necessario a rispondere alla tua richiesta e a gestire il rapporto che ne
            nasce; quelli delle candidature per il tempo necessario alla selezione. Puoi chiederne la cancellazione in qualsiasi
            momento (vedi “I tuoi diritti”). I dati che siamo obbligati a conservare per scopi amministrativi, legali o di sicurezza restano
            conservati per il tempo richiesto dalla legge.
          </p>

          <h2 id="cookie">Cookie policy</h2>

          <h3>Introduzione</h3>
          <p>
            I cookie sono piccoli file di testo che i siti inviano al browser, dove vengono memorizzati per essere poi ritrasmessi agli
            stessi siti alla visita successiva. Con “cookie” intendiamo qui anche le tecnologie simili, come l’archiviazione locale del
            browser (<em>localStorage</em>). Possono essere di <em>prima parte</em> (impostati dal sito che visiti) o di{" "}
            <em>terza parte</em> (impostati da un altro dominio, ad esempio per mostrare una mappa o un video).
          </p>

          <h3>Che cosa usa questo sito</h3>
          <p>
            Questo sito <strong>non usa cookie di profilazione né strumenti di analisi statistica</strong>. Usa soltanto:
          </p>
          <ul>
            <li>
              <strong>Preferenza del tema</strong> (tecnico, di prima parte): quando scegli il tema chiaro o scuro, il browser ricorda la
              scelta con la voce <code>pc-theme</code> nell’archiviazione locale. Resta finché non la cancelli dal browser. Non contiene dati
              personali e non richiede consenso.
            </li>
            <li>
              <strong>Mappa di Google</strong> (di terza parte), solo nella pagina <Link href="/contatti">Contatti</Link>: la mappa è
              incorporata da Google Maps e, caricandola, Google può impostare propri cookie e raccogliere dati sulla tua visita secondo la
              propria informativa. Il sito non ha un controllo diretto su questi cookie: ti invitiamo a leggere la{" "}
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
                privacy policy di Google
              </a>
              .
            </li>
          </ul>
          <p>
            I cookie tecnici non richiedono il consenso: per questo, al momento, il sito non mostra un banner. Se in futuro aggiungeremo
            strumenti di analisi o di marketing, aggiorneremo questa pagina e chiederemo il consenso prima di attivarli.
          </p>

          <h3>Come gestire o disabilitare i cookie</h3>
          <p>
            Puoi gestire le preferenze sui cookie dal tuo browser, anche per impedire che terze parti ne installino, ed eliminare quelli già
            presenti. Disabilitandoli tutti, alcune funzioni del sito potrebbero non funzionare come previsto. Le istruzioni dei principali
            browser:
          </p>
          <ul>
            <li>
              <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">
                Google Chrome
              </a>
            </li>
            <li>
              <a href="https://support.mozilla.org/it/kb/Attivare%20e%20disattivare%20i%20cookie" target="_blank" rel="noopener noreferrer">
                Mozilla Firefox
              </a>
            </li>
            <li>
              <a href="https://support.apple.com/it-it/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer">
                Apple Safari
              </a>
            </li>
            <li>
              <a href="https://support.microsoft.com/it-it/microsoft-edge" target="_blank" rel="noopener noreferrer">
                Microsoft Edge
              </a>
            </li>
          </ul>

          <h2>I tuoi diritti</h2>
          <p>
            Per i dati che trattiamo, puoi in ogni momento: revocare il consenso; opporti al trattamento; accedere ai tuoi dati; chiederne la
            rettifica; ottenere la limitazione del trattamento; ottenere la cancellazione; ricevere i tuoi dati o farli trasferire a un altro
            titolare; proporre reclamo al Garante per la protezione dei dati personali o agire in sede giudiziaria.
          </p>
          <p>
            Per esercitare questi diritti scrivi
            {EMAIL ? (
              <>
                {" "}
                a <a href={`mailto:${EMAIL}`}>{EMAIL}</a> oppure
              </>
            ) : null}{" "}
            alla sede del Titolare indicata sopra. Con la stessa richiesta puoi anche chiedere la verifica o la cancellazione dei tuoi dati
            dai nostri elenchi e l’elenco degli incaricati del trattamento. Le richieste sono gratuite e le evadiamo nel più breve tempo
            possibile, in ogni caso entro 30 giorni.
          </p>
        </article>
      </section>
    </>
  );
}
