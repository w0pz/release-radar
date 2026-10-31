// Dublin cinemas shown on the Tickets page, by their entertainment.ie listings page:
// https://entertainment.ie/cinema/cinema-listings/dublin/<slug>/
// Some cinemas' times come without a booking link; `fallback` is where those times go instead.
const q = encodeURIComponent;

export const DUBLIN_CINEMAS: { slug: string; name: string; fallback: (title: string) => string }[] = [
  { slug: "omniplex-rathmines", name: "Omniplex Rathmines", fallback: () => "https://www.omniplex.ie/cinema/rathmines" },
  { slug: "movies-at-dundrum", name: "Movies@Dundrum", fallback: () => "https://moviesatdundrum.admit-one.eu/" },
  { slug: "lighthouse-cinema-dublin", name: "Light House", fallback: (t) => `https://www.lighthousecinema.ie/?s=${q(t)}` },
  { slug: "ifi-irish-film-institute", name: "IFI", fallback: (t) => `https://ifi.ie/search?q=${q(t)}` },
  { slug: "cineworld-dublin", name: "Cineworld Dublin", fallback: () => "https://www.cineworld.ie/whatson" },
];
