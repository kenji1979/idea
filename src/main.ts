import "./style.css";
import { Metronome } from "./metronome.js";
import { PRESETS, type Preset } from "./presets.js";
import {
  beatDurationSec,
  classifyDelta,
  nearestExpectedTarget,
  okHalfWindowSec,
} from "./timing.js";
import { aggregateSession, type TimedHit } from "./summary.js";
import { loadSettings, okZoneToSixteenthWidth, saveSettings, type AppSettings } from "./settings.js";

type Screen = "presets" | "session" | "summary" | "settings";

let settings: AppSettings = loadSettings();
let selectedPresetId = "eight-kick-snare";
let bpm = 92;
let midiOk = false;
let audioCtx: AudioContext | null = null;
let metronome: Metronome | null = null;

let sessionPreset: Preset | null = null;
let sessionStartSec = 0;
let sessionEndSec = 0;
let sessionFirstClickSec = 0;
let sessionBeatDur = 0;
let sessionHits: TimedHit[] = [];
let lastHitAudioTime: Partial<Record<"kick" | "snare" | "hihat", number>> = {};
let laneHitMarks: { at: number; deltaSec: number; cls: string }[] = [];
let rafId = 0;
const SESSION_SEC = 90;
const COUNT_IN_BEATS = 4;
const PX_PER_SEC = 140;
const LANE_HIT_TTL = 2.2;

function mod(n: number, m: number): number {
  return ((n % m) + m) % m;
}

function noteToRole(note: number, s: AppSettings): "kick" | "snare" | "hihat" | null {
  const entries: Array<["kick" | "snare" | "hihat", number]> = [
    ["kick", s.midiNotes.kick],
    ["snare", s.midiNotes.snare],
    ["hihat", s.midiNotes.hihat],
  ];
  for (const [role, n] of entries) {
    if (n === note) return role;
  }
  return null;
}

function el<T extends HTMLElement>(html: string): T {
  const t = document.createElement("template");
  t.innerHTML = html.trim();
  return t.content.firstElementChild as T;
}

function mountApp(): void {
  const root = document.querySelector("#app")!;
  root.innerHTML = `
    <div id="screen-presets" class="screen"></div>
    <div id="screen-session" class="screen hidden"></div>
    <div id="screen-summary" class="screen hidden"></div>
  `;
  settings = loadSettings();
  renderPresetScreen();
  void wireMidi();
}

function showScreen(s: Screen): void {
  const presets = document.getElementById("screen-presets")!;
  const session = document.getElementById("screen-session")!;
  const summary = document.getElementById("screen-summary")!;
  presets.classList.toggle("hidden", s !== "presets");
  session.classList.toggle("hidden", s !== "session");
  summary.classList.toggle("hidden", s !== "summary");
}

function tagClass(tag: Preset["tag"]): string {
  if (tag === "hard") return "hard";
  if (tag === "subdivision") return "sub";
  return "";
}

function tagLabel(tag: Preset["tag"]): string {
  switch (tag) {
    case "recommended":
      return "おすすめ";
    case "observe":
      return "観察";
    case "subdivision":
      return "刻み";
    case "hard":
      return "むずかしめ";
    default:
      return "";
  }
}

