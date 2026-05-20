const demoItems = [
  {
    id: "project-knowledge-lab",
    title: "个人知识空间原型",
    type: "项目作品",
    summary: "把读书、科研、代码和项目内容放进同一个公开展示系统，验证个人学术主页的核心结构。",
    tags: ["知识管理", "作品集", "Web"],
    body:
      "这个项目的目标不是把所有内容堆在一起，而是让访问者能快速理解：我是谁、我研究什么、我做过什么。\n\n当前版本重点验证首页、作品集、笔记库和内容管理流程。后续可以接入数据库、登录权限和真实文件存储。",
    link: "",
    featured: true,
    published: true,
    createdAt: "2026-05-20",
    cover: ""
  },
  {
    id: "paper-note-map",
    title: "论文阅读：从摘要到研究问题",
    type: "论文笔记",
    summary: "记录一篇论文如何从摘要、方法、实验和局限，进一步转化成自己的研究问题。",
    tags: ["论文阅读", "科研方法", "问题意识"],
    body:
      "一篇论文不只是结论集合。更重要的是理解作者如何定义问题、为什么选择这个方法、实验设计有没有说服力，以及它没有解决什么。\n\n我希望每篇论文笔记最后都能留下一个问题：这篇文章能推动我下一步做什么？",
    link: "",
    featured: false,
    published: true,
    createdAt: "2026-05-20",
    cover: ""
  },
  {
    id: "code-note-clean-upload",
    title: "代码笔记：上传流程的边界设计",
    type: "代码笔记",
    summary: "整理网页上传内容时需要考虑的文件类型、大小限制、预览、失败提示和隐私问题。",
    tags: ["代码实践", "上传", "安全"],
    body:
      "上传功能看起来只是选一个文件，实际要考虑很多边界：文件是不是太大、类型是否允许、失败后用户是否知道原因、私密文件是否会被公开访问。\n\n第一版可以先支持图片封面和链接，后续再扩展 PDF、Markdown 和附件管理。",
    link: "",
    featured: true,
    published: true,
    createdAt: "2026-05-20",
    cover: ""
  },
  {
    id: "research-log-timeline",
    title: "科研记录：让过程也可以被看见",
    type: "科研记录",
    summary: "科研成果不是突然出现的，网站需要保留阅读、实验、失败和复盘的路径。",
    tags: ["科研记录", "时间线", "复盘"],
    body:
      "如果只展示结果，访问者很难理解一个项目的真实含金量。研究记录可以把问题提出、资料收集、实验尝试和阶段结论串起来。\n\n这能让网站不只是橱窗，也像一间开放的研究工作室。",
    link: "",
    featured: false,
    published: true,
    createdAt: "2026-05-20",
    cover: ""
  }
];

const topics = [
  {
    title: "个人知识管理系统",
    stage: "原型阶段",
    summary: "围绕如何整理、展示和复用博士阶段知识资产，逐步形成完整网站结构。",
    progress: 62
  },
  {
    title: "论文阅读与科研问题生成",
    stage: "持续积累",
    summary: "把论文阅读从摘录变成研究问题的来源，让笔记能服务真实科研。",
    progress: 48
  },
  {
    title: "代码实践与项目复盘",
    stage: "建设中",
    summary: "把代码项目背后的设计取舍、踩坑过程和可复用经验沉淀下来。",
    progress: 38
  }
];

const storageKey = "leone1111_online_notes_items";
let items = loadItems();

const el = {
  featuredGrid: document.querySelector("#featuredGrid"),
  notesGrid: document.querySelector("#notesGrid"),
  topicList: document.querySelector("#topicList"),
  searchInput: document.querySelector("#searchInput"),
  typeFilter: document.querySelector("#typeFilter"),
  form: document.querySelector("#contentForm"),
  adminItems: document.querySelector("#adminItems"),
  resetDemo: document.querySelector("#resetDemo"),
  statWorks: document.querySelector("#statWorks"),
  statNotes: document.querySelector("#statNotes"),
  statTopics: document.querySelector("#statTopics"),
  detail: document.querySelector("#detail"),
  detailArticle: document.querySelector("#detailArticle"),
  backToList: document.querySelector("#backToList"),
  navLinks: document.querySelectorAll(".main-nav a"),
  menuButton: document.querySelector(".menu-button"),
  mainNav: document.querySelector(".main-nav")
};

function loadItems() {
  const saved = localStorage.getItem(storageKey);
  if (!saved) return demoItems;

  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : demoItems;
  } catch {
    return demoItems;
  }
}

