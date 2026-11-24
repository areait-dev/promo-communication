"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { PHONE, PRIVACY_URL } from "@/data/contact";
import { SERVICES } from "@/data/services";
import { postForm } from "@/lib/send";

/** Dati della richiesta, come li riceverà l'invio reale. */
export type ContactRequest = {
  nome: string;
  email: string;
  telefono: string;
  servizi: string[];
  messaggio: string;
  privacy: boolean;
};

type Field = "n" | "e" | "t" | "p";
type Status = "idle" | "sending" | "sent" | "error";

function validate(req: ContactRequest): Partial<Record<Field, string>> {
  const errs: Partial<Record<Field, string>> = {};
  if (!req.nome.trim()) errs.n = "Ci dici come ti chiami?";
  if (!req.email.trim()) errs.e = "Serve un indirizzo email per risponderti.";
  else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(req.email.trim())) errs.e = "Controlla l’indirizzo email: manca qualcosa.";
  if (req.telefono.trim() && req.telefono.replace(/\D/g, "").length < 6) errs.t = "Controlla il numero di telefono.";
  if (!req.privacy) errs.p = "Serve il consenso al trattamento dei dati per risponderti.";
  return errs;
}

export function ContactPageForm({ defaultService }: { defaultService?: string } = {}) {
  const form = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [who, setWho] = useState("");

  // Arrivando da "Scopri il servizio" (?servizio=id) il servizio è già spuntato.
  useEffect(() => {
    const id = defaultService ?? new URLSearchParams(window.location.search).get("servizio");
    const name = SERVICES.find((s) => s.id === id)?.name;
    if (!name) return;
    const box = form.current?.querySelector<HTMLInputElement>(`input[name="servizi"][value="${name}"]`);
    if (box) box.checked = true;
  }, [defaultService]);

  async function onSubmit(ev: FormEvent) {
    ev.preventDefault();
    const fd = new FormData(form.current!);
    const req: ContactRequest = {
      nome: String(fd.get("nome") ?? ""),
      email: String(fd.get("email") ?? ""),
      telefono: String(fd.get("telefono") ?? ""),
      servizi: fd.getAll("servizi").map(String),
      messaggio: String(fd.get("messaggio") ?? ""),
      privacy: fd.get("privacy") === "on",
    };
    const errs = validate(req);
    setErrors(errs);
    const first = (Object.keys(errs) as Field[])[0];
    if (first) {
      document.getElementById("ct-" + first)?.focus();
      return;
    }
    setWho(req.nome.trim().split(/\s+/)[0].replace(/[<>&"]/g, ""));
    setStatus("sending");
    try {
      await postForm("contatti", fd);
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  function reset() {
    form.current?.reset();
    setErrors({});
    setStatus("idle");
  }

  const invalid = (f: Field) => (errors[f] ? { "aria-invalid": true, "aria-describedby": `ct-${f}-err` } : {});
  const err = (f: Field) =>
    errors[f] ? (
      <p className="ct-err" id={`ct-${f}-err`}>
        {errors[f]}
      </p>
    ) : null;

  return (
    <div className="ct-form pc-reveal">
      <form ref={form} noValidate onSubmit={onSubmit} hidden={status === "sent"} aria-busy={status === "sending"}>
        <input className="sr-only" name="sito" tabIndex={-1} autoComplete="off" aria-hidden="true" />
        <fieldset className="ct-chips">
          <legend className="ct-label">Di cosa hai bisogno?</legend>
          <p className="ct-hint" id="ct-chips-hint">
            Puoi sceglierne più di uno.
          </p>
          <div className="ct-chips__list" aria-describedby="ct-chips-hint">
            {SERVICES.map((s) => (
              <label className="ct-chip" key={s.id}>
                <input type="checkbox" name="servizi" value={s.name} />
                <span>{s.name}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="ct-field">
          <label className="ct-label" htmlFor="ct-n">
            Nome e cognome
          </label>
          <input className="ct-input" id="ct-n" name="nome" autoComplete="name" required {...invalid("n")} />
          {err("n")}
        </div>

        <div className="ct-row">
          <div className="ct-field">
            <label className="ct-label" htmlFor="ct-e">
              Email
            </label>
            <input className="ct-input" id="ct-e" name="email" type="email" inputMode="email" autoCapitalize="none" spellCheck={false} autoComplete="email" required {...invalid("e")} />
            {err("e")}
          </div>
          <div className="ct-field">
            <label className="ct-label" htmlFor="ct-t">
              Telefono
            </label>
            <input className="ct-input" id="ct-t" name="telefono" type="tel" inputMode="tel" autoComplete="tel" {...invalid("t")} />
            {err("t")}
          </div>
        </div>

        <div className="ct-field">
          <label className="ct-label" htmlFor="ct-m">
            Raccontaci il tuo progetto
          </label>
          <textarea className="ct-input ct-textarea" id="ct-m" name="messaggio" rows={5}></textarea>
        </div>

        <div className="ct-field">
          <label className="ct-check">
            <input id="ct-p" type="checkbox" name="privacy" required {...invalid("p")} />
            <span>
              Acconsento al trattamento dei dati personali secondo l’{" "}
              <a href={PRIVACY_URL} target="_blank" rel="noopener noreferrer">
                informativa privacy
              </a>
              .
            </span>
          </label>
          {err("p")}
        </div>

        {status === "error" && (
          <p className="ct-alert" role="alert">
            Non siamo riusciti a inviare la richiesta. Riprova tra poco, oppure chiamaci al{" "}
            <a href={PHONE.href}>{PHONE.label}</a>.
          </p>
        )}

        <button className="pc-btn pc-btn--accent ct-submit" type="submit" disabled={status === "sending"}>
          {status === "sending" ? (
            <>
              <span className="ct-spin" aria-hidden="true"></span> Invio in corso…
            </>
          ) : (
            <>
              Invia la richiesta <span className="pc-btn__arrow">→</span>
            </>
          )}
        </button>
      </form>

      <div className="ct-status" aria-live="polite">
        {status === "sending" && <span className="sr-only">Invio in corso</span>}
        {status === "sent" && (
          <div className="ct-done">
            <span className="ct-done__ic" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M5 12.5l4.5 4.5L19 7.5" />
              </svg>
            </span>
            <h2>Messaggio ricevuto, forte e chiaro.</h2>
            <p>Grazie{who ? ` ${who}` : ""}.</p>
            <button className="pc-btn pc-btn--ghost" type="button" onClick={reset}>
              Scrivi un altro messaggio
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
