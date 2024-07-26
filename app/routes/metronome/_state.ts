import { create } from "zustand";

export const bpmMin = 40;
export const bpmMax = 280;
export const bpmStep = 1;

interface MetronomeState {
  // ui
  tab: string;
  setTab: (v: string) => void;
  // Playback
  isPlaying: boolean;
  setIsPlaying: (v: boolean) => void;
  playNotes: boolean;
  setPlayNotes: (v: boolean) => void;
  // Settings
  bpm: number;
  setBpm: (v: number) => void;
  currentBeat: number;
  setCurrentBeat: (v: number) => void;
  beats: number;
  setBeats: (v: number) => void;
  notes: number;
  setNotes: (v: number) => void;
  // Automation
  incrementBy: number;
  setIncrementBy: (v: number) => void;
  incrementStep: number;
  setIncrementStep: (v: number) => void;
  incrementLimit: number;
  setIncrementLimit: (v: number) => void;
  incrementReverse: boolean;
  setIncrementReverse: (v: boolean) => void;
  // Sounds
  sound: string;
  setSound: (v: string) => void;
}

export const useMetronomeState = create<MetronomeState>((set) => ({
  // ui
  tab: "1",
  setTab: (v) => set(() => ({ tab: v })),
  // Playback
  isPlaying: false,
  setIsPlaying: (v) => set(() => ({ isPlaying: v })),
  playNotes: true,
  setPlayNotes: (v) => set(() => ({ playNotes: v })),
  // Settings
  bpm: 120,
  setBpm: (v) => set(() => ({ bpm: v })),
  currentBeat: 0,
  setCurrentBeat: (v) => set(() => ({ currentBeat: v })),
  beats: 4,
  setBeats: (v) => set(() => ({ beats: v })),
  notes: 4,
  setNotes: (v) => set(() => ({ notes: v })),
  // Automation
  incrementBy: 5,
  setIncrementBy: (v) => set(() => ({ incrementBy: v })),
  incrementStep: 8,
  setIncrementStep: (v) => set(() => ({ incrementStep: v })),
  incrementLimit: 10,
  setIncrementLimit: (v) => set(() => ({ incrementLimit: v })),
  incrementReverse: false,
  setIncrementReverse: (v) => set(() => ({ incrementReverse: v })),
  // Sounds
  sound: "sine",
  setSound: (v) => set(() => ({ sound: v })),
}));