function saveItems() {
  localStorage.setItem(storageKey, JSON.stringify(items));
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function visibleItems() {
  return items.filter((item) => item.published);
}

function renderStats() {
  const published = visibleItems();
  el.statWorks.textContent = published.filter((item) => item.featured).length;
  el.statNotes.textContent = published.length;
  el.statTopics.textContent = topics.length;
}

function renderTypeFilter() {
  const types = ["全部类型", ...new Set(visibleItems().map((item) => item.type))];
  el.typeFilter.innerHTML = types
    .map((type) => `<option value="${escapeHtml(type)}">${escapeHtml(type)}</option>`)
    .join("");
}

function cardTemplate(item) {
  const cover = item.cover
    ? `<img src="${item.cover}" alt="${escapeHtml(item.title)} 的封面图">`
    : "";
  const link = item.link
    ? `<a class="text-button" href="${escapeHtml(item.link)}" target="_blank" rel="noreferrer">外部链接</a>`
    : "";

  return `
    <article class="content-card">
      <div class="card-cover">${cover}</div>
      <div class="card-body">
        <span class="type-pill">${escapeHtml(item.type)}</span>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.summary)}</p>
        <div class="tag-row">
          ${(item.tags || []).map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}
        </div>
        <div class="card-actions">
          <button class="text-button" type="button" data-detail="${escapeHtml(item.id)}">阅读详情</button>
          ${link}
        </div>
      </div>
    </article>
  `;
}

function renderFeatured() {
  const featured = visibleItems().filter((item) => item.featured);
  el.featuredGrid.innerHTML = featured.length
    ? featured.map(cardTemplate).join("")
    : `<div class="empty-state">还没有设置代表作品。可以到“管理”里勾选“设为代表作品”。</div>`;
}

function renderNotes() {
  const keyword = el.searchInput.value.trim().toLowerCase();
  const selectedType = el.typeFilter.value || "全部类型";
  const filtered = visibleItems().filter((item) => {
    const haystack = [item.title, item.summary, item.type, ...(item.tags || [])].join(" ").toLowerCase();
    const matchesKeyword = !keyword || haystack.includes(keyword);
    const matchesType = selectedType === "全部类型" || item.type === selectedType;
    return matchesKeyword && matchesType;
  });

  el.notesGrid.innerHTML = filtered.length
    ? filtered.map(cardTemplate).join("")
    : `<div class="empty-state">没有找到匹配内容。可以换个关键词，或者先到“管理”里新增内容。</div>`;
}

function renderTopics() {
  el.topicList.innerHTML = topics
    .map(
      (topic) => `
        <article class="topic-item">
          <span class="type-pill">${escapeHtml(topic.stage)}</span>
          <div>
            <strong>${escapeHtml(topic.title)}</strong>
            <p>${escapeHtml(topic.summary)}</p>
          </div>
          <div class="progress-track" aria-label="${escapeHtml(topic.title)} 进度 ${topic.progress}%">
            <span style="width: ${topic.progress}%"></span>
          </div>
        </article>
      `
    )
    .join("");
}

function renderAdmin() {
  el.adminItems.innerHTML = items
    .map(
      (item) => `
        <article class="admin-item">
          <strong>${escapeHtml(item.title)}</strong>
          <p>${escapeHtml(item.type)} · ${item.published ? "公开" : "草稿"} · ${
            item.featured ? "代表作品" : "普通内容"
          }</p>
          <div class="admin-actions">
            <button class="text-button" type="button" data-toggle-publish="${escapeHtml(item.id)}">${
              item.published ? "设为草稿" : "公开"
            }</button>
            <button class="text-button" type="button" data-toggle-featured="${escapeHtml(item.id)}">${
              item.featured ? "取消代表作品" : "设为代表作品"
            }</button>
            <button class="text-button" type="button" data-remove="${escapeHtml(item.id)}">删除</button>
          </div>
        </article>
      `
    )
    .join("");
}

function renderAll() {
  renderStats();
  renderTypeFilter();
  renderFeatured();
  renderNotes();
  renderTopics();
  renderAdmin();
}

function showDetail(id) {
  const item = items.find((entry) => entry.id === id);
  if (!item) return;

  el.detail.hidden = false;
  document.querySelectorAll(".section-pane, .overview-band").forEach((section) => {
    section.hidden = true;
  });

  const externalLink = item.link
    ? `<p><a class="button secondary" href="${escapeHtml(item.link)}" target="_blank" rel="noreferrer">打开外部链接</a></p>`
    : "";

  el.detailArticle.innerHTML = `
    <div class="detail-meta">
      <span>${escapeHtml(item.type)}</span>
      <span>${escapeHtml(item.createdAt)}</span>
    </div>
    <h1>${escapeHtml(item.title)}</h1>
    <p>${escapeHtml(item.summary)}</p>
    <div class="tag-row">
      ${(item.tags || []).map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}
    </div>
    <div class="detail-body">${escapeHtml(item.body || "还没有填写正文。")}</div>
    ${externalLink}
  `;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function hideDetail() {
  el.detail.hidden = true;
  document.querySelectorAll(".section-pane, .overview-band").forEach((section) => {
    section.hidden = false;
  });
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve("");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function handleSubmit(event) {
  event.preventDefault();
  const formData = new FormData(el.form);
  const cover = await fileToDataUrl(formData.get("cover"));
  const now = new Date().toISOString().slice(0, 10);

  const item = {
    id: `item-${Date.now()}`,
    title: formData.get("title").trim(),
    type: formData.get("type"),
    summary: formData.get("summary").trim(),
    tags: formData
      .get("tags")
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean),
    body: formData.get("body").trim(),
    link: formData.get("link").trim(),
    featured: formData.get("featured") === "on",
    published: formData.get("published") === "on",
    createdAt: now,
    cover
  };

  items = [item, ...items];
  saveItems();
  el.form.reset();
  renderAll();
  location.hash = "#notes";
}

function handleCardClick(event) {
  const detailButton = event.target.closest("[data-detail]");
  if (detailButton) {
    showDetail(detailButton.dataset.detail);
  }
}

function handleAdminClick(event) {
  const publishButton = event.target.closest("[data-toggle-publish]");
  const featuredButton = event.target.closest("[data-toggle-featured]");
  const removeButton = event.target.closest("[data-remove]");

  if (publishButton) {
    items = items.map((item) =>
      item.id === publishButton.dataset.togglePublish ? { ...item, published: !item.published } : item
    );
  }

  if (featuredButton) {
    items = items.map((item) =>
      item.id === featuredButton.dataset.toggleFeatured ? { ...item, featured: !item.featured } : item
    );
  }

  if (removeButton) {
    const item = items.find((entry) => entry.id === removeButton.dataset.remove);
    const ok = window.confirm(`确认删除《${item?.title || "这条内容"}》吗？删除后会从当前浏览器本地数据里移除。`);
    if (!ok) return;
    items = items.filter((entry) => entry.id !== removeButton.dataset.remove);
  }

  saveItems();
  renderAll();
}

function resetDemoData() {
  const ok = window.confirm("确认恢复示例数据吗？这会覆盖当前浏览器里新增的本地内容。");
  if (!ok) return;
  items = demoItems;
  saveItems();
  renderAll();
}

function updateActiveNav() {
  const hash = location.hash || "#home";
  el.navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === hash);
  });
}

