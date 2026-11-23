import type { ReactNode } from "react";
import PageTransition from "@/components/PageTransition";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader />
      {/* Animates the page when leaving for or arriving from Blob or Lines,
          which have their own layouts; the template animates moves within. */}
      <PageTransition>
        <main className="flex-1">{children}</main>
      </PageTransition>
      <SiteFooter />
    </>
  );
}
