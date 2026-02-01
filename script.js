// Debug: zeigt in der Konsole, dass das Script geladen wurde
console.log("script loaded");

/* =========================================================
   A) Footer: Jahr automatisch setzen
   - Damit du nicht jedes Jahr "© 2026" manuell ändern musst.
========================================================= */
const yearEl = document.querySelector("#year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* =========================================================
   B) Theme (Night/Day)
   - Wir setzen/entfernen die CSS-Klasse "night" am <body>.
   - CSS macht dann die Darstellung dunkel/hell.
   - localStorage merkt sich die Wahl über Seiten-Neuladen hinweg.
========================================================= */
const button = document.querySelector("#toggle-theme");
const savedTheme = localStorage.getItem("alex-theme"); // "night" | "day" | null

// Beim Laden: gespeicherten Zustand anwenden
if (savedTheme === "night") {
  document.body.classList.add("night");
  if (button) button.textContent = "Day";
} else {
  if (button) button.textContent = "Night";
}

// Beim Klick: umschalten + speichern
if (button) {
  button.addEventListener("click", () => {
    const isNight = document.body.classList.toggle("night");
    button.textContent = isNight ? "Day" : "Night";
    localStorage.setItem("alex-theme", isNight ? "night" : "day");
  });
}

/* =========================================================
   C) Projekte: Daten (deine Projektliste)
   - Hier pflegst du Projekte als Objekte (title/desc/url/cta/tags).
   - Die Seite baut die Karten automatisch daraus.
========================================================= */
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

/* =========================================================
   D) DOM-Elemente holen
   - Das sind "Griffe" auf HTML-Elemente.
========================================================= */
const countEl = document.querySelector("#search-count");     // Anzeige "x Treffer"
const list = document.querySelector("#project-list");        // <ul> für Karten
const searchInput = document.querySelector("#project-search"); // Suchfeld
const filtersEl = document.querySelector("#tag-filters");    // Filter-Buttons

/* =========================================================
   E) renderProjects(items)
   - Baut die Kartenliste neu aus einer Projekt-Liste (items).
   - Wird aufgerufen bei: Initial, Suche tippen, Tag-Filter klicken.
========================================================= */
function renderProjects(items) {
  if (!list) return;

  // Treffer-Anzeige
  if (countEl) {
  const n = items.length;

  const q = (searchInput ? searchInput.value : "").trim();
  const isFiltering = q.length > 0 || activeTag !== "Alle";

  if (!isFiltering) {
    countEl.textContent = "";
  } else {
    countEl.textContent = n === 1 ? "1 Projekt" : `${n} Projekte`;
  }
}

  // Liste leeren, damit nichts doppelt wird
  list.replaceChildren();

  // Wenn nichts gefunden: Meldung anzeigen
  if (items.length === 0) {
    const li = document.createElement("li");
    li.className = "project-card";
    li.textContent = "Keine Projekte gefunden.";
    list.appendChild(li);
    return;
  }

  // Für jedes Projekt eine Card erstellen
  for (const project of items) {
    const li = document.createElement("li");
    li.className = "project-card";

    // Überschrift
    const h3 = document.createElement("h3");
    h3.textContent = project.title;

    // Beschreibung
    const p = document.createElement("p");
    p.textContent = project.desc;

    // Erst Text rein, dann Extras (Tags/Link)
    li.appendChild(h3);
    li.appendChild(p);

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

    // Button/Link nur, wenn URL existiert
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

/* =========================================================
   F) Tag-Filter (Buttons)
   - activeTag merkt den aktuellen Filter ("Alle" oder ein Tag).
   - buildTagFilters() baut Buttons aus den vorhandenen Tags.
========================================================= */
let activeTag = "Alle";

function buildTagFilters() {
  if (!filtersEl) return;

  // Set sammelt eindeutige Tags (ohne Duplikate)
  const tagSet = new Set();
  for (const p of projects) {
    for (const t of (p.tags ?? [])) tagSet.add(t);
  }

  // Buttons: "Alle" + Tags alphabetisch
  const tags = ["Alle", ...Array.from(tagSet).sort()];

  // Filterleiste leeren
  filtersEl.replaceChildren();

  // Buttons erstellen
  for (const tag of tags) {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = tag;

    // aktiven Button optisch markieren
    if (tag === activeTag) b.classList.add("is-active");

    // Klick: Tag setzen + neu rendern
    b.addEventListener("click", () => {
      activeTag = tag;
      buildTagFilters(); // damit aktiver Button markiert ist
      applyFilters();    // Projekte neu filtern/anzeigen
    });

    filtersEl.appendChild(b);
  }
}

/* =========================================================
   G) applyFilters()
   - Kombiniert Suchtext + Tagfilter.
   - Ergebnis wird gerendert.
========================================================= */
function applyFilters() {
  const q = (searchInput ? searchInput.value : "").toLowerCase().trim();

  const filtered = projects.filter((p) => {
    // "Heuhaufen": alles in einen String packen
    const hay = (p.title + " " + p.desc + " " + (p.cta ?? "")).toLowerCase();

    const matchesText = hay.includes(q);
    const matchesTag = activeTag === "Alle" || (p.tags ?? []).includes(activeTag);

    return matchesText && matchesTag;
  });

  renderProjects(filtered);
}

// Initial: Filterbuttons bauen und Projekte anzeigen
buildTagFilters();
applyFilters();

// Suche tippen = neu filtern
if (searchInput) {
  searchInput.addEventListener("input", applyFilters);

  // ESC: Suche leeren + Filter auf "Alle"
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      searchInput.value = "";
      activeTag = "Alle";
      buildTagFilters();
      applyFilters();
    }
  });
}

