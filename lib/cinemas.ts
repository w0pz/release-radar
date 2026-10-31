// Where to book in Ireland. None of these chains offer an API, so links are either a
// search for the film (when the site supports one) or the cinema's listings page.
type Cinema = { name: string; url: (title: string) => string };

const q = encodeURIComponent;

export const IRISH_CINEMAS: Cinema[] = [
  { name: "Showtimes near Dublin", url: (t) => `https://www.google.com/search?q=${q(`${t} showtimes Dublin`)}&gl=ie` },
  // Sets Rathmines as the chosen cinema and opens its showtimes.
  { name: "Omniplex Rathmines", url: () => "https://www.omniplex.ie/cinema/rathmines" },
  { name: "ODEON", url: () => "https://www.odeoncinemas.ie/whats-on/" },
  { name: "Cineworld Dublin", url: () => "https://www.cineworld.ie/whatson" },
  { name: "IMC", url: (t) => `https://imc.ie/?s=${q(t)}` },
  { name: "Light House", url: (t) => `https://www.lighthousecinema.ie/?s=${q(t)}` },
  { name: "IFI", url: (t) => `https://ifi.ie/search?q=${q(t)}` },
];
