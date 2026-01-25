console.log("script loaded");

const yearEl = document.querySelector("#year");
if (yearEl) yearEl.textContent = new Date().getFullYear();


// Theme
const button = document.querySelector("#toggle-theme");
const savedTheme = localStorage.getItem("alex-theme");

if (savedTheme === "night") {
  document.body.classList.add("night");
  if (button) button.textContent = "Day";
} else {
  if (button) button.textContent = "Night";
}

if (button) {
  button.addEventListener("click", () => {
    const isNight = document.body.classList.toggle("night");
    button.textContent = isNight ? "Day" : "Night";
    localStorage.setItem("alex-theme", isNight ? "night" : "day");
  });
}

const countEl = document.querySelector("#search-count");

// Projekte
const projects = [
  {
    title: "Film-Metadaten Checker",
    desc: "Produktionsjahr, Cast, Titel, Herkunft, Sprachen prüfen",
    url: "https://github.com/",
    cta: "Demo",
    tags: ["JS", "Data", "QA"],
  },
  {
    title: "Projekt 2",
    desc: "Kurzbeschreibung folgt.",
    url: "https://github.com/",
    cta: "GitHub",
    tags: ["JS"],
  },
{
  title: "Portfolio Seite",
  desc: "Meine erste responsive Seite mit Night Mode.",
  url: "https://silentcity86.github.io/portfolio-01/",
  cta: "Live",
  tags: ["HTML", "CSS", "JS"],
},

];

const list = document.querySelector("#project-list");
const searchInput = document.querySelector("#project-search");

function renderProjects(items) {
  if (!list) return;

  if (countEl) countEl.textContent = `${items.length} Treffer`;

  list.replaceChildren();

  if (items.length === 0) {
    const li = document.createElement("li");
    li.className = "project-card";
    li.textContent = "Keine Projekte gefunden.";
    list.appendChild(li);
    return;
  }

  for (const project of items) {
    const li = document.createElement("li");
    li.className = "project-card";

    const h3 = document.createElement("h3");
    h3.textContent = project.title;

    const p = document.createElement("p");
    p.textContent = project.desc;

    // Tags anzeigen (wenn vorhanden)
if (project.tags && project.tags.length > 0) {
  const tagsWrap = document.createElement("div");
  tagsWrap.className = "tag-list";

  for (const tag of project.tags) {
    const span = document.createElement("span");
    span.className = "tag";
    span.textContent = tag;
    tagsWrap.appendChild(span);
  }

  li.appendChild(tagsWrap);
}


    li.appendChild(h3);
    li.appendChild(p);

    if (project.url) {
      const a = document.createElement("a");
      a.href = project.url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.textContent = project.cta ?? "GitHub Repo";
      li.appendChild(a);
    }

    list.appendChild(li);
  }
}

const filtersEl = document.querySelector("#tag-filters");
let activeTag = "Alle";

function buildTagFilters() {
  if (!filtersEl) return;

  const tagSet = new Set();
  for (const p of projects) {
    for (const t of (p.tags ?? [])) tagSet.add(t);
  }

  const tags = ["Alle", ...Array.from(tagSet).sort()];
  filtersEl.replaceChildren();

  for (const tag of tags) {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = tag;

    if (tag === activeTag) b.classList.add("is-active");

    b.addEventListener("click", () => {
      activeTag = tag;
      buildTagFilters(); // aktive Optik aktualisieren
      applyFilters();    // neu rendern
    });

    filtersEl.appendChild(b);
  }
}

function applyFilters() {
  const q = (searchInput ? searchInput.value : "").toLowerCase().trim();

  const filtered = projects.filter((p) => {
    const hay = (p.title + " " + p.desc + " " + (p.cta ?? "")).toLowerCase();
    const matchesText = hay.includes(q);
    const matchesTag = activeTag === "Alle" || (p.tags ?? []).includes(activeTag);
    return matchesText && matchesTag;
  });

  renderProjects(filtered);
}

// Initial
buildTagFilters();
applyFilters();

// Suche tippen = neu filtern
if (searchInput) {
  searchInput.addEventListener("input", applyFilters);
}

// ESC im Suchfeld: Suche leeren + Filter zurück auf "Alle"
if (searchInput) {
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      searchInput.value = "";
      activeTag = "Alle";
      buildTagFilters();
      applyFilters();
    }
  });
// --- Metadata QA Checker ---
const qaForm = document.querySelector("#qa-form");
const qaResult = document.querySelector("#qa-result");