/* =========================================================
   H) Metadata QA Checker
   - Prüft Pflichtfelder (Titel/Jahr/Sprachen/Cast)
   - Speichert Eingaben automatisch (localStorage)
   - Export kopiert Report in die Zwischenablage
   - Reset leert alles + löscht Speicher
========================================================= */
const qaForm = document.querySelector("#qa-form");
const qaResult = document.querySelector("#qa-result");

// IDs der QA-Felder (für speichern/leeren)
const qaFields = ["meta-title", "meta-year", "meta-lang", "meta-cast"];
const QA_KEY = "qa-meta-v1";

// Buttons
const exportBtn = document.querySelector("#qa-export");
const resetBtn = document.querySelector("#qa-reset");

/* Ergebnisbox anzeigen:
   ok=true => grün "OK"
   ok=false => orange mit Liste "Fehlt ..."
*/
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

/* Jahr prüfen:
   - 4-stellig
   - Bereich 1900–2099
*/
function isValidYear(value) {
  if (!/^\d{4}$/.test(value)) return false;
  const y = Number(value);
  return y >= 1900 && y <= 2099;
}

/* localStorage laden -> Felder befüllen */
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

/* localStorage speichern -> aktuellen Feldinhalt merken */
function saveQa() {
  const data = {};
  for (const id of qaFields) {
    const el = document.querySelector("#" + id);
    data[id] = el ? el.value : "";
  }
  localStorage.setItem(QA_KEY, JSON.stringify(data));
}

// Beim Tippen: sofort speichern
for (const id of qaFields) {
  const el = document.querySelector("#" + id);
  if (el) el.addEventListener("input", saveQa);
}

// Beim Laden: wiederherstellen
loadQa();

/* Form Submit (Prüfen): Regeln anwenden und Ergebnis zeigen */
if (qaForm) {
  qaForm.addEventListener("submit", (e) => {
    e.preventDefault(); // verhindert, dass die Seite neu lädt

    const title = document.querySelector("#meta-title")?.value.trim() ?? "";
    const year  = document.querySelector("#meta-year")?.value.trim() ?? "";
    const lang  = document.querySelector("#meta-lang")?.value.trim() ?? "";
    const cast  = document.querySelector("#meta-cast")?.value.trim() ?? "";

    const missing = [];

    if (title.length < 2) missing.push("Titel (mind. 2 Zeichen)");
    if (!isValidYear(year)) missing.push("Produktionsjahr (4-stellig, z. B. 1999)");
    if (lang.length < 2) missing.push("Sprachen (z. B. DE, EN)");
    if (cast.length < 3) missing.push("Cast (z. B. Name, Name)");

    setResult(missing.length === 0, missing);
  });
}

/* Export-Text zusammenbauen */
function makeReport() {
  const title = document.querySelector("#meta-title")?.value.trim() ?? "";
  const year  = document.querySelector("#meta-year")?.value.trim() ?? "";
  const lang  = document.querySelector("#meta-lang")?.value.trim() ?? "";
  const cast  = document.querySelector("#meta-cast")?.value.trim() ?? "";

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
    missing.length === 0 ? "Status: OK ✅" : "Fehlt: " + missing.join(", "),
  ];

  return lines.join("\n");
}

/* Export klicken: versucht in die Zwischenablage zu kopieren */
if (exportBtn) {
  exportBtn.addEventListener("click", async () => {
    const text = makeReport();

    try {
      await navigator.clipboard.writeText(text);
      // kleines Feedback: wir nutzen setResult, damit du was siehst
      setResult(true, ["Report kopiert ✅ (in Zwischenablage)"]);
    } catch (e) {
      // Fallback: Text anzeigen, damit man manuell kopieren kann
      if (qaResult) {
        qaResult.innerHTML = `<pre style="white-space:pre-wrap; padding:12px; border:1px solid #d7dbe3; border-radius:12px;">${text}</pre>`;
      }
    }
  });
}

/* Reset klicken: leert alles + löscht localStorage + Ergebnisbox */
if (resetBtn) {
  resetBtn.addEventListener("click", () => {
    for (const id of qaFields) {
      const el = document.querySelector("#" + id);
      if (el) el.value = "";
    }

    localStorage.removeItem(QA_KEY);

    if (qaResult) qaResult.innerHTML = "";

    document.querySelector("#meta-title")?.focus();
  });
}
