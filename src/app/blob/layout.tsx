import type { Metadata } from "next";
import type { ReactNode } from "react";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Blob",
  description:
    "An interactive 3D blob that plays a sawtooth synthesiser. Move and reshape it to change the pitch and filter, and watch the sound's spectrum colour it.",
};

export default function BlobLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main className="flex flex-1 flex-col">{children}</main>
    </>
  );
}
