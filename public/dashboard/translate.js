/**
 * translate.js  – Seed2Harvest multilingual layer
 * ─────────────────────────────────────────────────────────────────
 * Strategy:
 *   1. Load Google Translate widget silently (hidden host div).
 *   2. Use TWO mechanisms to change language (belt + braces):
 *      a. Set the `googtrans` cookie  → tells GT which lang to use
 *      b. Native-value-set on .goog-te-combo + real DOM change event
 *         (React-style setter trick so GT's internal listener fires)
 *   3. Persist choice in localStorage; restore on load.
 *   4. Suppress all Google default chrome (banner, branding).
 *   5. Custom pill-dropdown UI mounted inside the header.
 * ─────────────────────────────────────────────────────────────────
 */
(function () {
  "use strict";

  /* ─────────────────────────────────────────────
     1. Constants
  ───────────────────────────────────────────── */
  var LS_KEY      = "s2h_lang";
  var DEFAULT     = "en";
  var PAGE_LANG   = "en";          // source language of the page

  var LANGUAGES = [
    { code: "en", native: "English", label: "English"  },
    { code: "hi", native: "हिंदी",   label: "Hindi"    },
    { code: "mr", native: "मराठी",   label: "Marathi"  }
  ];

  /* ─────────────────────────────────────────────
     2. Suppress Google default UI immediately
        (injected before widget iframe appears so
         the browser never paints it)
  ───────────────────────────────────────────── */
  var suppressStyle = document.createElement("style");
  suppressStyle.id  = "s2h-gt-suppress";
  suppressStyle.textContent =
    /* Banner iframe Google slides in at the top */
    ".goog-te-banner-frame{display:none!important}" +
    "iframe.skiptranslate{display:none!important}" +
    /* Keeps body from shifting down */
    "body{top:0!important;position:static!important;margin-top:0!important;padding-top:0!important;}" +
    /* Hide the host div + default branding */
    "#google_translate_element{position:absolute!important;top:0!important;left:0!important;width:1px!important;height:1px!important;overflow:hidden!important;opacity:0.0001!important;z-index:-10!important;pointer-events:none;}" +
    ".goog-logo-link,.goog-te-gadget,.goog-te-gadget-simple{display:none!important}" +
    /* The translation spinner popup */
    ".goog-te-spinner-pos{display:none!important}" +
    /* Skip-translated links sometimes injected */
    "font[face]{background:none!important;box-shadow:none!important}";
  document.head.appendChild(suppressStyle);

  /* ─────────────────────────────────────────────
     3. Cookie helpers
        googtrans=/en/hi  → GT translates en→hi
  ───────────────────────────────────────────── */
  function setGoogTransCookie(langCode) {
    var val   = langCode === DEFAULT ? "/en/en" : "/" + PAGE_LANG + "/" + langCode;
    var opts  = ";path=/;SameSite=None;Secure";
    /* Set on current domain and parent domains for reliability */
    document.cookie = "googtrans=" + val + opts;
    document.cookie = "googtrans=" + val + ";domain=" + location.hostname + opts;
  }

  function clearGoogTransCookie() {
    var expire = ";expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/";
    document.cookie = "googtrans=" + expire;
    document.cookie = "googtrans=" + expire + ";domain=" + location.hostname;
  }

  /* ─────────────────────────────────────────────
     4. Core translation trigger
        Uses the React-style native setter trick
        to fire a real change event that Google's
        internal listener responds to.
  ───────────────────────────────────────────── */
  function triggerGoogleCombo(langCode) {
    var combo = document.querySelector(".goog-te-combo");
    if (!combo || combo.options.length === 0) return false;

    /* ── a. Cookie path (belt) ── */
    var valToSet = langCode;
    
    if (langCode === DEFAULT) {
      clearGoogTransCookie();
    } else {
      setGoogTransCookie(langCode);
    }

    /* ── b. Native-setter trick & selectedIndex (braces) ── */
    var targetIndex = -1;
    for (var i = 0; i < combo.options.length; i++) {
        if (combo.options[i].value === valToSet || (langCode === DEFAULT && combo.options[i].value === "")) {
            targetIndex = i;
            valToSet = combo.options[i].value; // update valToSet to actual value inside dropdown
            break;
        }
    }
    
    if (targetIndex !== -1) {
        combo.selectedIndex = targetIndex;
    }

    try {
      var nativeSetter = Object.getOwnPropertyDescriptor(
        HTMLSelectElement.prototype, "value"
      );
      if (nativeSetter && nativeSetter.set) {
        nativeSetter.set.call(combo, valToSet);
      } else {
        combo.value = valToSet;
      }
    } catch (e) {
      combo.value = valToSet;
    }

    /* Fire change event */
    var evt = document.createEvent("HTMLEvents");
    evt.initEvent("change", true, true);
    combo.dispatchEvent(evt);

    /* Also try the newer Event constructor for good measure */
    try { combo.dispatchEvent(new window.Event("change", { bubbles: true })); } catch(e) {}
    
    // Fallback: sometimes GT needs a 'change' event but we also need to trigger 'input'
    try { combo.dispatchEvent(new window.Event("input", { bubbles: true })); } catch(e) {}

    return true;
  }

  /**
   * Polls until .goog-te-combo is present, then applies the language.
   * @param {string} langCode
   * @param {number} [maxMs=12000] give up after this many ms
   */
  function applyLanguage(langCode, maxMs) {
    maxMs = maxMs || 12000;
    var start = Date.now();

    /* Set cookie immediately — even before the combo appears,
       so if the user refreshes the page the choice is honoured. */
    if (langCode === DEFAULT) {
      clearGoogTransCookie();
    } else {
      setGoogTransCookie(langCode);
    }

    function attempt() {
      if (triggerGoogleCombo(langCode)) return;   // success
      if (Date.now() - start >= maxMs) return;    // timeout
      setTimeout(attempt, 300);                   // retry
    }

    attempt();
  }

  /* ─────────────────────────────────────────────
     5. Persist & restore
  ───────────────────────────────────────────── */
  function saveLang(code) {
    try { localStorage.setItem(LS_KEY, code); } catch(e) {}
  }

  function getSavedLang() {
    try { return localStorage.getItem(LS_KEY) || DEFAULT; } catch(e) { return DEFAULT; }
  }

  function restoreLanguage() {
    var lang = getSavedLang();
    updateCustomUI(lang);
    if (lang !== DEFAULT) {
      /* Give widget extra time to fully initialise */
      setTimeout(function() { applyLanguage(lang); }, 1000);
    }
  }

  /* ─────────────────────────────────────────────
     6. Custom dropdown UI
  ───────────────────────────────────────────── */
  function buildDropdown() {
    var saved = getSavedLang();

    /* -- Wrapper -- */
    var wrap = document.createElement("div");
    wrap.id   = "s2h-lang-switcher";
    wrap.setAttribute("role", "navigation");
    wrap.setAttribute("aria-label", "Language selector");

    /* -- Trigger pill -- */
    var btn = document.createElement("button");
    btn.id   = "s2h-lang-trigger";
    btn.type = "button";
    btn.setAttribute("aria-haspopup",  "listbox");
    btn.setAttribute("aria-expanded",  "false");
    btn.setAttribute("aria-label",     "Select language");

    var globe = document.createElement("span");
    globe.className = "s2h-lang-globe";
    globe.setAttribute("aria-hidden", "true");
    globe.textContent = "🌐";

    var lbl = document.createElement("span");
    lbl.id        = "s2h-lang-label";
    lbl.className = "s2h-lang-label";

    var chev = document.createElement("span");
    chev.className = "s2h-lang-chevron";
    chev.setAttribute("aria-hidden", "true");
    chev.innerHTML =
      '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" ' +
      'stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">' +
      '<polyline points="5 8 10 13 15 8"/></svg>';

    btn.appendChild(globe);
    btn.appendChild(lbl);
    btn.appendChild(chev);

    /* -- List -- */
    var list = document.createElement("ul");
    list.id   = "s2h-lang-list";
    list.setAttribute("role",       "listbox");
    list.setAttribute("aria-label", "Available languages");

    LANGUAGES.forEach(function(lang) {
      var li = document.createElement("li");
      li.setAttribute("role",         "option");
      li.setAttribute("data-lang",    lang.code);
      li.setAttribute("tabindex",     "0");
      li.setAttribute("aria-selected", lang.code === saved ? "true" : "false");
      if (lang.code === saved) li.classList.add("s2h-lang-active");

      var nm = document.createElement("span");
      nm.className   = "s2h-lang-name";
      nm.textContent = lang.native;

      var sub = document.createElement("span");
      sub.className   = "s2h-lang-sub";
      sub.textContent = lang.label;

      li.appendChild(nm);
      li.appendChild(sub);

      li.addEventListener("click", function() { selectLanguage(lang.code); });
      li.addEventListener("keydown", function(e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          selectLanguage(lang.code);
        }
      });

      list.appendChild(li);
    });

    wrap.appendChild(btn);
    wrap.appendChild(list);

    /* -- Toggle open/close -- */
    btn.addEventListener("click", function(e) {
      e.stopPropagation();
      var isOpen = wrap.classList.toggle("s2h-lang-open");
      btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    document.addEventListener("click", function(e) {
      if (!wrap.contains(e.target) && wrap.classList.contains("s2h-lang-open")) {
        wrap.classList.remove("s2h-lang-open");
        btn.setAttribute("aria-expanded", "false");
      }
    });

    wrap.addEventListener("keydown", function(e) {
      if (e.key === "Escape") {
        wrap.classList.remove("s2h-lang-open");
        btn.setAttribute("aria-expanded", "false");
        btn.focus();
      }
    });

    updateCustomUI(saved);
    return wrap;
  }

  function updateCustomUI(code) {
    var lbl   = document.getElementById("s2h-lang-label");
    var items = document.querySelectorAll("#s2h-lang-list [data-lang]");
    var match = LANGUAGES.filter(function(l){ return l.code === code; })[0] || LANGUAGES[0];

    if (lbl) lbl.textContent = match.native;

    items.forEach(function(item) {
      var active = item.getAttribute("data-lang") === code;
      item.classList.toggle("s2h-lang-active", active);
      item.setAttribute("aria-selected", active ? "true" : "false");
    });
  }

  function selectLanguage(code) {
    saveLang(code);
    updateCustomUI(code);
    applyLanguage(code);

    /* close */
    var wrap = document.getElementById("s2h-lang-switcher");
    var btn  = document.getElementById("s2h-lang-trigger");
    if (wrap) wrap.classList.remove("s2h-lang-open");
    if (btn)  btn.setAttribute("aria-expanded", "false");
  }

  /* ─────────────────────────────────────────────
     7. Mount dropdown into the header
  ───────────────────────────────────────────── */
  function mountDropdown() {
    var logo = document.querySelector(".header-logo");
    var dropdown = buildDropdown();

    if (logo && logo.parentNode) {
      logo.parentNode.insertBefore(dropdown, logo.nextSibling);
    } else {
      var topbar = document.querySelector(".topbar");
      if (topbar) topbar.appendChild(dropdown);
      else document.body.appendChild(dropdown);
    }
  }

  /* ─────────────────────────────────────────────
     8. GT widget callback  (called by GT script)
  ───────────────────────────────────────────── */
  window.googleTranslateElementInit = function() {
    /* global google */
    try {
      new google.translate.TranslateElement(
        {
          pageLanguage:       PAGE_LANG,
          includedLanguages:  "en,hi,mr",
          layout:             google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay:        true
        },
        "google_translate_element"
      );
    } catch(e) { /* widget failed – cookie method still works on next load */ }

    restoreLanguage();
  };

  /* ─────────────────────────────────────────────
     9. Bootstrap
  ───────────────────────────────────────────── */
  function init() {
    /* Hidden host div that GT needs */
    if (!document.getElementById("google_translate_element")) {
      var host = document.createElement("div");
      host.id = "google_translate_element";
      document.body.appendChild(host);
    }

    /* Load GT script */
    var script   = document.createElement("script");
    script.src   = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.head.appendChild(script);

    /* Mount UI */
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", mountDropdown);
    } else {
      mountDropdown();
    }

    /* ── Banner-suppression poller (runs for 15 s after load) ── */
    var killer = setInterval(function() {
      /* Kill banner iframe */
      var banner = document.querySelector(".goog-te-banner-frame");
      if (banner) banner.style.cssText = "display:none!important";

      /* Kill body offset Google injects */
      var bTop = window.getComputedStyle(document.body).getPropertyValue("top");
      if (bTop && bTop !== "0px" && bTop !== "auto") {
        document.body.style.setProperty("top", "0", "important");
        document.body.style.position = "static";
      }

      /* Kill margin-top trick sometimes used */
      var bMt = window.getComputedStyle(document.body).getPropertyValue("margin-top");
      if (bMt && parseInt(bMt) > 0) {
        document.body.style.setProperty("margin-top", "0", "important");
      }
    }, 400);

    setTimeout(function() { clearInterval(killer); }, 15000);
  }

  init();

})();
