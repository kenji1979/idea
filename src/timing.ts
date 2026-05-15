import type { PadRole, PatternKind } from "./presets.js";

export function beatDurationSec(bpm: number): number {
  return 60 / bpm;
}

/** OK zone half-width as a fraction of one 16th-note duration at current BPM. */
export function okHalfWindowSec(bpm: number, widthSixteenths = 0.22): number {
  const q = beatDurationSec(bpm);
  return (q / 4) * widthSixteenths;
}

export interface NearestTarget {
  targetTimeSec: number;
  deltaSec: number;
  /** Continuous quarter index from session start (can be fractional). */
  targetQuarterIndex: number;
}

/**
 * Find nearest expected hit time for this role and pattern.
 * Returns null if this role is not used in pattern or no target within search window.
 */
export function nearestExpectedTarget(
  hitTimeSec: number,
  sessionStartSec: number,
  bpm: number,
  pattern: PatternKind,
  role: PadRole
): NearestTarget | null {
  const beatDur = beatDurationSec(bpm);
  const tRel = hitTimeSec - sessionStartSec;
  if (!Number.isFinite(tRel)) return null;

  switch (pattern.type) {
    case "quarter-kick-snare": {
      if (role === "kick") {
        return nearestQuarterGrid(tRel, sessionStartSec, beatDur, (b) => b % 4 === 0 || b % 4 === 2);
      }
      if (role === "snare") {
        return nearestQuarterGrid(tRel, sessionStartSec, beatDur, (b) => b % 4 === 1 || b % 4 === 3);
      }
      return null;
    }
    case "quarter-kick-bar-head": {
      if (role !== "kick") return null;
      return nearestQuarterGrid(tRel, sessionStartSec, beatDur, (b) => b % 4 === 0);
    }
    case "eighth-hihat-steady": {
      if (role !== "hihat") return null;
      return nearestEighthGrid(tRel, sessionStartSec, beatDur);
    }
    case "offbeat-snare": {
      if (role !== "snare") return null;
      return nearestOffbeatSnareTargets(tRel, sessionStartSec, beatDur);
    }
    default:
      return null;
  }
}

function nearestQuarterGrid(
  tRel: number,
  sessionStartSec: number,
  beatDur: number,
  isExpectedBeat: (beatIndex: number) => boolean
): NearestTarget | null {
  const q = tRel / beatDur;
  const center = Math.round(q);
  let best: NearestTarget | null = null;
  for (let d = -3; d <= 3; d++) {
    const b = center + d;
    if (!isExpectedBeat(b)) continue;
    const targetTimeSec = sessionStartSec + b * beatDur;
    const deltaSec = tRel + sessionStartSec - targetTimeSec;
    const cand = { targetTimeSec, deltaSec, targetQuarterIndex: b };
    if (!best || Math.abs(cand.deltaSec) < Math.abs(best.deltaSec)) best = cand;
  }
  return best;
}

function nearestEighthGrid(tRel: number, sessionStartSec: number, beatDur: number): NearestTarget {
  const eighthDur = beatDur / 2;
  const e = Math.round(tRel / eighthDur);
  const targetTimeSec = sessionStartSec + e * eighthDur;
  const deltaSec = tRel + sessionStartSec - targetTimeSec;
  return { targetTimeSec, deltaSec, targetQuarterIndex: e / 2 };
}

/** Snare on "and" of 1 and 3: quarter positions 0.5 and 2.5 within each bar of 4 quarters. */
function nearestOffbeatSnareTargets(
  tRel: number,
  sessionStartSec: number,
  beatDur: number
): NearestTarget | null {
  const q = tRel / beatDur;
  const centerBar = Math.floor(q / 4);
  let best: NearestTarget | null = null;
  for (let dBar = -1; dBar <= 1; dBar++) {
    const barIdx = centerBar + dBar;
    for (const off of [0.5, 2.5] as const) {
      const tq = barIdx * 4 + off;
      const targetTimeSec = sessionStartSec + tq * beatDur;
      const deltaSec = tRel + sessionStartSec - targetTimeSec;
      const cand: NearestTarget = {
        targetTimeSec,
        deltaSec,
        targetQuarterIndex: tq,
      };
      if (!best || Math.abs(cand.deltaSec) < Math.abs(best.deltaSec)) best = cand;
    }
  }
  return best;
}

export type HitClass = "early" | "ok" | "late";

export function classifyDelta(deltaSec: number, okHalfWindowSec: number): HitClass {
  if (deltaSec < -okHalfWindowSec) return "early";
  if (deltaSec > okHalfWindowSec) return "late";
  return "ok";
}
