// All dates are handled as plain "YYYY-MM-DD" strings in UTC so that a release
// never shifts a day because of the viewer's time zone.

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function addDays(iso: string, days: number) {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/** The Monday starting the week that contains `iso`. */
export function weekStart(iso: string) {
  const day = new Date(`${iso}T00:00:00Z`).getUTCDay();
  return addDays(iso, -((day + 6) % 7));
}

// Formatted by hand rather than with toLocaleDateString: Node (at build time) and
// browsers disagree on details like "Sat, 31 Oct" vs "Sat 31 Oct", which breaks hydration.
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** "31 Oct", or "Sat 31 Oct" / "31 Oct 2026" with the options. */
export function formatDate(iso: string, { weekday = false, year = false } = {}) {
  const d = new Date(`${iso}T00:00:00Z`);
  const parts = [`${d.getUTCDate()}`, MONTHS[d.getUTCMonth()].slice(0, 3)];
  if (weekday) parts.unshift(WEEKDAYS[d.getUTCDay()]);
  if (year) parts.push(`${d.getUTCFullYear()}`);
  return parts.join(" ");
}

/** "2 – 8 Nov 2026", "30 Nov – 6 Dec 2026" or "28 Dec 2026 – 3 Jan 2027" for the week starting `start`. */
export function formatWeek(start: string) {
  const end = addDays(start, 6);
  const sameYear = start.slice(0, 4) === end.slice(0, 4);
  const sameMonth = start.slice(0, 7) === end.slice(0, 7);
  const from = sameMonth ? String(Number(start.slice(8))) : formatDate(start, { year: !sameYear });
  return `${from} – ${formatDate(end, { year: true })}`;
}
