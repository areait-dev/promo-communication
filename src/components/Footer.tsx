import Link from "next/link";
import { SocialLinks } from "./SocialLinks";
import { ADDRESS, PHONE } from "@/data/contact";
import { SERVICES } from "@/data/services";

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
              <Link href="/servizi">{s.name}</Link>
            </span>
          ))}
        </div>
        <div>
          <h4>Contatti</h4>
          <a href={PHONE.href}>{PHONE.label}</a>
          <br />
          {ADDRESS[0]}
          <br />
          {ADDRESS[1]}
          <br />
          <Link href="/contatti">Scrivici</Link>
        </div>
        <div>
          <h4>Social</h4>
          <SocialLinks />
        </div>
      </div>
      <div className="pc-footer__legal">
        <span>Privacy · Cookie</span>
      </div>
    </footer>
  );
}
