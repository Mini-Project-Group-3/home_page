import { useEffect, useRef, useState } from "react";
import { Globe, ChevronDown } from "lucide-react";

const LANGUAGES = [
  { code: "en", native: "English", label: "English" },
  { code: "hi", native: "हिंदी", label: "Hindi" },
  { code: "mr", native: "मराठी", label: "Marathi" },
];

const LS_KEY = "s2h_lang";
const DEFAULT_LANG = "en";
const PAGE_LANG = "en";

// Suppress Google Translate default UI globally (once)
function injectSuppressStyles() {
  if (document.getElementById("s2h-gt-suppress")) return;
  const style = document.createElement("style");
  style.id = "s2h-gt-suppress";
  style.textContent = `
    .goog-te-banner-frame { display: none !important; }
    iframe.skiptranslate { display: none !important; }
    body { top: 0 !important; position: static !important; margin-top: 0 !important; padding-top: 0 !important; }
    #google_translate_element { position: absolute !important; top: 0 !important; left: 0 !important; width: 1px !important; height: 1px !important; overflow: hidden !important; opacity: 0.0001 !important; z-index: -10 !important; pointer-events: none; }
    .goog-logo-link, .goog-te-gadget, .goog-te-gadget-simple { display: none !important; }
    .goog-te-spinner-pos { display: none !important; }
    font[face] { background: none !important; box-shadow: none !important; }
  `;
  document.head.appendChild(style);
}

function setGoogTransCookie(langCode: string) {
  const val = langCode === DEFAULT_LANG ? "/en/en" : `/${PAGE_LANG}/${langCode}`;
  const opts = ";path=/;SameSite=None;Secure";
  document.cookie = `googtrans=${val}${opts}`;
  document.cookie = `googtrans=${val};domain=${location.hostname}${opts}`;
}

function clearGoogTransCookie() {
  const expire = ";expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/";
  document.cookie = `googtrans=${expire}`;
  document.cookie = `googtrans=${expire};domain=${location.hostname}`;
}

function triggerGoogleCombo(langCode: string): boolean {
  const combo = document.querySelector(".goog-te-combo") as HTMLSelectElement | null;
  if (!combo || combo.options.length === 0) return false;

  let valToSet = langCode;

  if (langCode === DEFAULT_LANG) {
    clearGoogTransCookie();
  } else {
    setGoogTransCookie(langCode);
  }

  let targetIndex = -1;
  for (let i = 0; i < combo.options.length; i++) {
    if (combo.options[i].value === valToSet || (langCode === DEFAULT_LANG && combo.options[i].value === "")) {
      targetIndex = i;
      valToSet = combo.options[i].value;
      break;
    }
  }

  if (targetIndex !== -1) {
    combo.selectedIndex = targetIndex;
  }

  try {
    const nativeSetter = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, "value");
    if (nativeSetter?.set) {
      nativeSetter.set.call(combo, valToSet);
    } else {
      combo.value = valToSet;
    }
  } catch {
    combo.value = valToSet;
  }

  const evt = document.createEvent("HTMLEvents");
  evt.initEvent("change", true, true);
  combo.dispatchEvent(evt);

  try { combo.dispatchEvent(new Event("change", { bubbles: true })); } catch {}
  try { combo.dispatchEvent(new Event("input", { bubbles: true })); } catch {}

  return true;
}

function applyLanguage(langCode: string, maxMs = 12000) {
  if (langCode === DEFAULT_LANG) {
    clearGoogTransCookie();
  } else {
    setGoogTransCookie(langCode);
  }

  const start = Date.now();
  function attempt() {
    if (triggerGoogleCombo(langCode)) return;
    if (Date.now() - start >= maxMs) return;
    setTimeout(attempt, 300);
  }
  attempt();
}

function getSavedLang(): string {
  try { return localStorage.getItem(LS_KEY) || DEFAULT_LANG; } catch { return DEFAULT_LANG; }
}

function saveLang(code: string) {
  try { localStorage.setItem(LS_KEY, code); } catch {}
}

// Ensure GT script + host div loaded only once globally
let gtLoaded = false;
function loadGoogleTranslate() {
  if (gtLoaded) return;
  gtLoaded = true;

  if (!document.getElementById("google_translate_element")) {
    const host = document.createElement("div");
    host.id = "google_translate_element";
    document.body.appendChild(host);
  }

  (window as any).googleTranslateElementInit = () => {
    try {
      new (window as any).google.translate.TranslateElement(
        {
          pageLanguage: PAGE_LANG,
          includedLanguages: "en,hi,mr",
          layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: true,
        },
        "google_translate_element"
      );
    } catch {}

    // Restore saved language
    const saved = getSavedLang();
    if (saved !== DEFAULT_LANG) {
      setTimeout(() => applyLanguage(saved), 1000);
    }
  };

  const script = document.createElement("script");
  script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
  script.async = true;
  document.head.appendChild(script);

  // Banner suppression poller
  const killer = setInterval(() => {
    const banner = document.querySelector(".goog-te-banner-frame") as HTMLElement | null;
    if (banner) banner.style.cssText = "display:none!important";
    const bTop = window.getComputedStyle(document.body).getPropertyValue("top");
    if (bTop && bTop !== "0px" && bTop !== "auto") {
      document.body.style.setProperty("top", "0", "important");
      document.body.style.position = "static";
    }
  }, 400);
  setTimeout(() => clearInterval(killer), 15000);
}

const GoogleTranslate = () => {
  const [open, setOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState(getSavedLang());
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    injectSuppressStyles();
    loadGoogleTranslate();

    // If GT is already loaded (navigated from another page), restore language
    if ((window as any).google?.translate) {
      const saved = getSavedLang();
      if (saved !== DEFAULT_LANG) {
        setTimeout(() => applyLanguage(saved), 500);
      }
    }
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const selectLanguage = (code: string) => {
    saveLang(code);
    setCurrentLang(code);
    applyLanguage(code);
    setOpen(false);
  };

  const currentLabel = LANGUAGES.find((l) => l.code === currentLang)?.native || "English";

  return (
    <div ref={wrapRef} className="relative notranslate" translate="no">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
        className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card/80 backdrop-blur-sm px-3 py-1.5 text-sm font-medium text-foreground shadow-sm hover:bg-accent transition-colors"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Select language"
      >
        <Globe className="h-4 w-4 text-muted-foreground" />
        <span>{currentLabel}</span>
        <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label="Available languages"
          className="absolute right-0 top-full mt-1 z-50 min-w-[140px] rounded-lg border border-border bg-card shadow-lg overflow-hidden"
        >
          {LANGUAGES.map((lang) => (
            <li
              key={lang.code}
              role="option"
              aria-selected={lang.code === currentLang}
              onClick={() => selectLanguage(lang.code)}
              className={`flex items-center justify-between px-3 py-2 text-sm cursor-pointer transition-colors hover:bg-accent ${
                lang.code === currentLang ? "bg-accent/60 font-semibold" : ""
              }`}
            >
              <span>{lang.native}</span>
              <span className="text-xs text-muted-foreground">{lang.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GoogleTranslate;
