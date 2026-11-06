import { WeeksView } from "@/components/WeeksView";
import { getUpcoming } from "@/lib/catalog";

export default async function HomePage() {
  const items = await getUpcoming("theatrical");
  return <WeeksView title="Coming Soon" active="theatrical" items={items} empty="No upcoming cinema releases are listed yet." />;
}