function renderPresetScreen(): void {
  const host = document.getElementById("screen-presets")!;
  const cards = PRESETS.map(
    (p) => `
    <button type="button" class="preset-card${p.id === selectedPresetId ? " selected" : ""}" data-preset="${p.id}">
      <span class="preset-tag ${tagClass(p.tag)}">${tagLabel(p.tag)}</span>
      <span class="preset-title">${p.name}</span>
      <span class="preset-desc">${p.description}</span>
    </button>`
  ).join("");

  host.innerHTML = `
    <div class="top-bar">
      <div class="brand"><span class="brand-dot"></span> リズムレーン</div>
      <div style="text-align:right">
        <div id="midi-status" class="${midiOk ? "ok" : "warn"}">${midiOk ? "MIDI: 利用可能" : "MIDI: 未接続または許可待ち"}</div>
        <div class="note-pill" style="margin-top:8px">HHの開閉トレーニングはありません。八分HHは単色の刻みのみです。</div>
      </div>
    </div>
    <h2 style="margin:0 0 12px;font-size:20px">きょうのれんしゅう</h2>
    <div class="preset-grid" id="preset-grid">${cards}</div>
    <div class="tempo-row">
      <div>
        <div class="tempo-label">テンポ（BPM）</div>
        <div id="bpm-value">${bpm}</div>
      </div>
      <input id="bpm-slider" type="range" min="70" max="130" step="1" value="${bpm}" />
    </div>
    <div id="settings-panel" class="settings-panel hidden">
      <label>キック MIDIノート <input type="number" id="set-kick" min="0" max="127" value="${settings.midiNotes.kick}" /></label>
      <label>スネア MIDIノート <input type="number" id="set-snare" min="0" max="127" value="${settings.midiNotes.snare}" /></label>
      <label>ハイハット MIDIノート <input type="number" id="set-hihat" min="0" max="127" value="${settings.midiNotes.hihat}" /></label>
      <label>連打まとめ（ms） <input type="number" id="set-debounce" min="15" max="120" value="${settings.debounceMs}" /></label>
      <label>OKゾーン
        <select id="set-okzone">
          <option value="small" ${settings.okZone === "small" ? "selected" : ""}>ちいさい</option>
          <option value="medium" ${settings.okZone === "medium" ? "selected" : ""}>ふつう</option>
          <option value="large" ${settings.okZone === "large" ? "selected" : ""}>おおきめ</option>
        </select>
      </label>
    </div>
    <div class="settings-actions">
      <button type="button" class="btn btn-secondary" id="btn-toggle-settings">せってい</button>
    </div>
    <div class="big-actions">
      <button type="button" class="btn btn-primary" id="btn-start">はじめる</button>
    </div>
    <p class="footer-hint">Chrome / Edge 推奨 · PCとTD-11をUSB接続し、ブラウザのMIDI許可を出してください。</p>
  `;

  host.querySelectorAll(".preset-card").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = (btn as HTMLElement).dataset.preset!;
      selectedPresetId = id;
      renderPresetScreen();
    });
  });

  const bpmSlider = host.querySelector("#bpm-slider") as HTMLInputElement;
  const bpmValue = host.querySelector("#bpm-value")!;
  bpmSlider.addEventListener("input", () => {
    bpm = Number(bpmSlider.value);
    bpmValue.textContent = String(bpm);
  });

  host.querySelector("#btn-toggle-settings")!.addEventListener("click", () => {
    host.querySelector("#settings-panel")!.classList.toggle("hidden");
  });

  host.querySelector("#btn-start")!.addEventListener("click", async () => {
    const preset = PRESETS.find((p) => p.id === selectedPresetId);
    if (!preset) return;
    await startSession(preset);
  });

  bindSettingsPersistence(host);
}

function bindSettingsPersistence(host: HTMLElement): void {
  const sync = () => {
    const g = (id: string) => host.querySelector(id) as HTMLInputElement | HTMLSelectElement | null;
    settings = {
      midiNotes: {
        kick: Number(g("#set-kick")?.value) || 36,
        snare: Number(g("#set-snare")?.value) || 38,
        hihat: Number(g("#set-hihat")?.value) || 42,
      },
      debounceMs: Number(g("#set-debounce")?.value) || 45,
      okZone: (g("#set-okzone")?.value as AppSettings["okZone"]) || "medium",
    };
    saveSettings(settings);
  };
  ["#set-kick", "#set-snare", "#set-hihat", "#set-debounce", "#set-okzone"].forEach((sel) => {
    host.querySelector(sel)?.addEventListener("change", sync);
  });
}

async function ensureAudio(): Promise<AudioContext> {
  if (!audioCtx) audioCtx = new AudioContext();
  if (audioCtx.state === "suspended") await audioCtx.resume();
  return audioCtx;
}

let midiAccess: MIDIAccess | null = null;

async function wireMidi(): Promise<void> {
  if (midiAccess) return;
  const nav = navigator as Navigator & { requestMIDIAccess?: (opts?: object) => Promise<MIDIAccess> };
  if (!nav.requestMIDIAccess) {
    const status = document.getElementById("midi-status");
    if (status) {
      status.textContent = "MIDI: このブラウザは未対応";
      status.className = "warn";
    }
    return;
  }
  try {
    const access = await nav.requestMIDIAccess({ sysex: false });
    midiAccess = access;
    const bindInputs = () => {
      midiOk = [...access.inputs.values()].length > 0;
      updateMidiStatusUi();
      for (const input of access.inputs.values()) {
        input.onmidimessage = onMidiMessage;
      }
    };
    bindInputs();
    access.onstatechange = () => bindInputs();
  } catch {
    midiOk = false;
    const status = document.getElementById("midi-status");
    if (status) {
      status.textContent = "MIDI: 許可が必要か、接続を確認してください";
      status.className = "warn";
    }
  }
}

function updateMidiStatusUi(): void {
  const status = document.getElementById("midi-status");
  if (!status) return;
  status.textContent = midiOk ? "MIDI: 利用可能" : "MIDI: 未接続または許可待ち";
  status.className = midiOk ? "ok" : "warn";
}

