(function () {
  const LANG_KEY = "ifshhe_lang";
  const langButton = document.getElementById("lang-button");
  const langMenu = document.getElementById("lang-menu");
  const langItems = [...langMenu.querySelectorAll("[data-lang]")];

  function storedLang() {
    try { return localStorage.getItem(LANG_KEY); } catch { return null; }
  }

  function setLang(lang) {
    if (!window.IFSHHE_I18N[lang]) lang = "en";
    const html = document.documentElement;
    html.lang = lang;
    html.dir = window.IFSHHE_RTL.includes(lang) ? "rtl" : "ltr";
    document.getElementById("lang-current").textContent = window.IFSHHE_LANG_NAMES[lang];
    langItems.forEach((item) => item.setAttribute("aria-checked", String(item.dataset.lang === lang)));

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      el.textContent = t(el.dataset.i18n, lang);
    });
    document.querySelectorAll("[data-i18n-alt]").forEach((el) => {
      el.alt = t(el.dataset.i18nAlt, lang);
    });

    try { localStorage.setItem(LANG_KEY, lang); } catch {}
    document.dispatchEvent(new CustomEvent("langchange", { detail: lang }));
  }

  // Language menu
  function setMenuOpen(open) {
    langMenu.hidden = !open;
    langButton.setAttribute("aria-expanded", String(open));
    if (open) (langItems.find((i) => i.getAttribute("aria-checked") === "true") || langItems[0]).focus();
  }
  langButton.addEventListener("click", () => setMenuOpen(langMenu.hidden));
  langItems.forEach((item) => item.addEventListener("click", () => {
    setLang(item.dataset.lang);
    setMenuOpen(false);
    langButton.focus();
  }));
  langMenu.addEventListener("keydown", (e) => {
    const i = langItems.indexOf(document.activeElement);
    if (e.key === "ArrowDown") { e.preventDefault(); langItems[(i + 1) % langItems.length].focus(); }
    if (e.key === "ArrowUp") { e.preventDefault(); langItems[(i - 1 + langItems.length) % langItems.length].focus(); }
    if (e.key === "Escape") { setMenuOpen(false); langButton.focus(); }
  });
  document.addEventListener("click", (e) => {
    if (!langMenu.hidden && !e.target.closest(".lang")) setMenuOpen(false);
  });

  const initial = new URLSearchParams(location.search).get("lang")
    || storedLang()
    || (navigator.language || "en").slice(0, 2);
  if (initial !== "en") setLang(initial);

  // Mobile menu
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.getElementById("nav");
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  nav.addEventListener("click", (e) => {
    if (e.target.closest("a")) {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });

  // Members
  const list = document.getElementById("members-list");
  for (const m of window.IFSHHE_MEMBERS) {
    const card = document.createElement("article");
    card.className = "member";
    const avatar = document.createElement("div");
    avatar.className = "avatar";
    if (m.photo) {
      const img = document.createElement("img");
      img.src = m.photo;
      img.alt = "";
      img.loading = "lazy";
      avatar.append(img);
    } else {
      avatar.textContent = m.name.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
    }
    const name = document.createElement("h3");
    name.textContent = m.name;
    const role = document.createElement("p");
    role.textContent = m.role;
    card.append(avatar, name, role);
    list.append(card);
  }

  document.getElementById("year").textContent = new Date().getFullYear();

  // Visitor counter: counts once per browser session. Hidden if the
  // function isn't available (e.g. when opening the file locally).
  (async function visits() {
    const KEY = "ifshhe_counted";
    let counted = false;
    try { counted = sessionStorage.getItem(KEY) === "1"; } catch {}
    try {
      const res = await fetch("/api/visits", { method: counted ? "GET" : "POST" });
      if (!res.ok) return;
      const { count } = await res.json();
      if (typeof count !== "number") return;
      try { sessionStorage.setItem(KEY, "1"); } catch {}
      document.getElementById("visit-count").textContent = count.toLocaleString();
      document.getElementById("visits").hidden = false;
    } catch {}
  })();
})();
