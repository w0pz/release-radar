"use client";

import { useEffect, useState } from "react";
import { formatDate, todayISO } from "@/lib/dates";
import { countryLabel } from "@/lib/countries";
import { tmdbUrl, type Kind } from "@/lib/releases";
import { CountryTags } from "./CountryTags";
import { tabClass, tabGroupClass } from "./Tabs";

export type CalendarEntry = { id: number; title: string; date: string; kind: Kind; countries: string[] };

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MAX_PER_CELL = 4;
const FILTERS = [
  { value: "all", label: "All" },
  { value: "theatrical", label: "Theaters" },
  { value: "digital", label: "Digital" },
] as const;

const KIND_STYLE: Record<Kind, string> = {
  theatrical: "border-amber-400 bg-amber-400/10 hover:bg-amber-400/20",
  digital: "border-sky-400 bg-sky-400/10 hover:bg-sky-400/20",
};

function Entry({ entry }: { entry: CalendarEntry }) {
  return (
    <a
      href={tmdbUrl(entry.id)}
      target="_blank"
      rel="noreferrer"
      title={`${entry.title}: ${entry.kind === "digital" ? "digital" : "theaters"} in ${entry.countries.map(countryLabel).join(", ")}`}
      className={`flex items-center gap-1 rounded-sm border-l-2 px-1.5 py-0.5 text-xs ${KIND_STYLE[entry.kind]}`}
    >
      <span className="min-w-0 flex-1 truncate">{entry.title}</span>
      <CountryTags countries={entry.countries} />
    </a>
  );
}

export function CalendarBoard(props: {
  month: string;
  lastDay: string;
  entries: CalendarEntry[];
  buildToday: string;
}) {
  const { month, lastDay, entries } = props;
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["value"]>("all");
  // The page is built ahead of time; correct "today" once it runs in the browser.
  const [today, setToday] = useState(props.buildToday);
  useEffect(() => setToday(todayISO()), []);

  const byDay = new Map<string, CalendarEntry[]>();
  for (const e of entries) {
    if (filter !== "all" && e.kind !== filter) continue;
    byDay.set(e.date, [...(byDay.get(e.date) ?? []), e]);
  }

  const from = `${month}-01`;
  const leadingBlanks = (new Date(`${from}T00:00:00Z`).getUTCDay() + 6) % 7;
  const days = Array.from({ length: Number(lastDay.slice(8)) }, (_, i) => `${month}-${String(i + 1).padStart(2, "0")}`);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="flex flex-wrap gap-4 text-xs text-zinc-400">
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber-400" /> In theaters</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-sky-400" /> Digital</span>
          <span>Tags show where each movie is released</span>
        </p>
        <div className={tabGroupClass}>
          {FILTERS.map((f) => (
            <button key={f.value} type="button" onClick={() => setFilter(f.value)} className={tabClass(filter === f.value)}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop: month grid */}
      <div className="hidden overflow-hidden rounded-xl border border-white/10 md:block">
        <div className="grid grid-cols-7 border-b border-white/10 bg-zinc-900 text-xs text-zinc-400">
          {WEEKDAYS.map((d) => (
            <div key={d} className="px-2 py-2">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 [&>*]:border-b [&>*]:border-r [&>*]:border-white/5">
          {Array.from({ length: leadingBlanks }, (_, i) => (
            <div key={`blank-${i}`} className="bg-zinc-950/60" />
          ))}
          {days.map((day) => {
            const items = byDay.get(day) ?? [];
            return (
              <div key={day} className={`min-h-28 space-y-1 p-1.5 ${day < today ? "opacity-60" : ""}`}>
                <div className={`text-xs ${day === today ? "inline-grid h-5 w-5 place-items-center rounded-full bg-amber-400 font-semibold text-zinc-950" : "text-zinc-500"}`}>
                  {Number(day.slice(8))}
                </div>
                {items.slice(0, MAX_PER_CELL).map((e) => (
                  <Entry key={`${e.kind}-${e.id}`} entry={e} />
                ))}
                {items.length > MAX_PER_CELL && (
                  <details className="text-xs text-zinc-400">
                    <summary className="cursor-pointer hover:text-white">+{items.length - MAX_PER_CELL} more</summary>
                    <div className="mt-1 space-y-1">
                      {items.slice(MAX_PER_CELL).map((e) => (
                        <Entry key={`${e.kind}-${e.id}`} entry={e} />
                      ))}
                    </div>
                  </details>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile: agenda list */}
      <div className="space-y-4 md:hidden">
        {days.filter((d) => byDay.has(d)).map((day) => (
          <section key={day}>
            <h2 className={`mb-1.5 text-sm font-medium ${day === today ? "text-amber-300" : "text-zinc-300"}`}>
              {formatDate(day, { weekday: true })}
            </h2>
            <div className="space-y-1">
              {byDay.get(day)!.map((e) => (
                <Entry key={`${e.kind}-${e.id}`} entry={e} />
              ))}
            </div>
          </section>
        ))}
      </div>

      {byDay.size === 0 && <p className="text-sm text-zinc-400">No releases listed this month.</p>}
    </>
  );
}
