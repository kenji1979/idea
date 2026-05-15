import { describe, expect, it } from "vitest";
import { nearestExpectedTarget, classifyDelta, okHalfWindowSec, beatDurationSec } from "../src/timing";
import type { PatternKind } from "../src/presets";

const bpm = 100;
const beatDur = beatDurationSec(bpm);
const sessionStart = 10;

describe("nearestExpectedTarget", () => {
  it("aligns kick on 1 and 3 for eight-beat preset", () => {
    const p: PatternKind = { type: "quarter-kick-snare" };
    const t0 = sessionStart + 0 * beatDur;
    const k = nearestExpectedTarget(t0 + 0.001, sessionStart, bpm, p, "kick");
    expect(k).not.toBeNull();
    expect(k!.deltaSec).toBeCloseTo(0.001, 3);

    const t2 = sessionStart + 2 * beatDur;
    const k2 = nearestExpectedTarget(t2 - 0.002, sessionStart, bpm, p, "kick");
    expect(k2!.deltaSec).toBeCloseTo(-0.002, 3);
  });

  it("aligns snare on 2 and 4", () => {
    const p: PatternKind = { type: "quarter-kick-snare" };
    const t = sessionStart + 1 * beatDur + 0.005;
    const s = nearestExpectedTarget(t, sessionStart, bpm, p, "snare");
    expect(s).not.toBeNull();
    expect(s!.deltaSec).toBeCloseTo(0.005, 3);
  });

  it("returns null for snare on kick-only-head preset", () => {
    const p: PatternKind = { type: "quarter-kick-bar-head" };
    const t = sessionStart + 1 * beatDur;
    expect(nearestExpectedTarget(t, sessionStart, bpm, p, "snare")).toBeNull();
  });

  it("finds eighth grid for hihat", () => {
    const p: PatternKind = { type: "eighth-hihat-steady" };
    const eighth = beatDur / 2;
    const t = sessionStart + 3 * eighth + 0.001;
    const h = nearestExpectedTarget(t, sessionStart, bpm, p, "hihat");
    expect(h).not.toBeNull();
    expect(h!.deltaSec).toBeCloseTo(0.001, 3);
  });

  it("finds offbeat snare targets", () => {
    const p: PatternKind = { type: "offbeat-snare" };
    const t = sessionStart + 0.5 * beatDur + 0.003;
    const s = nearestExpectedTarget(t, sessionStart, bpm, p, "snare");
    expect(s).not.toBeNull();
    expect(s!.deltaSec).toBeCloseTo(0.003, 3);
  });
});

describe("classifyDelta", () => {
  it("classifies relative to half window", () => {
    const w = 0.02;
    expect(classifyDelta(-0.03, w)).toBe("early");
    expect(classifyDelta(0.03, w)).toBe("late");
    expect(classifyDelta(0.01, w)).toBe("ok");
    expect(classifyDelta(-0.01, w)).toBe("ok");
  });
});

describe("okHalfWindowSec", () => {
  it("scales with BPM", () => {
    const a = okHalfWindowSec(60, 0.22);
    const b = okHalfWindowSec(120, 0.22);
    expect(a).toBeGreaterThan(b);
  });
});
