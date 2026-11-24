"use client";

import { useRef, useState, type FormEvent } from "react";
import { AREAS, CV_EXT, CV_MAX_MB } from "@/data/careers";
import { PHONE, PRIVACY_URL } from "@/data/contact";
import { postForm } from "@/lib/send";

/** Dati della candidatura, come li riceverà l'invio reale. */
export type CareersRequest = {
  nome: string;
  email: string;
  telefono: string;
  area: string;
  link: string;
  messaggio: string;
  cv: File | null;
  privacy: boolean;
};

type Field = "n" | "e" | "t" | "cv" | "p";
type Status = "idle" | "sending" | "sent" | "error";

function validate(req: CareersRequest): Partial<Record<Field, string>> {
  const errs: Partial<Record<Field, string>> = {};
  if (!req.nome.trim()) errs.n = "Ci dici come ti chiami?";
  if (!req.email.trim()) errs.e = "Serve un indirizzo email per risponderti.";
  else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(req.email.trim())) errs.e = "Controlla l’indirizzo email: manca qualcosa.";
  if (req.telefono.trim() && req.telefono.replace(/\D/g, "").length < 6) errs.t = "Controlla il numero di telefono.";
  if (!req.cv || req.cv.size === 0) errs.cv = `Allega il tuo CV (${CV_EXT.join(", ").replaceAll(".", "").toUpperCase()}, massimo ${CV_MAX_MB} MB).`;
  else if (!CV_EXT.some((x) => req.cv!.name.toLowerCase().endsWith(x))) errs.cv = "Il CV deve essere un PDF o un documento Word.";
  else if (req.cv.size > CV_MAX_MB * 1024 * 1024) errs.cv = `Il file supera i ${CV_MAX_MB} MB.`;
  if (!req.privacy) errs.p = "Serve il consenso al trattamento dei dati per valutare la candidatura.";
  return errs;
}

export function CareersForm() {
  const form = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [who, setWho] = useState("");
  const [fileName, setFileName] = useState("");

  async function onSubmit(ev: FormEvent) {
    ev.preventDefault();
    const fd = new FormData(form.current!);
    const file = fd.get("cv");
    const req: CareersRequest = {
      nome: String(fd.get("nome") ?? ""),
      email: String(fd.get("email") ?? ""),
      telefono: String(fd.get("telefono") ?? ""),
      area: String(fd.get("area") ?? ""),
      link: String(fd.get("link") ?? ""),
      messaggio: String(fd.get("messaggio") ?? ""),
      cv: file instanceof File ? file : null,
      privacy: fd.get("privacy") === "on",
    };
    const errs = validate(req);
    setErrors(errs);
    const first = (Object.keys(errs) as Field[])[0];
    if (first) {
      document.getElementById("cr-" + first)?.focus();
      return;
    }
    setWho(req.nome.trim().split(/\s+/)[0].replace(/[<>&"]/g, ""));
    setStatus("sending");
    try {
      await postForm("candidatura", fd);
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  function reset() {
    form.current?.reset();
    setErrors({});
    setFileName("");
    setStatus("idle");
  }

  const invalid = (f: Field) => (errors[f] ? { "aria-invalid": true, "aria-describedby": `cr-${f}-err` } : {});
  const err = (f: Field) =>
    errors[f] ? (
      <p className="ct-err" id={`cr-${f}-err`}>
        {errors[f]}
      </p>
    ) : null;

  return (
    <div className="ct-form pc-reveal" id="candidati">
      <form ref={form} noValidate onSubmit={onSubmit} hidden={status === "sent"} aria-busy={status === "sending"}>
        <input className="sr-only" name="sito" tabIndex={-1} autoComplete="off" aria-hidden="true" />
        <div className="ct-field">
          <label className="ct-label" htmlFor="cr-n">
            Nome e cognome
          </label>
          <input className="ct-input" id="cr-n" name="nome" autoComplete="name" required {...invalid("n")} />
          {err("n")}
        </div>

        <div className="ct-row">
          <div className="ct-field">
            <label className="ct-label" htmlFor="cr-e">
              Email
            </label>
            <input className="ct-input" id="cr-e" name="email" type="email" inputMode="email" autoCapitalize="none" spellCheck={false} autoComplete="email" required {...invalid("e")} />
            {err("e")}
          </div>
          <div className="ct-field">
            <label className="ct-label" htmlFor="cr-t">
              Telefono
            </label>
            <input className="ct-input" id="cr-t" name="telefono" type="tel" inputMode="tel" autoComplete="tel" {...invalid("t")} />
            {err("t")}
          </div>
        </div>

        <div className="ct-field">
          <label className="ct-label" htmlFor="cr-a">
            Area di interesse
          </label>
          <select className="ct-input ct-select" id="cr-a" name="area" defaultValue={AREAS[AREAS.length - 1]}>
            {AREAS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>

        <div className="ct-field">
          <label className="ct-label" htmlFor="cr-l">
            LinkedIn o portfolio <span className="ct-opt">(facoltativo)</span>
          </label>
          <input className="ct-input" id="cr-l" name="link" type="url" inputMode="url" autoComplete="url" placeholder="https://" />
        </div>

        <div className="ct-field">
          <label className="ct-label" htmlFor="cr-cv">
            Il tuo CV
          </label>
          <label className={"ct-file" + (errors.cv ? " is-invalid" : "")} htmlFor="cr-cv">
            <input
              className="ct-file__input"
              id="cr-cv"
              name="cv"
              type="file"
              accept={CV_EXT.join(",") + ",application/pdf"}
              required
              onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
              {...invalid("cv")}
            />
            <span className="ct-file__btn">Scegli il file</span>
            <span className="ct-file__name">{fileName || `PDF o Word, massimo ${CV_MAX_MB} MB`}</span>
          </label>
          {err("cv")}
        </div>

        <div className="ct-field">
          <label className="ct-label" htmlFor="cr-m">
            Raccontaci chi sei
          </label>
          <textarea className="ct-input ct-textarea" id="cr-m" name="messaggio" rows={5}></textarea>
        </div>

        <div className="ct-field">
          <label className="ct-check">
            <input id="cr-p" type="checkbox" name="privacy" required {...invalid("p")} />
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
            Non siamo riusciti a inviare la candidatura. Riprova tra poco, oppure chiamaci al{" "}
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
              Invia la candidatura <span className="pc-btn__arrow">→</span>
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
            <h2>Candidatura ricevuta, forte e chiaro.</h2>
            <p>Grazie{who ? ` ${who}` : ""}.</p>
            <button className="pc-btn pc-btn--ghost" type="button" onClick={reset}>
              Invia un’altra candidatura
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
