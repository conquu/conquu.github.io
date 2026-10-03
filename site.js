/* ConquApp — tüm sayfalar: dil tercihi, koyu/açık tema, beliren bölümler,
   ana sayfadaki telefon ekranı döngüsü ve eğimi. Tercihler tarayıcıda saklanır;
   saklanamazsa sayfa yine normal çalışır. */
(function () {
  var root = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function save(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function load(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }

  /* ---- dil ---- */
  var LANG_KEY = "conquapp-lang";
  var pageLang = root.lang === "en" ? "en" : "tr";

  document.querySelectorAll("[data-set-lang]").forEach(function (a) {
    a.addEventListener("click", function () { save(LANG_KEY, a.getAttribute("data-set-lang")); });
  });

  var banner = document.getElementById("langBanner");
  if (banner) {
    var browserLang = (navigator.language || "").toLowerCase().indexOf("tr") === 0 ? "tr" : "en";
    if (!load(LANG_KEY) && browserLang !== pageLang) banner.hidden = false;
    var close = banner.querySelector("[data-dismiss]");
    if (close) close.addEventListener("click", function () { save(LANG_KEY, pageLang); banner.hidden = true; });
  }

  /* ---- koyu / açık tema ---- */
  var THEME_KEY = "conquapp-theme";
  var mq = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;

  function isDark() {
    var t = root.getAttribute("data-theme");
    if (t) return t === "dark";
    return !!(mq && mq.matches);
  }
  function syncIcon() { root.classList.toggle("is-dark", isDark()); }
  syncIcon();
  if (mq && mq.addEventListener) mq.addEventListener("change", syncIcon);

  var toggle = document.getElementById("themeToggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = isDark() ? "light" : "dark";
      root.setAttribute("data-theme", next);
      save(THEME_KEY, next);
      syncIcon();
    });
  }

  /* ---- görünür olunca başlayan kutular (geri sayım) ---- */
  var watched = document.querySelectorAll(".tile");
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("is-in");
          e.target.dispatchEvent(new CustomEvent("inview"));
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.12 });
    watched.forEach(function (el) { io.observe(el); });
  } else {
    watched.forEach(function (el) {
      el.classList.add("is-in");
      el.dispatchEvent(new CustomEvent("inview"));
    });
  }

  /* ---- beliren bölümler: kaydırma animasyonu olmayan tarayıcılar için ---- */
  var scrollAnim = window.CSS && CSS.supports && CSS.supports("animation-timeline: view()");
  if (!scrollAnim && !reduce && "IntersectionObserver" in window) {
    var reveals = document.querySelectorAll(".reveal");
    root.classList.add("io-reveal");
    var rio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-shown"); rio.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    reveals.forEach(function (el) { rio.observe(el); });
  }

  /* ---- ana sayfa: telefona fareyle hafif 3B eğim ---- */
  var stage = document.querySelector(".stage");
  var finePointer = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (stage && finePointer && !reduce) {
    stage.setAttribute("data-tilt", "");
    var phone = stage.querySelector(".phone");
    var raf = 0;
    stage.addEventListener("pointermove", function (ev) {
      if (raf) return;
      raf = requestAnimationFrame(function () {
        raf = 0;
        var r = stage.getBoundingClientRect();
        var x = (ev.clientX - r.left) / r.width - 0.5;
        var y = (ev.clientY - r.top) / r.height - 0.5;
        phone.style.setProperty("--ry", (x * 10).toFixed(2) + "deg");
        phone.style.setProperty("--rx", (y * -8).toFixed(2) + "deg");
      });
    });
    stage.addEventListener("pointerleave", function () {
      phone.style.setProperty("--ry", "0deg");
      phone.style.setProperty("--rx", "0deg");
    });
  }

  /* ---- ana sayfa: telefon ekranı döngüsü ---- */
  var cycler = document.querySelector("[data-cycle]");
  if (cycler) {
    var shots = cycler.querySelectorAll("img");
    var i = 0;
    shots[0].classList.add("is-on");
    if (!reduce && shots.length > 1) {
      setInterval(function () {
        if (document.hidden) return;
        shots[i].classList.remove("is-on");
        i = (i + 1) % shots.length;
        shots[i].classList.add("is-on");
      }, 3200);
    }
  }
})();
