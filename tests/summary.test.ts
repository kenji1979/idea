import { describe, expect, it } from "vitest";
import { aggregateSession } from "../src/summary";

describe("aggregateSession", () => {
  it("handles empty hits", () => {
    const s = aggregateSession([]);
    expect(s.total).toBe(0);
    expect(s.headline).toContain("データ");
  });

  it("detects early tendency", () => {
    const s = aggregateSession([
      { deltaSec: -0.02, cls: "early", beatInBar: 0 },
      { deltaSec: -0.015, cls: "early", beatInBar: 0 },
      { deltaSec: -0.01, cls: "early", beatInBar: 1 },
    ]);
    expect(s.early).toBe(3);
    expect(s.headline).toContain("早い");
  });

  it("detects late tendency", () => {
    const s = aggregateSession([
      { deltaSec: 0.02, cls: "late", beatInBar: 2 },
      { deltaSec: 0.018, cls: "late", beatInBar: 2 },
      { deltaSec: 0.012, cls: "late", beatInBar: 3 },
    ]);
    expect(s.late).toBe(3);
    expect(s.headline).toContain("おくれ");
  });
});
