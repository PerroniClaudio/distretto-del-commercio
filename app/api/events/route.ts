import { sanityFetch } from "@/sanity/lib/live";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const eventsQuery = `*[_type == "event"] | order(date asc) {
      _id,
      title,
      slug,
      date,
      dateEnd,
      location,
      description,
      category->{title},
      comune->{title},
      image{
        asset->{
          _id,
          url
        },
        alt
      }
    }`;

    const { data: events } = await sanityFetch({
      query: eventsQuery,
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error('Errore nel recupero degli eventi:', error);
    return NextResponse.json(
      { error: 'Errore nel recupero degli eventi' },
      { status: 500 }
    );
  }
}