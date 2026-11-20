"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { motionOff, prefersReduced, vars } from "@/lib/ui";

const WORD = 2000; // permanenza di ogni parola

export function Boost({ words, tag = "h1", size }: { words: string[]; tag?: "h1" | "h2"; size?: string }) {
  const [on, setOn] = useState(0);
  const [off, setOff] = useState(-1);
  const cur = useRef(0);

  useEffect(() => {
    if (prefersReduced() || words.length < 2) return;
    const id = setInterval(() => {
      if (motionOff()) return;
      const prev = cur.current;
      cur.current = (prev + 1) % words.length;
      setOn(cur.current);
      setOff(prev);
      setTimeout(() => setOff((o) => (o === prev ? -1 : o)), 350);
    }, WORD);
    return () => clearInterval(id);
  }, [words.length]);

  const Tag = tag;
  const style: CSSProperties | undefined = size ? vars({ "--boost-size": size }) : undefined;
  return (
    <Tag className="pc-boost" style={style}>
      <span className="pc-boost__fixed">Boost your</span>
      <span className="pc-boost__slot" aria-live="polite">
        {words.map((w, i) => (
          <span key={w} className={"pc-boost__word" + (i === on ? " is-on" : "") + (i === off ? " is-off" : "")}>
            {w}
          </span>
        ))}
      </span>
    </Tag>
  );
}
