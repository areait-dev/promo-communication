import type { Metadata } from "next";
import { Accordion } from "@/components/Accordion";
import { Boost } from "@/components/Boost";
import { ElasticGrid } from "@/components/ElasticGrid";
import { Star } from "@/components/Star";
import { Cta } from "@/components/blocks";
import { vars } from "@/lib/ui";
import { PageFx } from "@/components/PageFx";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Servizi",
  path: "/servizi",
  description:
    "Brand strategy, identity, digital & web, social media, reputation, personal branding, eventi e comunicazione politica: i servizi di PromoCommunication.",
});

export default function Servizi() {
  return (
    <>
      <section className="hero ctl-host" style={{ paddingTop: 246, paddingBottom: 326 }}>
        <ElasticGrid />
        <Star className="pc-star--spin bigstar" />
        <div className="wrap" style={{ position: "relative" }}>
          <div className="pc-reveal" style={vars({ "--i": 1, marginTop: "24px" })}>
            <Boost words={["Strategy", "Brand", "Digital", "Social", "Reputation", "Event", "Campaign"]} tag="h1" />
          </div>
        </div>
        <PageFx />
      </section>
      <Accordion />
      <Cta />
    </>
  );
}
