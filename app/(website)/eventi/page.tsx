import EventList from "@/components/EventList";
import EventsHero from "@/components/ui/EventsHero";

export default function EventiPage() {
  return (
    <>
    <EventsHero />
    <div className="container my-5">
      <EventList view="both" />
    </div>
    </>
  );
}