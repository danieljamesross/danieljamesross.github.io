// Durations for animations started from script, on the same scale as the
// CSS ones: see "Motion" in src/app/globals.css, which defines the numbers.

function token(style: CSSStyleDeclaration, name: string) {
  return parseFloat(style.getPropertyValue(name));
}

/** How long, in ms, something `size` px across (its diagonal) should take. */
export function motionDuration(size: number) {
  const style = getComputedStyle(document.documentElement);
  const base = token(style, "--motion-base");
  const rate = token(style, "--motion-rate");
  const max = token(style, "--motion-max");
  return Math.min(base + size * rate, max);
}

/** The diagonal of an element's box, in px. */
export function diagonal(el: Element) {
  const { width, height } = el.getBoundingClientRect();
  return Math.hypot(width, height);
}

export function prefersReducedMotion() {
  return matchMedia("(prefers-reduced-motion: reduce)").matches;
}
