import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import { z } from "zod";

// Projects are Markdown files in src/content/projects/, edited through Pages
// CMS (see .pages.yml) or by hand. The filename is the URL slug. Everything
// here runs at build time; an invalid file fails the build with a message
// naming the file, so a bad edit never reaches the live site.

const CONTENT_DIR = path.join(process.cwd(), "src/content/projects");
const IMAGE_DIR = path.join(process.cwd(), "src/assets/images");

// The CMS can save a cleared field as an empty value rather than removing it.
const optional = <T extends z.ZodType>(schema: T) =>
  z.preprocess(
    (value) => (value === "" || value === null ? undefined : value),
    schema.optional(),
  );

const frontmatterSchema = z.object({
  title: z.string().min(1),
  date: z.coerce.date(),
  excerpt: z.string().min(1),
  image: z
    .string()
    .regex(
      /^\/images\/[^/]+$/,
      "must be an uploaded image, like /images/photo.jpg",
    )
    .refine(
      (image) => fs.existsSync(path.join(IMAGE_DIR, path.basename(image))),
      "file not found in src/assets/images",
    ),
  imageAlt: optional(z.string()),
  tags: z.preprocess((v) => v ?? [], z.array(z.string())),
  links: z.preprocess(
    (v) => v ?? [],
    z.array(z.object({ label: z.string().min(1), url: z.url() })),
  ),
});

export type ProjectLink = { label: string; url: string };

export type Project = {
  slug: string;
  title: string;
  date: Date;
  excerpt: string;
  image: string;
  imageAlt: string;
  tags: string[];
  links: ProjectLink[];
  /** The body rendered from Markdown to HTML. */
  html: string;
};

function loadProject(file: string): Project {
  const source = fs.readFileSync(path.join(CONTENT_DIR, file), "utf8");
  const { data, content } = matter(source);
  const result = frontmatterSchema.safeParse(data);
  if (!result.success) {
    const problems = result.error.issues
      .map((issue) => `  ${issue.path.join(".") || "(file)"}: ${issue.message}`)
      .join("\n");
    throw new Error(
      `Invalid project src/content/projects/${file}:\n${problems}`,
    );
  }
  const fields = result.data;
  return {
    slug: path.basename(file, ".md"),
    ...fields,
    imageAlt: fields.imageAlt ?? fields.title,
    html: marked.parse(content, { async: false }),
  };
}

let cache: Project[] | undefined;

/** All projects, most recent first. */
export function getProjects(): Project[] {
  cache ??= fs
    .readdirSync(CONTENT_DIR)
    .filter((file) => file.endsWith(".md"))
    .map(loadProject)
    .sort(
      (a, b) =>
        b.date.getTime() - a.date.getTime() || a.title.localeCompare(b.title),
    );
  return cache;
}

export function getProject(slug: string): Project | undefined {
  return getProjects().find((project) => project.slug === slug);
}
