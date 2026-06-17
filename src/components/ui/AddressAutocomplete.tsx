"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { MapPin, Loader2 } from "lucide-react";

interface Suggestion {
  display_name: string;
  place_id: string;
  address: {
    city?: string;
    town?: string;
    village?: string;
    country?: string;
  };
}

interface Props {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  icon?: "depart" | "arrivee";
}

export default function AddressAutocomplete({ placeholder, value, onChange, icon = "depart" }: Props) {
  const [query, setQuery]           = useState(value);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading]       = useState(false);
  const [open, setOpen]             = useState(false);
  const [focused, setFocused]       = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const wrapRef                     = useRef<HTMLDivElement>(null);

  // Fermer si clic extérieur
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const search = useCallback(async (q: string) => {
    if (q.length < 3) { setSuggestions([]); setOpen(false); return; }
    setLoading(true);
    try {
      // Biais vers Marseille et région PACA
      const url = `https://nominatim.openstreetmap.org/search?` + new URLSearchParams({
        q:                q,
        format:           "json",
        addressdetails:   "1",
        limit:            "6",
        countrycodes:     "fr",
        viewbox:          "4.5,43.0,6.5,44.5", // bbox PACA
        bounded:          "0",
        "accept-language":"fr",
      });
      const res  = await fetch(url, { headers: { "User-Agent": "AzurPrestigeTaxi/1.0" } });
      const data = await res.json();
      setSuggestions(data);
      setOpen(data.length > 0);
    } catch {
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleInput = (val: string) => {
    setQuery(val);
    onChange(val); // met à jour le parent en temps réel
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(val), 350);
  };

  const handleSelect = (s: Suggestion) => {
    // Formater joliment le nom
    const parts = s.display_name.split(",").slice(0, 3).map(p => p.trim());
    const clean = parts.join(", ");
    setQuery(clean);
    onChange(clean);
    setSuggestions([]);
    setOpen(false);
  };

  const inp = `w-full bg-transparent text-white placeholder-[#444] text-sm font-light focus:outline-none`;

  return (
    <div ref={wrapRef} className="relative">
      {/* Input */}
      <div className={`flex items-center gap-3 border px-4 py-3.5 transition-colors duration-300 ${
        focused ? "border-[#D4AF37]/50" : "border-white/[0.08]"
      }`}>
        <MapPin
          size={13}
          className={`shrink-0 transition-colors duration-300 ${icon === "arrivee" ? "text-[#D4AF37]/50" : "text-[#D4AF37]"}`}
        />
        <input
          className={inp}
          placeholder={placeholder}
          value={query}
          onChange={e => handleInput(e.target.value)}
          onFocus={() => { setFocused(true); if (suggestions.length > 0) setOpen(true); }}
          onBlur={() => setFocused(false)}
          autoComplete="off"
        />
        {loading && <Loader2 size={13} className="shrink-0 text-[#D4AF37]/50 animate-spin" />}
      </div>

      {/* Dropdown suggestions */}
      {open && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-50 border border-white/[0.08] border-t-0 bg-[#0E0E0E] max-h-64 overflow-y-auto">
          {suggestions.map((s, i) => {
            const parts  = s.display_name.split(",");
            const main   = parts.slice(0, 2).join(",").trim();
            const detail = parts.slice(2, 4).join(",").trim();
            return (
              <button
                key={s.place_id + i}
                type="button"
                onMouseDown={() => handleSelect(s)}
                className="w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-white/[0.04] transition-colors duration-150 border-b border-white/[0.04] last:border-0"
              >
                <MapPin size={12} className="text-[#D4AF37]/40 shrink-0 mt-0.5" />
                <div>
                  <div className="text-white text-sm font-light leading-snug">{main}</div>
                  {detail && <div className="text-[#707070] text-xs font-light mt-0.5">{detail}</div>}
                </div>
              </button>
            );
          })}
          <div className="px-4 py-2 flex items-center gap-2 border-t border-white/[0.04]">
            <svg viewBox="0 0 24 24" className="w-3 h-3 opacity-30" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
            </svg>
            <span className="text-[#3A3A3A] text-[10px] font-light">OpenStreetMap</span>
          </div>
        </div>
      )}
    </div>
  );
}
