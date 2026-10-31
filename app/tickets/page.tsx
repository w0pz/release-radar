import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { TicketsBoard } from "@/components/TicketsBoard";
import { DUBLIN_CINEMAS } from "@/lib/cinemas";
import { getDublinShowtimes } from "@/lib/showtimes";

export const metadata: Metadata = { title: "Tickets · Release Radar" };

export default async function TicketsPage() {
  const { films, days, failed } = await getDublinShowtimes();
  return (
    <div className="space-y-6">
      <PageHeader title="Tickets" active="tickets" />
      {days.length > 0 ? (
        <TicketsBoard films={films} days={days} cinemas={DUBLIN_CINEMAS.map((c) => c.name).filter((n) => !failed.includes(n))} />
      ) : (
        <p className="text-sm text-zinc-400">Showtimes couldn&apos;t be loaded in this update. They&apos;ll be back after the next one.</p>
      )}
      <p className="text-xs text-zinc-500">
        Showtimes from{" "}
        <a href="https://entertainment.ie/cinema/cinema-listings/dublin/" target="_blank" rel="noreferrer" className="underline hover:text-zinc-300">
          entertainment.ie
        </a>
        , updated twice a day. Check the cinema&apos;s page before you travel.
        {failed.length > 0 && ` Missing from this update: ${failed.join(", ")}.`}
      </p>
    </div>
  );
}
