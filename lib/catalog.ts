// What the static build generates: the upcoming lists and calendar months.
import { addDays, lastDayOfMonth, shiftMonth, todayISO } from "./dates";
import type { Kind } from "./releases";
import { getReleasesInRange } from "./tmdb";

const UPCOMING_DAYS = 120;

/** Months the calendar is built for: last month through three months ahead. */
export function calendarMonths() {
  const current = todayISO().slice(0, 7);
  return [-1, 0, 1, 2, 3].map((d) => shiftMonth(current, d));
}

export function getUpcoming(kind: Kind) {
  const from = todayISO();
  return getReleasesInRange({ kind, from, to: addDays(from, UPCOMING_DAYS) });
}

export function getMonth(kind: Kind, month: string) {
  return getReleasesInRange({ kind, from: `${month}-01`, to: lastDayOfMonth(month), maxPages: 2 });
}
