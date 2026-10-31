import { formatDate } from "@/lib/dates";
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
          {list.every((r) => r.limited) && <span className="text-zinc-500">ltd</span>}
          <span className="ml-auto">
            <CountryTags countries={list.map((r) => r.country)} />
          </span>
        </div>
      ))}
    </div>
  );
}

export function MovieCard({ item }: { item: ReleaseItem }) {
  const { movie } = item;
  const poster = img(movie.poster_path, "w185");
  return (
    <article className="group">
      <a href={tmdbUrl(movie.id)} target="_blank" rel="noreferrer" className="block">
        <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-zinc-900 ring-1 ring-white/10 transition group-hover:ring-amber-400/60">
          {poster ? (
            <img src={poster} alt="" loading="lazy" className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]" />
          ) : (
            <div className="flex h-full items-center justify-center p-2 text-center text-xs text-zinc-500">{movie.title}</div>
          )}
        </div>
        <h3 className="mt-1.5 line-clamp-2 text-xs font-medium leading-snug group-hover:text-amber-300">{movie.title}</h3>
      </a>
      <ReleaseLines releases={item.releases} color={item.kind === "digital" ? "bg-sky-400" : "bg-amber-400"} />
    </article>
  );
}

export function CardGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-3 gap-x-3 gap-y-5 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">{children}</div>;
}
