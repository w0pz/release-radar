// What the static build generates: the upcoming lists.
import { addDays, todayISO } from "./dates";
import type { Kind } from "./releases";
import { getReleasesInRange } from "./tmdb";

const UPCOMING_DAYS = 120;

export function getUpcoming(kind: Kind) {
  const from = todayISO();
  return getReleasesInRange({ kind, from, to: addDays(from, UPCOMING_DAYS) });
}
