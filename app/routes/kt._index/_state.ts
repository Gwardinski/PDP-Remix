import { create } from "zustand";
import { KT, PLAYERS, Unit } from "./_data";

type Mode = "selecting" | "confirming";
type Action = "attack" | "heal" | "capture" | "idle";

interface GameState {
  players: KT[];
  selectedMode: Mode;
  setMode: (mode: Mode) => void;
  selectedAction: Action;
  setAction: (action: Action) => void;
  selectedUnits: Unit[];
  setUnits: (units: Unit[]) => void;
  selectedTargets: Unit[];
  setTargets: (targets: Unit[]) => void;
  actonValue: number;
  setActionValue: (v: number) => void;
  reset: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  players: PLAYERS,
  selectedMode: "selecting",
  setMode: (mode: Mode) => set((_) => ({ selectedMode: mode })),
  selectedAction: "idle",
  setAction: (action: Action) => set((_) => ({ selectedAction: action })),
  selectedUnits: [],
  setUnits: (units: Unit[]) => set((_) => ({ selectedUnits: units })),
  selectedTargets: [],
  setTargets: (targets: Unit[]) => set((_) => ({ selectedTargets: targets })),
  actonValue: 0,
  setActionValue: (v) => set((_) => ({ actonValue: v })),
  reset: () =>
    set((_) => ({
      selectedMode: "selecting",
      selectedAction: "idle",
      selectedUnits: [],
      selectedTargets: [],
      actonValue: 0,
    })),
}));
