import Link from "next/link";

export function Tabs({ tabs, active }: { tabs: { value: string; label: string; href: string }[]; active: string }) {
  return (
    <div className="inline-flex rounded-full border border-white/10 bg-zinc-900 p-1 text-sm">
      {tabs.map((t) => (
        <Link
          key={t.value}
          href={t.href}
          className={`rounded-full px-4 py-1.5 transition ${
            t.value === active ? "bg-amber-400 font-medium text-zinc-950" : "text-zinc-300 hover:text-white"
          }`}
        >
          {t.label}
        </Link>
      ))}
    </div>
  );
}
