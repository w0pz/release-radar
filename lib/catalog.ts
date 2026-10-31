// What the static build generates: the upcoming lists.
import { addDays, todayISO } from "./dates";
import type { Kind } from "./releases";
import { getReleasesInRange } from "./tmdb";

const UPCOMING_DAYS = 120;
// Countries count as "already released" only within this window, so re-releases of
// old films aren't tagged as already out.
const RELEASED_LOOKBACK_DAYS = 180;

export function getUpcoming(kind: Kind) {
  const from = todayISO();
  return getReleasesInRange({
    kind,
    from,
    to: addDays(from, UPCOMING_DAYS),
    releasedSince: addDays(from, -RELEASED_LOOKBACK_DAYS),
  });
}
