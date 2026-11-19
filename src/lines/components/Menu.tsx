"use client";

import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faCircle,
  faPause,
  faUndo,
  faTrash,
  faInfo,
} from "@fortawesome/free-solid-svg-icons";
import { useAppDispatch, useAppState } from "@/lines/lib/state/context";

function IconButton({
  icon,
  label,
  className,
  pressed,
  onClick,
}: {
  icon: IconDefinition;
  label: string;
  className: string;
  pressed?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className="icon-button"
      aria-label={label}
      aria-pressed={pressed}
      onClick={onClick}
    >
      <FontAwesomeIcon icon={icon} className={className} aria-hidden />
    </button>
  );
}

export default function Menu() {
  const dispatch = useAppDispatch();
  const {
    recordButton,
    clearButton,
    playButton,
    pauseButton,
    recordGesture,
    playError,
    checkbox,
    trashed,
  } = useAppState();

  return (
    <>
      <div className="menu">
        {recordButton && (
          <IconButton
            icon={faCircle}
            label="Record gestures"
            className={recordGesture ? "faIcon recording" : "faIcon record"}
            pressed={recordGesture}
            onClick={() => dispatch({ type: "TOGGLE_RECORD_GESTURE" })}
          />
        )}
        {playButton && (
          <IconButton
            icon={faPlay}
            label="Play recorded gestures"
            className="faIcon play"
            onClick={() => dispatch({ type: "SET_PLAY_GESTURE" })}
          />
        )}
        {pauseButton && (
          <IconButton
            icon={faPause}
            label="Pause"
            className="faIcon pause"
            onClick={() => dispatch({ type: "SET_PAUSE_GESTURE" })}
          />
        )}
        {clearButton && (
          <IconButton
            icon={faInfo}
            label="About Lines"
            className="faIcon clear"
            onClick={() => dispatch({ type: "TOGGLE_INFO" })}
          />
        )}
        {clearButton && (
          <IconButton
            icon={faUndo}
            label="Start again"
            className="faIcon clear"
            onClick={() => window.location.reload()}
          />
        )}
        {clearButton && (
          <IconButton
            icon={faTrash}
            label="Delete recorded gestures"
            className="faIcon clear"
            onClick={() => {
              dispatch({ type: "TRASHED" });
              localStorage.clear();
            }}
          />
        )}
        {checkbox && (
          <label htmlFor="check">
            <input
              id="check"
              type="checkbox"
              className="checkbox"
              onClick={() => dispatch({ type: "TOGGLE_SHOW_GESTURE" })}
            />
            Show Gestures
          </label>
        )}
      </div>
      <div className="info">
        {recordGesture && <span>Recording...</span>}
        {playError && (
          <span className="error">
            You must first record a wiggle for each sketch.
          </span>
        )}
        {trashed && <span className="error">Gestures deleted.</span>}
      </div>
    </>
  );
}
