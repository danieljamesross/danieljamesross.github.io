// Rendered only by SiteHeader, a Client Component, so this is one too.
import { useLayoutEffect, useRef } from "react";
import { motionDuration, prefersReducedMotion } from "@/lib/motion";

// The icon's box, in px, and the length every piece is drawn at before
// scaling to its own.
const WIDTH = 20;
const HEIGHT = 14;
const BASE = 10;

/** Where a piece sits: its centre, its angle in degrees, and its length. */
type Pose = { x: number; y: number; r: number; l: number };

// Three bars, each made of a left and a right half.
const BARS: Pose[] = [1, 7, 13].flatMap((y) => [
  { x: 5, y, r: 0, l: 10 },
  { x: 15, y, r: 0, l: 10 },
]);

// A cross, each arm made of three pieces. Alternate pieces take alternate
// arms, so every bar ends up split between them.
const ARM = WIDTH / 3;
const CROSS: Pose[] = BARS.map((_, i) => {
  const r = i % 2 ? -45 : 45;
  const along = (Math.floor(i / 2) - 1) * ARM;
  const rad = (r * Math.PI) / 180;
  return {
    x: WIDTH / 2 + along * Math.cos(rad),
    y: HEIGHT / 2 + along * Math.sin(rad),
    r,
    l: ARM,
  };
});

// Where the splinters land, scattered along the bottom, and how far each
// tumbles on the way down. Fixed, so the heap looks the same every time.
const HEAP_X = [9, 3, 16, 6, 12, 18];
const TUMBLE = [190, -170, 175, -195, 160, -185];
const SPLINTER = 3;
const FLOOR = HEIGHT + 0.5;
// The order the splinters come back to life in.
const WAKE = [2, 5, 0, 3, 1, 4];

function transform({ x, y, r, l }: Pose) {
  return `translate(${x - BASE / 2}px, ${y - 1}px) rotate(${r}deg) scaleX(${l / BASE})`;
}

/** `to`'s angle, turned by half turns to the nearest to `from`: a bar looks
 *  the same either way round, so it never needs to swing further than 90°. */
function nearest(to: number, from: number) {
  return to + Math.round((from - to) / 180) * 180;
}

/**
 * The pieces' path from one pose to the other: they break apart, tumble into
 * a heap of splinters and lie still, then, one after another, spring upright,
 * stride to their places growing as they go, and turn to make the new shape.
 */
function keyframes(from: Pose, to: Pose, i: number): Keyframe[] {
  const heap = { x: HEAP_X[i], y: FLOOR, r: from.r + TUMBLE[i], l: SPLINTER };
  const upright = { ...heap, y: FLOOR - 2, r: heap.r + 90, l: SPLINTER + 1 };
  const striding = { x: to.x, y: to.y - 1.5, r: upright.r, l: to.l * 0.7 };
  const landed = { ...to, r: nearest(to.r, striding.r) };
  // The axe: each piece jolts a little apart from the others.
  const chopped = {
    ...from,
    x: from.x + (from.x - WIDTH / 2) * 0.15,
    y: from.y + (i % 2 ? 0.75 : -0.75),
  };
  const wake = 0.45 + WAKE.indexOf(i) * 0.04;
  return [
    { offset: 0, transform: transform(from), easing: "ease-out" },
    { offset: 0.08, transform: transform(chopped), easing: "ease-in" },
    // Falling, then a small bounce off the floor.
    { offset: 0.28, transform: transform(heap), easing: "ease-out" },
    {
      offset: 0.32,
      transform: transform({ ...heap, y: FLOOR - 1.25 }),
      easing: "ease-in",
    },
    { offset: 0.36, transform: transform(heap), easing: "linear" },
    // Lying still, until its turn comes.
    { offset: wake, transform: transform(heap), easing: "ease-out" },
    {
      offset: wake + 0.08,
      transform: transform(upright),
      easing: "ease-in-out",
    },
    {
      offset: 0.86,
      transform: transform(striding),
      easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    },
    { offset: 1, transform: transform(landed) },
  ];
}

/**
 * The phone menu button's icon: three bars when the menu is closed and a
 * cross when it's open. Changing between them, the pieces collapse into a
 * heap and rebuild themselves into the other shape, like the broom chopped
 * to splinters that each get up and carry on, while the whole icon turns a
 * quarter. It keeps time with the menu panel's own animation for the screen.
 */
export default function MenuIcon({ open }: { open: boolean }) {
  const icon = useRef<HTMLSpanElement>(null);
  const pieces = useRef<(HTMLSpanElement | null)[]>([]);
  const animations = useRef<Animation[]>([]);
  const shown = useRef(open);

  useLayoutEffect(() => {
    if (shown.current === open) return;
    shown.current = open;
    const from = open ? BARS : CROSS;
    const to = open ? CROSS : BARS;
    // Mid-change, carry on from wherever the pieces have got to.
    const midway = animations.current.map(
      (animation, i) =>
        animation.playState === "running" &&
        getComputedStyle(i ? pieces.current[i - 1]! : icon.current!)[
          i ? "transform" : "rotate"
        ],
    );
    animations.current.forEach((animation) => animation.cancel());
    animations.current = [];
    if (prefersReducedMotion()) return;

    const duration = motionDuration(Math.hypot(innerWidth, innerHeight));
    // The whole icon turns a quarter, clockwise, as it rebuilds. The cross
    // looks the same at either end of its turn, so opening ends on it a
    // quarter round and closing starts on it a quarter back, and the bars
    // are always level.
    const turn = icon.current!.animate(
      {
        rotate: [
          midway[0] || (open ? "0deg" : "-90deg"),
          open ? "90deg" : "0deg",
        ],
      },
      { duration, easing: "cubic-bezier(0.65, 0, 0.35, 1)" },
    );
    animations.current = [
      turn,
      ...pieces.current.map((piece, i) => {
        const frames = keyframes(from[i], to[i], i);
        const current = midway[i + 1];
        if (current) frames[0].transform = current;
        return piece!.animate(frames, { duration });
      }),
    ];
  }, [open]);

  return (
    <span
      ref={icon}
      aria-hidden
      className="relative block"
      style={{ width: WIDTH, height: HEIGHT }}
    >
      {(open ? CROSS : BARS).map((pose, i) => (
        <span
          key={i}
          ref={(el) => {
            pieces.current[i] = el;
          }}
          className="absolute top-0 left-0 h-0.5 bg-current"
          style={{ width: BASE, transform: transform(pose) }}
        />
      ))}
    </span>
  );
}
