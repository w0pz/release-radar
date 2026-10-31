// Types and helpers shared by server and client code.

export type Kind = "theatrical" | "digital";

// TMDB release types: https://developer.themoviedb.org/reference/movie-release-dates
export const RELEASE_TYPES: Record<number, string> = {
  1: "Premiere",
  2: "Theatrical (limited)",
  3: "Theatrical",
  4: "Digital",
  5: "Physical",
  6: "TV",
};

export const KIND_TYPES: Record<Kind, number[]> = {
  theatrical: [2, 3],
  digital: [4],
};

export type ReleaseDate = {
  release_date: string;
  type: number;
  certification: string;
  note: string;
};

export type CountryReleases = {
  iso_3166_1: string;
  release_dates: ReleaseDate[];
};

export function img(path: string | null | undefined, size: "w92" | "w185" | "w342" | "w500" | "w1280") {
  return path ? `https://image.tmdb.org/t/p/${size}${path}` : null;
}

/** The movie's page on TMDB, which cards link to. */
export function tmdbUrl(id: number) {
  return `https://www.themoviedb.org/movie/${id}`;
}
