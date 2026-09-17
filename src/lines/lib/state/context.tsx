"use client";

import { createContext, useContext, useReducer, type ReactNode } from "react";
import { createInitialState } from "./initState";
import { reducer } from "./reducer";
import type { AppState, Dispatch } from "./types";

const AppStateContext = createContext<AppState | null>(null);
const AppDispatchContext = createContext<Dispatch | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState);

  return (
    <AppDispatchContext.Provider value={dispatch}>
      <AppStateContext.Provider value={state}>
        {children}
      </AppStateContext.Provider>
    </AppDispatchContext.Provider>
  );
}

export function useAppState(): AppState {
  const state = useContext(AppStateContext);
  if (!state) {
    throw new Error("useAppState must be used within an AppStateProvider");
  }
  return state;
}

export function useAppDispatch(): Dispatch {
  const dispatch = useContext(AppDispatchContext);
  if (!dispatch) {
    throw new Error("useAppDispatch must be used within an AppStateProvider");
  }
  return dispatch;
}
