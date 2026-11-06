import { formatDate } from "@/lib/dates";
import { countryLabel } from "@/lib/countries";
import { img, tmdbUrl } from "@/lib/releases";
import type { CountryRelease, ReleaseItem } from "@/lib/tmdb";
import { CountryTags } from "./CountryTags";

/** One line per distinct date, e.g. "5 Nov · US" and "7 Nov · UK IE". */
function ReleaseLines({ releases, color }: { releases: CountryRelease[]; color: string }) {
  const byDate = new Map<string, CountryRelease[]>();
  for (const r of releases) byDate.set(r.date, [...(byDate.get(r.date) ?? []), r]);
  return (
    <div className="mt-1 space-y-0.5">
      {[...byDate].map(([date, list]) => (
        <div key={date} className="flex flex-wrap items-center gap-x-1 gap-y-0.5 text-[11px] text-zinc-300">
          <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${color}`} />
          <span className="tabular-nums">{formatDate(date)}</span>
          {list.every((r) => r.limited) && <span className="text-zinc-500">LTD</span>}
          <span className="ml-auto">
            <CountryTags countries={list.map((r) => r.country)} />
          </span>
        </div>
      ))}
    </div>
  );
}

/** `showKind` labels the card "In cinemas" or "Digital", for lists that mix both. */
export function MovieCard({ item, showKind = false }: { item: ReleaseItem; showKind?: boolean }) {
  const { movie } = item;
  const poster = img(movie.poster_path, "w185");
  return (
    <article className="group">
      <a href={tmdbUrl(movie.id)} target="_blank" rel="noreferrer" className="block">
        {/* Shadows don't show on a black page, so depth comes from light: a brighter edge,
            a highlight along the top, and a faint glow underneath. */}
        <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-zinc-900 shadow-[0_14px_30px_-14px_rgba(255,255,255,0.28)] ring-1 ring-white/20 transition group-hover:ring-amber-400/70">
          {poster ? (
            <img src={poster} alt="" loading="lazy" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center p-2 text-center text-xs text-zinc-500">{movie.title}</div>
          )}
          <span aria-hidden className="pointer-events-none absolute inset-0 rounded-lg shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]" />
        </div>
        <h3 className="mt-1.5 line-clamp-2 text-xs font-medium leading-snug group-hover:text-amber-300">{movie.title}</h3>
      </a>
      {showKind && (
        <p className={`mt-0.5 text-[11px] font-medium ${item.kind === "digital" ? "text-sky-300" : "text-amber-300"}`}>
          {item.kind === "digital" ? "Digital" : "In cinemas"}
        </p>
      )}
      <ReleaseLines releases={item.releases} color={item.kind === "digital" ? "bg-sky-400" : "bg-amber-400"} />
      {item.released.length > 0 && (
        <div
          className="mt-0.5 flex flex-wrap items-center gap-x-1 gap-y-0.5 text-[11px] text-zinc-500"
          title={item.released.map((r) => `${countryLabel(r.country)}: ${formatDate(r.date, { year: true })}`).join(", ")}
        >
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-600" />
          Already released
          <span className="ml-auto">
            <CountryTags countries={item.released.map((r) => r.country)} />
          </span>
        </div>
      )}
    </article>
  );
}

export function CardGrid({ children }: { children: React.ReactNode }) {
  // Desktop shares its width with the week column, hence 6–7 per row rather than 8.
  return <div className="grid grid-cols-3 gap-x-3 gap-y-5 sm:grid-cols-4 md:grid-cols-6 xl:grid-cols-7">{children}</div>;
}
