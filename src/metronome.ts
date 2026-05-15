/**
 * Schedules short click sounds on the Web Audio clock (shared with hit timing).
 */
export class Metronome {
  private ctx: AudioContext;
  private bpm = 92;
  private nextBeatIndex = 0;
  private nextBeatTime = 0;
  private timer: ReturnType<typeof setInterval> | null = null;
  private running = false;
  private lastClickTime = Infinity;

  constructor(audioContext: AudioContext) {
    this.ctx = audioContext;
  }

  getBpm(): number {
    return this.bpm;
  }

  setBpm(bpm: number): void {
    this.bpm = Math.min(180, Math.max(40, bpm));
  }

  /**
   * Schedule clicks from `firstBeatTime` until `lastClickTime` (AudioContext time, exclusive tail).
   */
  start(firstBeatTime: number, bpm: number, lastClickTime = Infinity): void {
    this.stop();
    this.setBpm(bpm);
    this.running = true;
    this.lastClickTime = lastClickTime;
    this.nextBeatTime = firstBeatTime;
    this.nextBeatIndex = 0;
    this.scheduleAhead();
    this.timer = setInterval(() => this.scheduleAhead(), 50);
  }

  stop(): void {
    this.running = false;
    if (this.timer !== null) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  private beatDur(): number {
    return 60 / this.bpm;
  }

  private scheduleAhead(): void {
    if (!this.running) return;
    const ctx = this.ctx;
    const lookAhead = 0.6;
    const now = ctx.currentTime;
    while (this.nextBeatTime < now + lookAhead) {
      if (this.nextBeatTime > this.lastClickTime + 0.02) {
        this.stop();
        return;
      }
      const t = this.nextBeatTime;
      const isDown = this.nextBeatIndex % 4 === 0;
      this.playClick(t, isDown);
      this.nextBeatTime += this.beatDur();
      this.nextBeatIndex++;
    }
  }

  private playClick(when: number, downbeat: boolean): void {
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = downbeat ? 1000 : 760;
    g.gain.value = 0.001;
    g.gain.setValueAtTime(0.001, when);
    g.gain.exponentialRampToValueAtTime(downbeat ? 0.22 : 0.14, when + 0.004);
    g.gain.exponentialRampToValueAtTime(0.001, when + 0.06);
    osc.connect(g);
    g.connect(ctx.destination);
    osc.start(when);
    osc.stop(when + 0.07);
  }
}
