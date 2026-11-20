import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Pagina non trovata" };

export default function NotFound() {
  return (
    <section className="hero">
      <div className="wrap">
        <h1 className="page-h1">Questa pagina non c’è.</h1>
        <Link className="pc-btn" href="/" style={{ marginTop: 32 }}>
          Torna alla home <span className="pc-btn__arrow">→</span>
        </Link>
      </div>
    </section>
  );
}
