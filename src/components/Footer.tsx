import Link from "next/link";
import { SocialLinks } from "./SocialLinks";
import { CookieSettingsButton } from "./CookieBanner";
import { ADDRESS, PHONE, PRIVACY_URL } from "@/data/contact";
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
          Promotergroup S.p.A. · P.IVA 13178771005
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
        <Link href={PRIVACY_URL}>Privacy e Cookie Policy</Link>
        <CookieSettingsButton className="ft-link" />
      </div>
    </footer>
  );
}
