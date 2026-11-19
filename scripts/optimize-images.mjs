// Generates resized WebP copies of every image in src/assets/images/ into
// public/_images/, one per width next/image can request (see
// src/lib/imageWidths.json). The site is a static export, so Next's own image
// optimiser isn't available; src/lib/imageLoader.ts points next/image at these
// files instead. Runs automatically before `npm run dev` and `npm run build`.
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = path.join(import.meta.dirname, "..");
const SOURCE_DIR = path.join(root, "src/assets/images");
const OUTPUT_DIR = path.join(root, "public/_images");
const { deviceSizes, imageSizes } = JSON.parse(
  fs.readFileSync(path.join(root, "src/lib/imageWidths.json"), "utf8"),
);
const WIDTHS = [...imageSizes, ...deviceSizes];
const IMAGE = /\.(jpe?g|png|webp)$/i;

fs.mkdirSync(OUTPUT_DIR, { recursive: true });

let generated = 0;
for (const file of fs.readdirSync(SOURCE_DIR).filter((f) => IMAGE.test(f))) {
  const source = path.join(SOURCE_DIR, file);
  const sourceTime = fs.statSync(source).mtimeMs;
  const name = path.parse(file).name;
  for (const width of WIDTHS) {
    const output = path.join(OUTPUT_DIR, `${name}-${width}.webp`);
    // Skip copies that are already newer than their source.
    if (fs.existsSync(output) && fs.statSync(output).mtimeMs >= sourceTime) {
      continue;
    }
    await sharp(source)
      // Never upscale: requests wider than the original get the original size.
      .resize({ width, withoutEnlargement: true })
      // A slightly lower alpha quality makes transparent PNGs much smaller
      // with no visible difference.
      .webp({ quality: 75, alphaQuality: 80 })
      .toFile(output);
    generated++;
  }
}
console.log(
  `optimize-images: ${generated} image(s) generated in public/_images/`,
);
