(function () {
  "use strict";

  var html = document.documentElement;
  var KEY = "mra-lang";
  var BRANCHES = window.BRANCHES || [];

  var PROGRAMS = [
    ["boxing", "Boxing", "الملاكمة"],
    ["kickboxing", "Kickboxing", "الكيك بوكسينج"],
    ["self-defense", "Self-Defense", "الدفاع عن النفس"],
    ["combat-fitness", "Combat Fitness", "اللياقة القتالية"],
    ["kids", "Kids Boxing", "ملاكمة الأطفال"],
    ["yoga", "Yoga & Recovery", "اليوجا والتعافي"],
    ["not-sure", "Not sure yet", "لست متأكدًا بعد"]
  ];

  function lang() { return html.getAttribute("data-lang") === "ar" ? "ar" : "en"; }
  function pick(en, ar) { return lang() === "ar" ? ar : en; }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  /* WhatsApp needs a full international number. Prefer a branch number that
     has the usual 11 digits so a mistyped source number is never used. */
  function waNumber(b) {
    var good = b.phones.filter(function (p) { return p.length === 11; });
    return "2" + (good.length ? good[0] : b.phones[0]);
  }

  /* ---------- Branch rendering ---------- */
  function renderBranchGrid() {
    var grid = document.getElementById("branchGrid");
    if (!grid) return;
    var ar = lang() === "ar";
    grid.innerHTML = BRANCHES.map(function (b, i) {
      var mapQuery = encodeURIComponent("Mohamed Reda Boxing Academy " + b.name_en + " " + b.addr_en + " Cairo Egypt");
      var phones = b.phones.map(function (p) {
        return '<a href="tel:+2' + p + '">' + p + "</a>";
      }).join("");
      return (
        '<div class="branch-card">' +
          '<div class="bnum">' + String(i + 1).padStart(2, "0") + " / " + String(BRANCHES.length).padStart(2, "0") + "</div>" +
          "<h3>" + esc(ar ? b.name_ar : b.name_en) + "</h3>" +
          '<p class="baddr">' + esc(ar ? b.addr_ar : b.addr_en) + "</p>" +
          '<div class="branch-phones">' + phones + "</div>" +
          '<div class="branch-cta">' +
            '<a href="https://www.google.com/maps/search/?api=1&query=' + mapQuery + '" target="_blank" rel="noopener" class="btn btn--outline btn--sm">' + (ar ? "الاتجاهات" : "Directions") + "</a>" +
            '<a href="https://wa.me/' + waNumber(b) + '" target="_blank" rel="noopener" class="btn btn--primary btn--sm">WhatsApp</a>' +
          "</div>" +
        "</div>"
      );
    }).join("");
  }

  function renderBranchTiles() {
    var wrap = document.getElementById("branchTiles");
    if (!wrap) return;
    var ar = lang() === "ar";
    wrap.innerHTML = BRANCHES.map(function (b) {
      return (
        '<a class="branch-tile" href="branches.html">' +
          '<span class="bt-name">' + esc(ar ? b.name_ar : b.name_en) + "</span>" +
          '<span class="bt-area">' + esc(ar ? b.area_ar : b.area_en) + "</span>" +
        "</a>"
      );
    }).join("");
  }

  /* Selects are built here (not duplicated in HTML) because iOS Safari ignores
     display:none on <option>, which would show every option twice. */
  function fillSelect(id, items, labelFn) {
    var sel = document.getElementById(id);
    if (!sel) return;
    var keep = sel.value;
    sel.innerHTML = "";
    items.forEach(function (item, i) {
      var o = document.createElement("option");
      o.value = item.value !== undefined ? item.value : String(i);
      o.textContent = labelFn(item, i);
      sel.appendChild(o);
    });
    if (keep) sel.value = keep;
  }

  function renderSelects() {
    var ar = lang() === "ar";
    fillSelect("f-branch",
      BRANCHES.map(function (b, i) { return { value: String(i), b: b }; }),
      function (it) { return ar ? it.b.name_ar : it.b.name_en; });
    fillSelect("f-program",
      PROGRAMS.map(function (p) { return { value: p[0], p: p }; }),
      function (it) { return ar ? it.p[2] : it.p[1]; });
  }

  function renderDynamic() {
    renderBranchGrid();
    renderBranchTiles();
    renderSelects();
  }

  /* ---------- Language ---------- */
  function setLang(l, persist) {
    html.setAttribute("data-lang", l);
    html.setAttribute("lang", l);
    var t = html.getAttribute(l === "ar" ? "data-title-ar" : "data-title-en");
    if (t) document.title = t;
    document.querySelectorAll("[data-set-lang]").forEach(function (btn) {
      btn.setAttribute("aria-pressed", btn.getAttribute("data-set-lang") === l ? "true" : "false");
    });
    if (persist) { try { localStorage.setItem(KEY, l); } catch (e) {} }
    renderDynamic();
  }
  document.querySelectorAll("[data-set-lang]").forEach(function (btn) {
    btn.addEventListener("click", function () { setLang(btn.getAttribute("data-set-lang"), true); });
  });
  setLang(lang(), false);

  /* ---------- Mobile nav ---------- */
  var navToggle = document.getElementById("navToggle");
  var mainNav = document.getElementById("main-nav");
  function closeNav() {
    if (!mainNav) return;
    mainNav.classList.remove("is-open");
    if (navToggle) navToggle.setAttribute("aria-expanded", "false");
  }
  if (navToggle && mainNav) {
    navToggle.addEventListener("click", function () {
      var open = mainNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    mainNav.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", closeNav); });
    document.addEventListener("click", function (e) {
      if (!mainNav.contains(e.target) && !navToggle.contains(e.target)) closeNav();
    });
  }

  /* ---------- Gallery lightbox ---------- */
  var lightbox = document.getElementById("lightbox");
  if (lightbox) {
    var lightboxImg = document.getElementById("lightboxImg");
    document.querySelectorAll(".g-tile:not([disabled])").forEach(function (tile) {
      tile.addEventListener("click", function () {
        var img = tile.querySelector("img");
        if (!img) return;
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add("is-open");
      });
    });
    document.getElementById("lightboxClose").addEventListener("click", function () { lightbox.classList.remove("is-open"); });
    lightbox.addEventListener("click", function (e) { if (e.target === lightbox) lightbox.classList.remove("is-open"); });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeNav();
      if (lightbox) lightbox.classList.remove("is-open");
    }
  });

  /* ---------- Contact form: sends the request to the chosen branch on WhatsApp ---------- */
  var form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var ar = lang() === "ar";
      var b = BRANCHES[parseInt(form.elements.branch.value, 10)] || BRANCHES[0];
      var prog = PROGRAMS.filter(function (p) { return p[0] === form.elements.program.value; })[0] || PROGRAMS[0];
      var msg = form.elements.message.value.trim();
      var lines = ar
        ? ["مرحبًا، أود حجز حصة تجريبية.",
           "الاسم: " + form.elements.name.value.trim(),
           "الهاتف: " + form.elements.phone.value.trim(),
           "الفرع: " + b.name_ar,
           "البرنامج: " + prog[2]]
        : ["Hello, I'd like to book a trial class.",
           "Name: " + form.elements.name.value.trim(),
           "Phone: " + form.elements.phone.value.trim(),
           "Branch: " + b.name_en,
           "Program: " + prog[1]];
      if (msg) lines.push((ar ? "رسالة: " : "Message: ") + msg);
      window.open("https://wa.me/" + waNumber(b) + "?text=" + encodeURIComponent(lines.join("\n")), "_blank", "noopener");
      document.getElementById("formSuccess").classList.add("is-shown");
    });
  }

  /* ---------- Footer year ---------- */
  var y = String(new Date().getFullYear());
  ["year", "year2"].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.textContent = y;
  });

  /* ---------- Header shadow on scroll ---------- */
  var header = document.querySelector(".site-header");
  if (header) {
    window.addEventListener("scroll", function () {
      header.style.boxShadow = window.scrollY > 8 ? "0 6px 20px rgba(0,0,0,.25)" : "none";
    }, { passive: true });
  }
})();
