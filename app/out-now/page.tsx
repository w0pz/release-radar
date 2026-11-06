import type { Metadata } from "next";
import { WeeksView } from "@/components/WeeksView";
import { getRecent } from "@/lib/catalog";

export const metadata: Metadata = { title: "Out Now · Release Radar" };

export default async function OutNowPage() {
  const items = await getRecent();
  return <WeeksView title="Out Now" active="out-now" items={items} recent empty="Nothing was released in the last 30 days." />;
}