function setResult(ok, lines) {
  if (!qaResult) return;

  qaResult.innerHTML = "";

  const box = document.createElement("div");
  box.style.padding = "12px 14px";
  box.style.borderRadius = "12px";
  box.style.border = "1px solid";
  box.style.marginTop = "8px";

  if (ok) {
    box.style.background = "rgba(0, 200, 0, 0.08)";
    box.style.borderColor = "rgba(0, 200, 0, 0.35)";
    box.textContent = "✅ OK – sieht vollständig aus.";
  } else {
    box.style.background = "rgba(255, 140, 0, 0.08)";
    box.style.borderColor = "rgba(255, 140, 0, 0.35)";

    const title = document.createElement("div");
    title.style.fontWeight = "700";
    title.textContent = "⚠️ Es fehlt noch etwas:";

    const ul = document.createElement("ul");
    ul.style.margin = "8px 0 0";
    ul.style.paddingLeft = "18px";

    for (const line of lines) {
      const li = document.createElement("li");
      li.textContent = line;
      ul.appendChild(li);
    }

    box.appendChild(title);
    box.appendChild(ul);
  }

  qaResult.appendChild(box);
}

function isValidYear(value) {
  // erlaubt 4-stellig, z. B. 1900–2099 (du kannst die Range später ändern)
  if (!/^\d{4}$/.test(value)) return false;
  const y = Number(value);
  return y >= 1900 && y <= 2099;
}

if (qaForm) {
  qaForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = document.querySelector("#meta-title")?.value.trim() ?? "";
    const year = document.querySelector("#meta-year")?.value.trim() ?? "";
    const lang = document.querySelector("#meta-lang")?.value.trim() ?? "";
    const cast = document.querySelector("#meta-cast")?.value.trim() ?? "";

    const missing = [];

    if (title.length < 2) missing.push("Titel (mind. 2 Zeichen)");
    if (!isValidYear(year)) missing.push("Produktionsjahr (4-stellig, z. B. 1999)");
    if (lang.length < 2) missing.push("Sprachen (z. B. DE, EN)");
    if (cast.length < 3) missing.push("Cast (z. B. Name, Name)");

    setResult(missing.length === 0, missing);
  });
}

// --- QA: Auto-Speichern (localStorage) ---
const qaFields = ["meta-title", "meta-year", "meta-lang", "meta-cast"];
const QA_KEY = "qa-meta-v1";

function loadQa() {
  try {
    const raw = localStorage.getItem(QA_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);

    for (const id of qaFields) {
      const el = document.querySelector("#" + id);
      if (el && typeof data[id] === "string") el.value = data[id];
    }
  } catch (e) {
    console.log("QA load failed", e);
  }
}

function saveQa() {
  const data = {};
  for (const id of qaFields) {
    const el = document.querySelector("#" + id);
    data[id] = el ? el.value : "";
  }
  localStorage.setItem(QA_KEY, JSON.stringify(data));
}

// Beim Tippen speichern
for (const id of qaFields) {
  const el = document.querySelector("#" + id);
  if (el) el.addEventListener("input", saveQa);
}

// Beim Laden wiederherstellen
loadQa();

const exportBtn = document.querySelector("#qa-export");

const resetBtn = document.querySelector("#qa-reset");

if (resetBtn) {
  resetBtn.addEventListener("click", () => {
    // Felder leeren
    for (const id of qaFields) {
      const el = document.querySelector("#" + id);
      if (el) el.value = "";
    }

    // localStorage löschen
    localStorage.removeItem(QA_KEY);

    // Ergebnisbox leeren
    if (qaResult) qaResult.innerHTML = "";

    // Fokus zurück ins erste Feld
    document.querySelector("#meta-title")?.focus();
  });
}


function makeReport() {
  const title = document.querySelector("#meta-title")?.value.trim() ?? "";
  const year = document.querySelector("#meta-year")?.value.trim() ?? "";
  const lang = document.querySelector("#meta-lang")?.value.trim() ?? "";
  const cast = document.querySelector("#meta-cast")?.value.trim() ?? "";

  const missing = [];
  if (title.length < 2) missing.push("Titel");
  if (!isValidYear(year)) missing.push("Produktionsjahr");
  if (lang.length < 2) missing.push("Sprachen");
  if (cast.length < 3) missing.push("Cast");

  const lines = [
    "Metadata QA Report",
    "------------------",
    `Titel: ${title || "-"}`,
    `Jahr: ${year || "-"}`,
    `Sprachen: ${lang || "-"}`,
    `Cast: ${cast || "-"}`,
    "",
    missing.length === 0
      ? "Status: OK ✅"
      : "Fehlt: " + missing.join(", "),
  ];

  return lines.join("\n");
}

if (exportBtn) {
  exportBtn.addEventListener("click", async () => {
    const text = makeReport();

    try {
      await navigator.clipboard.writeText(text);
      setResult(true, ["Report kopiert ✅ (in Zwischenablage)"]); // kleine Rückmeldung
    } catch (e) {
      // Fallback: im Ergebnis anzeigen, damit du es manuell kopieren kannst
      if (qaResult) {
        qaResult.innerHTML = `<pre style="white-space:pre-wrap; padding:12px; border:1px solid #d7dbe3; border-radius:12px;">${text}</pre>`;
      }
    }
  });
}

}
