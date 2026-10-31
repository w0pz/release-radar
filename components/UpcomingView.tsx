import { CardGrid, MovieCard } from "@/components/MovieCard";
import { Tabs } from "@/components/Tabs";
import { getUpcoming } from "@/lib/catalog";
import { formatMonth } from "@/lib/dates";
import type { Kind } from "@/lib/releases";
import type { ReleaseItem } from "@/lib/tmdb";

export async function UpcomingView({ kind }: { kind: Kind }) {
  const items = await getUpcoming(kind);

  const byMonth = new Map<string, ReleaseItem[]>();
  for (const item of items) {
    const key = item.date.slice(0, 7);
    byMonth.set(key, [...(byMonth.get(key) ?? []), item]);
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Coming soon</h1>
          <p className="mt-1 text-sm text-zinc-400">
            The most popular {kind === "digital" ? "digital" : "theatrical"} releases in the US, UK and Ireland over the next 4 months.
          </p>
        </div>
        <Tabs
          active={kind}
          tabs={[
            { value: "theatrical", label: "In theaters", href: "/" },
            { value: "digital", label: "Digital", href: "/digital/" },
          ]}
        />
      </div>

      {items.length === 0 && (
        <p className="rounded-lg border border-white/10 bg-zinc-900 p-6 text-sm text-zinc-400">No upcoming {kind} releases are listed yet.</p>
      )}

      {[...byMonth].map(([month, list]) => (
        <section key={month}>
          <h2 className="mb-4 flex items-baseline gap-3 text-lg font-semibold">
            {formatMonth(month)}
            <span className="text-sm font-normal text-zinc-500">{list.length} releases</span>
          </h2>
          <CardGrid>
            {list.map((item) => (
              <MovieCard key={item.movie.id} item={item} />
            ))}
          </CardGrid>
        </section>
      ))}

      <p className="text-xs text-zinc-600">Updated {new Date().toUTCString()}</p>
    </div>
  );
}
