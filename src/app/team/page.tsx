import type { Metadata } from "next";
import { Stickers } from "@/components/Stickers";
import { TeamScroll } from "@/components/TeamScroll";
import { Cta } from "@/components/blocks";
import { vars } from "@/lib/ui";
import { PageFx } from "@/components/PageFx";
import { seoMeta } from "@/lib/seo";
import { getContent } from "@/lib/content";

export const generateMetadata = (): Promise<Metadata> => seoMeta({
  title: "Team",
  path: "/team",
  description:
    "Il team di Promo Communication: press officer, art director, social media manager, graphic designer e developer. Teste diverse, stesso fumetto.",
});

export default async function Team() {
  const { team } = await getContent();
  return (
    <>
      <Stickers />
      <section className="hero ctl-host" style={{ paddingBottom: "var(--space-12)" }}>
        <div className="wrap">
          <h1 className="pc-reveal page-h1" style={vars({ "--i": 1 })}>
            Il team
          </h1>
          <p className="lead pc-reveal" style={vars({ "--i": 2 })}>
            Creativi, copywriter, graphic designer, gente che parla fluentemente la lingua degli algoritmi e chi con i giornalisti si
            dà del tu.
          </p>
        </div>
        <PageFx />
      </section>
      <TeamScroll team={team} />
      <Cta />
    </>
  );
}
