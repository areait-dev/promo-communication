"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { PRIVACY_URL } from "@/data/contact";
import type { Service } from "@/data/services";
import { ATTACH_MAX_MB, validateContact, type ContactField as Field } from "@/lib/contact-form";
import { postForm } from "@/lib/send";

type Status = "idle" | "sending" | "sent" | "error";

/** Il modulo di contatto del sito: lo stesso in home, in /contatti e nelle pagine servizio. */
export function ContactForm({
  defaultService,
  services: SERVICES,
  phone: PHONE,
}: {
  defaultService?: string;
  services: Service[];
  phone: { label: string; href: string };
}) {
  const form = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [who, setWho] = useState("");
  const [files, setFiles] = useState<string[]>([]);

  // Arrivando da "Scopri il servizio" (?servizio=id) il servizio è già spuntato.
  useEffect(() => {
    const id = defaultService ?? new URLSearchParams(window.location.search).get("servizio");
    const name = SERVICES.find((s) => s.id === id)?.name;
    if (!name) return;
    const box = form.current?.querySelector<HTMLInputElement>(`input[name="servizi"][value="${name}"]`);
    if (box) box.checked = true;
  }, [defaultService, SERVICES]);

  async function onSubmit(ev: FormEvent) {
    ev.preventDefault();
    const fd = new FormData(form.current!);
    const nome = String(fd.get("nome") ?? "");
    const errs = validateContact({
      nome,
      email: String(fd.get("email") ?? ""),
      telefono: String(fd.get("telefono") ?? ""),
      privacy: fd.get("privacy") === "on",
      allegati: fd.getAll("f").reduce((tot, f) => tot + (f instanceof File ? f.size : 0), 0),
    });
    setErrors(errs);
    const first = (Object.keys(errs) as Field[])[0];
    if (first) {
      document.getElementById("ct-" + first)?.focus();
      return;
    }
    setWho(nome.trim().split(/\s+/)[0].replace(/[<>&"]/g, ""));
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
    setFiles([]);
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
                <input type="checkbox" name="servizi" value={s.name} defaultChecked={s.id === defaultService} />
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
          <label className="ct-label" htmlFor="ct-f">
            Allegati <span className="ct-opt">(facoltativo)</span>
          </label>
          {/* il campo file copre tutto il riquadro: il trascinamento e' quello del browser */}
          <label className={"ct-file ct-file--drop" + (errors.f ? " is-invalid" : "")} htmlFor="ct-f">
            <input
              className="ct-file__input"
              id="ct-f"
              name="f"
              type="file"
              multiple
              onChange={(e) => {
                setFiles(Array.from(e.target.files ?? []).map((x) => x.name));
                setErrors((v) => ({ ...v, f: undefined })); // nuova scelta: l'errore di prima non vale piu'
              }}
              {...invalid("f")}
            />
            <span className="ct-file__name">
              Trascina qui i file o <u>sfoglia</u>, massimo {ATTACH_MAX_MB} MB in totale
            </span>
            {files.length > 0 && (
              <span className="ct-file__list">
                {files.map((n, k) => (
                  <span className="ct-file__item" key={k}>
                    {n}
                  </span>
                ))}
              </span>
            )}
          </label>
          {err("f")}
        </div>

        <div className="ct-field">
          <label className="ct-check">
            <input id="ct-p" type="checkbox" name="privacy" required {...invalid("p")} />
            <span>
              Acconsento al trattamento dei dati personali secondo l’
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
          <div className="ct-done" ref={(el) => el?.scrollIntoView({ block: "nearest" })}>
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
