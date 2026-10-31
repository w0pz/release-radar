// Build-time TMDB client. The token is read from TMDB_READ_TOKEN and never sent to the browser.
import { KIND_TYPES, type CountryReleases, type Kind } from "./releases";
import { COUNTRIES } from "./countries";

const BASE = "https://api.themoviedb.org/3";

export class TmdbError extends Error {
  constructor(public status: number, path: string) {
    super(`TMDB request failed (${status}) for ${path}`);
  }
}

async function tmdb<T>(path: string, params: Record<string, string | number | undefined> = {}): Promise<T> {
  const token = process.env.TMDB_READ_TOKEN;
  if (!token) throw new Error("TMDB_READ_TOKEN is not set. Add it to .env.local and restart the server.");

  const url = new URL(BASE + path);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") url.searchParams.set(key, String(value));
  }

  await acquire();
  try {
    for (let attempt = 0; ; attempt++) {
      let res: Response | null = null;
      try {
        // Cached for the whole build so pages sharing a request only hit TMDB once.
        res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}`, accept: "application/json" },
          cache: "force-cache",
        });
      } catch (e) {
        if (attempt >= MAX_RETRIES) throw e;
      }
      if (res?.ok) return await res.json();
      const retryable = !res || res.status === 429 || res.status >= 500;
      if (!retryable || attempt >= MAX_RETRIES) throw new TmdbError(res?.status ?? 0, path);
      const retryAfter = Number(res?.headers.get("retry-after")) * 1000;
      await new Promise((r) => setTimeout(r, retryAfter || 500 * 2 ** attempt + Math.random() * 500));
    }
  } finally {
    release();
  }
}

// A static build renders many pages at once; cap concurrent TMDB requests per process.
const MAX_IN_FLIGHT = 6;
const MAX_RETRIES = 8;
let inFlight = 0;
const waiting: (() => void)[] = [];

function acquire() {
  if (inFlight < MAX_IN_FLIGHT) {
    inFlight++;
    return Promise.resolve();
  }
  return new Promise<void>((resolve) => waiting.push(resolve));
}

function release() {
  const next = waiting.shift();
  if (next) next();
  else inFlight--;
}

export type Movie = {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  popularity: number;
  release_date: string;
};

type Page<T> = { page: number; results: T[]; total_pages: number; total_results: number };

/** When a movie comes out in one country; `limited` for a limited theatrical run. */
export type CountryRelease = { country: string; date: string; limited: boolean };

/**
 * A movie's releases of one kind, in date order; `date` is the earliest. `released`
 * lists countries where it already came out (before `from`) and has no date in range.
 */
export type ReleaseItem = {
  movie: Movie;
  kind: Kind;
  date: string;
  releases: CountryRelease[];
  released: { country: string; date: string }[];
};

async function getReleaseDates(id: number) {
  const res = await tmdb<{ results: CountryReleases[] }>(`/movie/${id}/release_dates`);
  return res.results;
}

async function mapLimit<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const out = new Array<R>(items.length);
  let next = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length) {
      const i = next++;
      out[i] = await fn(items[i]);
    }
  });
  await Promise.all(workers);
  return out;
}

/**
 * Most popular movies with a release of `kind` in any tracked country between `from`
 * and `to` (inclusive), sorted by their earliest release in that range.
 *
 * Discover finds the candidates per country; each movie's release dates are then looked
 * up so every country shows its exact date for the chosen release type.
 */
export async function getReleasesInRange(opts: {
  kind: Kind;
  from: string;
  to: string;
  maxPages?: number;
  /** How far back to look for countries where the movie is already out. */
  releasedSince?: string;
}): Promise<ReleaseItem[]> {
  const { kind, from, to, maxPages = 3, releasedSince = from } = opts;
  const types = KIND_TYPES[kind];

  const discover = async (region: string) => {
    const params = {
      region,
      language: "en-US",
      with_release_type: types.join("|"),
      "release_date.gte": from,
      "release_date.lte": to,
      sort_by: "popularity.desc",
      include_adult: "false",
      include_video: "false",
    };
    const first = await tmdb<Page<Movie>>("/discover/movie", { ...params, page: 1 });
    const rest = await Promise.all(
      Array.from({ length: Math.min(first.total_pages, maxPages) - 1 }, (_, i) =>
        tmdb<Page<Movie>>("/discover/movie", { ...params, page: i + 2 }),
      ),
    );
    return [first, ...rest].flatMap((p) => p.results);
  };

  const seen = new Set<number>();
  const movies = (await Promise.all(COUNTRIES.map((c) => discover(c.code))))
    .flat()
    .filter((m) => !seen.has(m.id) && seen.add(m.id));

  const withDates = await mapLimit(movies, 10, async (movie) => ({ movie, results: await getReleaseDates(movie.id) }));

  const items: ReleaseItem[] = [];
  for (const { movie, results } of withDates) {
    const releases: CountryRelease[] = [];
    const released: ReleaseItem["released"] = [];
    for (const { code } of COUNTRIES) {
      const ofKind = (results.find((c) => c.iso_3166_1 === code)?.release_dates ?? []).filter((d) => types.includes(d.type));
      const dates = ofKind.filter((d) => d.release_date.slice(0, 10) >= from && d.release_date.slice(0, 10) <= to);
      const date = dates.map((d) => d.release_date.slice(0, 10)).sort()[0];
      if (date) {
        const onDate = dates.filter((d) => d.release_date.startsWith(date));
        releases.push({ country: code, date, limited: !onDate.some((d) => d.type === 3) && kind === "theatrical" });
        continue;
      }
      const past = ofKind
        .map((d) => d.release_date.slice(0, 10))
        .filter((d) => d >= releasedSince && d < from)
        .sort()[0];
      if (past) released.push({ country: code, date: past });
    }
    if (!releases.length) continue;
    releases.sort((a, b) => a.date.localeCompare(b.date));
    items.push({ movie, kind, date: releases[0].date, releases, released });
  }

  return items.sort((a, b) => a.date.localeCompare(b.date) || b.movie.popularity - a.movie.popularity);
}