function onMidiMessage(ev: MIDIMessageEvent): void {
  if (!sessionPreset || !audioCtx) return;
  const data = ev.data;
  if (!data || data.length < 3) return;
  const status = data[0]!;
  const note = data[1]!;
  const vel = data[2]!;
  const chNoteOn = 0x90;
  if (status < chNoteOn || status > chNoteOn + 15) return;
  if (vel === 0) return;

  const hitTime = audioCtx.currentTime;
  if (hitTime < sessionStartSec || hitTime >= sessionEndSec) return;

  const role = noteToRole(note, settings);
  if (!role || !sessionPreset.activeRoles.includes(role)) return;

  const debounceSec = settings.debounceMs / 1000;
  const prev = lastHitAudioTime[role];
  if (prev !== undefined && hitTime - prev < debounceSec) return;

  const near = nearestExpectedTarget(hitTime, sessionStartSec, bpm, sessionPreset.pattern, role);
  if (!near) return;

  const okw = okHalfWindowSec(bpm, okZoneToSixteenthWidth(settings.okZone));
  const cls = classifyDelta(near.deltaSec, okw);
  const beatInBar = mod(Math.floor(near.targetQuarterIndex), 4);
  sessionHits.push({ deltaSec: near.deltaSec, cls, beatInBar });
  lastHitAudioTime[role] = hitTime;
  laneHitMarks.push({ at: hitTime, deltaSec: near.deltaSec, cls });
}

async function startSession(preset: Preset): Promise<void> {
  const ctx = await ensureAudio();
  if (!metronome) metronome = new Metronome(ctx);

  sessionPreset = preset;
  sessionHits = [];
  laneHitMarks = [];
  lastHitAudioTime = {};

  const beatDur = beatDurationSec(bpm);
  sessionBeatDur = beatDur;
  const prep = 0.15;
  sessionFirstClickSec = ctx.currentTime + prep;
  sessionStartSec = sessionFirstClickSec + COUNT_IN_BEATS * beatDur;
  sessionEndSec = sessionStartSec + SESSION_SEC;
  const lastClick = sessionEndSec + beatDur * 2;

  metronome.start(sessionFirstClickSec, bpm, lastClick);

  renderSessionScreen(preset);
  showScreen("session");
  startLaneLoop();
}

function stopSessionEarly(): void {
  if (rafId) cancelAnimationFrame(rafId);
  rafId = 0;
  metronome?.stop();
  if (audioCtx && sessionEndSec > audioCtx.currentTime) {
    sessionEndSec = audioCtx.currentTime;
  }
  finishSession();
}

function finishSession(): void {
  if (rafId) cancelAnimationFrame(rafId);
  rafId = 0;
  metronome?.stop();
  const preset = sessionPreset;
  const sum = aggregateSession(sessionHits);
  sessionPreset = null;
  renderSummaryScreen(preset, sum);
  showScreen("summary");
}

function renderSessionScreen(preset: Preset): void {
  const host = document.getElementById("screen-session")!;
  const roles = preset.activeRoles
    .map((r) => `<span class="pad-chip">${r === "kick" ? "キック" : r === "snare" ? "スネア" : "ハイハット"}：ON</span>`)
    .join("");
  host.innerHTML = `
    <div class="top-bar">
      <div class="brand"><span class="brand-dot"></span> リズムレーン</div>
      <div class="note-pill">課題：${preset.name}</div>
    </div>
    <div class="session-hud">
      <div class="hud-block"><h3>のこりじかん</h3><div class="big" id="hud-remain">—</div></div>
      <div class="hud-block"><h3>テンポ</h3><div class="big">${bpm}</div></div>
      <div class="hud-block">
        <h3>かんばん</h3>
        <div class="legend">
          <span><i class="swatch early"></i> ちょい早い</span>
          <span><i class="swatch ok"></i> OK</span>
          <span><i class="swatch late"></i> ちょいおくれ</span>
        </div>
      </div>
    </div>
    <div class="lane-wrap" id="lane-wrap">
      <div class="lane-grid"></div>
      <div class="center-line"></div>
      <div id="lane-beats"></div>
      <div id="lane-hits"></div>
    </div>
    <div class="pad-hint">${roles}</div>
    <div class="big-actions">
      <button type="button" class="btn btn-secondary" id="btn-stop-session">とめる</button>
      <button type="button" class="btn btn-primary" id="btn-session-wait" disabled>れんしゅうちゅう…</button>
    </div>
  `;
  host.querySelector("#btn-stop-session")!.addEventListener("click", () => stopSessionEarly());
}

