/* ConquApp — dil tercihi ve dil öneri bandı (tüm sayfalar)
   Tercih tarayıcıda saklanır; saklanamazsa sayfa yine normal çalışır. */
(function () {
  var KEY = "conquapp-lang";
  var pageLang = document.documentElement.lang === "en" ? "en" : "tr";

  function save(l) {
    try { localStorage.setItem(KEY, l); } catch (e) {}
  }
  function load() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }

  // Dil bağlantısına (üst menü veya bant) tıklanınca tercihi hatırla
  document.querySelectorAll("[data-set-lang]").forEach(function (a) {
    a.addEventListener("click", function () { save(a.getAttribute("data-set-lang")); });
  });

  // Tercih yoksa ve tarayıcı dili sayfanın dilinden farklıysa öneri bandını göster
  var banner = document.getElementById("langBanner");
  if (!banner) return;
  var browserLang = (navigator.language || "").toLowerCase().indexOf("tr") === 0 ? "tr" : "en";
  if (!load() && browserLang !== pageLang) banner.hidden = false;

  var close = banner.querySelector("[data-dismiss]");
  if (close) {
    close.addEventListener("click", function () {
      save(pageLang);
      banner.hidden = true;
    });
  }
})();
