import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Promo communication | Coming soon",
  description:
    "Promo communication — Creative Agency by Promotergroup. Il nuovo sito è in arrivo.",
};

export const viewport: Viewport = {
  themeColor: "#001a6f",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