function startLaneLoop(): void {
  const laneBeats = document.getElementById("lane-beats")!;
  const laneHits = document.getElementById("lane-hits")!;
  const hudRemain = document.getElementById("hud-remain")!;
  const wrap = document.getElementById("lane-wrap")!;

  const tick = () => {
    if (!audioCtx || !sessionPreset) return;
    const now = audioCtx.currentTime;
    const remain = Math.max(0, sessionEndSec - now);
    const m = Math.floor(remain / 60);
    const s = Math.floor(remain % 60);
    hudRemain.textContent = `${m}:${String(s).padStart(2, "0")}`;

    if (now >= sessionEndSec) {
      finishSession();
      return;
    }

    const w = wrap.clientWidth || 800;
    const cx = w / 2;
    laneBeats.replaceChildren();
    const b0 = Math.floor((now - sessionStartSec) / sessionBeatDur) - 1;
    for (let i = 0; i < 10; i++) {
      const b = b0 + i;
      const tBeat = sessionStartSec + b * sessionBeatDur;
      const x = cx + (tBeat - now) * PX_PER_SEC;
      if (x < -20 || x > w + 20) continue;
      const dot = el<HTMLDivElement>(`<div class="beat-dot"></div>`);
      dot.style.left = `${x}px`;
      laneBeats.appendChild(dot);
    }

    laneHits.replaceChildren();
    const cutoff = now - LANE_HIT_TTL;
    laneHitMarks = laneHitMarks.filter((h) => h.at > cutoff);
    for (const h of laneHitMarks) {
      const x = cx + h.deltaSec * PX_PER_SEC;
      const dot = el<HTMLDivElement>(`<div class="hit-dot ${h.cls}"></div>`);
      dot.style.left = `${Math.max(24, Math.min(w - 24, x))}px`;
      laneHits.appendChild(dot);
    }

    rafId = requestAnimationFrame(tick);
  };
  rafId = requestAnimationFrame(tick);
}

function renderSummaryScreen(preset: Preset | null, sum: ReturnType<typeof aggregateSession>): void {
  const host = document.getElementById("screen-summary")!;
  const maxH = Math.max(sum.early, sum.ok, sum.late, 1);
  const hEarly = Math.round((sum.early / maxH) * 100);
  const hOk = Math.round((sum.ok / maxH) * 100);
  const hLate = Math.round((sum.late / maxH) * 100);
  const accent =
    sum.meanDeltaMs < -4 ? "color:var(--early)" : sum.meanDeltaMs > 4 ? "color:var(--late)" : "";
  const meanStyle = accent ? ` style="${accent}"` : "";

  const hints = sum.hints.map((h) => `<li>${h}</li>`).join("");
  const hintBlock = hints ? `<ul class="bullet-list">${hints}</ul>` : "";

  host.innerHTML = `
    <div class="top-bar">
      <div class="brand"><span class="brand-dot"></span> リズムレーン</div>
      <div class="note-pill">${preset ? `課題：${preset.name}` : ""} · ヒット数 ${sum.total}</div>
    </div>
    <h2 style="margin:0 0 14px;font-size:20px">おつかれさま！ きょうのけっか</h2>
    <div class="summary-grid">
      <div class="summary-card">
        <h3>ズレのばらつき</h3>
        <div class="bars">
          <div class="bar early" style="height:${hEarly}%"><span>早い</span></div>
          <div class="bar ok" style="height:${hOk}%"><span>OK</span></div>
          <div class="bar late" style="height:${hLate}%"><span>おくれ</span></div>
        </div>
        <p class="quote">${sum.headline}</p>
        <p class="subquote">${sum.detail}</p>
        <p class="subquote">平均ズレの感じ：<span${meanStyle}>約 ${sum.meanDeltaMs.toFixed(1)} ms（マイナスが早い）</span></p>
        ${hintBlock}
      </div>
      <div class="summary-card">
        <h3>きょうのかたち</h3>
        <div class="shape-art"><div class="shape-trail"></div></div>
        <p class="subquote" style="margin-top:12px">分布イメージ（本番では形を少しずつ変えられます）</p>
      </div>
    </div>
    <div class="big-actions">
      <button type="button" class="btn btn-primary" id="btn-again">もういちど</button>
      <button type="button" class="btn btn-secondary" id="btn-other">べつの課題</button>
    </div>
  `;
  host.querySelector("#btn-again")!.addEventListener("click", () => {
    const preset = PRESETS.find((p) => p.id === selectedPresetId);
    if (preset) void startSession(preset);
  });
  host.querySelector("#btn-other")!.addEventListener("click", () => {
    renderPresetScreen();
    showScreen("presets");
  });
}

mountApp();
