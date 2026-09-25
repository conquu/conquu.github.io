/* GezPlan sayfası — gezi kartı teması ve "Kimler dahil?" demosu
   Metinler sayfanın diline (html lang) göre seçilir. Hesap, uygulamadaki
   kuruş mantığıyla aynı: taban pay + artık, dahil olanların sırasına göre dağıtılır. */
(function () {
  var L = document.documentElement.lang === "en" ? "en" : "tr";

  var TEXT = {
    tr: {
      everyone: function (n) { return "Kimler dahil: Herkes (" + n + " kişi)"; },
      partial: function (n) { return "Kimler dahil: " + n + " kişi"; },
      nobody: "Kimse borçlu değil. Ece kendi harcamasını ödedi.",
      atLeastOne: "En az bir kişi dahil olmalı.",
      locale: "tr-TR",
      money: function (s) { return s + " ₺"; },
      amountK: 90000
    },
    en: {
      everyone: function (n) { return "Included: Everyone (" + n + " people)"; },
      partial: function (n) { return "Included: " + n + " people"; },
      nobody: "Nobody owes anything. Ece paid for her own expense.",
      atLeastOne: "At least one person has to be included.",
      locale: "en-US",
      money: function (s) { return "$" + s; },
      amountK: 9000
    }
  }[L];

  var THEMES = {
    kamp: {
      t1: "#2E7D5B", t2: "#43A57C", emoji: "⛺", days: 11, ready: "4/9",
      tr: { title: "Abant kampı", place: "Abant Gölü, Bolu" },
      en: { title: "Lake camping", place: "Abant Lake, Bolu" }
    },
    deniz: {
      t1: "#2F80C4", t2: "#56A8E0", emoji: "🏖️", days: 23, ready: "2/5",
      tr: { title: "Antalya", place: "Konyaaltı, Antalya" },
      en: { title: "Antalya", place: "Konyaaltı, Antalya" }
    },
    piknik: {
      t1: "#D96F24", t2: "#F2A65A", emoji: "🧺", days: 3, ready: "6/7",
      tr: { title: "Pazar pikniği", place: "Belgrad Ormanı, İstanbul" },
      en: { title: "Sunday picnic", place: "Belgrad Forest, Istanbul" }
    },
    doga: {
      t1: "#8A5E36", t2: "#B98A5E", emoji: "🥾", days: 38, ready: "1/8",
      tr: { title: "Kaçkar yürüyüşü", place: "Yukarı Kavrun, Rize" },
      en: { title: "Kaçkar hike", place: "Upper Kavrun, Rize" }
    }
  };

  /* ---- gezi turu temasi ---- */
  var root = document.documentElement;
  var themeButtons = document.querySelectorAll("[data-theme-key]");

  function setTheme(key) {
    var th = THEMES[key];
    if (!th) return;
    root.style.setProperty("--t1", th.t1);
    root.style.setProperty("--t2", th.t2);
    document.getElementById("tcEmoji").textContent = th.emoji;
    document.getElementById("tcTitle").textContent = th[L].title;
    document.getElementById("tcPlace").textContent = th[L].place;
    document.getElementById("tcDays").textContent = th.days;
    document.getElementById("tcReady").textContent = th.ready;
    themeButtons.forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-theme-key") === key ? "true" : "false");
    });
  }

  themeButtons.forEach(function (b) {
    b.addEventListener("click", function () { setTheme(b.getAttribute("data-theme-key")); });
  });

  /* ---- kimler dahil demosu ---- */
  var ORDER = ["Ece", "Mert", "Selin", "Kaan"];
  var PAYER = "Ece";
  var included = ORDER.slice();
  var peopleButtons = document.querySelectorAll("[data-person]");
  var msg = document.getElementById("splitMsg");
  var lines = document.getElementById("planLines");
  var label = document.getElementById("incLabel");
  if (!lines || !label) return;

  function fmt(k) {
    var digits = k % 100 !== 0 ? 2 : 0;
    return TEXT.money((k / 100).toLocaleString(TEXT.locale, { minimumFractionDigits: digits, maximumFractionDigits: digits }));
  }

  function render() {
    var n = included.length;
    label.textContent = n === ORDER.length ? TEXT.everyone(n) : TEXT.partial(n);

    var base = Math.floor(TEXT.amountK / n);
    var rem = TEXT.amountK - base * n;
    lines.innerHTML = "";
    var debtors = 0;
    included.forEach(function (name, idx) {
      if (name === PAYER) return;
      var share = base + (idx < rem ? 1 : 0);
      var row = document.createElement("div");
      row.className = "plan-line";
      var who = document.createElement("span");
      who.textContent = name + " → " + PAYER;
      var amt = document.createElement("b");
      amt.textContent = fmt(share);
      row.appendChild(who);
      row.appendChild(amt);
      lines.appendChild(row);
      debtors++;
    });
    if (debtors === 0) {
      var none = document.createElement("div");
      none.className = "plan-line";
      none.textContent = TEXT.nobody;
      lines.appendChild(none);
    }
    peopleButtons.forEach(function (b) {
      b.setAttribute("aria-pressed", included.indexOf(b.getAttribute("data-person")) !== -1 ? "true" : "false");
    });
  }

  peopleButtons.forEach(function (b) {
    b.addEventListener("click", function () {
      var name = b.getAttribute("data-person");
      var i = included.indexOf(name);
      msg.textContent = "";
      if (i !== -1) {
        if (included.length <= 1) { msg.textContent = TEXT.atLeastOne; return; }
        included.splice(i, 1);
      } else {
        included = ORDER.filter(function (p) { return p === name || included.indexOf(p) !== -1; });
      }
      render();
    });
  });

  render();
})();
