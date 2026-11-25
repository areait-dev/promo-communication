import type { Metadata } from "next";
import { ElasticGrid } from "@/components/ElasticGrid";
import { ProjectList } from "@/components/ProjectList";
import { Star } from "@/components/Star";
import { Cta } from "@/components/blocks";
import { getContent } from "@/lib/content";
import { PageFx } from "@/components/PageFx";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Portfolio",
  path: "/portfolio",
  description:
    "I progetti di PromoCommunication: identità di marca, siti, social ed eventi realizzati per le imprese con cui lavoriamo.",
});

export default async function Portfolio() {
  const { projects } = await getContent();
  return (
    <>
      <section className="about-hero pf-hero2 ctl-host">
        <ElasticGrid />
        <Star className="pc-star--spin bigstar" />
        <div className="wrap" style={{ position: "relative" }}>
          <h1 className="pc-reveal pf-title2">
            <span>Progetti che abbiamo fatto</span>
            <br />
            <span>(e che rifaremmo domani)</span>
          </h1>
        </div>
        <PageFx />
      </section>
      <section className="pl-sec">
        <div className="wrap">
          <ProjectList list={projects} mode="portfolio" />
        </div>
      </section>
      <Cta />
    </>
  );
}
