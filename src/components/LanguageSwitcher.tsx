import { useEffect, useState } from "react";

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: any;
  }
}

const getLang = () =>
  /googtrans=\/ru\/en/.test(document.cookie) ? "en" : "ru";

const setCookie = (value: string | null) => {
  const host = window.location.hostname;
  const domains = ["", host, "." + host.split(".").slice(-2).join(".")];
  domains.forEach((d) => {
    const dom = d ? `;domain=${d}` : "";
    document.cookie = value
      ? `googtrans=${value};path=/${dom}`
      : `googtrans=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT${dom}`;
  });
};

let loaded = false;
const loadScript = () => {
  if (loaded) return;
  loaded = true;
  window.googleTranslateElementInit = () => {
    new window.google.translate.TranslateElement(
      { pageLanguage: "ru", includedLanguages: "en,ru", autoDisplay: false },
      "google_translate_element"
    );
  };
  const s = document.createElement("script");
  s.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
  s.async = true;
  document.body.appendChild(s);
};

const LanguageSwitcher = ({ className = "" }: { className?: string }) => {
  const [lang, setLang] = useState<"ru" | "en">("ru");

  useEffect(() => {
    const l = getLang();
    setLang(l);
    if (l === "en") loadScript();
  }, []);

  const change = (l: "ru" | "en") => {
    if (l === lang) return;
    setCookie(l === "en" ? "/ru/en" : null);
    window.location.reload();
  };

  return (
    <div className={`notranslate flex items-center text-xs tracking-wider ${className}`} translate="no">
      <div id="google_translate_element" className="hidden" />
      <button
        onClick={() => change("ru")}
        className={`px-1 transition-opacity ${lang === "ru" ? "font-semibold" : "opacity-50 hover:opacity-100"}`}
        aria-label="Русский язык"
      >
        RU
      </button>
      <span className="opacity-30">/</span>
      <button
        onClick={() => change("en")}
        className={`px-1 transition-opacity ${lang === "en" ? "font-semibold" : "opacity-50 hover:opacity-100"}`}
        aria-label="English language"
      >
        EN
      </button>
    </div>
  );
};

export default LanguageSwitcher;
