(function () {
  const EPOCH = Date.UTC(2026, 7, 13);
  const STORAGE_KEY = "wit-microscope-med-v1";

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

  function pickDaily(dateKey) {
    const list = window.SPECIMENS;
    const index = hash32(`${dateKey}|wit-micro-med`) % list.length;
    return list[index];
  }

  function pickLab(excludeId) {
    const list = window.SPECIMENS.filter((item) => item.id !== excludeId);
    return list[Math.floor(Math.random() * list.length)];
  }

  function buildChoices(specimen, dateKey) {
    const rng = mulberry32(hash32(`${dateKey}|${specimen.id}|choices`));
    const distractors = specimen.lookalikes.slice();
    for (let i = distractors.length - 1; i > 0; i -= 1) {
      const j = Math.floor(rng() * (i + 1));
      [distractors[i], distractors[j]] = [distractors[j], distractors[i]];
    }
    const options = [specimen.name, ...distractors.slice(0, 3)];
    for (let i = options.length - 1; i > 0; i -= 1) {
      const j = Math.floor(rng() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }
    return options;
  }

  function formatHumanDate(d) {
    return d.toLocaleDateString(undefined, {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  }

  const ui = {
    date: $("case-date"),
    accession: $("case-accession"),
    puzzle: $("case-puzzle"),
    stain: $("meta-stain"),
    mag: $("meta-mag"),
    difficulty: $("meta-diff"),
    image: $("specimen-image"),
    ocular: $("ocular"),
    choices: $("choices"),
    reveal: $("reveal"),
    verdict: $("verdict"),
    blurb: $("blurb"),
    credit: $("credit"),
    streak: $("stat-streak"),
    best: $("stat-best"),
    share: $("btn-share"),
    next: $("btn-next"),
    toast: $("toast")
  };

  const isLab = new URLSearchParams(location.search).get("mode") === "lab";
  const today = new Date();
  const todayKey = localDate(today);
  let state = loadState();
  let current;
  let choices;
  let locked = false;

  function toast(message) {
    ui.toast.textContent = message;
    ui.toast.classList.add("is-on");
    window.setTimeout(() => ui.toast.classList.remove("is-on"), 1600);
  }

  function renderStats() {
    ui.streak.textContent = state.streak || 0;
    ui.best.textContent = state.best || 0;
  }

  function setImage(file) {
    ui.ocular.classList.add("is-loading");
    ui.image.alt = "Microscope field of today's specimen";
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
    choices.forEach((label, index) => {
      const button = document.createElement("button");
      button.className = "choice";
      button.type = "button";
      button.dataset.index = String(index);
      button.innerHTML = `<span class="key">${keys[index]}</span><span>${label}</span>`;
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

  function openReveal(correct, selected) {
    ui.reveal.classList.add("is-open");
    ui.verdict.className = `verdict ${correct ? "good" : "bad"}`;
    ui.verdict.textContent = correct ? "Correct." : "Not that.";
    ui.blurb.textContent = current.blurb;
    ui.credit.innerHTML = `${current.credit}. <a href="${commonsPage(current.file)}" target="_blank" rel="noreferrer">Image source</a>`;
    ui.share.hidden = isLab;
    ui.next.hidden = !isLab;
  }

  function guess(label) {
    if (locked) return;
    locked = true;
    const correct = label === current.name;
    renderChoices(label, current.name);
    openReveal(correct, label);

    if (isLab) return;

    const already = state.lastDate === todayKey;
    if (!already) {
      if (correct) {
        state.streak = (state.lastDate && isYesterday(state.lastDate, todayKey)) ? (state.streak || 0) + 1 : 1;
        state.best = Math.max(state.best || 0, state.streak);
      } else {
        state.streak = 0;
      }
      state.lastDate = todayKey;
      state.lastId = current.id;
      state.lastGuess = label;
      state.lastCorrect = correct;
      saveState(state);
      renderStats();
    }
  }

  function isYesterday(prevKey, nowKey) {
    const [y, m, d] = prevKey.split("-").map(Number);
    const prev = new Date(y, m - 1, d);
    prev.setDate(prev.getDate() + 1);
    return localDate(prev) === nowKey;
  }

  function loadSpecimen(specimen, key) {
    current = specimen;
    choices = buildChoices(specimen, key);
    locked = false;
    ui.reveal.classList.remove("is-open");
    ui.stain.textContent = specimen.stain;
    ui.mag.textContent = specimen.mag;
    ui.difficulty.textContent = "●".repeat(specimen.difficulty) + "○".repeat(5 - specimen.difficulty);
    setImage(specimen.file);
    renderChoices(null, specimen.name);
  }

  function startDaily() {
    const specimen = pickDaily(todayKey);
    ui.date.textContent = formatHumanDate(today);
    ui.accession.textContent = `WIT-${today.getFullYear()}-${pad(today.getMonth() + 1)}${pad(today.getDate())}`;
    ui.puzzle.textContent = `#${puzzleNumber(today)}`;
    loadSpecimen(specimen, todayKey);

    if (state.lastDate === todayKey && state.lastGuess) {
      locked = true;
      renderChoices(state.lastGuess, specimen.name);
      openReveal(state.lastCorrect, state.lastGuess);
    }
  }

  function startLab(fromId) {
    const specimen = pickLab(fromId);
    const key = `lab-${Date.now()}`;
    ui.date.textContent = "Open lab";
    ui.accession.textContent = `WIT-LAB-${pad(Math.floor(Math.random() * 99) + 1)}`;
    ui.puzzle.textContent = "practice";
    loadSpecimen(specimen, key);
  }

  $("btn-how").addEventListener("click", () => $("modal").classList.add("is-open"));
  $("btn-close-modal").addEventListener("click", () => $("modal").classList.remove("is-open"));
  $("modal").addEventListener("click", (event) => {
    if (event.target.id === "modal") $("modal").classList.remove("is-open");
  });

  $("btn-zoom").addEventListener("click", () => {
    $("lightbox-image").src = commonsUrl(current.file, 1600);
    $("lightbox").classList.add("is-open");
  });
  $("lightbox").addEventListener("click", () => $("lightbox").classList.remove("is-open"));

  ui.share.addEventListener("click", async () => {
    const mark = state.lastCorrect ? "correct" : "missed";
    const text = `What is this (microscope) #${puzzleNumber(today)}\n🔬 Medical edition — ${mark}`;
    try {
      await navigator.clipboard.writeText(text);
      toast("Result copied");
    } catch {
      toast("Copy failed");
    }
  });

  ui.next.addEventListener("click", () => startLab(current.id));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      $("modal").classList.remove("is-open");
      $("lightbox").classList.remove("is-open");
    }
    const map = { 1: 0, 2: 1, 3: 2, 4: 3, a: 0, b: 1, c: 2, d: 3 };
    const index = map[event.key];
    if (index == null || locked) return;
    const buttons = ui.choices.querySelectorAll(".choice");
    if (buttons[index]) buttons[index].click();
  });

  const coffee = $("coffee");
  const bmc = window.GAME_CONFIG && window.GAME_CONFIG.buyMeACoffee;
  if (coffee) {
    if (bmc) coffee.href = `https://www.buymeacoffee.com/${bmc}`;
    else coffee.hidden = true;
  }

  renderStats();
  if (isLab) startLab();
  else startDaily();
})();
