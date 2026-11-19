import type { MetadataRoute } from "next";
import { getProjects } from "@/lib/projects";

export const dynamic = "force-static";

const SITE_URL = "https://danieljamesross.github.io";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["/", "/composition/", "/lines/", "/cv/", "/contact/"];
  const projectPages = getProjects().map(
    (project) => `/portfolio/${project.slug}/`,
  );
  return [...pages, ...projectPages].map((path) => ({
    url: `${SITE_URL}${path}`,
  }));
}
