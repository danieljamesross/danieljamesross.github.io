import { useId, type Ref } from "react";

// The rays, from 7.5 to 9.5 out from the centre, every 45°.
const RAYS = Array.from({ length: 8 }, (_, i) => {
  const angle = (i * Math.PI) / 4;
  const [x, y] = [Math.sin(angle), -Math.cos(angle)];
  return {
    x1: 12 + x * 7.5,
    y1: 12 + y * 7.5,
    x2: 12 + x * 9.5,
    y2: 12 + y * 9.5,
  };
});

// The sun's disc, as a fraction of the moon's.
const SUN = 0.47;
// How far the shadow that carves the crescent moves off the disc.
const AWAY = "8px -8px";

/**
 * The theme toggle's icon, showing the theme it would switch to: a crescent
 * moon in light mode and a sun in dark. Both are one drawing, a disc with a
 * shadow over it and rays around it, so each can turn into the other: see
 * animateThemeIcon. At rest CSS poses it for the theme, which the server
 * can't know.
 */
export default function ThemeIcon({
  ref,
  className = "",
}: {
  ref?: Ref<SVGSVGElement>;
  className?: string;
}) {
  // Escaped, since it ends up in url(#…).
  const mask = `moon-${useId().replace(/[^\w-]/g, "")}`;
  return (
    <svg
      ref={ref}
      viewBox="0 0 24 24"
      aria-hidden
      className={`overflow-visible ${className}`}
    >
      <defs>
        <mask id={mask}>
          <rect x="-12" y="-12" width="48" height="48" fill="white" />
          <circle
            data-part="shadow"
            cx="18"
            cy="6"
            r="7"
            fill="black"
            className="dark:translate-x-2 dark:-translate-y-2"
          />
        </mask>
      </defs>
      <g data-part="spin" className="origin-[12px_12px]">
        <circle
          data-part="disc"
          cx="12"
          cy="12"
          r="8.5"
          mask={`url(#${mask})`}
          className="origin-[12px_12px] fill-current dark:scale-[0.47]"
        />
        {RAYS.map((ray, i) => (
          <line
            key={i}
            data-part="ray"
            {...ray}
            className="origin-[12px_12px] scale-0 stroke-current stroke-2 opacity-0 [stroke-linecap:round] dark:scale-100 dark:opacity-100"
          />
        ))}
      </g>
    </svg>
  );
}

/**
 * Turns the icon from one theme's to the other's over `duration` ms, as the
 * theme changes. To the sun: the shadow slides off the moon, the full disc
 * shrinks with a gulp, and the rays shoot out one after another. To the
 * moon: the rays pull in one after another, the disc swells, and the shadow
 * swings back across it. The whole drawing spins half a turn meanwhile.
 */
export function animateThemeIcon(
  svg: SVGSVGElement,
  toDark: boolean,
  duration: number,
) {
  const part = (name: string) => [
    ...svg.querySelectorAll<SVGElement>(`[data-part=${name}]`),
  ];
  const options = { duration };
  const animations = [
    ...part("spin").map((el) =>
      el.animate(
        { rotate: ["-180deg", "0deg"] },
        { duration, easing: "cubic-bezier(0.65, 0, 0.35, 1)" },
      ),
    ),
  ];

  if (toDark) {
    for (const el of part("shadow"))
      animations.push(
        el.animate(
          [
            { offset: 0, translate: "0 0", easing: "ease-in" },
            { offset: 0.3, translate: AWAY },
          ],
          options,
        ),
      );
    for (const el of part("disc"))
      animations.push(
        el.animate(
          [
            { offset: 0, scale: 1 },
            { offset: 0.25, scale: 1, easing: "ease-in" },
            { offset: 0.5, scale: SUN * 0.8, easing: "ease-out" },
            { offset: 0.6, scale: SUN },
          ],
          options,
        ),
      );
    part("ray").forEach((el, i) => {
      const start = 0.45 + i * 0.04;
      animations.push(
        el.animate(
          [
            { offset: 0, scale: 0, opacity: 0 },
            { offset: start, scale: 0, opacity: 0, easing: "ease-out" },
            {
              offset: start + 0.12,
              scale: 1.4,
              opacity: 1,
              easing: "ease-in-out",
            },
            { offset: start + 0.22, scale: 1, opacity: 1 },
          ],
          options,
        ),
      );
    });
    return animations;
  }

  part("ray").forEach((el, i) => {
    const start = i * 0.03;
    animations.push(
      el.animate(
        [
          { offset: 0, scale: 1, opacity: 1 },
          { offset: start, scale: 1, opacity: 1, easing: "ease-out" },
          { offset: start + 0.05, scale: 1.25, opacity: 1, easing: "ease-in" },
          { offset: start + 0.15, scale: 0, opacity: 0 },
        ],
        options,
      ),
    );
  });
  for (const el of part("disc"))
    animations.push(
      el.animate(
        [
          { offset: 0, scale: SUN },
          { offset: 0.3, scale: SUN, easing: "ease-out" },
          { offset: 0.55, scale: 1.12, easing: "ease-in-out" },
          { offset: 0.65, scale: 1 },
        ],
        options,
      ),
    );
  for (const el of part("shadow"))
    animations.push(
      el.animate(
        [
          { offset: 0, translate: AWAY },
          { offset: 0.55, translate: AWAY, easing: "ease-out" },
          { offset: 0.85, translate: "-0.8px 0.8px", easing: "ease-in-out" },
          { offset: 1, translate: "0 0" },
        ],
        options,
      ),
    );
  return animations;
}
