/** Pad roles used for timing (no open/close training). */
export type PadRole = "kick" | "snare" | "hihat";

export type PatternKind =
  | { type: "quarter-kick-snare" }
  | { type: "quarter-kick-bar-head" }
  | { type: "eighth-hihat-steady" }
  | { type: "offbeat-snare" };

export interface Preset {
  id: string;
  name: string;
  description: string;
  tag: "recommended" | "observe" | "subdivision" | "hard" | "disabled";
  pattern: PatternKind;
  /** Which roles produce timing marks (others ignored for this preset). */
  activeRoles: PadRole[];
}

export const PRESETS: Preset[] = [
  {
    id: "eight-kick-snare",
    name: "8ビート：キック＋スネア",
    description: "1・3拍キック、2・4拍スネア。ズレの癖を見る。",
    tag: "recommended",
    pattern: { type: "quarter-kick-snare" },
    activeRoles: ["kick", "snare"],
  },
  {
    id: "kick-bar-head",
    name: "拍の頭チェック",
    description: "キックは各小節の1拍目だけ。頭の安定を見る。",
    tag: "observe",
    pattern: { type: "quarter-kick-bar-head" },
    activeRoles: ["kick"],
  },
  {
    id: "hihat-eighth",
    name: "ハイハット八分（単色）",
    description: "開閉は使わない。八分の均等さを見る。",
    tag: "subdivision",
    pattern: { type: "eighth-hihat-steady" },
    activeRoles: ["hihat"],
  },
  {
    id: "offbeat-snare",
    name: "オフビート・スネア",
    description: "裏のスネア。キープが試される。",
    tag: "hard",
    pattern: { type: "offbeat-snare" },
    activeRoles: ["snare"],
  },
];

export function getPreset(id: string): Preset | undefined {
  return PRESETS.find((p) => p.id === id);
}
