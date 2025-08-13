import EventList from "@/components/EventList";
import EventsHero from "@/components/ui/EventsHero";

// Le informazioni devono aggiornarsi dinamicamente. O così o usando il revalidate in sanityFetch
export const dynamic = "force-dynamic";

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