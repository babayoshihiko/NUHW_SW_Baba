document.addEventListener("DOMContentLoaded", () => {

  const supportedLangs = ["ja","en","fr","de","es","zh","ko","it","pt","ru"];
  const browserLang = navigator.language.slice(0, 2);
  const origin = window.location.origin;

  // ===== basePath =====
  const parts = window.location.pathname.split("/");
  let basePath = "";

  if (parts.length > 2 && !/^[a-z]{2}$/i.test(parts[1])) {
    basePath = `/${parts[1]}`;
  }

  // ===== 現在言語 =====
  function getCurrentLang() {
    let path = window.location.pathname;

    if (basePath && path.startsWith(basePath)) {
      path = path.slice(basePath.length);
    }

    const segs = path.split("/").filter(Boolean);
    const first = segs[0];

    if (supportedLangs.includes(first)) return first;

    return supportedLangs.includes(browserLang) ? browserLang : "en";
  }

  const currentLang = getCurrentLang();

  // ===== nav-link =====
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

    // ===== ここがポイント =====
    // "/" のときだけ index.html にする
    if (path === "/" || path === "") {
      path = "/index.html";
    }

    // 言語プレフィックス除去
    path = path.replace(/^\/?([a-z]{2})\//i, "");

    // 先頭スラッシュ削除
    path = path.replace(/^\/+/, "");

    // html以外無視
    if (!path.endsWith(".html")) return;

    const newHref = `${basePath}/${currentLang}/${path}`;

    a.setAttribute("href", newHref);
  });

  // ===== dropdown（言語切替）=====
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
    let currentPath = window.location.pathname;

    if (currentPath.endsWith("/")) {
      currentPath += "index.html";
    }

    let page = currentPath.split("/").pop();

    const newHref = `${basePath}/${targetLang}/${page}`;

    a.setAttribute("href", newHref);
  });

});