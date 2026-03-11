const page = document.body?.dataset?.page || "";

const formatDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`;
};

const fetchJson = async (path) => {
  const response = await fetch(path, { cache: "no-store" });
  if (!response.ok) throw new Error(`Failed to load ${path}`);
  return response.json();
};

const fillSiteInfo = async () => {
  try {
    const site = await fetchJson("/content/site.json");
    document.querySelectorAll("[data-site]").forEach((el) => {
      const key = el.dataset.site;
      if (site[key]) {
        el.textContent = site[key];
      }
    });

    const highlightContainer = document.getElementById("heroHighlights");
    if (highlightContainer && Array.isArray(site.highlights)) {
      highlightContainer.innerHTML = site.highlights
        .map((item) => `<span>${item}</span>`)
        .join("");
    }

    const certList = document.getElementById("certList");
    if (certList && Array.isArray(site.certs)) {
      certList.innerHTML = site.certs.map((item) => `<li>${item}</li>`).join("");
    }
  } catch (error) {
    console.warn(error);
  }
};

const renderProducts = async () => {
  const grid = document.getElementById("productGrid");
  if (!grid) return;
  try {
    const data = await fetchJson("/content/products.json");
    grid.innerHTML = (data.items || [])
      .map(
        (item) => `
          <article class="card">
            <img src="${item.image}" alt="${item.name}" />
            <div>
              <h3>${item.name}</h3>
              <p>${item.summary}</p>
            </div>
            <div class="meta">
              <span>型号：${item.model}</span>
              <span>流量：${item.flow}</span>
              <span>扬程：${item.head}</span>
              <span>功率：${item.power}</span>
              <span>应用：${item.scene}</span>
            </div>
          </article>
        `
      )
      .join("");
  } catch (error) {
    console.warn(error);
  }
};

const renderSolutions = async () => {
  const grid = document.getElementById("solutionGrid");
  if (!grid) return;
  try {
    const data = await fetchJson("/content/solutions.json");
    grid.innerHTML = (data.items || [])
      .map(
        (item) => `
          <article class="solution-card">
            <img src="${item.image}" alt="${item.title}" />
            <div>
              <h3>${item.title}</h3>
              <p>${item.summary}</p>
            </div>
            <ul>${(item.features || []).map((feature) => `<li>${feature}</li>`).join("")}</ul>
            <strong>推荐产品：${item.recommended}</strong>
          </article>
        `
      )
      .join("");
  } catch (error) {
    console.warn(error);
  }
};

const renderCases = async () => {
  const grid = document.getElementById("caseGrid");
  if (!grid) return;
  try {
    const data = await fetchJson("/content/cases.json");
    grid.innerHTML = (data.items || [])
      .map(
        (item) => `
          <article class="case-card">
            <img src="${item.image}" alt="${item.name}" />
            <h3>${item.name}</h3>
            <p>${item.summary}</p>
            <strong>${item.result}</strong>
          </article>
        `
      )
      .join("");
  } catch (error) {
    console.warn(error);
  }
};

const renderNews = async (limit) => {
  const grid = document.getElementById("newsGrid");
  if (!grid) return;
  try {
    const data = await fetchJson("/content/news.json");
    const items = (data.items || []).slice(0, limit || data.items.length);
    grid.innerHTML = items
      .map(
        (item) => `
          <article class="news-card">
            <img src="${item.cover}" alt="${item.title}" />
            <span>${formatDate(item.date)}</span>
            <h3>${item.title}</h3>
            <p>${item.summary}</p>
            <div class="meta">${(item.tags || []).map((tag) => `#${tag}`).join(" ")}</div>
          </article>
        `
      )
      .join("");
  } catch (error) {
    console.warn(error);
  }
};

const renderVideos = async () => {
  const grid = document.getElementById("videoGrid");
  if (!grid) return;
  try {
    const data = await fetchJson("/content/videos.json");
    grid.innerHTML = (data.items || [])
      .map(
        (item) => `
          <article class="video-card">
            <iframe src="${item.embed}" title="${item.title}" allowfullscreen></iframe>
            <span>${formatDate(item.date)}</span>
            <h3>${item.title}</h3>
            <p>${item.summary}</p>
          </article>
        `
      )
      .join("");
  } catch (error) {
    console.warn(error);
  }
};

const setActiveNav = () => {
  document.querySelectorAll(".nav-link").forEach((link) => {
    if (link.getAttribute("href")?.includes(`${page}.html`)) {
      link.classList.add("active");
    }
    if (page === "home" && link.getAttribute("href") === "/index.html") {
      link.classList.add("active");
    }
  });
};

const initNavToggle = () => {
  const toggle = document.getElementById("navToggle");
  if (!toggle) return;
  toggle.addEventListener("click", () => {
    document.body.classList.toggle("nav-open");
  });
};

const init = async () => {
  setActiveNav();
  initNavToggle();
  await fillSiteInfo();
  await renderProducts();
  await renderSolutions();
  await renderCases();
  if (page === "home") {
    await renderNews(3);
  } else {
    await renderNews();
  }
  await renderVideos();
};

init();
