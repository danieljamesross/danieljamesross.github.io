import type { ReactNode } from "react";
import PageTransition from "@/components/PageTransition";

// Unlike the layout, a template mounts afresh for each page, so the page
// transition plays on every navigation within the site.
export default function SiteTemplate({ children }: { children: ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
