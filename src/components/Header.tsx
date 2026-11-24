"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Controls, useMobile } from "./Controls";
import { Logo } from "./Logo";
import { Star } from "./Star";

const NAV = [
  ["chi-siamo", "Chi siamo"],
  ["servizi", "Servizi"],
  ["portfolio", "Portfolio"],
  ["team", "Team"],
  ["contatti", "Contatti"],
] as const;

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const mobile = useMobile();
  const [menuAt, setMenuAt] = useState<string | null>(null);
  const menu = menuAt === pathname; // il menu si chiude da solo quando cambia pagina
  const burger = useRef<HTMLButtonElement>(null);
  const mm = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuAt(null);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Menu aperto: blocca lo scroll della pagina, porta il focus sul pulsante Chiudi e lo restituisce all'hamburger alla chiusura
  const closeBtn = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("menu-open", menu);
    if (menu) closeBtn.current?.focus({ preventScroll: true });
    else if (wasOpen.current) burger.current?.focus({ preventScroll: true });
    wasOpen.current = menu;
    return () => root.classList.remove("menu-open");
  }, [menu]);

  function openMenu() {
    const r = burger.current!.getBoundingClientRect();
    mm.current?.style.setProperty("--mx", r.left + r.width / 2 + "px");
    mm.current?.style.setProperty("--my", r.top + r.height / 2 + "px");
    setMenuAt(pathname);
  }

  const current = (key: string) => (pathname === "/" + key || pathname.startsWith("/" + key + "/") ? "page" : undefined);

  return (
    <>
      <a className="skip" href="#main">
        Vai al contenuto
      </a>
      <header className={"hdr" + (scrolled ? " scrolled" : "")} id="hdr">
        <div className="wrap">
          <Link href="/" aria-label="PromoCommunication, torna alla home">
            <Logo />
          </Link>
          <nav className="nav" aria-label="Principale">
            {NAV.map(([key, label]) => (
              <Link key={key} className="nl" href={"/" + key} data-nav={key} aria-current={current(key)}>
                {label}
              </Link>
            ))}
            {!mobile && <Controls />}
            <button
              ref={burger}
              className="burger"
              type="button"
              aria-label="Apri il menu"
              aria-expanded={menu}
              aria-controls="mmenu"
              onClick={openMenu}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </nav>
        </div>
      </header>

      <div className={"mmenu on-brand" + (menu ? " open" : "")} id="mmenu" role="dialog" aria-modal="true" aria-label="Menu" ref={mm}>
        <div className="top">
          <Logo />
          <button ref={closeBtn} className="close" type="button" onClick={() => setMenuAt(null)}>
            Chiudi ✕
          </button>
        </div>
        <nav>
          <Link href="/" onClick={() => pathname === "/" && setMenuAt(null)}>Home</Link>
          {NAV.map(([key, label]) => (
            <Link key={key} href={"/" + key} onClick={() => pathname === "/" + key && setMenuAt(null)}>
              {label}
            </Link>
          ))}
        </nav>
        <div className="foot">
          <span>Tema</span>
          {mobile && <Controls />}
        </div>
        <Star className="pc-star--spin bigstar" />
      </div>
    </>
  );
}
