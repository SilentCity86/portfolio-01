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

// Beim Laden: alle anzeigen
renderProjects(projects);

// Beim Tippen: filtern
if (searchInput) {
  searchInput.addEventListener("input", () => {
    const q = searchInput.value.toLowerCase().trim();

    const filtered = projects.filter((p) =>
      (p.title + " " + p.desc + " " + (p.cta ?? ""))
        .toLowerCase()
        .includes(q)
    );

    renderProjects(filtered);
  });
} else {
  console.log("project-search input not found");
}
