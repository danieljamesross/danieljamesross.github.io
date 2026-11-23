"use client";

import dynamic from "next/dynamic";

// The whole piece is browser-only (WebGL, Web Audio), so it's excluded from
// SSR entirely; `ssr: false` must live in a Client Component.
const BlobApp = dynamic(() => import("./BlobApp"), { ssr: false });

export default function BlobAppLoader() {
  return <BlobApp />;
}
