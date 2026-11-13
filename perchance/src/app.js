import { settings } from "./settings.js";

// Blacknode Launcher — simplified port of the Lumen launcher logic.
//
// Simple-style rules for this page:
// - System fonts only, light/dark via color-scheme, no glow/gradients/starfield.
// - Only system apps ship (Notes + Settings). No bundled demo apps.
// - User rows are rendered with escaped strings (see esc()) — never raw HTML.

const esc = (s) =>
  String(s ?? "").replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]),
  );

const DB_NAME = "blacknode-launcher";
const SYSFAV_KEY = "blacknode.sysfav";
const NOTES_KEY = "blacknode.notes";
// Previous keys (one-time migration only — your apps carry over).
const OLD_DB = "ange-eric-launcher";
const OLD_SYSFAV = "ange-eric.sysfav";
const OLD_NOTES = "ange-eric.notes";

const NOTES_HTML = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>
html{color-scheme:light dark}body{margin:0;font-family:system-ui,sans-serif;padding:24px 18px}
h1{font-size:28px;margin:0 0 4px}p{opacity:.7;font-size:12px;margin:0 0 12px}
textarea{width:100%;height:calc(100vh - 140px);font:16px/1.6 system-ui;padding:12px;border-radius:10px;border:1px solid GrayText;box-sizing:border-box}</style></head><body>
<h1>Notes</h1><p id="s">SAVED LOCALLY</p>
<textarea id="t" placeholder="Jot something down…"></textarea>
<script>const K=${JSON.stringify(NOTES_KEY)},t=document.getElementById('t'),s=document.getElementById('s');
try{t.value=localStorage.getItem(K)||''}catch(e){}
t.oninput=()=>{try{localStorage.setItem(K,t.value);s.textContent='SAVED · '+new Date().toLocaleTimeString()}catch(e){s.textContent='STORAGE UNAVAILABLE'}}<\/script></body></html>`;

const SYS = [
  {
    id: "sys-notes",
    name: "Notes",
    icon: "✎",
    accent: "#6b7cff",
    system: true,
    type: "html",
    html: NOTES_HTML,
    fav: false,
    notes: "Built-in notes",
  },
  {
    id: "sys-settings",
    name: "Settings",
    icon: "⚙",
    accent: "#6b7cff",
    system: true,
    type: "settings",
    fav: false,
  },
];

export function initInstallApp(rootEl) {
  rootEl.textContent = "";

  const wrap = document.createElement("div");
  wrap.className = "ae-wrap";

  // Header: brand + clock (tap clock to jump to search).
  const head = document.createElement("header");
  head.className = "ae-head";
  const brand = document.createElement("div");
  brand.className = "ae-brand";
  brand.textContent = settings.title;
  const clockArea = document.createElement("button");
  clockArea.className = "ae-clockArea";
  clockArea.type = "button";
  clockArea.setAttribute("aria-label", "Go to search");
  const clock = document.createElement("div");
  clock.className = "ae-clock";
  clock.id = "ae-clock";
  clock.textContent = "--:--";
  const dayline = document.createElement("div");
  dayline.className = "ae-dayline";
  const day = document.createElement("span");
  day.id = "ae-day";
  const date = document.createElement("span");
  date.id = "ae-date";
  dayline.append(day, document.createTextNode(" · "), date);
  clockArea.append(clock, dayline);
  const lede = document.createElement("p");
  lede.className = "lede";
  lede.textContent = settings.tagline;
  head.append(brand, clockArea, lede);

  // Inline search + calculator.
  const searchRow = document.createElement("div");
  searchRow.className = "ae-searchRow";
  const q = document.createElement("input");
  q.id = "q";
  q.type = "search";
  q.placeholder = "Search apps or type 12*7…";
  q.setAttribute("aria-label", "Search apps");
  q.autocomplete = "off";
  const calc = document.createElement("div");
  calc.id = "calc";
  calc.className = "ae-calc";
  calc.setAttribute("aria-live", "polite");
  searchRow.append(q, calc);

  // Favourites.
  const favSec = document.createElement("section");
  const favH = document.createElement("h2");
  favH.textContent = "Favourites";
  const favs = document.createElement("div");
  favs.id = "favs";
  favSec.append(favH, favs);

  // Recents.
  const recSec = document.createElement("section");
  const recH = document.createElement("h2");
  recH.textContent = "Recent";
  const recents = document.createElement("div");
  recents.id = "recents";
  recents.className = "ae-recents";
  recSec.append(recH, recents);

  // All apps.
  const allSec = document.createElement("section");
  const allHead = document.createElement("div");
  allHead.className = "ae-allHead";
  const allH = document.createElement("h2");
  allH.textContent = "All apps";
  const cnt = document.createElement("span");
  cnt.id = "cnt";
  cnt.className = "ae-count";
  allHead.append(allH, cnt);
  // Vertical side index (mobile-first): in-flow next to the list, sticks
  // while the All apps section scrolls. Tap or drag to jump to a letter.
  const rail = document.createElement("nav");
  rail.id = "azV";
  rail.className = "ae-azV";
  rail.setAttribute("aria-label", "Jump to letter");
  const allList = document.createElement("div");
  allList.id = "allList";
  const listWrap = document.createElement("div");
  listWrap.className = "ae-listWrap";
  listWrap.append(allList, rail);
  allSec.append(allHead, listWrap);

  // Dock.
  const dock = document.createElement("footer");
  dock.className = "ae-dock";
  const bAdd = document.createElement("button");
  bAdd.id = "bAdd";
  bAdd.type = "button";
  bAdd.textContent = "+ Add";
  const bSet = document.createElement("button");
  bSet.id = "bSet";
  bSet.type = "button";
  bSet.textContent = "Settings";
  dock.append(bAdd, bSet);

  wrap.append(head, searchRow, favSec, recSec, allSec, dock);
  rootEl.append(wrap);
  const appLayer = document.createElement("div");
  appLayer.id = "appLayer";
  appLayer.hidden = true;
  const topbar = document.createElement("div");
  topbar.className = "ae-topbar";
  const bHome = document.createElement("button");
  bHome.id = "bHome";
  bHome.type = "button";
  bHome.textContent = "◂ Home";
  const curName = document.createElement("span");
  curName.id = "curName";
  curName.className = "ae-appname";
  topbar.append(bHome, curName);
  const frames = document.createElement("div");
  frames.id = "frames";
  const frameNote = document.createElement("div");
  frameNote.id = "frameNote";
  frameNote.className = "ae-frameNote";
  frameNote.hidden = true;
  frames.append(frameNote);
  appLayer.append(topbar, frames);

  const scrim = document.createElement("div");
  scrim.id = "scrim";
  scrim.hidden = true;

  const sheet = document.createElement("div");
  sheet.id = "sheet";
  sheet.hidden = true;
  sheet.setAttribute("role", "dialog");
  sheet.setAttribute("aria-modal", "true");
  const sheetBody = document.createElement("div");
  sheetBody.id = "sheetBody";
  sheet.append(sheetBody);

  const toastEl = document.createElement("div");
  toastEl.id = "toast";
  toastEl.className = "ae-toast";
  toastEl.hidden = true;

  const fileHtml = document.createElement("input");
  fileHtml.type = "file";
  fileHtml.id = "fileHtml";
  fileHtml.accept = ".html,.htm,text/html";
  fileHtml.hidden = true;
  const fileJson = document.createElement("input");
  fileJson.type = "file";
  fileJson.id = "fileJson";
  fileJson.accept = ".json,application/json";
  fileJson.hidden = true;

  rootEl.append(appLayer, scrim, sheet, toastEl, fileHtml, fileJson);
  rootEl.hidden = false;

  /* ---------- state ---------- */
  let apps = [];
  const alive = new Map();
  let current = null;
  let db = null;

  const openDB = () =>
    new Promise((res, rej) => {
      const r = indexedDB.open(DB_NAME, 1);
      r.onupgradeneeded = () => r.result.createObjectStore("programs", { keyPath: "id" });
      r.onsuccess = () => res((db = r.result));
      r.onerror = () => rej(r.error);
    });
  const tx = (mode, fn) =>
    new Promise((res, rej) => {
      const t = db.transaction("programs", mode);
      const s = t.objectStore("programs");
      const r = fn(s);
      t.oncomplete = () => res(r && r.result);
      t.onerror = () => rej(t.error);
    });
  const dbAll = () => tx("readonly", (s) => s.getAll());
  const dbPut = (p) => tx("readwrite", (s) => s.put(p));
  const dbDel = (id) => tx("readwrite", (s) => s.delete(id));

  async function load() {
    const st = await dbAll();
    apps = [...st, ...SYS].sort((a, b) =>
      a.name.localeCompare(b.name, "en-AU", { sensitivity: "base" }),
    );
  }

  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.hidden = false;
    clearTimeout(toastEl._t);
    toastEl._t = setTimeout(() => {
      toastEl.hidden = true;
    }, 2200);
  }
  function buzz(ms) {
    try {
      if (navigator.vibrate) navigator.vibrate(ms);
    } catch (e) {}
  }

  /* ---------- install-as-app ---------- */
  let installEvent = null;
  const isRunningAsApp = () =>
    window.matchMedia("(display-mode: standalone)").matches ||
    window.matchMedia("(display-mode: fullscreen)").matches ||
    window.navigator.standalone === true;
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    if (isRunningAsApp()) return;
    installEvent = e;
    const b = document.getElementById("ae-installBtn");
    if (b) {
      b.disabled = false;
      b.textContent = settings.installLabel;
    }
    const h = document.getElementById("ae-installHint");
    if (h) h.textContent = "";
  });
  window.addEventListener("appinstalled", () => {
    installEvent = null;
    const b = document.getElementById("ae-installBtn");
    if (b) {
      b.disabled = true;
      b.textContent = settings.installedLabel;
    }
    const h = document.getElementById("ae-installHint");
    if (h) h.textContent = settings.runningHint;
  });

  /* ---------- rendering ---------- */
  const letterOf = (n) => {
    const c = (n || "#")[0].toUpperCase();
    return /[A-Z]/.test(c) ? c : "#";
  };

  function iconHTML(a) {
    const ic = (a.icon || a.name[0] || "?").trim();
    return `<span class="ic"${
      a.accent ? ` style="--c:${esc(a.accent)}"` : ""
    }>${esc([...ic].slice(0, 2).join(""))}</span>`;
  }
  function rowHTML(a) {
    return `<div class="app" data-id="${esc(a.id)}" role="button" tabindex="0">${iconHTML(
      a,
    )}<span class="nm">${esc(a.name)}</span>${
      a.system ? `<span class="sysTag">System</span>` : ""
    }</div>`;
  }

  function render() {
    const query = q.value.trim().toLowerCase();
    const favList = apps.filter((a) => a.fav).slice(0, settings.maxFavourites);
    favs.innerHTML = favList.length
      ? favList.map(rowHTML).join("")
      : `<p class="muted">Nothing favourited yet. Long-press (or right-click) any app to favourite it.</p>`;

    const recentApps = [...alive.keys()]
      .map((id) => apps.find((a) => a.id === id))
      .filter(Boolean);
    recents.innerHTML = recentApps.length
      ? recentApps
          .map(
            (a) =>
              `<button class="r" data-id="${esc(a.id)}">${esc(
                (a.icon || a.name[0] || "?").slice(0, 2),
              )} ${esc(a.name)}</button>`,
          )
          .join("")
      : `<span class="muted">No recent apps.</span>`;

    const filtered = query
      ? apps.filter((a) =>
          `${a.name} ${a.notes || ""}`.toLowerCase().includes(query),
        )
      : apps;
    let h = "";
    let cur = "";
    for (const a of filtered) {
      const L = letterOf(a.name);
      if (L !== cur) {
        cur = L;
        h += `<div class="sec" id="sec-${L === "#" ? "num" : L}">${L}</div>`;
      }
      h += rowHTML(a);
    }
    allList.innerHTML =
      h || `<p class="muted">No apps match “${esc(q.value.trim())}”.</p>`;
    cnt.textContent = `${filtered.length} of ${apps.length}`;

    const have = new Set(apps.map((a) => letterOf(a.name)));
    const letters = "#ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    rail.innerHTML = letters
      .map(
        (L) =>
          `<button data-l="${L}"${
            have.has(L) ? ` class="has"` : ""
          } tabindex="-1" aria-hidden="true">${L}</button>`,
      )
      .join("");
  }

  function jumpToLetter(L) {
    const order = "#ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    for (let i = order.indexOf(L); i < order.length; i++) {
      const sec = document.getElementById(
        `sec-${order[i] === "#" ? "num" : order[i]}`,
      );
      if (sec) {
        sec.scrollIntoView({ block: "start" });
        break;
      }
    }
  }

  function railLetterAt(clientY) {
    const r = rail.getBoundingClientRect();
    const order = "#ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    const i = Math.max(
      0,
      Math.min(
        order.length - 1,
        Math.floor(((clientY - r.top) / r.height) * order.length),
      ),
    );
    return order[i];
  }

  let railScrub = false;
  rail.addEventListener("pointerdown", (e) => {
    railScrub = true;
    try {
      rail.setPointerCapture(e.pointerId);
    } catch (err) {}
    jumpToLetter(railLetterAt(e.clientY));
  });
  rail.addEventListener("pointermove", (e) => {
    if (railScrub) jumpToLetter(railLetterAt(e.clientY));
  });
  const railEnd = () => {
    railScrub = false;
  };
  rail.addEventListener("pointerup", railEnd);
  rail.addEventListener("pointercancel", railEnd);

  /* ---------- clock ---------- */
  function tick() {
    const d = new Date();
    clock.textContent =
      String(d.getHours()).padStart(2, "0") +
      ":" +
      String(d.getMinutes()).padStart(2, "0");
    day.textContent = d
      .toLocaleDateString("en-AU", { weekday: "short" })
      .toUpperCase();
    date.textContent = d
      .toLocaleDateString("en-AU", { day: "numeric", month: "long" })
      .toUpperCase();
  }
  tick();
  setInterval(tick, 5000);
  clockArea.addEventListener("click", () => q.focus());

  /* ---------- search + calculator ---------- */
  function calcEval(s) {
    if (
      !/^[\d\s+\-*/().,%^x×÷]+$/.test(s) ||
      !/\d/.test(s) ||
      !/[+\-*/%^x×÷]/.test(s)
    )
      return null;
    try {
      const v = Function(
        '"use strict";return(' +
          s
            .replace(/,/g, "")
            .replace(/[x×]/g, "*")
            .replace(/÷/g, "/")
            .replace(/\^/g, "**") +
          ")",
      )();
      return Number.isFinite(v) ? +v.toPrecision(12) : null;
    } catch (e) {
      return null;
    }
  }
  function doSearch() {
    const c = calcEval(q.value.trim());
    calc.textContent =
      c === null
        ? ""
        : "= " + c.toLocaleString("en-AU", { maximumFractionDigits: 10 });
    render();
  }
  q.addEventListener("input", doSearch);
  q.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const f = allList.querySelector(".app");
      if (f) launch(f.dataset.id);
    }
    if (e.key === "Escape") q.blur();
  });

  /* ---------- app launching ---------- */
  function launch(id) {
    const a = apps.find((x) => x.id === id);
    if (!a) return;
    if (a.type === "settings") {
      openSettings();
      return;
    }
    let f = alive.get(id);
    if (!f) {
      f = document.createElement("iframe");
      f.setAttribute(
        "sandbox",
        "allow-scripts allow-same-origin allow-forms allow-pointer-lock allow-downloads allow-popups allow-modals",
      );
      f.setAttribute(
        "allow",
        "fullscreen; accelerometer; gyroscope; camera; microphone; clipboard-read; clipboard-write; xr-spatial-tracking",
      );
      f.title = a.name;
      if (a.type === "url") {
        f.src = a.url;
      } else {
        f.src = URL.createObjectURL(new Blob([a.html], { type: "text/html" }));
      }
      frames.append(f);
      alive.set(id, f);
      if (alive.size > settings.maxOpen) {
        const [old, of] = alive.entries().next().value;
        if (old !== id) {
          of.remove();
          alive.delete(old);
        }
      }
    } else {
      alive.delete(id);
      alive.set(id, f);
    }
    frames.querySelectorAll("iframe").forEach((x) => {
      x.classList.toggle("on", x === f);
    });
    if (a.type === "url") {
      frameNote.textContent =
        "If this stays blank, the site blocks embedding. Long-press the app to edit it.";
      frameNote.hidden = false;
      setTimeout(() => {
        frameNote.hidden = true;
      }, 5000);
    } else {
      frameNote.hidden = true;
    }
    current = id;
    curName.textContent = a.name;
    appLayer.hidden = false;
    try {
      history.pushState({ app: id }, "");
    } catch (e) {}
    buzz(8);
    render();
  }

  function goHome(fromPop) {
    if (!current) return;
    current = null;
    appLayer.hidden = true;
    if (!fromPop && history.state && history.state.app) history.back();
  }
  bHome.addEventListener("click", () => goHome());
  window.addEventListener("popstate", () => {
    if (current) goHome(true);
    else if (!sheet.hidden) closeSheet();
  });

  /* ---------- tap + long-press ---------- */
  let lpTimer = null;
  let lpStart = null;
  let lpFired = false;
  document.addEventListener("pointerdown", (e) => {
    const t = e.target.closest(".app,.r");
    if (!t || !rootEl.contains(t)) return;
    lpFired = false;
    lpStart = [e.clientX, e.clientY];
    lpTimer = setTimeout(() => {
      lpFired = true;
      buzz(15);
      appMenu(t.dataset.id);
    }, 520);
  });
  document.addEventListener("pointermove", (e) => {
    if (
      lpStart &&
      Math.hypot(e.clientX - lpStart[0], e.clientY - lpStart[1]) > 10
    ) {
      clearTimeout(lpTimer);
      lpStart = null;
    }
  });
  document.addEventListener("pointerup", () => clearTimeout(lpTimer));
  document.addEventListener("click", (e) => {
    const t = e.target.closest(".app,.r");
    if (!t || !rootEl.contains(t)) return;
    if (lpFired) {
      lpFired = false;
      return;
    }
    launch(t.dataset.id);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const t = e.target.closest && e.target.closest(".app");
    if (!t || !rootEl.contains(t)) return;
    e.preventDefault();
    launch(t.dataset.id);
  });
  document.addEventListener("contextmenu", (e) => {
    if (e.target.closest && e.target.closest(".app") && rootEl.contains(e.target)) {
      e.preventDefault();
      appMenu(e.target.closest(".app").dataset.id);
    }
  });

  /* ---------- sheets ---------- */
  function openSheet(html) {
    sheetBody.innerHTML = html;
    sheet.hidden = false;
    scrim.hidden = false;
  }
  function closeSheet() {
    sheet.hidden = true;
    scrim.hidden = true;
  }
  scrim.addEventListener("click", closeSheet);

  function appMenu(id) {
    const a = apps.find((x) => x.id === id);
    if (!a) return;
    openSheet(
      `<div class="sheetHead">${iconHTML(a)}<h3>${esc(a.name)}</h3></div>` +
        (a.notes ? `<p class="muted">${esc(a.notes)}</p>` : "") +
        `<div class="menu">` +
        `<button class="mi" data-a="open">Open</button>` +
        `<button class="mi" data-a="fav">${a.fav ? "★ Remove from favourites" : "☆ Add to favourites"}</button>` +
        (a.system
          ? ""
          : `<button class="mi" data-a="edit">Edit details</button>` +
            (a.type === "html"
              ? `<button class="mi" data-a="export">Export single HTML file</button>`
              : "") +
            `<button class="mi danger" data-a="del">Delete</button>`) +
        `<button class="mi" data-a="close">Close</button></div>`,
    );
    sheetBody.onclick = async (e) => {
      const m = e.target.closest("[data-a]");
      if (!m) return;
      const act = m.dataset.a;
      if (act === "close") closeSheet();
      if (act === "open") {
        closeSheet();
        launch(id);
      }
      if (act === "fav") {
        if (
          !a.fav &&
          apps.filter((x) => x.fav).length >= settings.maxFavourites
        ) {
          toast(`Max ${settings.maxFavourites} favourites`);
          return;
        }
        a.fav = !a.fav;
        await save(a);
        closeSheet();
        toast(a.fav ? "Added to favourites" : "Removed from favourites");
      }
      if (act === "edit") editor(a);
      if (act === "export")
        download(
          new Blob([a.html], { type: "text/html" }),
          a.name.replace(/[^\w-]+/g, "-").toLowerCase() + ".html",
        );
      if (act === "del") {
        if (window.confirm(`Delete “${a.name}”? This can't be undone.`)) {
          await dbDel(a.id);
          const f = alive.get(a.id);
          if (f) {
            f.remove();
            alive.delete(a.id);
          }
          await load();
          render();
          closeSheet();
          toast("Deleted");
        }
      }
    };
  }

  async function save(a) {
    if (a.system) {
      const k = JSON.parse(localStorage.getItem(SYSFAV_KEY) || "{}");
      k[a.id] = a.fav;
      localStorage.setItem(SYSFAV_KEY, JSON.stringify(k));
    } else {
      await dbPut(a);
    }
    render();
  }

  function download(blob, name) {
    const u = URL.createObjectURL(blob);
    const l = document.createElement("a");
    l.href = u;
    l.download = name;
    document.body.appendChild(l);
    l.click();
    l.remove();
    setTimeout(() => URL.revokeObjectURL(u), 4000);
    toast("Exported " + name);
  }

  /* ---------- add / edit ---------- */
  function editor(a) {
    const isNew = !a;
    a = a || { name: "", icon: "", accent: "#6b7cff", notes: "", type: "html", html: "" };
    let mode = isNew ? "file" : a.type === "url" ? "url" : "code";
    openSheet(
      `<h3>${isNew ? "Add program" : "Edit program"}</h3>` +
        `<div class="seg" id="srcSeg"><button data-m="file">HTML FILE</button><button data-m="url">URL</button><button data-m="code">PASTE CODE</button></div>` +
        `<div id="srcBox"></div>` +
        `<div class="row"><div><label class="f" for="eName">Name</label><input class="inp" id="eName" value="${esc(
          a.name,
        )}" placeholder="My program"></div>` +
        `<div class="iconCol"><label class="f" for="eIcon">Icon</label><input class="inp" id="eIcon" value="${esc(
          a.icon,
        )}" maxlength="2" placeholder="✦"></div></div>` +
        `<div><label class="f" for="eCol">Accent</label><input type="color" class="inp" id="eCol" value="${esc(
          a.accent || "#6b7cff",
        )}"></div>` +
        `<div><label class="f" for="eNotes">Notes</label><textarea class="inp" id="eNotes">${esc(
          a.notes,
        )}</textarea></div>` +
        `<button class="btn" id="eSave">${isNew ? "Add to launcher" : "Save changes"}</button>`,
    );
    let fileHtmlContent = null;
    const seg = sheetBody.querySelector("#srcSeg");
    const box = sheetBody.querySelector("#srcBox");
    const paint = () => {
      seg.querySelectorAll("button").forEach((b) =>
        b.classList.toggle("on", b.dataset.m === mode),
      );
      if (mode === "file") {
        box.innerHTML = `<button class="btn ghost" id="pick">${
          fileHtmlContent ? "✓ File loaded — choose another" : "Choose .html from device"
        }</button>`;
        box.querySelector("#pick").onclick = () => fileHtml.click();
      } else if (mode === "url") {
        box.innerHTML =
          `<label class="f" for="eUrl">Web address</label><input class="inp" id="eUrl" value="${esc(
            a.url || "",
          )}" placeholder="https://…">` +
          `<p class="muted">Some sites block being framed; those will show blank.</p>`;
      } else {
        box.innerHTML = `<label class="f" for="eCode">HTML code</label><textarea class="inp" id="eCode" placeholder="<!DOCTYPE html>…">${esc(
          isNew ? "" : a.html || "",
        )}</textarea>`;
      }
    };
    seg.onclick = (e) => {
      const b = e.target.closest("button");
      if (b) {
        mode = b.dataset.m;
        paint();
      }
    };
    paint();
    fileHtml.onchange = (e) => {
      const f = e.target.files[0];
      if (!f) return;
      const r = new FileReader();
      r.onload = () => {
        fileHtmlContent = r.result;
        const nameInput = sheetBody.querySelector("#eName");
        if (nameInput && !nameInput.value)
          nameInput.value = f.name.replace(/\.html?$/i, "").replace(/[-_]+/g, " ");
        paint();
        toast("Loaded " + f.name);
      };
      r.readAsText(f);
      e.target.value = "";
    };
    sheetBody.querySelector("#eSave").onclick = async () => {
      const name = sheetBody.querySelector("#eName").value.trim();
      if (!name) {
        toast("Give it a name");
        return;
      }
      const o = Object.assign({}, a, {
        name,
        icon: sheetBody.querySelector("#eIcon").value.trim(),
        accent: sheetBody.querySelector("#eCol").value,
        notes: sheetBody.querySelector("#eNotes").value,
      });
      if (isNew) {
        o.id =
          "p-" +
          Date.now().toString(36) +
          Math.random().toString(36).slice(2, 6);
        o.created = Date.now();
        o.fav = false;
      }
      if (mode === "file") {
        if (fileHtmlContent != null) {
          o.type = "html";
          o.html = fileHtmlContent;
        } else if (isNew) {
          toast("Choose a file first");
          return;
        }
      }
      if (mode === "url") {
        const u = sheetBody.querySelector("#eUrl").value.trim();
        if (!/^https?:\/\//i.test(u)) {
          toast("Enter a full https:// address");
          return;
        }
        o.type = "url";
        o.url = u;
        delete o.html;
      }
      if (mode === "code") {
        const c = sheetBody.querySelector("#eCode").value;
        if (!c.trim()) {
          toast("Paste some HTML");
          return;
        }
        o.type = "html";
        o.html = c;
      }
      const f = alive.get(o.id);
      if (f) {
        f.remove();
        alive.delete(o.id);
      }
      await dbPut(o);
      await load();
      render();
      closeSheet();
      toast(isNew ? "Added " + name : "Saved");
    };
  }
  bAdd.addEventListener("click", () => editor());
  bSet.addEventListener("click", () => openSettings());

  /* ---------- settings ---------- */
  function openSettings() {
    const installable = !isRunningAsApp();
    openSheet(
      `<h3>Settings</h3>` +
        `<p class="muted">${esc(settings.title)} · <span id="ae-setCount">${
          apps.length
        }</span> apps · stored offline in IndexedDB on this device.</p>` +
        `<button class="btn" id="ae-installBtn" ${
          installable && installEvent ? "" : "disabled"
        }>${isRunningAsApp() ? esc(settings.installedLabel) : esc(settings.installLabel)}</button>` +
        `<p class="muted" id="ae-installHint">${
          isRunningAsApp()
            ? esc(settings.runningHint)
            : installEvent
              ? ""
              : esc(settings.unsupportedHint)
        }</p>` +
        `<button class="btn ghost" id="bExp">Export backup (JSON)</button>` +
        `<button class="btn ghost" id="bImp">Import backup</button>` +
        `<p class="muted">Tip: long-press (or right-click) any app for Open / Favourite / Edit / Delete.</p>`,
    );
    sheetBody.querySelector("#bExp").onclick = exportAll;
    sheetBody.querySelector("#bImp").onclick = () => fileJson.click();
    const ib = sheetBody.querySelector("#ae-installBtn");
    ib.onclick = async () => {
      if (!installEvent) return;
      const { outcome } = await installEvent.prompt();
      if (outcome === "accepted") ib.disabled = true;
    };
  }

  async function exportAll() {
    const progs = await dbAll();
    const data = {
      app: settings.title,
      version: 1,
      exported: new Date().toISOString(),
      sysfav: JSON.parse(localStorage.getItem(SYSFAV_KEY) || "{}"),
      programs: progs,
    };
    window.__lastExport = data;
    download(
      new Blob([JSON.stringify(data)], { type: "application/json" }),
      "blacknode-launcher-backup-" +
        new Date().toISOString().slice(0, 10) +
        ".json",
    );
  }
  fileJson.onchange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = async () => {
      try {
        const d = JSON.parse(r.result);
        if (!Array.isArray(d.programs)) throw 0;
        for (const p of d.programs) if (p && p.id && p.name) await dbPut(p);
        if (d.sysfav) localStorage.setItem(SYSFAV_KEY, JSON.stringify(d.sysfav));
        await load();
        applySysFav();
        render();
        closeSheet();
        toast("Imported " + d.programs.length + " programs");
      } catch (err) {
        toast("That isn't a launcher backup");
      }
    };
    r.readAsText(f);
    e.target.value = "";
  };

  function applySysFav() {
    const k = JSON.parse(localStorage.getItem(SYSFAV_KEY) || "{}");
    SYS.forEach((s) => {
      if (s.id in k) s.fav = k[s.id];
    });
  }

  /* ---------- boot: system apps only, no bundled seeds ---------- */
  (async () => {
    applySysFav();
    try {
      await openDB();
      await migrateFromOldKeys();
      await load();
    } catch (e) {
      console.error(e);
      apps = [...SYS];
      toast("Storage unavailable — running in memory");
    }
    render();
    window.__ready = true;
  })();

  // One-time move from the previous keys, so apps/notes saved under the
  // old name carry over instead of looking wiped.
  async function migrateFromOldKeys() {
    try {
      if ((await dbAll()).length) return;
      const oldProgs = await new Promise((res) => {
        const r = indexedDB.open(OLD_DB, 1);
        let done = false;
        const finish = (v) => {
          if (!done) {
            done = true;
            res(v);
          }
        };
        r.onupgradeneeded = () => {
          try {
            r.result.createObjectStore("programs", { keyPath: "id" });
          } catch (e) {}
        };
        r.onsuccess = () => {
          const db2 = r.result;
          try {
            const q = db2
              .transaction("programs", "readonly")
              .objectStore("programs")
              .getAll();
            q.onsuccess = () => {
              finish(q.result || []);
              db2.close();
            };
            q.onerror = () => {
              finish([]);
              db2.close();
            };
          } catch (e) {
            finish([]);
            try {
              db2.close();
            } catch (e2) {}
          }
        };
        r.onerror = () => finish([]);
        r.onblocked = () => finish([]);
      });
      for (const p of oldProgs) {
        if (p && p.id && p.name) {
          try {
            await dbPut(p);
          } catch (e) {}
        }
      }
      const oldFav = localStorage.getItem(OLD_SYSFAV);
      if (oldFav && !localStorage.getItem(SYSFAV_KEY))
        localStorage.setItem(SYSFAV_KEY, oldFav);
      const oldNotes = localStorage.getItem(OLD_NOTES);
      if (oldNotes && !localStorage.getItem(NOTES_KEY))
        localStorage.setItem(NOTES_KEY, oldNotes);
    } catch (e) {}
  }
}
