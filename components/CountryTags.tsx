import { countryLabel } from "@/lib/countries";

export function CountryTags({ countries }: { countries: string[] }) {
  return (
    <span className="inline-flex shrink-0 gap-0.5">
      {countries.map((c) => (
        <span key={c} className="rounded bg-white/10 px-1 font-mono text-[10px] leading-4 text-zinc-300">
          {countryLabel(c)}
        </span>
      ))}
    </span>
  );
}
