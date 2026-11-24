"use client";

import type { ImageLoaderProps } from "next/image";

// The site is a static export, so Next's own image optimiser isn't available.
// Images uploaded to src/assets/images/ are referenced as /images/<name>.<ext>
// (the path Pages CMS writes), and scripts/optimize-images.mjs pre-generates a
// AVIF copy per width at /_images/<name>-<width>.avif.
export default function imageLoader({ src, width }: ImageLoaderProps): string {
  const match = src.match(/^\/images\/(.+)\.[a-z]+$/i);
  if (!match) return src;
  return `/_images/${match[1]}-${width}.avif`;
}
