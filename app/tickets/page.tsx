import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { getIrishListings, type IrishListing } from "@/lib/catalog";
import { IRISH_CINEMAS } from "@/lib/cinemas";
import { formatDate } from "@/lib/dates";
import { img, tmdbUrl } from "@/lib/releases";

export const metadata: Metadata = { title: "Tickets · Release Radar" };

function ListingRow({ listing, opening }: { listing: IrishListing; opening: boolean }) {
  const { movie } = listing;
  const poster = img(movie.poster_path, "w92");
  return (
    <li className="flex gap-4 py-4">
      <a href={tmdbUrl(movie.id)} target="_blank" rel="noreferrer" className="shrink-0">
        <div className="h-[84px] w-14 overflow-hidden rounded bg-zinc-900 ring-1 ring-white/20">
          {poster && <img src={poster} alt="" loading="lazy" className="h-full w-full object-cover" />}
        </div>
      </a>
      <div className="min-w-0 flex-1">
        <h3 className="font-medium leading-snug">
          <a href={tmdbUrl(movie.id)} target="_blank" rel="noreferrer" className="hover:text-amber-300">
            {movie.title}
          </a>
        </h3>
        <p className="mt-0.5 text-xs text-zinc-400">
          {opening ? "Opens" : "Released"} {formatDate(listing.date, { weekday: true })}
          {listing.limited && <span className="ml-1.5 text-zinc-500">LTD</span>}
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {IRISH_CINEMAS.map((c) => (
            <a
              key={c.name}
              href={c.url(movie.title)}
              target="_blank"
              rel="noreferrer"
              className="rounded-md border border-white/15 px-2 py-1 text-xs text-zinc-200 hover:border-amber-400 hover:text-amber-300"
            >
              {c.name}
            </a>
          ))}
        </div>
      </div>
    </li>
  );
}

function ListingSection({ title, listings, opening }: { title: string; listings: IrishListing[]; opening: boolean }) {
  if (listings.length === 0) return null;
  return (
    <section>
      <h2 className="flex items-baseline gap-3 text-base font-semibold">
        {title}
        <span className="text-sm font-normal text-zinc-500">{listings.length} films</span>
      </h2>
      <ul className="divide-y divide-white/10">
        {listings.map((l) => (
          <ListingRow key={l.movie.id} listing={l} opening={opening} />
        ))}
      </ul>
    </section>
  );
}

export default async function TicketsPage() {
  const { openingSoon, outNow } = await getIrishListings();
  return (
    <div className="space-y-8">
      <PageHeader title="Tickets" active="tickets" />
      <ListingSection title="Opening in Ireland soon" listings={openingSoon} opening />
      <ListingSection title="Out in Ireland now" listings={outNow} opening={false} />
      {openingSoon.length + outNow.length === 0 && (
        <p className="text-sm text-zinc-400">No Irish cinema releases are listed for the last 6 weeks or the next 2.</p>
      )}
      <p className="max-w-prose text-xs text-zinc-500">
        Showtimes, IMC, Light House and IFI search for the film. Omniplex opens Rathmines showtimes, and ODEON and
        Cineworld open their listings, because those sites don&apos;t support links to a single film.
      </p>
    </div>
  );
}
