"use client";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto max-w-lg rounded-lg border border-red-500/30 bg-red-500/10 p-6 text-sm">
      <h1 className="text-base font-semibold text-red-200">Couldn&apos;t load releases</h1>
      <p className="mt-2 text-red-100/80">{error.message}</p>
      <button onClick={reset} className="mt-4 rounded-md bg-white/10 px-3 py-1.5 hover:bg-white/20">
        Try again
      </button>
    </div>
  );
}
