import { CalendarView } from "@/components/CalendarView";
import { calendarMonths } from "@/lib/catalog";

export const dynamicParams = false;

export function generateStaticParams() {
  return calendarMonths().map((month) => ({ month }));
}

export default async function CalendarMonthPage({ params }: { params: Promise<{ month: string }> }) {
  return <CalendarView month={(await params).month} />;
}
