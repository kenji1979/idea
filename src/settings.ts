import type { PadRole } from "./presets.js";

export const STORAGE_KEY = "rhythm-lane-settings-v1";

export type OkZoneSize = "small" | "medium" | "large";

export interface AppSettings {
  midiNotes: Record<PadRole, number>;
  debounceMs: number;
  okZone: OkZoneSize;
}

const DEFAULTS: AppSettings = {
  midiNotes: { kick: 36, snare: 38, hihat: 42 },
  debounceMs: 45,
  okZone: "medium",
};

export function okZoneToSixteenthWidth(zone: OkZoneSize): number {
  switch (zone) {
    case "small":
      return 0.15;
    case "medium":
      return 0.22;
    case "large":
      return 0.32;
    default:
      return 0.22;
  }
}

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULTS, midiNotes: { ...DEFAULTS.midiNotes } };
    const j = JSON.parse(raw) as Partial<AppSettings>;
    return {
      midiNotes: {
        kick: typeof j.midiNotes?.kick === "number" ? j.midiNotes.kick : DEFAULTS.midiNotes.kick,
        snare: typeof j.midiNotes?.snare === "number" ? j.midiNotes.snare : DEFAULTS.midiNotes.snare,
        hihat: typeof j.midiNotes?.hihat === "number" ? j.midiNotes.hihat : DEFAULTS.midiNotes.hihat,
      },
      debounceMs:
        typeof j.debounceMs === "number" && j.debounceMs >= 15 && j.debounceMs <= 120
          ? j.debounceMs
          : DEFAULTS.debounceMs,
      okZone: j.okZone === "small" || j.okZone === "large" || j.okZone === "medium" ? j.okZone : "medium",
    };
  } catch {
    return { ...DEFAULTS, midiNotes: { ...DEFAULTS.midiNotes } };
  }
}

export function saveSettings(s: AppSettings): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
}
