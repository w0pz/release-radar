import { Tabs } from "./Tabs";

export type Section = "theatrical" | "digital" | "tickets";

const SECTIONS = [
  { value: "theatrical", label: "Cinemas", href: "/" },
  { value: "digital", label: "Digital", href: "/digital/" },
  { value: "tickets", label: "Tickets", href: "/tickets/" },
];

export function PageHeader({ title, active }: { title: string; active: Section }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
      <Tabs active={active} tabs={SECTIONS} />
    </div>
  );
}
