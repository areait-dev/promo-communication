import type { Metadata } from "next";
import { Stickers } from "@/components/Stickers";
import { TeamScroll } from "@/components/TeamScroll";
import { Cta } from "@/components/blocks";
import { vars } from "@/lib/ui";
import { MobileControls } from "@/components/Controls";

export const metadata: Metadata = { title: "Team" };

export default function Team() {
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
        <MobileControls />
      </section>
      <TeamScroll />
      <Cta />
    </>
  );
}
