"use client";

import { useRef, useState, type FormEvent } from "react";
import { PRIVACY_URL } from "@/data/contact";
import { postForm } from "@/lib/send";

type Kind = "home" | "contact";

export function ContactForm({ kind }: { kind: Kind }) {
  const form = useRef<HTMLFormElement>(null);
  const [err, setErr] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [who, setWho] = useState("");
  const [files, setFiles] = useState<string[]>([]);
  const home = kind === "home";
  const p = home ? "h" : "f";

  async function onSubmit(ev: FormEvent) {
    ev.preventDefault();
    const f = form.current!;
    const el = (name: string) => f.elements.namedItem(name) as HTMLInputElement | null;
    const n = el("n")!.value.trim();
    if (!n) {
      setErr("Ci dici come ti chiami?");
      el("n")!.focus();
      return;
    }
    const e = el("e");
    if (e && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e.value.trim())) {
      setErr("Controlla l’indirizzo email: manca qualcosa.");
      e.focus();
      return;
    }
    const c = el("p");
    if (c && !c.checked) {
      setErr("Serve il consenso al trattamento dei dati per risponderti.");
      c.focus();
      return;
    }
    setErr("");
    setWho(n);
    setState("sending");
    try {
      await postForm(home ? "home" : "contatti", new FormData(f));
      setState("sent");
    } catch (e) {
      setState("idle");
      setErr(e instanceof Error ? e.message : "Invio non riuscito. Riprova tra poco.");
    }
  }
  function reset() {
    form.current?.reset();
    setFiles([]);
    setState("idle");
  }

  return (
    <>
      <form
        ref={form}
        className="pc-bubble pc-bubble--light pc-bubble--lg pc-reveal cform"
        noValidate
        onSubmit={onSubmit}
        style={state === "idle" ? undefined : { display: "none" }}
      >
        <input className="sr-only" name="sito" tabIndex={-1} autoComplete="off" aria-hidden="true" />
        {home ? (
          <>
            <div className="row2">
              <div className="field">
                <label htmlFor="h-n">Nome</label>
                <input id="h-n" name="n" autoComplete="given-name" required />
              </div>
              <div className="field">
                <label htmlFor="h-c">Cognome</label>
                <input id="h-c" name="c" autoComplete="family-name" />
              </div>
            </div>
            <div className="row2">
              <div className="field">
                <label htmlFor="h-e">Email</label>
                <input id="h-e" name="e" type="email" inputMode="email" autoCapitalize="none" spellCheck={false} autoComplete="email" required />
              </div>
              <div className="field">
                <label htmlFor="h-t">Telefono</label>
                <input id="h-t" name="t" type="tel" inputMode="tel" autoComplete="tel" />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="field">
              <label htmlFor="f-n">Nome e cognome</label>
              <input id="f-n" name="n" autoComplete="name" required />
            </div>
            <div className="row2">
              <div className="field">
                <label htmlFor="f-e">Email</label>
                <input id="f-e" name="e" type="email" inputMode="email" autoCapitalize="none" spellCheck={false} autoComplete="email" required />
              </div>
              <div className="field">
                <label htmlFor="f-t">Telefono</label>
                <input id="f-t" name="t" type="tel" inputMode="tel" autoComplete="tel" />
              </div>
            </div>
          </>
        )}
        <div className="field">
          <label htmlFor={p + "-m"}>{home ? "Messaggio" : "Raccontaci il tuo progetto"}</label>
          <textarea id={p + "-m"} name="m" placeholder={home ? "Raccontaci la tua idea" : undefined}></textarea>
        </div>
        {home ? (
          <div className="field">
            <span className="legend">Allegati</span>
            <label className="drop" htmlFor="h-f">
              <input
                id="h-f"
                name="f"
                type="file"
                multiple
                onChange={(e) => setFiles(Array.from(e.target.files ?? []).map((x) => x.name.replace(/[<>&"]/g, "")))}
              />
              <span className="drop-t">
                Trascina qui i file o <u>sfoglia</u>
              </span>
              <span className="files">
                {files.map((n) => (
                  <span className="file" key={n}>
                    {n}
                  </span>
                ))}
              </span>
            </label>
          </div>
        ) : (
          <label className="check">
            <input type="checkbox" name="p" required />
            <span>
              Acconsento al trattamento dei dati personali secondo l’
              <a href={PRIVACY_URL} target="_blank" rel="noopener noreferrer">
                informativa privacy
              </a>
              .
            </span>
          </label>
        )}
        <p className="err" role="alert">
          {err}
        </p>
        <button className="pc-btn pc-btn--accent" type="submit">
          Boost <span className="pc-btn__arrow">→</span>
        </button>
      </form>
      <div className={"sent" + (state === "idle" ? "" : " show")} aria-live="polite">
        {state === "sending" && (
          <div className="pc-typing" role="status" aria-label="Invio in corso">
            <span></span>
            <span></span>
            <span></span>
          </div>
        )}
        {state === "sent" && (
          <>
            <div className="pc-bubble pc-bubble--lg pc-bubble--pop">Messaggio ricevuto, forte e chiaro.</div>
            <p className="p" style={{ marginTop: 8 }}>
              Grazie {who.replace(/[<>&"]/g, "")}.
            </p>
            <button className="pc-btn pc-btn--ghost" type="button" onClick={reset}>
              Scrivi un altro messaggio
            </button>
          </>
        )}
      </div>
    </>
  );
}
