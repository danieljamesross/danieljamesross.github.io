// Generates resized AVIF copies of every image in src/assets/images/ into
// public/_images/, one per width next/image can request (see
// src/lib/imageWidths.json). Every project image is shown in a 16:9 box with
// object-fit: cover, so each copy is cropped to its middle 16:9 first: the
// rest is never seen, and was up to half the bytes. The site is a static export, so Next's own image
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
const ASPECT = 16 / 9;
// AVIF, which every current browser shows, is about a third smaller than WebP
// at the same look, most of all for detailed transparent images like
// giant-leap.png. Quality 50 matches the look of WebP's 75.
const AVIF = { quality: 50 };

// Changing how copies are made has to remake them all, not just ones whose
// source is newer.
const SETTINGS = JSON.stringify({ WIDTHS, ASPECT, AVIF });
const STAMP = path.join(OUTPUT_DIR, ".settings");
const stale =
  !fs.existsSync(STAMP) || fs.readFileSync(STAMP, "utf8") !== SETTINGS;

fs.mkdirSync(OUTPUT_DIR, { recursive: true });
// Clear out copies in a format or width no longer made.
if (stale) {
  for (const file of fs.readdirSync(OUTPUT_DIR)) {
    fs.rmSync(path.join(OUTPUT_DIR, file));
  }
}

/** The largest ASPECT rectangle in the middle of the image. */
async function middle(source) {
  const { width, height } = await sharp(source).metadata();
  const w = Math.min(width, Math.round(height * ASPECT));
  const h = Math.min(height, Math.round(w / ASPECT));
  return {
    left: Math.floor((width - w) / 2),
    top: Math.floor((height - h) / 2),
    width: w,
    height: h,
  };
}

let generated = 0;
for (const file of fs.readdirSync(SOURCE_DIR).filter((f) => IMAGE.test(f))) {
  const source = path.join(SOURCE_DIR, file);
  const sourceTime = fs.statSync(source).mtimeMs;
  const name = path.parse(file).name;
  const crop = await middle(source);
  for (const width of WIDTHS) {
    const output = path.join(OUTPUT_DIR, `${name}-${width}.avif`);
    // Skip copies that are already newer than their source.
    if (
      !stale &&
      fs.existsSync(output) &&
      fs.statSync(output).mtimeMs >= sourceTime
    ) {
      continue;
    }
    await sharp(source)
      .extract(crop)
      // Never upscale: requests wider than the original get the original size.
      .resize({ width, withoutEnlargement: true })
      .avif(AVIF)
      .toFile(output);
    generated++;
  }
}
fs.writeFileSync(STAMP, SETTINGS);
console.log(
  `optimize-images: ${generated} image(s) generated in public/_images/`,
);
