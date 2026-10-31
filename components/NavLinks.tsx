"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavLinks() {
  const pathname = usePathname();
  const links = [
    { href: "/", label: "Upcoming", active: !pathname.startsWith("/calendar") },
    { href: "/calendar/", label: "Calendar", active: pathname.startsWith("/calendar") },
  ];

  return (
    <nav className="flex gap-1 text-sm">
      {links.map(({ href, label, active }) => (
        <Link
          key={label}
          href={href}
          className={`rounded-md px-2.5 py-1.5 transition ${active ? "bg-white/10 text-white" : "text-zinc-400 hover:text-white"}`}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
