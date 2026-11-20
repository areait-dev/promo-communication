import type { Metadata, Viewport } from "next";
import { Funnel_Display, Outfit } from "next/font/google";
import "./site.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MainView } from "@/components/MainView";
import { Behaviors } from "@/components/Behaviors";

const outfit = Outfit({ subsets: ["latin"], variable: "--f-outfit", display: "swap" });
const funnel = Funnel_Display({ subsets: ["latin"], variable: "--f-funnel", display: "swap" });

export const metadata: Metadata = {
  title: {
    default: "Boost your brand — PromoCommunication",
    template: "%s — PromoCommunication",
  },
  description:
    "PromoCommunication — la Unit di Comunicazione & Marketing di Promotergroup. Diamo forma, voce e spazio a quello che la tua impresa fa ogni giorno.",
};

export const viewport: Viewport = {
  themeColor: "#001a6f",
};

// Prima del primo paint: classe .js (abilita lo stato iniziale dei reveal), tema e pausa animazioni; evita lampi.
const initScript = `var d=document.documentElement;d.classList.add('js');setTimeout(function(){if(!window.__pcReveal)d.classList.add('no-reveal')},5000);try{var t=localStorage.getItem('pc-theme');if(t)d.setAttribute('data-theme',t);var m=localStorage.getItem('pc-motion');if(m?m==='off':matchMedia('(prefers-reduced-motion: reduce)').matches)d.classList.add('motion-off')}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="it" data-theme="light" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: initScript }} />
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
      </body>
    </html>
  );
}
