"use client";

import type { ImageLoaderProps } from "next/image";

// The site is a static export, so Next's own image optimiser isn't available.
// The project images are hosted on WordPress.com, whose image CDN resizes and
// re-encodes on request (serving WebP to browsers that accept it), so ask it
// for exactly the width next/image picked from `sizes`.
const WORDPRESS_UPLOADS = "https://vitruviandan.wordpress.com/wp-content/uploads/";

export default function imageLoader({ src, width, quality }: ImageLoaderProps): string {
  if (!src.startsWith(WORDPRESS_UPLOADS)) return src;
  return `${src}?w=${width}&quality=${quality ?? 75}`;
}
