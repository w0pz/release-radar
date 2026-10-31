"use client";

import { useState } from "react";
import { formatDate } from "@/lib/dates";
import type { FilmShowtimes } from "@/lib/showtimes";

function FilmBlock({ film, day }: { film: FilmShowtimes; day: string }) {
  const cinemas = Object.entries(film.cinemas).filter(([, byDay]) => byDay[day]?.length);
  return (
    <article className="flex gap-4 py-5 sm:gap-6">
      <a href={film.infoUrl ?? undefined} target="_blank" rel="noreferrer" className="shrink-0">
        <div className="aspect-[2/3] w-20 overflow-hidden rounded-lg bg-zinc-900 ring-1 ring-white/20 sm:w-28">
          {film.poster && <img src={film.poster} alt="" loading="lazy" className="h-full w-full object-cover" />}
        </div>
      </a>
      <div className="min-w-0 flex-1">
        <h2 className="text-lg font-semibold leading-snug">
          <a href={film.infoUrl ?? undefined} target="_blank" rel="noreferrer" className="hover:text-amber-300">
            {film.title}
          </a>
        </h2>
        <p className="mt-1 flex flex-wrap items-center gap-x-2 text-xs text-zinc-400">
          {film.rating && <span className="rounded border border-white/25 px-1.5 py-px font-semibold text-zinc-200">{film.rating}</span>}
          {film.runtime && <span>{Math.floor(film.runtime / 60)} hr {film.runtime % 60} min</span>}
        </p>
        <div className="mt-3 space-y-3">
          {cinemas.map(([cinema, byDay]) => (
            <div key={cinema}>
              <h3 className="text-sm text-zinc-300">{cinema}</h3>
              <div className="mt-1.5 flex flex-wrap gap-2">
                {byDay[day].map((s) => (
                  <a
                    key={`${s.time}-${s.format}`}
                    href={s.bookingUrl}
                    target="_blank"
                    rel="noreferrer"
                    title={s.direct ? `Book ${s.time} at ${cinema}` : `Book on ${cinema}'s website`}
                    className="min-w-16 rounded-md bg-zinc-800 px-3 py-1.5 text-center text-sm font-semibold tabular-nums text-white ring-1 ring-white/10 hover:bg-amber-400 hover:text-zinc-950"
                  >
                    {s.time}
                    {s.format && s.format !== "2D" && <span className="ml-1 text-[10px] font-medium opacity-70">{s.format}</span>}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

export function TicketsBoard({ films, days }: { films: FilmShowtimes[]; days: string[] }) {
  // Starts on the first day in the data, so the prebuilt page and the browser agree.
  const [day, setDay] = useState(days[0]);

  // A–Z so any film is easy to find; a leading "The"/"A"/"An" is ignored when sorting.
  const sortKey = (title: string) => title.replace(/^(the|a|an)\s+/i, "");
  const showing = films
    .filter((f) => Object.values(f.cinemas).some((byDay) => byDay[day]?.length))
    .sort((a, b) => sortKey(a.title).localeCompare(sortKey(b.title), "en", { sensitivity: "base" }));

  return (
    <div>
      <div className="-mx-4 overflow-x-auto px-4">
        <div className="flex gap-1 border-b border-white/10" role="tablist" aria-label="Day">
          {days.map((d) => (
            <button
              key={d}
              type="button"
              role="tab"
              aria-selected={d === day}
              onClick={() => setDay(d)}
              className={`shrink-0 border-b-2 px-3 py-2 text-sm whitespace-nowrap transition ${
                d === day ? "border-amber-400 font-medium text-amber-300" : "border-transparent text-zinc-400 hover:text-white"
              }`}
            >
              {formatDate(d, { weekday: true })}
            </button>
          ))}
        </div>
      </div>
      <p className="mt-3 text-xs text-zinc-500">{showing.length} films showing · tap a time to book</p>
      <div className="divide-y divide-white/10">
        {showing.map((f) => (
          <FilmBlock key={f.id} film={f} day={day} />
        ))}
      </div>
    </div>
  );
}
