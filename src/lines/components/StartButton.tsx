"use client";

import { useAppDispatch, useAppState } from "@/lines/lib/state/context";

export default function StartButton() {
  const dispatch = useAppDispatch();
  const { startButton } = useAppState();

  if (!startButton) return null;

  return (
    <div className="start">
      <button
        type="button"
        className="start-button"
        onClick={() => dispatch({ type: "START" })}
      >
        lines
      </button>
    </div>
  );
}
