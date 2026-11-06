import { WeeksView } from "@/components/WeeksView";
import { getUpcoming } from "@/lib/catalog";

export default async function DigitalPage() {
  const items = await getUpcoming("digital");
  return <WeeksView title="Coming Soon" active="digital" items={items} empty="No upcoming digital releases are listed yet." />;
}
