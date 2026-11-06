// What the static build generates: the upcoming lists and recent releases.
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

// Out Now: what came out recently, so films don't vanish from the site the day they're released.
const RECENT_DAYS = 30;

/** Cinema and digital releases from the last 30 days up to today. */
export async function getRecent() {
  const to = todayISO();
  const from = addDays(to, -(RECENT_DAYS - 1));
  const kinds: Kind[] = ["theatrical", "digital"];
  const lists = await Promise.all(kinds.map((kind) => getReleasesInRange({ kind, from, to })));
  return lists.flat();
}
