import type { Metadata } from "next";
import { Accordion } from "@/components/Accordion";
import { Boost } from "@/components/Boost";
import { ServicesScroll } from "@/components/ServicesScroll";
import { ElasticGrid } from "@/components/ElasticGrid";
import { Star } from "@/components/Star";
import { Cta } from "@/components/blocks";
import { vars } from "@/lib/ui";
import { PageFx } from "@/components/PageFx";

export const metadata: Metadata = { title: "Servizi" };

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
      <ServicesScroll />
      <Cta />
    </>
  );
}
