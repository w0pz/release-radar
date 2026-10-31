import { CalendarView } from "@/components/CalendarView";
import { todayISO } from "@/lib/dates";

export default function CalendarPage() {
  return <CalendarView month={todayISO().slice(0, 7)} />;
}
