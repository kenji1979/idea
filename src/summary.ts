import type { HitClass } from "./timing.js";

export interface TimedHit {
  deltaSec: number;
  cls: HitClass;
  /** Integer beat in bar 0..3 for quarter-aligned targets; -1 if unknown. */
  beatInBar: number;
}

export interface SessionSummary {
  total: number;
  early: number;
  late: number;
  ok: number;
  meanDeltaMs: number;
  headline: string;
  detail: string;
  /** Optional pattern hints for child-friendly copy. */
  hints: string[];
}

export function aggregateSession(hits: TimedHit[]): SessionSummary {
  const total = hits.length;
  if (total === 0) {
    return {
      total: 0,
      early: 0,
      late: 0,
      ok: 0,
      meanDeltaMs: 0,
      headline: "まだデータがないよ",
      detail: "次はメトロノームに合わせて、もう一度やってみよう。",
      hints: [],
    };
  }
  let early = 0;
  let late = 0;
  let ok = 0;
  let sumDelta = 0;
  const earlyByBeat = new Map<number, number>();
  const lateByBeat = new Map<number, number>();

  for (const h of hits) {
    sumDelta += h.deltaSec;
    if (h.cls === "early") {
      early++;
      if (h.beatInBar >= 0) earlyByBeat.set(h.beatInBar, (earlyByBeat.get(h.beatInBar) ?? 0) + 1);
    } else if (h.cls === "late") {
      late++;
      if (h.beatInBar >= 0) lateByBeat.set(h.beatInBar, (lateByBeat.get(h.beatInBar) ?? 0) + 1);
    } else ok++;
  }
  const meanDeltaMs = (sumDelta / total) * 1000;

  let headline: string;
  if (meanDeltaMs < -4) headline = "ちょい早いのが多めかも";
  else if (meanDeltaMs > 4) headline = "ちょいおくれが多めかも";
  else headline = "だいたいバランスよさそう！";

  const earlyRatio = early / total;
  const lateRatio = late / total;
  let detail = `早い ${(earlyRatio * 100).toFixed(0)}% · OK ${((ok / total) * 100).toFixed(0)}% · おくれ ${(lateRatio * 100).toFixed(0)}%。`;
  detail += ` 平均ズレは約 ${meanDeltaMs.toFixed(1)} ミリ秒。`;

  const hints: string[] = [];
  const maxEarlyBeat = maxKey(earlyByBeat);
  if (maxEarlyBeat !== null && (earlyByBeat.get(maxEarlyBeat) ?? 0) >= Math.max(3, total * 0.15)) {
    if (maxEarlyBeat === 0) hints.push("小節のはじめで、前に出やすいみたい。");
    else hints.push(`${maxEarlyBeat + 1}拍目付近で、早めに寄りがちかも。`);
  }
  const maxLateBeat = maxKey(lateByBeat);
  if (maxLateBeat !== null && (lateByBeat.get(maxLateBeat) ?? 0) >= Math.max(3, total * 0.15)) {
    hints.push(`${maxLateBeat + 1}拍目付近で、おくれやすいみたい。`);
  }
  if (hints.length === 0 && ok / total < 0.35) {
    hints.push("OKゾーンを「おおきめ」にして、まずはリラックスして刻んでみるのもあり。");
  }

  return { total, early, late, ok, meanDeltaMs, headline, detail, hints };
}

function maxKey(m: Map<number, number>): number | null {
  let best: number | null = null;
  let bestV = 0;
  for (const [k, v] of m) {
    if (v > bestV) {
      bestV = v;
      best = k;
    }
  }
  return best;
}
