import { CardGrid, MovieCard } from "@/components/MovieCard";
import { Tabs } from "@/components/Tabs";
import { getUpcoming } from "@/lib/catalog";
import { formatWeek, weekStart } from "@/lib/dates";
import type { Kind } from "@/lib/releases";
import type { ReleaseItem } from "@/lib/tmdb";

export async function UpcomingView({ kind }: { kind: Kind }) {
  const items = await getUpcoming(kind);

  // Weeks run Monday to Sunday; a movie sits in the week of its earliest release.
  const byWeek = new Map<string, ReleaseItem[]>();
  for (const item of items) {
    const key = weekStart(item.date);
    byWeek.set(key, [...(byWeek.get(key) ?? []), item]);
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-3xl font-semibold tracking-tight">Coming Soon</h1>
        <Tabs
          active={kind}
          tabs={[
            { value: "theatrical", label: "Cinemas", href: "/" },
            { value: "digital", label: "Digital", href: "/digital/" },
          ]}
        />
      </div>

      {items.length === 0 && (
        <p className="rounded-lg border border-white/10 bg-zinc-900 p-6 text-sm text-zinc-400">No upcoming {kind} releases are listed yet.</p>
      )}

      {[...byWeek].map(([week, list]) => (
        <section key={week}>
          <h2 className="sticky top-[53px] z-10 -mx-4 mb-3 flex items-baseline gap-3 bg-zinc-950/90 px-4 py-2 text-base font-semibold backdrop-blur">
            {formatWeek(week)}
            <span className="text-sm font-normal text-zinc-500">{list.length} releases</span>
          </h2>
          <CardGrid>
            {list.map((item) => (
              <MovieCard key={item.movie.id} item={item} />
            ))}
          </CardGrid>
        </section>
      ))}
    </div>
  );
}
