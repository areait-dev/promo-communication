import type { ReactNode } from "react";
import { SocialLinks } from "./SocialLinks";
import { ADDRESS, EMAIL, HOURS, MAPS_EMBED, MAPS_LINK, PHONE } from "@/data/contact";

/** Icone a tratto (viewBox 24), le stesse forme semplici usate nel resto del sito. */
const IC = {
  mail: (
    <>
      <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
      <path d="m22 6-10 7L2 6" />
    </>
  ),
  phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />,
  pin: (
    <>
      <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" />
      <path d="M12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9.5" />
      <path d="M12 6.5V12l3.5 2" />
    </>
  ),
  share: <path d="M3.5 12a2.5 2.5 0 1 0 5 0 2.5 2.5 0 1 0-5 0M15.5 6a2.5 2.5 0 1 0 5 0 2.5 2.5 0 1 0-5 0M15.5 18a2.5 2.5 0 1 0 5 0 2.5 2.5 0 1 0-5 0M8.2 10.8l7.6-3.6M8.2 13.2l7.6 3.6" />,
};

function Item({ icon, label, children }: { icon: keyof typeof IC; label: string; children: ReactNode }) {
  return (
    <li className="ct-item">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        {IC[icon]}
      </svg>
      <div>
        <span className="ct-k">{label}</span>
        {children}
      </div>
    </li>
  );
}

const TODO = <span className="ct-v ct-v--todo">Da inserire</span>;

/** Pannello blu notte con i recapiti e la mappa. Email, telefono e orari si modificano in src/data/contact.ts. */
export function ContactPanel() {
  return (
    <aside className="ct-panel pc-reveal" aria-label="Recapiti">
      <ul className="ct-list">
        <Item icon="mail" label="Email">
          {EMAIL ? (
            <a className="ct-v" href={`mailto:${EMAIL}`}>
              {EMAIL}
            </a>
          ) : (
            TODO
          )}
        </Item>
        <Item icon="phone" label="Telefono">
          <a className="ct-v" href={PHONE.href}>
            {PHONE.label}
          </a>
        </Item>
        <Item icon="pin" label="Indirizzo">
          <address className="ct-v">
            {ADDRESS[0]}
            <br />
            {ADDRESS[1]}
          </address>
        </Item>
        <Item icon="clock" label="Orari di apertura">
          {HOURS ? (
            <p className="ct-v ct-hours">
              {HOURS.map((h) => (
                <span key={h}>{h}</span>
              ))}
            </p>
          ) : (
            TODO
          )}
        </Item>
        <li className="ct-map-item">
          <div className="ct-map">
            <iframe
              title="Mappa: Via del Carrubo, Vittoria (RG)"
              src={MAPS_EMBED}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            ></iframe>
            <a className="ct-maplink" href={MAPS_LINK} target="_blank" rel="noopener noreferrer">
              Apri in Google Maps <span aria-hidden="true">→</span>
            </a>
          </div>
        </li>
        <Item icon="share" label="Social">
          <SocialLinks />
        </Item>
      </ul>
      <p className="ct-brand">PromoCommunication è un brand di Promotergroup S.p.a.</p>
    </aside>
  );
}
