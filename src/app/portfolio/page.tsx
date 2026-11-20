import type { Metadata } from "next";
import { ElasticGrid } from "@/components/ElasticGrid";
import { ProjectList } from "@/components/ProjectList";
import { Star } from "@/components/Star";
import { Cta } from "@/components/blocks";
import { PROJECTS } from "@/data/projects";

export const metadata: Metadata = { title: "Portfolio" };

export default function Portfolio() {
  return (
    <>
      <section className="about-hero pf-hero2">
        <ElasticGrid />
        <Star className="pc-star--spin bigstar" />
        <div className="wrap" style={{ position: "relative" }}>
          <h1 className="pc-reveal pf-title2">
            <span>Progetti che abbiamo fatto</span>
            <br />
            <span>(e che rifaremmo domani)</span>
          </h1>
        </div>
      </section>
      <section className="pl-sec">
        <div className="wrap">
          <ProjectList list={PROJECTS} mode="portfolio" />
        </div>
      </section>
      <Cta />
    </>
  );
}
