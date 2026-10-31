import { CardGrid, MovieCard } from "@/components/MovieCard";
import { PageHeader } from "@/components/PageHeader";
import { getUpcoming } from "@/lib/catalog";
import { addDays, formatWeek, todayISO, weekStart } from "@/lib/dates";
import type { Kind } from "@/lib/releases";
import type { ReleaseItem } from "@/lib/tmdb";

type Week = { start: string; id: string; label: string | null; items: ReleaseItem[] };

export async function UpcomingView({ kind }: { kind: Kind }) {
  const items = await getUpcoming(kind);

  // Weeks run Monday to Sunday; a movie sits in the week of its earliest release.
  // "This week" is worked out at build time; the site rebuilds just after midnight UTC,
  // so the label moves on with the new week.
  const thisWeek = weekStart(todayISO());
  const nextWeek = addDays(thisWeek, 7);
  const byWeek = new Map<string, ReleaseItem[]>();
  for (const item of items) {
    const key = weekStart(item.date);
    byWeek.set(key, [...(byWeek.get(key) ?? []), item]);
  }
  const weeks: Week[] = [...byWeek].map(([start, list]) => ({
    start,
    id: `week-${start}`,
    label: start === thisWeek ? "This week" : start === nextWeek ? "Next week" : null,
    items: list,
  }));

  return (
    <div className="space-y-8">
      <PageHeader title="Coming Soon" active={kind} />

      {items.length === 0 && (
        <p className="rounded-lg border border-white/10 bg-zinc-900 p-6 text-sm text-zinc-400">No upcoming {kind} releases are listed yet.</p>
      )}

      {/* Phones: weeks as a scrollable row of chips. */}
      {weeks.length > 0 && (
        <nav aria-label="Jump to week" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:hidden">
          {weeks.map((w) => (
            <WeekChip key={w.id} week={w} />
          ))}
        </nav>
      )}

      <div className="lg:flex lg:gap-8">
        <div className="min-w-0 flex-1 space-y-8">
          {weeks.map((w) => (
            <section key={w.id} id={w.id} className="scroll-mt-[60px]">
              <h2 className="sticky top-[53px] z-10 -mx-4 mb-3 flex items-baseline gap-3 bg-zinc-950/90 px-4 py-2 text-base font-semibold backdrop-blur">
                {w.label && <span className="text-amber-300">{w.label}</span>}
                <span>{formatWeek(w.start)}</span>
                <span className="text-sm font-normal text-zinc-500">{w.items.length} releases</span>
              </h2>
              <CardGrid>
                {w.items.map((item) => (
                  <MovieCard key={item.movie.id} item={item} />
                ))}
              </CardGrid>
            </section>
          ))}
        </div>

        {/* Desktop: a column of weeks on the right that stays in view while scrolling. */}
        {weeks.length > 0 && (
          <nav
            aria-label="Jump to week"
            className="sticky top-[69px] hidden max-h-[calc(100vh-85px)] w-36 shrink-0 self-start overflow-y-auto lg:block"
          >
            <p className="mb-2 px-2 text-xs text-zinc-500">Jump to week</p>
            <ul className="space-y-0.5">
              {weeks.map((w) => (
                <li key={w.id}>
                  <WeekChip week={w} column />
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </div>
  );
}

function WeekChip({ week, column = false }: { week: Week; column?: boolean }) {
  const range = formatWeek(week.start, { year: false });
  return (
    <a
      href={`#${week.id}`}
      className={
        column
          ? "flex items-baseline justify-between gap-2 rounded-md px-2 py-1 text-sm text-zinc-300 hover:bg-white/10 hover:text-white"
          : "inline-flex shrink-0 items-baseline gap-1.5 whitespace-nowrap rounded-full border border-white/10 bg-zinc-900 px-3 py-1 text-sm text-zinc-300 hover:border-amber-400 hover:text-white"
      }
    >
      <span className={week.label ? "text-amber-300" : undefined}>{week.label ?? range}</span>
      <span className="text-xs text-zinc-500">{week.items.length}</span>
    </a>
  );
}
