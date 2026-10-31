import { countryLabel } from "@/lib/countries";

// Ireland is where the site is used, so its tag stands out from the rest.
const HIGHLIGHT = "IE";

export function CountryTags({ countries }: { countries: string[] }) {
  return (
    <span className="inline-flex shrink-0 gap-0.5">
      {countries.map((c) => (
        <span
          key={c}
          className={`rounded px-1 font-mono text-[10px] leading-4 ${
            c === HIGHLIGHT ? "bg-amber-400/15 text-amber-200 ring-1 ring-amber-400/70 ring-inset" : "bg-white/10 text-zinc-300"
          }`}
        >
          {countryLabel(c)}
        </span>
      ))}
    </span>
  );
}
