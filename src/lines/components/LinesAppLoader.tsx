"use client";

import dynamic from "next/dynamic";

// The whole piece is browser-only (Web Audio, canvas, localStorage), so it's
// excluded from SSR entirely; `ssr: false` must live in a Client Component.
const LinesApp = dynamic(() => import("./LinesApp"), { ssr: false });

export default function LinesAppLoader() {
  return <LinesApp />;
}
