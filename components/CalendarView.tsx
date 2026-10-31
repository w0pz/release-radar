import Link from "next/link";
import { calendarMonths, getMonth } from "@/lib/catalog";
import { formatMonth, lastDayOfMonth, shiftMonth, todayISO } from "@/lib/dates";
import { CalendarBoard, type CalendarEntry } from "./CalendarBoard";

const navClass = "rounded-md border border-white/10 px-2.5 py-1 hover:border-white/30";

export async function CalendarView({ month }: { month: string }) {
  const items = (await Promise.all([getMonth("theatrical", month), getMonth("digital", month)])).flat();

  // One entry per movie, kind and date, tagged with every country releasing it that day.
  const entries: CalendarEntry[] = [];
  for (const item of items.sort((a, b) => b.movie.popularity - a.movie.popularity)) {
    const byDate = new Map<string, string[]>();
    for (const r of item.releases) byDate.set(r.date, [...(byDate.get(r.date) ?? []), r.country]);
    for (const [date, countries] of byDate) {
      entries.push({ id: item.movie.id, title: item.movie.title, kind: item.kind, date, countries });
    }
  }

  const months = calendarMonths();
  const prev = shiftMonth(month, -1);
  const next = shiftMonth(month, 1);
  const current = todayISO().slice(0, 7);
  const href = (m: string) => `/calendar/${m}/`;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        {months.includes(prev) ? (
          <Link href={href(prev)} aria-label="Previous month" className={navClass}>←</Link>
        ) : (
          <span className={`${navClass} opacity-30`}>←</span>
        )}
        <h1 className="min-w-44 text-center text-2xl font-semibold tracking-tight">{formatMonth(month)}</h1>
        {months.includes(next) ? (
          <Link href={href(next)} aria-label="Next month" className={navClass}>→</Link>
        ) : (
          <span className={`${navClass} opacity-30`}>→</span>
        )}
        {month !== current && (
          <Link href={href(current)} className="text-sm text-zinc-400 hover:text-white">
            Today
          </Link>
        )}
      </div>
      <CalendarBoard month={month} lastDay={lastDayOfMonth(month)} entries={entries} buildToday={todayISO()} />
    </div>
  );
}
