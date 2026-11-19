import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Alata } from "next/font/google";
import SiteHeader from "@/components/SiteHeader";
import "@/lines/styles/main.scss";

const alata = Alata({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-lines",
});

export const metadata: Metadata = {
  title: "Lines",
  description:
    "Lines is a web-based, interactive, audiovisual composition. Play with five line drawings whose sounds and shapes react to touch.",
};

export default function LinesLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader />
      <div className={`${alata.variable} flex flex-1 flex-col`}>{children}</div>
    </>
  );
}
