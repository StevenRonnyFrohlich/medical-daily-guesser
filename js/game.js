(function () {
  const EPOCH = Date.UTC(2026, 7, 13);
  const STORAGE_KEY = "wit-microscope-med-v5";
  const DAILY_COUNT = (window.GAME_CONFIG && window.GAME_CONFIG.dailyCount) || 6;
  const SHARE_URL = (window.GAME_CONFIG && window.GAME_CONFIG.shareUrl) || "";
  const MODES = {
    morphology: {
      id: "morphology",
      label: "Human morphology",
      blurb: "Liver, skin, muscle, nerves, squamous sheets, and normal blood cells."
    },
    organisms: {
      id: "organisms",
      label: "Parasites & organisms",
      blurb: "Malaria, worms, bacteria, fungi, and the rest of the menagerie."
    },
    abnormal: {
      id: "abnormal",
      label: "Abnormal morphology",
      blurb: "Sickle cells, leukemias, schistocytes of TTP, and other disease shapes."
    },
    cytology: {
      id: "cytology",
      label: "Cytology",
      blurb: "Pap smears: koilocytes, HSIL, clue cells, herpes, and the rest of the tray."
    }
  };

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

  function modeRecord(state, modeId) {
    state.modes = state.modes || {};
    if (!state.modes[modeId]) state.modes[modeId] = { streak: 0, best: 0 };
    return state.modes[modeId];
  }

  function specimenFiles(specimen) {
    if (Array.isArray(specimen.files) && specimen.files.length) return specimen.files;
    return specimen.file ? [specimen.file] : [];
  }

  function withField(specimen, seed) {
    const files = specimenFiles(specimen);
    const file = files.length
      ? files[hash32(`${seed}|${specimen.id}|field`) % files.length]
      : specimen.file;
    return Object.assign({}, specimen, { file });
  }

  function pickSet(seed, count, selected) {
    const rng = mulberry32(hash32(seed));
    const pool = window.SPECIMENS.filter((item) => item.track === selected.id);
    const byCat = {};
    pool.forEach((item) => {
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
          picked.push(withField(next, seed));
          used.add(next.id);
          added = true;
        }
      });
      if (!added) break;
    }
    return shuffle(picked, rng);
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[char]));
  }

  function choiceMarkup(label) {
    const match = String(label).match(/^(.*) \((.+)\)$/);
    if (!match) return escapeHtml(label);
    return `${escapeHtml(match[1])} <em>(${escapeHtml(match[2])})</em>`;
  }

  function wbcChart(activeId) {
    const rows = [
      { id: "neutrophil", label: "Neutrophils", range: "40–70%" },
      { id: "lymphocyte", label: "Lymphocytes", range: "20–40%" },
      { id: "monocyte", label: "Monocytes", range: "2–8%" },
      { id: "eosinophil", label: "Eosinophils", range: "1–4%" },
      { id: "basophil", label: "Basophils", range: "0–1%" }
    ];
    const widths = { neutrophil: 86, lymphocyte: 48, monocyte: 14, eosinophil: 10, basophil: 6 };
    const bars = rows
      .map((row) => {
        const on = row.id === activeId ? " is-on" : "";
        return `<div class="wbc-row${on}"><span>${row.label}</span><span class="wbc-bar"><i style="width:${widths[row.id]}%"></i></span><span>${row.range}</span></div>`;
      })
      .join("");
    return `<div class="wbc-chart"><p class="wbc-caption">Typical adult white-cell differential</p>${bars}</div>`;
  }

  function infoTable(caption, headers, rows, activeId) {
    const head = headers.map((cell) => `<th>${escapeHtml(cell)}</th>`).join("");
    const body = rows
      .map((row) => {
        const on = row.id === activeId ? " class=\"is-on\"" : "";
        const cells = row.cells.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("");
        return `<tr${on}>${cells}</tr>`;
      })
      .join("");
    return `<div class="wbc-chart"><p class="wbc-caption">${escapeHtml(caption)}</p><table class="info-table"><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>`;
  }

  function malariaChart(activeId) {
    return infoTable(
      "Human malaria on a thin film",
      ["Species", "Red cell", "Signature"],
      [
        { id: "pf-rings", cells: ["P. falciparum", "Normal size", "Rings, crescents"] },
        { id: "pf-gam", cells: ["P. falciparum", "Normal size", "Banana gametocyte"] },
        { id: "p-vivax", cells: ["P. vivax", "Enlarged, Schüffner", "Ameboid trophozoite"] },
        { id: "p-ovale", cells: ["P. ovale", "Oval, fimbriated", "Compact, Schüffner"] },
        { id: "p-malariae", cells: ["P. malariae", "Normal / small", "Band form"] }
      ],
      activeId
    );
  }

  function leukemiaChart(activeId) {
    const myeloid = new Set(["aml", "auer-rod", "cml"]);
    const lymphoid = new Set(["all", "cll"]);
    return infoTable(
      "The four common leukemias",
      ["", "Acute (blasts)", "Chronic (mature)"],
      [
        { id: myeloid.has(activeId) ? activeId : "myeloid", cells: ["Myeloid", "AML — Auer rods", "CML — left shift, basophils"] },
        { id: lymphoid.has(activeId) ? activeId : "lymphoid", cells: ["Lymphoid", "ALL — lymphoblasts", "CLL — smudge cells"] }
      ],
      activeId
    );
  }

  function mahaChart() {
    return infoTable(
      "Broken red cells: the usual plots",
      ["Call", "What is shearing them"],
      [
        { id: "schistocytes", cells: ["TTP", "Platelet microthrombi (ADAMTS13)"] },
        { id: "hus", cells: ["HUS", "Endothelial injury, often Shiga toxin"] },
        { id: "dic", cells: ["DIC", "Fibrin mesh throughout the tree"] },
        { id: "valve", cells: ["Valve / device", "Mechanical shear"] },
        { id: "htn", cells: ["Malignant hypertension", "Torn arterioles"] }
      ],
      "schistocytes"
    );
  }

  function bethesdaChart(activeId) {
    return infoTable(
      "Bethesda: the squamous ladder",
      ["Call", "What you are seeing"],
      [
        { id: "cyto-nilm", cells: ["NILM", "Normal or only reactive squamous"] },
        { id: "cyto-lsil", cells: ["LSIL", "Koilocytes, still-mature cytoplasm"] },
        { id: "cyto-hsil", cells: ["HSIL", "Immature cells, ugly nuclei"] },
        { id: "cyto-scc", cells: ["SCC", "Invasion, often a dirty background"] }
      ],
      activeId
    );
  }

  function glandularChart(activeId) {
    return infoTable(
      "Glandular cells on a Pap",
      ["Call", "Typical look"],
      [
        { id: "cyto-endocx", cells: ["Endocervical", "Honeycomb or picket-fence strip"] },
        { id: "cyto-em", cells: ["Endometrial", "Tight dark three-dimensional balls"] },
        { id: "cyto-adeno", cells: ["Adenocarcinoma", "Nucleoli, feathering, lost order"] }
      ],
      activeId
    );
  }

  function specimenChart(specimen) {
    if (specimen.chart === "wbc") return wbcChart(specimen.id);
    if (specimen.chart === "malaria") return malariaChart(specimen.id);
    if (specimen.chart === "leukemia") return leukemiaChart(specimen.id);
    if (specimen.chart === "maha") return mahaChart();
    if (specimen.chart === "bethesda") return bethesdaChart(specimen.id);
    if (specimen.chart === "glandular") return glandularChart(specimen.id);
    return "";
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

  function shareText(results, number, mode) {
    const marks = results.map((item) => (item && item.correct ? "🟩" : "🟥")).join("");
    const lines = [
      `The Call #${number}`,
      `${mode.label} ${scoreOf(results)}/${DAILY_COUNT}`,
      "",
      marks
    ];
    if (SHARE_URL) lines.push("", SHARE_URL);
    return lines.join("\n");
  }

  const ui = {
    lobby: $("lobby"),
    board: $("board"),
    modes: $("modes"),
    date: $("case-date"),
    accession: $("case-accession"),
    puzzle: $("case-puzzle"),
    stain: $("meta-stain"),
    mag: $("meta-mag"),
    difficulty: $("meta-diff"),
    field: $("meta-field"),
    image: $("specimen-image"),
    ocular: $("ocular"),
    loupe: $("loupe"),
    loupeImage: $("loupe-image"),
    loupeMag: $("loupe-mag"),
    choices: $("choices"),
    reveal: $("reveal"),
    verdict: $("verdict"),
    call: $("reveal-call"),
    sci: $("reveal-sci"),
    blurb: $("blurb"),
    extra: $("reveal-extra"),
    credit: $("credit"),
    streak: $("stat-streak"),
    best: $("stat-best"),
    score: $("stat-score"),
    scoreLabel: $("stat-score-label"),
    share: $("btn-share"),
    next: $("btn-next"),
    toast: $("toast"),
    tray: $("tray"),
    summary: $("summary"),
    summaryScore: $("summary-score"),
    shareGrid: $("share-grid"),
    edition: document.querySelector(".mark em")
  };

  const today = new Date();
  const todayKey = localDate(today);
  const puzzleNo = puzzleNumber(today);
  const params = new URLSearchParams(location.search);
  let state = loadState();
  let mode = null;
  let isLab = false;
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

  function traysDoneToday() {
    return Object.keys(MODES).filter((id) => {
      const record = modeRecord(state, id);
      return record.dayKey === todayKey && Array.isArray(record.progress) && record.progress.every(Boolean);
    }).length;
  }

  function renderLobbyStats() {
    ui.scoreLabel.textContent = "Trays";
    ui.score.textContent = `${traysDoneToday()}/${Object.keys(MODES).length}`;
    ui.streak.textContent = "—";
    ui.best.textContent = "—";
    ui.edition.textContent = "At the scope";
  }

  function renderPlayStats() {
    const record = modeRecord(state, mode.id);
    ui.scoreLabel.textContent = "Today";
    ui.streak.textContent = record.streak || 0;
    ui.best.textContent = record.best || 0;
    ui.score.textContent = `${scoreOf(results)}/${DAILY_COUNT}`;
    ui.edition.textContent = `${mode.label} · At the scope`;
  }

  function trayStatus(modeId) {
    const record = modeRecord(state, modeId);
    if (record.dayKey !== todayKey || !Array.isArray(record.progress)) return "Not started";
    const done = record.progress.filter(Boolean).length;
    if (done === DAILY_COUNT) return `${scoreOf(record.progress)}/${DAILY_COUNT} done`;
    return `${done}/${DAILY_COUNT} in progress`;
  }

  function renderLobby() {
    ui.lobby.hidden = false;
    ui.board.hidden = true;
    mode = null;
    isLab = false;
    renderLobbyStats();
    ui.modes.innerHTML = "";
    Object.values(MODES).forEach((item) => {
      const record = modeRecord(state, item.id);
      const card = document.createElement("article");
      card.className = "mode";
      card.innerHTML = `
        <h2>${item.label}</h2>
        <p>${item.blurb}</p>
        <div class="mode-meta">
          <span>${trayStatus(item.id)}</span>
          <span>Streak ${record.streak || 0}</span>
        </div>
        <div class="mode-actions">
          <button type="button" data-play="${item.id}">Play today</button>
        </div>`;
      ui.modes.appendChild(card);
    });
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

  const loupe = window.initLoupe(ui.ocular, ui.image, ui.loupe, ui.loupeImage, ui.loupeMag);

  function setImage(file) {
    ui.ocular.classList.add("is-loading");
    ui.image.alt = `Microscope field ${index + 1} of ${DAILY_COUNT}`;
    ui.image.onload = () => ui.ocular.classList.remove("is-loading");
    ui.image.onerror = () => {
      ui.ocular.classList.remove("is-loading");
      ui.image.alt = "Image failed to load. Check your network connection.";
    };
    ui.image.src = commonsUrl(file, 1100);
    loupe.setSource(commonsUrl(file, 2000));
  }

  function renderChoices(selected, correctName) {
    ui.choices.innerHTML = "";
    const keys = ["A", "B", "C", "D"];
    choices.forEach((label, choiceIndex) => {
      const button = document.createElement("button");
      button.className = "choice";
      button.type = "button";
      button.innerHTML = `<span class="key">${keys[choiceIndex]}</span><span>${choiceMarkup(label)}</span>`;
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
    ui.call.innerHTML = choiceMarkup(specimen.name);
    ui.sci.textContent = specimen.scientific || "";
    ui.sci.hidden = !specimen.scientific || specimen.scientific === specimen.name;
    ui.blurb.textContent = specimen.blurb;
    const parts = [];
    const chart = specimenChart(specimen);
    if (chart) parts.push(chart);
    if (specimen.about) parts.push(`<p class="reveal-about">${escapeHtml(specimen.about)}</p>`);
    ui.extra.innerHTML = parts.join("");
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
    ui.summaryScore.textContent = `${mode.label} · ${scoreOf(results)} / ${DAILY_COUNT}`;
    ui.shareGrid.textContent = results.map((item) => (item.correct ? "🟩" : "🟥")).join(" ");
    ui.share.hidden = isLab;
    $("btn-share-summary").hidden = isLab;
  }

  function persistDaily() {
    if (isLab || !mode) return;
    const record = modeRecord(state, mode.id);
    const justFinished = finished() && record.lastDate !== todayKey;
    if (justFinished) {
      record.streak = record.lastDate && isYesterday(record.lastDate, todayKey) ? (record.streak || 0) + 1 : 1;
      record.best = Math.max(record.best || 0, record.streak);
      record.lastDate = todayKey;
    }
    record.dayKey = todayKey;
    record.progress = results;
    saveState(state);
    renderPlayStats();
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
    choices = buildChoices(specimen, isLab ? `lab-${mode.id}-${specimen.id}` : `${todayKey}|${mode.id}|${specimen.id}`);
    ui.stain.textContent = specimen.stain;
    ui.mag.textContent = specimen.mag;
    ui.difficulty.textContent = "●".repeat(specimen.difficulty) + "○".repeat(5 - specimen.difficulty);
    ui.field.textContent = `${index + 1} / ${DAILY_COUNT}`;
    setImage(specimen.file);
    renderTray();
    renderPlayStats();
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
    set = pickSet(seed, DAILY_COUNT, mode);
    results = Array(DAILY_COUNT).fill(null);
    ui.date.textContent = label.date;
    ui.accession.textContent = label.accession;
    ui.puzzle.textContent = label.puzzle;
    showField(0);
  }

  function openBoard() {
    ui.lobby.hidden = true;
    ui.board.hidden = false;
  }

  function startDaily(modeId) {
    mode = MODES[modeId];
    isLab = false;
    openBoard();
    const seed = `${todayKey}|wit-micro-med-${mode.id}-v4`;
    startSet(seed, {
      date: formatHumanDate(today),
      accession: `CALL-${mode.id.slice(0, 1).toUpperCase()}${today.getFullYear()}-${pad(today.getMonth() + 1)}${pad(today.getDate())}`,
      puzzle: `#${puzzleNo}`
    });
    const record = modeRecord(state, mode.id);
    if (record.dayKey === todayKey && Array.isArray(record.progress)) {
      results = record.progress.slice(0, DAILY_COUNT);
      while (results.length < DAILY_COUNT) results.push(null);
      showField(firstOpen());
    }
  }

  function startLab(modeId) {
    mode = MODES[modeId];
    isLab = true;
    openBoard();
    startSet(`lab-${mode.id}-${Date.now()}`, {
      date: `${mode.label} lab`,
      accession: `CALL-LAB-${mode.id.slice(0, 1).toUpperCase()}-${pad(Math.floor(Math.random() * 99) + 1)}`,
      puzzle: "practice"
    });
  }

  async function share() {
    const text = shareText(results, puzzleNo, mode);
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

  function openHow() {
    $("modal").classList.add("is-open");
  }

  ui.modes.addEventListener("click", (event) => {
    const play = event.target.closest("[data-play]");
    if (play) startDaily(play.getAttribute("data-play"));
  });

  $("btn-trays").addEventListener("click", renderLobby);
  $("btn-how").addEventListener("click", openHow);
  $("btn-how-lobby").addEventListener("click", openHow);
  $("btn-close-modal").addEventListener("click", () => $("modal").classList.remove("is-open"));
  $("modal").addEventListener("click", (event) => {
    if (event.target.id === "modal") $("modal").classList.remove("is-open");
  });

  ui.ocular.addEventListener("dblclick", () => {
    ui.loupe.hidden = true;
    $("lightbox-image").src = commonsUrl(current().file, 1600);
    $("lightbox").classList.add("is-open");
  });
  $("lightbox").addEventListener("click", () => $("lightbox").classList.remove("is-open"));

  ui.share.addEventListener("click", share);
  $("btn-share-summary").addEventListener("click", share);
  ui.next.addEventListener("click", () => {
    if (isLab && finished()) {
      startLab(mode.id);
      return;
    }
    showField(firstOpen());
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      $("modal").classList.remove("is-open");
      $("lightbox").classList.remove("is-open");
    }
    if (ui.board.hidden) return;
    const map = { 1: 0, 2: 1, 3: 2, 4: 3, a: 0, b: 1, c: 2, d: 3 };
    const choiceIndex = map[event.key];
    if (choiceIndex == null || locked) return;
    const buttons = ui.choices.querySelectorAll(".choice");
    if (buttons[choiceIndex]) buttons[choiceIndex].click();
  });

  const requested = params.get("tray");
  if (requested && MODES[requested]) {
    startDaily(requested);
  } else {
    renderLobby();
  }
})();
