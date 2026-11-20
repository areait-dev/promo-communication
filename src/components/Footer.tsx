import Link from "next/link";
import { SERVICES } from "@/data/services";
import { svcHref } from "@/lib/ui";

export function Footer() {
  return (
    <footer className="pc-footer">
      <p className="pc-footer__big">
        Boost your
        <br />
        <em>brand.</em>
      </p>
      <div className="pc-footer__cols">
        <div>
          <h4 className="ft-brand">PromoCommunication</h4>
          PromoCommunication è un brand di Promotergroup S.p.a.
          <br />
          <a href="#" data-soon>Dati aziendali</a>
          <br />
          <a href="#" data-soon>Company Profile</a>
        </div>
        <div>
          <h4>Servizi</h4>
          {SERVICES.map((s, i) => (
            <span key={s.id}>
              {i > 0 && <br />}
              <Link href={svcHref(s.id)}>{s.name}</Link>
            </span>
          ))}
        </div>
        <div>
          <h4>Contatti</h4>
          <a href="tel:+390932862613">+39 0932 862613</a>
          <br />
          Via del Carrubo sn
          <br />
          Vittoria (RG)
          <br />
          <Link href="/contatti">Scrivici</Link>
        </div>
        <div>
          <h4>Social</h4>
          <a href="#" data-soon>Facebook</a>
          <br />
          <a href="#" data-soon>Instagram</a>
          <br />
          <a href="#" data-soon>LinkedIn</a>
          <br />
          <a href="#" data-soon>YouTube</a>
        </div>
      </div>
      <div className="pc-footer__legal">
        <span>PromoCommunication · Promotergroup S.p.a.</span>
        <span>Privacy · Cookie</span>
      </div>
    </footer>
  );
}
