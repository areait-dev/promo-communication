"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { vars } from "@/lib/ui";

/**
 * WCAG 2.2.2: la sequenza finisce entro 4,5 s dall'avvio, qualunque sia il numero di parole.
 * L'ultima parola compare al massimo a 3,7 s e la sua evidenziatura (0,8 s) finisce a 4,5 s:
 * il passo tra le parole è 0,9 s o meno (con più di 5 parole si accorcia).
 * Riparte (sempre una sola volta, sempre entro 5 s) solo se il titolo esce dallo schermo e poi rientra.
 */
const MAX_STEP = 900;
const LAST_WORD_AT = 3700;

/**
 * Titolo "Boost your <parola>": all'ingresso nello schermo le parole scorrono UNA volta e si fermano sull'ultima.
 * `hrefs` (stessa lunghezza di `words`) rende la parola cliccabile: solo quella attiva riceve clic e focus.
 * Mentre il mouse o il focus sono sulla parola la sequenza aspetta, cosi' il clic va dove si vede.
 * Con prefers-reduced-motion la sequenza parte lo stesso (finita, <= 4,5 s, mai in loop) ma senza scorrimento né animazione:
 * le parole si danno il cambio sul posto, con l'evidenziatore fermo (vedi site.css). Ferma subito era la scelta di prima: su un telefono
 * con "Riduci movimento" il titolo restava bloccato su una parola sola.
 */
export function Boost({
  words,
  hrefs,
  tag = "h1",
  size,
}: {
  words: string[];
  hrefs?: string[];
  tag?: "h1" | "h2";
  size?: string;
}) {
  const [on, setOn] = useState(0);
  const [off, setOff] = useState(-1);
  const root = useRef<HTMLHeadingElement>(null);
  const cur = useRef(0);
  const held = useRef(false); // mouse o tastiera sulla parola
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const last = words.length - 1;
  const STEP = Math.min(MAX_STEP, Math.floor(LAST_WORD_AT / Math.max(1, last)));

  useEffect(() => {
    const clear = () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
    const show = (i: number, animate: boolean) => {
      const prev = cur.current;
      cur.current = i;
      setOn(i);
      setOff(animate && prev !== i ? prev : -1);
      if (animate && prev !== i) timers.current.push(setTimeout(() => setOff((o) => (o === prev ? -1 : o)), 350));
    };
    // una sola passata: parola 0 -> ultima, poi niente piu' timer
    const run = () => {
      clear();
      show(0, false);
      const next = () => {
        if (held.current) {
          timers.current.push(setTimeout(next, STEP)); // l'utente ha il puntatore/focus sopra: aspetta
          return;
        }
        show(cur.current + 1, true);
        if (cur.current < last) timers.current.push(setTimeout(next, STEP));
      };
      timers.current.push(setTimeout(next, STEP));
    };

    let io: IntersectionObserver | undefined;
    if (words.length > 1 && root.current) {
      io = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) run();
          else {
            clear();
            show(0, false); // pronto per la prossima entrata
          }
        },
        { threshold: 0.5 },
      );
      io.observe(root.current);
    }
    return () => {
      io?.disconnect();
      clear();
    };
  }, [words.length, last, STEP]);

  const Tag = tag;
  const style: CSSProperties | undefined = size ? vars({ "--boost-size": size }) : undefined;
  const phrase = "Boost your " + words.map((w) => w.toLowerCase()).join(", ");
  return (
    <Tag className="pc-boost" style={style} ref={root} aria-label={phrase}>
      {/* il testo del titolo nell'HTML e' una frase sola ("Boost your Brand, Reputation, …"): spazio e virgole
          stanno in span invisibili e fuori dal flusso, quindi l'aspetto non cambia */}
      <span className="pc-boost__fixed" aria-hidden="true">
        Boost your<span className="sr-only"> </span>
      </span>
      <span
        className="pc-boost__slot"
        // senza link la parte che cambia e' interamente nascosta agli screen reader (c'e' la frase completa sopra);
        // con i link restano esposte solo le parole raggiungibili da tastiera, per non avere elementi focalizzabili dentro aria-hidden
        aria-hidden={hrefs ? undefined : true}
        onMouseEnter={() => (held.current = true)}
        onMouseLeave={() => (held.current = false)}
        onFocus={() => (held.current = true)}
        onBlur={() => (held.current = false)}
      >
        {words.map((w, i) => (
          <span
            key={w}
            className={"pc-boost__word" + (i === on ? " is-on" : "") + (i === off ? " is-off" : "")}
            aria-hidden={hrefs && i === on ? undefined : true}
          >
            {hrefs?.[i] ? (
              <Link className="pc-boost__link" href={hrefs[i]} tabIndex={i === on ? 0 : -1}>
                {w}
              </Link>
            ) : (
              w
            )}
            {i < last && <span className="sr-only">, </span>}
          </span>
        ))}
      </span>
    </Tag>
  );
}
