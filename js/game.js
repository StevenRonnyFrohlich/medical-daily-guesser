(function () {
  const EPOCH = Date.UTC(2026, 7, 13);
  const STORAGE_KEY = "wit-microscope-med-v2";
  const DAILY_COUNT = (window.GAME_CONFIG && window.GAME_CONFIG.dailyCount) || 6;
  const SHARE_URL = (window.GAME_CONFIG && window.GAME_CONFIG.shareUrl) || "";

  const $ = (id) => document.getElementById(id);

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function localDate(d) {
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }

  function puzzleNumber(d) {
    const utc = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
    return Math.floor((utc - EPOCH) / 86400000) + 1;
  }

  function hash32(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i += 1) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function mulberry32(seed) {
    let a = seed;
    return function rng() {
      a += 0x6d2b79f5;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function shuffle(list, rng) {
    const copy = list.slice();
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(rng() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function commonsUrl(file, width) {
    return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=${width}`;
  }

  function commonsPage(file) {
    return `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file.replace(/ /g, "_"))}`;
  }

  function loadState() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch {
      return {};
    }
  }

  function saveState(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function pickSet(seed, count) {
    const rng = mulberry32(hash32(seed));
    const byCat = {};
    window.SPECIMENS.forEach((item) => {
      (byCat[item.category] || (byCat[item.category] = [])).push(item);
    });
    Object.keys(byCat).forEach((cat) => {
      byCat[cat] = shuffle(byCat[cat], rng);
    });
    const cats = shuffle(Object.keys(byCat), rng);
    const picked = [];
    const used = new Set();
    while (picked.length < count) {
      let added = false;
      cats.forEach((cat) => {
        if (picked.length >= count) return;
        const next = byCat[cat].find((item) => !used.has(item.id));
        if (next) {
          picked.push(next);
          used.add(next.id);
          added = true;
        }
      });
      if (!added) break;
    }
    return shuffle(picked, rng);
  }

  function buildChoices(specimen, seed) {
    const rng = mulberry32(hash32(`${seed}|${specimen.id}|choices`));
    const options = [specimen.name, ...shuffle(specimen.lookalikes, rng).slice(0, 3)];
    return shuffle(options, rng);
  }

  function formatHumanDate(d) {
    return d.toLocaleDateString(undefined, {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  }

  function isYesterday(prevKey, nowKey) {
    const [y, m, d] = prevKey.split("-").map(Number);
    const prev = new Date(y, m - 1, d);
    prev.setDate(prev.getDate() + 1);
    return localDate(prev) === nowKey;
  }

  function scoreOf(results) {
    return results.filter((item) => item && item.correct).length;
  }

  function shareText(results, number) {
    const marks = results.map((item) => (item && item.correct ? "🟩" : "🟥")).join("");
    const lines = [
      `What is this (microscope) #${number}`,
      `${scoreOf(results)}/${DAILY_COUNT}`,
      "",
      marks
    ];
    if (SHARE_URL) lines.push("", SHARE_URL);
    return lines.join("\n");
  }

  const ui = {
    date: $("case-date"),
    accession: $("case-accession"),
    puzzle: $("case-puzzle"),
    stain: $("meta-stain"),
    mag: $("meta-mag"),
    difficulty: $("meta-diff"),
    field: $("meta-field"),
    image: $("specimen-image"),
    ocular: $("ocular"),
    choices: $("choices"),
    reveal: $("reveal"),
    verdict: $("verdict"),
    blurb: $("blurb"),
    credit: $("credit"),
    streak: $("stat-streak"),
    best: $("stat-best"),
    score: $("stat-score"),
    share: $("btn-share"),
    next: $("btn-next"),
    toast: $("toast"),
    tray: $("tray"),
    summary: $("summary"),
    summaryScore: $("summary-score"),
    shareGrid: $("share-grid")
  };

  const isLab = new URLSearchParams(location.search).get("mode") === "lab";
  const today = new Date();
  const todayKey = localDate(today);
  const puzzleNo = puzzleNumber(today);
  let state = loadState();
  let set = [];
  let results = Array(DAILY_COUNT).fill(null);
  let index = 0;
  let choices = [];
  let locked = false;

  function toast(message) {
    ui.toast.textContent = message;
    ui.toast.classList.add("is-on");
    window.setTimeout(() => ui.toast.classList.remove("is-on"), 1600);
  }

  function current() {
    return set[index];
  }

  function finished() {
    return results.every(Boolean);
  }

  function renderStats() {
    ui.streak.textContent = state.streak || 0;
    ui.best.textContent = state.best || 0;
    ui.score.textContent = `${scoreOf(results)}/${DAILY_COUNT}`;
  }

  function renderTray() {
    ui.tray.innerHTML = "";
    for (let i = 0; i < DAILY_COUNT; i += 1) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "box";
      button.setAttribute("aria-label", `Field ${i + 1}`);
      if (results[i]) button.classList.add(results[i].correct ? "is-right" : "is-wrong");
      else button.classList.add("is-empty");
      if (i === index) button.classList.add("is-current");
      button.addEventListener("click", () => {
        if (!results[i] && i !== firstOpen()) return;
        showField(i);
      });
      ui.tray.appendChild(button);
    }
  }

  function firstOpen() {
    const open = results.findIndex((item) => !item);
    return open === -1 ? DAILY_COUNT - 1 : open;
  }

  function setImage(file) {
    ui.ocular.classList.add("is-loading");
    ui.image.alt = `Microscope field ${index + 1} of ${DAILY_COUNT}`;
    ui.image.onload = () => ui.ocular.classList.remove("is-loading");
    ui.image.onerror = () => {
      ui.ocular.classList.remove("is-loading");
      ui.image.alt = "Image failed to load. Check your network connection.";
    };
    ui.image.src = commonsUrl(file, 1100);
  }

  function renderChoices(selected, correctName) {
    ui.choices.innerHTML = "";
    const keys = ["A", "B", "C", "D"];
    choices.forEach((label, choiceIndex) => {
      const button = document.createElement("button");
      button.className = "choice";
      button.type = "button";
      button.innerHTML = `<span class="key">${keys[choiceIndex]}</span><span>${label}</span>`;
      if (locked) {
        button.disabled = true;
        if (label === correctName) button.classList.add(selected === label ? "is-right" : "is-missed");
        if (selected === label && selected !== correctName) button.classList.add("is-wrong");
      } else {
        button.addEventListener("click", () => guess(label));
      }
      ui.choices.appendChild(button);
    });
  }

  function openReveal(correct) {
    const specimen = current();
    ui.reveal.classList.add("is-open");
    ui.verdict.className = `verdict ${correct ? "good" : "bad"}`;
    ui.verdict.textContent = correct ? "Correct." : "Not that.";
    ui.blurb.textContent = specimen.blurb;
    ui.credit.innerHTML = `${specimen.credit}. <a href="${commonsPage(specimen.file)}" target="_blank" rel="noreferrer">Image source</a>`;
    if (finished()) {
      ui.next.hidden = !isLab;
      ui.next.textContent = "New tray";
      ui.share.hidden = isLab;
      openSummary();
    } else {
      ui.next.hidden = !results[index];
      ui.next.textContent = "Next field";
      ui.share.hidden = true;
      ui.summary.classList.remove("is-open");
    }
  }

  function openSummary() {
    ui.summary.classList.add("is-open");
    ui.summaryScore.textContent = `${scoreOf(results)} / ${DAILY_COUNT}`;
    ui.shareGrid.textContent = results.map((item) => (item.correct ? "🟩" : "🟥")).join(" ");
    ui.share.hidden = isLab;
    $("btn-share-summary").hidden = isLab;
  }

  function persistDaily() {
    if (isLab) return;
    const justFinished = finished() && state.lastDate !== todayKey;
    if (justFinished) {
      state.streak = state.lastDate && isYesterday(state.lastDate, todayKey) ? (state.streak || 0) + 1 : 1;
      state.best = Math.max(state.best || 0, state.streak);
      state.lastDate = todayKey;
    }
    state.dayKey = todayKey;
    state.progress = results;
    saveState(state);
    renderStats();
  }

  function guess(label) {
    if (locked) return;
    locked = true;
    const specimen = current();
    const correct = label === specimen.name;
    results[index] = { id: specimen.id, guess: label, correct };
    renderChoices(label, specimen.name);
    renderTray();
    openReveal(correct);
    persistDaily();
  }

  function showField(nextIndex) {
    index = nextIndex;
    const specimen = current();
    const answered = results[index];
    locked = Boolean(answered);
    choices = buildChoices(specimen, isLab ? `lab-${specimen.id}` : `${todayKey}|${specimen.id}`);
    ui.stain.textContent = specimen.stain;
    ui.mag.textContent = specimen.mag;
    ui.difficulty.textContent = "●".repeat(specimen.difficulty) + "○".repeat(5 - specimen.difficulty);
    ui.field.textContent = `${index + 1} / ${DAILY_COUNT}`;
    setImage(specimen.file);
    renderTray();
    renderStats();
    if (answered) {
      renderChoices(answered.guess, specimen.name);
      openReveal(answered.correct);
    } else {
      ui.reveal.classList.remove("is-open");
      ui.summary.classList.remove("is-open");
      ui.share.hidden = true;
      ui.next.hidden = true;
      renderChoices(null, specimen.name);
    }
  }

  function startSet(seed, label) {
    set = pickSet(seed, DAILY_COUNT);
    results = Array(DAILY_COUNT).fill(null);
    ui.date.textContent = label.date;
    ui.accession.textContent = label.accession;
    ui.puzzle.textContent = label.puzzle;
    showField(0);
  }

  function startDaily() {
    const seed = `${todayKey}|wit-micro-med-six-v2`;
    startSet(seed, {
      date: formatHumanDate(today),
      accession: `WIT-${today.getFullYear()}-${pad(today.getMonth() + 1)}${pad(today.getDate())}`,
      puzzle: `#${puzzleNo}`
    });

    if (state.dayKey === todayKey && Array.isArray(state.progress)) {
      results = state.progress.slice(0, DAILY_COUNT);
      while (results.length < DAILY_COUNT) results.push(null);
      showField(firstOpen());
    }
  }

  function startLab() {
    startSet(`lab-${Date.now()}`, {
      date: "Open lab",
      accession: `WIT-LAB-${pad(Math.floor(Math.random() * 99) + 1)}`,
      puzzle: "practice"
    });
  }

  async function share() {
    const text = shareText(results, puzzleNo);
    if (navigator.share) {
      try {
        await navigator.share({ text });
        return;
      } catch (error) {
        if (error && error.name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(text);
      toast("Result copied");
    } catch {
      toast("Copy failed");
    }
  }

  $("btn-how").addEventListener("click", () => $("modal").classList.add("is-open"));
  $("btn-close-modal").addEventListener("click", () => $("modal").classList.remove("is-open"));
  $("modal").addEventListener("click", (event) => {
    if (event.target.id === "modal") $("modal").classList.remove("is-open");
  });

  $("btn-zoom").addEventListener("click", () => {
    $("lightbox-image").src = commonsUrl(current().file, 1600);
    $("lightbox").classList.add("is-open");
  });
  $("lightbox").addEventListener("click", () => $("lightbox").classList.remove("is-open"));

  ui.share.addEventListener("click", share);
  $("btn-share-summary").addEventListener("click", share);
  ui.next.addEventListener("click", () => {
    if (isLab && finished()) {
      startLab();
      return;
    }
    showField(firstOpen());
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      $("modal").classList.remove("is-open");
      $("lightbox").classList.remove("is-open");
    }
    const map = { 1: 0, 2: 1, 3: 2, 4: 3, a: 0, b: 1, c: 2, d: 3 };
    const choiceIndex = map[event.key];
    if (choiceIndex == null || locked) return;
    const buttons = ui.choices.querySelectorAll(".choice");
    if (buttons[choiceIndex]) buttons[choiceIndex].click();
  });

  const coffee = $("coffee");
  const bmc = window.GAME_CONFIG && window.GAME_CONFIG.buyMeACoffee;
  if (coffee) {
    if (bmc) coffee.href = `https://www.buymeacoffee.com/${bmc}`;
    else coffee.hidden = true;
  }

  if (isLab) startLab();
  else startDaily();
})();
