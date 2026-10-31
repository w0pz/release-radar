// What the static build generates: the upcoming lists and the Tickets page.
import { addDays, todayISO } from "./dates";
import type { Kind } from "./releases";
import { getReleasesInRange, type Movie } from "./tmdb";

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

// The Tickets page: films released in Irish cinemas recently or opening soon.
const TICKETS_PAST_DAYS = 42;
const TICKETS_AHEAD_DAYS = 14;

export type IrishListing = { movie: Movie; date: string; limited: boolean };

export async function getIrishListings() {
  const today = todayISO();
  const items = await getReleasesInRange({
    kind: "theatrical",
    from: addDays(today, -TICKETS_PAST_DAYS),
    to: addDays(today, TICKETS_AHEAD_DAYS),
  });
  const listings: IrishListing[] = items.flatMap((item) => {
    const ie = item.releases.find((r) => r.country === "IE");
    return ie ? [{ movie: item.movie, date: ie.date, limited: ie.limited }] : [];
  });
  return {
    openingSoon: listings.filter((l) => l.date > today).sort((a, b) => a.date.localeCompare(b.date)),
    outNow: listings.filter((l) => l.date <= today).sort((a, b) => b.date.localeCompare(a.date)),
  };
}
