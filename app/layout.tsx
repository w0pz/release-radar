import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { formatTimestamp } from "@/lib/dates";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Release Radar",
  description: "Upcoming theatrical and digital movie releases",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // The site is rebuilt with fresh TMDB data on a schedule, so build time is data time.
  const builtAt = new Date();
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col antialiased`}>
        <header className="sticky top-0 z-20 border-b border-white/10 bg-zinc-950/85 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center gap-x-6 px-4 py-3">
            <Link href="/" className="flex shrink-0 items-center gap-2 font-semibold tracking-tight">
              <span className="grid h-7 w-7 place-items-center rounded-md bg-amber-400 text-sm text-zinc-950">▶</span>
              Release Radar
            </Link>
            {/* One line only: the sticky week headings sit just below this header. */}
            <span className="ml-auto min-w-0 truncate text-xs text-zinc-500">
              <span className="hidden sm:inline">US · UK · Ireland · </span>
              Last updated <time dateTime={builtAt.toISOString()}>{formatTimestamp(builtAt)}</time>
            </span>
          </div>
        </header>
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8">{children}</main>
        <footer className="border-t border-white/10 px-4 py-6 text-center text-xs text-zinc-500">
          Movie data from{" "}
          <a href="https://www.themoviedb.org" className="underline hover:text-zinc-300" target="_blank" rel="noreferrer">
            TMDB
          </a>
          . This product uses the TMDB API but is not endorsed or certified by TMDB.        </footer>
      </body>
    </html>
  );
}
