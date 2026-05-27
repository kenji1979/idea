(function () {
  "use strict";

  /** 1弦から4弦（画面上は上から下）＝ G D A E */
  const STRINGS = [
    { name: "G", midiOpen: 43 },
    { name: "D", midiOpen: 38 },
    { name: "A", midiOpen: 33 },
    { name: "E", midiOpen: 28 },
  ];

  const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

  const SCALES = {
    major: {
      label: "メジャー（イオニアン）",
      intervals: [0, 2, 4, 5, 7, 9, 11],
    },
    natural_minor: {
      label: "ナチュラル・マイナー（エオリアン）",
      intervals: [0, 2, 3, 5, 7, 8, 10],
    },
    major_pent: {
      label: "メジャー・ペンタトニック",
      intervals: [0, 2, 4, 7, 9],
    },
    minor_pent: {
      label: "マイナー・ペンタトニック",
      intervals: [0, 3, 5, 7, 10],
    },
    blues: {
      label: "ブルース（マイナー・ペンタ＋ブルーノート）",
      intervals: [0, 3, 5, 6, 7, 10],
    },
    dorian: {
      label: "ドリアン",
      intervals: [0, 2, 3, 5, 7, 9, 10],
    },
    mixolydian: {
      label: "ミクソリディアン",
      intervals: [0, 2, 4, 5, 7, 9, 10],
    },
  };

  const DEGREE_NAMES = ["1", "2", "3", "4", "5", "6", "7"];

  const rootSelect = document.getElementById("root-select");
  const scaleSelect = document.getElementById("scale-select");
  const showDegrees = document.getElementById("show-degrees");
  const showAllNotes = document.getElementById("show-all-notes");
  const clearBtn = document.getElementById("clear-selection");
  const fretboardEl = document.getElementById("fretboard");
  const legendEl = document.getElementById("degree-legend");

  let audioCtx = null;
  let selectedCell = null;

  function noteNameFromPitchClass(pc) {
    const i = ((pc % 12) + 12) % 12;
    return NOTE_NAMES[i];
  }

  function pitchClassFromName(name) {
    const idx = NOTE_NAMES.indexOf(name);
    if (idx === -1) return 0;
    return idx;
  }

  function initSelects() {
    NOTE_NAMES.forEach((n) => {
      const opt = document.createElement("option");
      opt.value = n;
      opt.textContent = n;
      rootSelect.appendChild(opt);
    });
    rootSelect.value = "A";

    Object.keys(SCALES).forEach((key) => {
      const opt = document.createElement("option");
      opt.value = key;
      opt.textContent = SCALES[key].label;
      scaleSelect.appendChild(opt);
    });
    scaleSelect.value = "minor_pent";
  }

  function getScalePitchClasses(rootName, scaleKey) {
    const root = pitchClassFromName(rootName);
    const intervals = SCALES[scaleKey].intervals;
    return intervals.map((i) => (root + i) % 12);
  }

  /** ルートから何度か（1-based index in scale degrees） */
  function degreeForPitchClass(rootName, scaleKey, pc) {
    const root = pitchClassFromName(rootName);
    const intervals = SCALES[scaleKey].intervals;
    const rel = (pc - root + 12) % 12;
    const idx = intervals.indexOf(rel);
    if (idx === -1) return null;
    return idx + 1;
  }

  function buildLegend() {
    legendEl.innerHTML = "";
    const root = rootSelect.value;
    const scaleKey = scaleSelect.value;
    const intervals = SCALES[scaleKey].intervals;
    intervals.forEach((_, i) => {
      const deg = i + 1;
      const span = document.createElement("span");
      const sw = document.createElement("span");
      sw.className = "swatch deg-" + deg;
      sw.style.background = "var(--degree-" + Math.min(deg, 7) + ")";
      span.appendChild(sw);
      span.appendChild(
        document.createTextNode(
          deg + "度（" + (DEGREE_NAMES[i] || String(deg)) + "） — " + describeDegree(root, scaleKey, deg)
        )
      );
      legendEl.appendChild(span);
    });
  }

  function describeDegree(root, scaleKey, deg) {
    const intervals = SCALES[scaleKey].intervals;
    const semis = intervals[deg - 1];
    const name = noteNameFromPitchClass(pitchClassFromName(root) + semis);
    return name;
  }

  function renderFretboard() {
    const root = rootSelect.value;
    const scaleKey = scaleSelect.value;
    const scalePCs = new Set(getScalePitchClasses(root, scaleKey));
    const maxFret = 12;

    fretboardEl.innerHTML = "";

    const headerRow = document.createElement("div");
    headerRow.className = "fretboard-header";

    const corner = document.createElement("div");
    corner.className = "corner";
    corner.setAttribute("aria-hidden", "true");
    headerRow.appendChild(corner);

    for (let f = 0; f <= maxFret; f++) {
      const fl = document.createElement("div");
      fl.className = "fret-label" + (f === 0 ? " is-nut" : "");
      fl.textContent = f === 0 ? "開" : String(f);
      fl.setAttribute("aria-hidden", "true");
      headerRow.appendChild(fl);
    }
    fretboardEl.appendChild(headerRow);

    STRINGS.forEach((s, si) => {
      const lab = document.createElement("div");
      lab.className = "string-label";
      lab.textContent = s.name;
      lab.setAttribute("aria-hidden", "true");
      fretboardEl.appendChild(lab);

      for (let f = 0; f <= maxFret; f++) {
        const midi = s.midiOpen + f;
        const pc = midi % 12;
        const name = noteNameFromPitchClass(pc);
        const inScale = scalePCs.has(pc);
        const deg = inScale ? degreeForPitchClass(root, scaleKey, pc) : null;
        const isRoot = pc === pitchClassFromName(root);

        const cell = document.createElement("button");
        cell.type = "button";
        cell.className = "fret-cell";
        cell.setAttribute("role", "gridcell");
        cell.setAttribute(
          "aria-label",
          s.name + "弦 " + (f === 0 ? "オープン" : f + "フレット") + " " + name + (inScale ? " スケール内" : "")
        );

        if (inScale) {
          cell.classList.add("in-scale");
          if (deg) cell.classList.add("deg-" + deg);
        }
        if (isRoot) cell.classList.add("is-root");

        const showNote = showAllNotes.checked || inScale;
        if (showNote) {
          const nn = document.createElement("span");
          nn.className = "note-name";
          nn.textContent = name;
          cell.appendChild(nn);
        } else {
          cell.classList.add("note-hidden");
        }

        if (showDegrees.checked && inScale && deg) {
          const d = document.createElement("span");
          d.className = "degree";
          d.textContent = DEGREE_NAMES[deg - 1] || String(deg);
          cell.appendChild(d);
        }

        cell.dataset.midi = String(midi);
        cell.addEventListener("click", onCellClick);

        fretboardEl.appendChild(cell);
      }
    });

    buildLegend();
  }

  function onCellClick(e) {
    const cell = e.currentTarget;
    if (selectedCell) selectedCell.classList.remove("selected");
    selectedCell = cell;
    cell.classList.add("selected");
    playMidi(parseInt(cell.dataset.midi, 10));
  }

  function ensureAudio() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }
  }

  function playMidi(midi) {
    ensureAudio();
    const t0 = audioCtx.currentTime + 0.02;
    const freq = 440 * Math.pow(2, (midi - 69) / 12);
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, t0);
    gain.gain.setValueAtTime(0.12, t0);
    gain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.35);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(t0);
    osc.stop(t0 + 0.4);
  }

  clearBtn.addEventListener("click", () => {
    if (selectedCell) {
      selectedCell.classList.remove("selected");
      selectedCell = null;
    }
  });

  rootSelect.addEventListener("change", renderFretboard);
  scaleSelect.addEventListener("change", renderFretboard);
  showDegrees.addEventListener("change", renderFretboard);
  showAllNotes.addEventListener("change", renderFretboard);

  /**
   * 練習メニューから指板の表示を合わせる（存在しない値は無視）
   * @param {{ root?: string, scale?: string, showDegrees?: boolean, showAllNotes?: boolean }} opts
   */
  function applyFretboardSettings(opts) {
    if (!opts || typeof opts !== "object") return;
    if (opts.root && NOTE_NAMES.indexOf(opts.root) !== -1) {
      rootSelect.value = opts.root;
    }
    if (opts.scale && SCALES[opts.scale]) {
      scaleSelect.value = opts.scale;
    }
    if (typeof opts.showDegrees === "boolean") {
      showDegrees.checked = opts.showDegrees;
    }
    if (typeof opts.showAllNotes === "boolean") {
      showAllNotes.checked = opts.showAllNotes;
    }
    renderFretboard();
  }

  window.BassLab = {
    applyFretboardSettings,
    scrollToFretboard() {
      var el = document.getElementById("fret-title");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    scrollToControls() {
      var el = document.getElementById("controls-title");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    },
  };

  initSelects();
  renderFretboard();
})();
