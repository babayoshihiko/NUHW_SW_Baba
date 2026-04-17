document.addEventListener("DOMContentLoaded", () => {

  // ===== 設定 =====
  const supportedLangs = ["ja","en","fr","de","es","zh","ko","it","pt","ru"];
  const browserLang = navigator.language.slice(0, 2);
  const origin = window.location.origin;

  // ===== basePath（GitHub Pages対応）=====
  const parts = window.location.pathname.split("/");
  let basePath = "";

  if (parts.length > 2 && !/^[a-z]{2}$/i.test(parts[1])) {
    basePath = `/${parts[1]}`;
  }

  // ===== basePath除去関数（超重要）=====
  function stripBasePath(p) {
    if (basePath && p.startsWith(basePath)) {
      return p.slice(basePath.length);
    }
    return p;
  }

  // ===== 現在言語（URL優先）=====
  function getCurrentLang() {
    let path = stripBasePath(window.location.pathname);
    const segs = path.split("/").filter(Boolean);
    const first = segs[0];

    if (supportedLangs.includes(first)) return first;

    return supportedLangs.includes(browserLang) ? browserLang : "en";
  }

  const currentLang = getCurrentLang();

  // ==================================================
  // 🔽 nav-link（通常リンク）
  // ==================================================
  document.querySelectorAll("a.nav-link").forEach(a => {

    const href = a.getAttribute("href");
    if (!href || href.startsWith("#")) return;

    let url;
    try {
      url = new URL(href, origin);
    } catch {
      return;
    }

    if (url.origin !== origin) return;

    let path = url.pathname;

    // "/" → index.html
    if (path === "/" || path === "") {
      path = "/index.html";
    }

    // ★ basePath除去（最重要）
    path = stripBasePath(path);

    // 言語除去
    path = path.replace(/^\/?([a-z]{2})\//i, "");

    // 先頭スラッシュ削除
    path = path.replace(/^\/+/, "");

    if (!path.endsWith(".html")) return;

    const newHref = `${basePath}/${currentLang}/${path}`;
    a.setAttribute("href", newHref);
  });

  // ==================================================
  // 🔽 Language Selector（dropdown）
  // ==================================================
  document.querySelectorAll("a.dropdown-item").forEach(a => {

    const href = a.getAttribute("href");
    if (!href || href.startsWith("#")) return;

    let url;
    try {
      url = new URL(href, origin);
    } catch {
      return;
    }

    if (url.origin !== origin) return;

    const segs = url.pathname.split("/").filter(Boolean);
    const targetLang = segs[0];

    if (!supportedLangs.includes(targetLang)) return;

    // 現在ページ取得
    let currentPath = stripBasePath(window.location.pathname);

    if (currentPath.endsWith("/")) {
      currentPath += "index.html";
    }

    let page = currentPath.split("/").pop();

    const newHref = `${basePath}/${targetLang}/${page}`;
    a.setAttribute("href", newHref);
  });

});
