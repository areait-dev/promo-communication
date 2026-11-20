/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { Star } from "./Star";
import { SERVICES } from "@/data/services";
import type { Member } from "@/data/team";
import { vars } from "@/lib/ui";

export function Head({ title, tag: Tag = "h2" }: { title: string; tag?: "h1" | "h2" }) {
  return (
    <header className="pc-section-head pc-reveal">
      <div>
        <Tag>{title}</Tag>
      </div>
    </header>
  );
}

export function Marquee() {
  const items = SERVICES.map((s) => (
    <span className="pc-marquee__item" key={s.id}>
      {s.name}
      <Star />
    </span>
  ));
  return (
    <div className="pc-marquee" aria-label={"Servizi: " + SERVICES.map((s) => s.name).join(", ")}>
      <div className="pc-marquee__track" aria-hidden="true">
        {items}
        {SERVICES.map((s) => (
          <span className="pc-marquee__item" key={"b" + s.id}>
            {s.name}
            <Star />
          </span>
        ))}
      </div>
    </div>
  );
}

export function Cta() {
  return (
    <section className="pc-cta">
      <Star className="pc-star--big pc-star--spin" />
      <div className="wrap" style={{ paddingLeft: 0, paddingRight: 0 }}>
        <h2 className="pc-reveal">Raccontaci la tua idea, noi mettiamo il boost!</h2>
        <Link className="pc-btn pc-btn--on-brand pc-reveal" style={vars({ "--i": 1 })} href="/contatti">
          Raccontaci la tua idea <span className="pc-btn__arrow">→</span>
        </Link>
      </div>
    </section>
  );
}

export function JoinCard() {
  return (
    <article className="pc-team tm tm-join pc-reveal" style={vars({ "--i": 2 })}>
      <Link className="pc-team__frame" href="/contatti">
        <div className="pc-team__photo">
          <div className="pc-team__ph tm-join__in">
            <span>Il prossimo fumetto potresti essere tu</span>
            <small>Posizioni aperte →</small>
          </div>
        </div>
      </Link>
      <h3 className="pc-team__name">Lavora con noi</h3>
      <p className="pc-team__role">Candidature spontanee</p>
    </article>
  );
}

export function TeamCard({ t, i }: { t: Member; i: number }) {
  return (
    <article className="pc-team tm pc-reveal" style={vars({ "--i": i % 4 })}>
      <div className="pc-team__frame">
        <svg className="tm-outline" viewBox="0 0 1 1" preserveAspectRatio="none" aria-hidden="true">
          <path d="M1 0.16304L1 0.67452C1 0.76455 0.93187 0.83756 0.84785 0.83756L0.15154 0.83756L0 1L0 0L0.84785 0C0.93187 0 1 0.07299 1 0.16304Z" />
        </svg>
        <div className="pc-team__photo">
          <div className={`pc-team__ph ph ph-${t.c}`}>
            {t.img ? <img className="tm-cut" src={t.img} alt={t.n} /> : null}
          </div>
        </div>
      </div>
      <h3 className="pc-team__name">{t.n}</h3>
      <p className="pc-team__role">{t.r || "\u00a0"}</p>
    </article>
  );
}

export function Pager({
  label,
  prev,
  next,
  prevHref,
  nextHref,
  prevLabel,
  nextLabel,
}: {
  label: string;
  prev: string;
  next: string;
  prevHref: string;
  nextHref: string;
  prevLabel: string;
  nextLabel: string;
}) {
  return (
    <nav className="pager" aria-label={label}>
      <Link href={prevHref}>
        <small>{prevLabel}</small>
        <b>{prev}</b>
      </Link>
      <Link href={nextHref}>
        <small>{nextLabel}</small>
        <b>{next}</b>
      </Link>
    </nav>
  );
}
