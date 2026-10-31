import Link from "next/link";

export const tabGroupClass = "inline-flex rounded-full border border-white/10 bg-zinc-900 p-1 text-sm";

export function tabClass(active: boolean) {
  return `rounded-full px-4 py-1.5 transition ${active ? "bg-amber-400 font-medium text-zinc-950" : "text-zinc-300 hover:text-white"}`;
}

export function Tabs({ tabs, active }: { tabs: { value: string; label: string; href: string }[]; active: string }) {
  return (
    <div className={tabGroupClass}>
      {tabs.map((t) => (
        <Link key={t.value} href={t.href} className={tabClass(t.value === active)}>
          {t.label}
        </Link>
      ))}
    </div>
  );
}