function setupMobileNav() {
  el.menuButton.addEventListener("click", () => {
    const isOpen = el.mainNav.classList.toggle("open");
    el.menuButton.setAttribute("aria-expanded", String(isOpen));
  });

  el.mainNav.addEventListener("click", () => {
    el.mainNav.classList.remove("open");
    el.menuButton.setAttribute("aria-expanded", "false");
  });
}

function setupCanvas() {
  const canvas = document.querySelector("#knowledgeCanvas");
  const ctx = canvas.getContext("2d");
  const nodes = Array.from({ length: 52 }, () => ({
    x: Math.random(),
    y: Math.random(),
    vx: (Math.random() - 0.5) * 0.0007,
    vy: (Math.random() - 0.5) * 0.0007,
    r: 1.8 + Math.random() * 2.8
  }));

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = rect.width * ratio;
    canvas.height = rect.height * ratio;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function draw() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    ctx.clearRect(0, 0, width, height);

    nodes.forEach((node) => {
      node.x += node.vx;
      node.y += node.vy;
      if (node.x < 0.02 || node.x > 0.98) node.vx *= -1;
      if (node.y < 0.04 || node.y > 0.96) node.vy *= -1;
    });

    nodes.forEach((node, index) => {
      for (let nextIndex = index + 1; nextIndex < nodes.length; nextIndex += 1) {
        const next = nodes[nextIndex];
        const dx = (node.x - next.x) * width;
        const dy = (node.y - next.y) * height;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 145) {
          ctx.strokeStyle = `rgba(214, 202, 172, ${0.2 - distance / 900})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(node.x * width, node.y * height);
          ctx.lineTo(next.x * width, next.y * height);
          ctx.stroke();
        }
      }
    });

    nodes.forEach((node, index) => {
      const accent = index % 7 === 0 ? "197, 139, 47" : index % 5 === 0 ? "184, 79, 57" : "95, 184, 173";
      ctx.fillStyle = `rgba(${accent}, 0.82)`;
      ctx.beginPath();
      ctx.arc(node.x * width, node.y * height, node.r, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener("resize", resize);
  draw();
}

el.searchInput.addEventListener("input", renderNotes);
el.typeFilter.addEventListener("change", renderNotes);
el.form.addEventListener("submit", handleSubmit);
el.featuredGrid.addEventListener("click", handleCardClick);
el.notesGrid.addEventListener("click", handleCardClick);
el.adminItems.addEventListener("click", handleAdminClick);
el.resetDemo.addEventListener("click", resetDemoData);
el.backToList.addEventListener("click", hideDetail);
window.addEventListener("hashchange", updateActiveNav);

setupMobileNav();
setupCanvas();
renderAll();
updateActiveNav();
