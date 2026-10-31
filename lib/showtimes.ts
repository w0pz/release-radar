// Build-time showtimes for Dublin cinemas, read from entertainment.ie's listings pages
// (used with their permission, for private use). Each cinema page lists every film with
// its upcoming showings, and each time links to the cinema's booking page.
import { parse, type HTMLElement } from "node-html-parser";
import { DUBLIN_CINEMAS } from "./cinemas";
import { addDays, todayISO } from "./dates";

const LISTINGS = "https://entertainment.ie/cinema/cinema-listings/dublin/";
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** `direct` is false when the cinema gave no booking link and `bookingUrl` is its own listings. */
export type Showing = { time: string; format: string; bookingUrl: string; direct: boolean };

export type FilmShowtimes = {
  id: string;
  title: string;
  poster: string | null;
  rating: string | null;
  runtime: number | null;
  /** The film's entertainment.ie page, when it has one. */
  infoUrl: string | null;
  /** cinema name → date (YYYY-MM-DD) → showings */
  cinemas: Record<string, Record<string, Showing[]>>;
};

export type Showtimes = { films: FilmShowtimes[]; days: string[]; failed: string[] };

const text = (el: HTMLElement | null | undefined) => (el?.textContent ?? "").replace(/\s+/g, " ").trim();

/** "Sat 31 Oct" → "2026-10-31", picking the year that puts the date nearest to `today`. */
function parseDay(label: string, today: string): string | null {
  const m = label.match(/(\d{1,2}) ([A-Z][a-z]{2})/);
  if (!m) return null;
  const month = MONTHS.indexOf(m[2]);
  if (month < 0) return null;
  const year = Number(today.slice(0, 4));
  const candidates = [year - 1, year, year + 1].map(
    (y) => `${y}-${String(month + 1).padStart(2, "0")}-${m[1].padStart(2, "0")}`,
  );
  const distance = (iso: string) => Math.abs(Date.parse(iso) - Date.parse(today));
  return candidates.sort((a, b) => distance(a) - distance(b))[0];
}

function parseCinemaPage(
  html: string,
  cinema: (typeof DUBLIN_CINEMAS)[number],
  today: string,
  films: Map<string, FilmShowtimes>,
) {
  // The page writes age ratings as an unclosed <image> tag, which would swallow the rest of the
  // document into it; reading it as <img> keeps every film block intact.
  const root = parse(html.replace(/<image\b/gi, "<img"));
  for (const block of root.querySelectorAll(".movie-times-block")) {
    const header = block.querySelector(".movie-header");
    const title = text(header?.querySelector("h3"));
    if (!title) continue;
    // Films are matched across cinemas by title: films without an entertainment.ie page
    // link to the cinema's homepage instead, so links can't tell them apart.
    const id = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const infoUrl =
      header?.querySelectorAll("a").map((a) => a.getAttribute("href")).find((h) => h?.includes("entertainment.ie/movies/")) ??
      null;

    const ratingSrc = header?.querySelector(".badge-age")?.getAttribute("data-src") ?? "";
    const runtime = text(header).match(/Running time:\s*(\d+)/);
    const film = films.get(id) ?? {
      id,
      title,
      poster: header?.querySelector("img")?.getAttribute("data-src") ?? null,
      rating: ratingSrc.match(/rating\/([^/.]+)\./)?.[1]?.toUpperCase() ?? null,
      runtime: runtime ? Number(runtime[1]) : null,
      infoUrl,
      cinemas: {},
    };
    // Fill in details another cinema's page had and this film entry doesn't yet.
    film.infoUrl ??= infoUrl;

    for (const dateHeader of block.querySelectorAll(".date-header")) {
      const day = parseDay(text(dateHeader), today);
      const times = dateHeader.nextElementSibling;
      if (!day || !times?.classList.contains("time-item")) continue;
      const showings = times.querySelectorAll(".single-time-item").flatMap((item) => {
        const time = text(item.querySelector(".time-display")).match(/\d{1,2}:\d{2}/)?.[0];
        if (!time) return [];
        // Some cinemas list times without a booking link; send those to the cinema's own site.
        const href = item.getAttribute("href")?.replace(/&amp;/g, "&");
        const bookingUrl = href || cinema.fallback(title);
        return [{ time, format: text(item.querySelector(".sub-type")), bookingUrl, direct: Boolean(href) }];
      });
      if (showings.length) ((film.cinemas[cinema.name] ??= {})[day] ??= []).push(...showings);
    }
    films.set(id, film);
  }
}

export async function getDublinShowtimes(days = 14): Promise<Showtimes> {
  const today = todayISO();
  const last = addDays(today, days - 1);
  const films = new Map<string, FilmShowtimes>();
  const failed: string[] = [];

  await Promise.all(
    DUBLIN_CINEMAS.map(async (cinema) => {
      try {
        const res = await fetch(`${LISTINGS}${cinema.slug}/`, {
          headers: { "User-Agent": "ReleaseRadar/1.0 (private showtimes page)" },
          cache: "force-cache",
        });
        if (!res.ok) throw new Error(String(res.status));
        parseCinemaPage(await res.text(), cinema, today, films);
      } catch {
        // One unreachable cinema shouldn't break the whole build.
        failed.push(cinema.name);
      }
    }),
  );

  // Keep only showings in the window, and films that still have any.
  const result: FilmShowtimes[] = [];
  const allDays = new Set<string>();
  for (const film of films.values()) {
    for (const [cinema, byDay] of Object.entries(film.cinemas)) {
      for (const day of Object.keys(byDay)) {
        if (day < today || day > last) delete byDay[day];
        else {
          byDay[day].sort((a, b) => a.time.localeCompare(b.time));
          allDays.add(day);
        }
      }
      if (!Object.keys(byDay).length) delete film.cinemas[cinema];
    }
    if (Object.keys(film.cinemas).length) result.push(film);
  }

  return { films: result, days: [...allDays].sort(), failed: failed.sort() };
}
