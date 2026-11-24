import type { Metadata, Viewport } from "next";
import { Funnel_Display, Outfit } from "next/font/google";
import "./site.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MainView } from "@/components/MainView";
import { Behaviors } from "@/components/Behaviors";
import { CookieBanner } from "@/components/CookieBanner";
import { OG_IMAGE, SITE_NAME, SITE_URL } from "@/lib/seo";
import { ADDRESS, EMAIL, PHONE, SOCIALS } from "@/data/contact";
import { isPreview } from "@/lib/env";

const outfit = Outfit({ subsets: ["latin"], variable: "--f-outfit", display: "swap" });
const funnel = Funnel_Display({ subsets: ["latin"], variable: "--f-funnel", display: "swap" });

const HOME_TITLE = "Boost your brand — PromoCommunication";
const HOME_DESC =
  "PromoCommunication — la Unit di Comunicazione & Marketing di Promotergroup. Diamo forma, voce e spazio a quello che la tua impresa fa ogni giorno.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: HOME_TITLE,
    template: "%s — PromoCommunication",
  },
  description: HOME_DESC,
  alternates: { canonical: "/" },
  openGraph: { type: "website", siteName: SITE_NAME, locale: "it_IT", url: "/", title: HOME_TITLE, description: HOME_DESC, images: [OG_IMAGE] },
  twitter: { card: "summary_large_image", title: HOME_TITLE, description: HOME_DESC, images: [OG_IMAGE.url] },
};

// Dati strutturati: l'agenzia come organizzazione, parte di Promotergroup S.p.A.
const ORG_JSONLD = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/icon.png`,
  description: HOME_DESC,
  email: EMAIL ?? undefined,
  telephone: PHONE.label,
  address: { "@type": "PostalAddress", streetAddress: ADDRESS[0], postalCode: "97019", addressLocality: "Vittoria", addressRegion: "RG", addressCountry: "IT" },
  parentOrganization: { "@type": "Organization", name: "Promotergroup S.p.A.", url: "https://www.promotergroup.eu" },
  sameAs: SOCIALS.map((x) => x.href),
}).replace(/</g, "\\u003c");

export const viewport: Viewport = {
  themeColor: "#001a6f",
};

// Google Tag Manager: solo in produzione (non in locale né sullo stage, per non sporcare i dati).
// Il consenso parte NEGATO per analisi e pubblicità (Consent Mode): finché non c'è un banner che lo conceda, i tag Google che lo rispettano non salvano cookie.
const GTM_ID = "GTM-N49MLKQV";
const gtmScript = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',wait_for_update:500});try{var c=JSON.parse(localStorage.getItem('pc-consent')||'null');if(c&&c.v==='granted'&&Date.now()-c.t<15724800000)gtag('consent','update',{ad_storage:'granted',ad_user_data:'granted',ad_personalization:'granted',analytics_storage:'granted'})}catch(e){}(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s);j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i;f.parentNode.insertBefore(j,f)})(window,document,'script','dataLayer','${GTM_ID}')`;
const withGtm = process.env.NODE_ENV === "production" && !isPreview;

// Prima del primo paint: classe .js (abilita lo stato iniziale dei reveal), tema e, con prefers-reduced-motion, la classe
// motion-off che ferma le animazioni decorative; evita lampi. Non c'e' piu' un pulsante di pausa: la scelta e' quella del sistema.
const initScript = `var d=document.documentElement;d.classList.add('js');setTimeout(function(){if(!window.__pcReveal)d.classList.add('no-reveal')},5000);try{var t=localStorage.getItem('pc-theme');if(t)d.setAttribute('data-theme',t);}catch(e){}if(matchMedia('(prefers-reduced-motion: reduce)').matches)d.classList.add('motion-off')`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="it" data-theme="light" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: initScript }} />
        {withGtm && <script dangerouslySetInnerHTML={{ __html: gtmScript }} />}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ORG_JSONLD }} />
      </head>
      <body className={`pc ${outfit.variable} ${funnel.variable}`}>
        <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
          <defs>
            <clipPath id="pc-pitto-clip" clipPathUnits="objectBoundingBox">
              <path d="M1 0.16304L1 0.67452C1 0.76455 0.93187 0.83756 0.84785 0.83756L0.15154 0.83756L0 1L0 0L0.84785 0C0.93187 0 1 0.07299 1 0.16304Z" />
            </clipPath>
            <clipPath id="pc-bubble-clip" clipPathUnits="objectBoundingBox">
              <path d="M0 0H0.82A0.18 0.1309 0 0 1 1 0.1309V0.7382A0.18 0.1309 0 0 1 0.82 0.8691H0.18L0 1Z" />
            </clipPath>
          </defs>
        </svg>
        <Header />
        <MainView>{children}</MainView>
        <div id="foot">
          <Footer />
        </div>
        <Behaviors />
        <CookieBanner />
      </body>
    </html>
  );
}
