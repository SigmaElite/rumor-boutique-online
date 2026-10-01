import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Currency = "BYN" | "RUB" | "USD";

// BYN per 1 unit of currency (fallback if live rates unavailable)
const FALLBACK: Record<Currency, number> = { BYN: 1, USD: 3.0, RUB: 0.036 };

interface Ctx {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  format: (byn: number) => string;
}

const CurrencyContext = createContext<Ctx | null>(null);

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [currency, setCurrencyState] = useState<Currency>(
    () => (localStorage.getItem("currency") as Currency) || "BYN"
  );
  const [rates, setRates] = useState(FALLBACK);

  useEffect(() => {
    const cached = localStorage.getItem("currency_rates");
    if (cached) {
      try {
        const { at, r } = JSON.parse(cached);
        setRates(r);
        if (Date.now() - at < 6 * 3600 * 1000) return;
      } catch {}
    }
    const get = (code: string) =>
      fetch(`https://api.nbrb.by/exrates/rates/${code}?parammode=2`)
        .then((res) => res.json())
        .then((d) => d.Cur_OfficialRate / d.Cur_Scale);
    Promise.all([get("USD"), get("RUB")])
      .then(([usd, rub]) => {
        const r = { BYN: 1, USD: usd, RUB: rub };
        setRates(r);
        localStorage.setItem("currency_rates", JSON.stringify({ at: Date.now(), r }));
      })
      .catch(() => {});
  }, []);

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    localStorage.setItem("currency", c);
  };

  const format = (byn: number) => {
    const n = Number(byn) || 0;
    if (currency === "BYN") return `${new Intl.NumberFormat("ru-RU").format(n)} byn`;
    const v = n / rates[currency];
    const rounded = currency === "RUB" ? Math.round(v / 10) * 10 : Math.round(v);
    return `${new Intl.NumberFormat("ru-RU").format(rounded)} ${currency.toLowerCase()}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, format }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
};

export const CurrencySwitcher = ({ className = "" }: { className?: string }) => {
  const { currency, setCurrency } = useCurrency();
  return (
    <select
      value={currency}
      onChange={(e) => setCurrency(e.target.value as Currency)}
      className={`notranslate bg-transparent text-xs tracking-wider cursor-pointer outline-none ${className}`}
      aria-label="Валюта"
      translate="no"
    >
      <option value="BYN">BYN</option>
      <option value="RUB">RUB</option>
      <option value="USD">USD</option>
    </select>
  );
};
