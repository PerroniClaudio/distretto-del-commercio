import { defineQuery } from "next-sanity";
import { client } from "@/sanity/lib/client";
import Link from "next/link";
import { EVENT_VISIBILITY_CONDITIONS, NEWS_VISIBILITY_CONDITIONS } from "@/lib/queryUtils";

const sitemapQuery = defineQuery(`{
  "staticPages": *[_type == "static_page" && defined(slug.current)] | order(title asc) {
    title,
    "slug": slug.current,
    publishedAt
  },
  "posts": *[_type == "post" && defined(slug.current) && ${NEWS_VISIBILITY_CONDITIONS}] | order(publishedAt desc) {
    title,
    "slug": slug.current,
    publishedAt,
    excerpt
  },
  "events": *[_type == "event" && defined(slug.current) && ${EVENT_VISIBILITY_CONDITIONS}] | order(date desc) {
    title,
    "slug": slug.current,
    date,
    location
  },
  "categories": *[_type == "category" && defined(slug.current)] | order(title asc) {
    title,
    "slug": slug.current
  },
  "comuni": *[_type == "comune" && defined(slug.current)] | order(title asc) {
    title,
    "slug": slug.current
  }
}`);

interface SitemapData {
  staticPages: Array<{
    title: string;
    slug: string;
    publishedAt?: string;
  }>;
  posts: Array<{
    title: string;
    slug: string;
    publishedAt?: string;
    excerpt?: string;
  }>;
  events: Array<{
    title: string;
    slug: string;
    date?: string;
    location?: string;
  }>;
  categories: Array<{
    title: string;
    slug: string;
  }>;
  comuni: Array<{
    title: string;
    slug: string;
  }>;
}

export default async function Sitemap() {
  const data: SitemapData = await client.fetch(sitemapQuery);

  return (
    <div className="container mx-auto px-4 py-5">
      <h1 className="text-3xl font-bold mb-8">Mappa del Sito</h1>
      
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        
        {/* Pagine Principali */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-blue-600">Pagine Principali</h2>
          <ul className="space-y-2">
            <li>
              <Link href="/" className="text-blue-500 hover:underline">
                Home
              </Link>
            </li>
            <li>
              <Link href="/notizie" className="text-blue-500 hover:underline">
                Notizie
              </Link>
            </li>
            <li>
              <Link href="/eventi" className="text-blue-500 hover:underline">
                Eventi
              </Link>
            </li>
          </ul>
        </section>

        {/* Pagine Statiche */}
        {data.staticPages.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold mb-4 text-green-600">Pagine Informative</h2>
            <ul className="space-y-2">
              {data.staticPages.map((page) => (
                <li key={page.slug}>
                  <Link href={`/${page.slug}`} className="text-blue-500 hover:underline">
                    {page.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Comuni */}
        {data.comuni.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold mb-4 text-purple-600">Comuni</h2>
            <ul className="space-y-2 max-h-64 overflow-y-auto">
              {data.comuni.map((comune) => (
                <li key={comune.slug}>
                  <Link href={`/comuni/${comune.slug}`} className="text-blue-500 hover:underline">
                    {comune.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Categorie */}
        {data.categories.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold mb-4 text-orange-600">Categorie</h2>
            <ul className="space-y-2">
              {data.categories.map((category) => (
                <li key={category.slug}>
                  <Link href={`/categorie/${category.slug}`} className="text-blue-500 hover:underline">
                    {category.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Notizie Recenti */}
        {data.posts.length > 0 && (
          <section className="md:col-span-2">
            <h2 className="text-xl font-semibold mb-4 text-red-600">Notizie Recenti</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {data.posts.slice(0, 6).map((post) => (
                <div key={post.slug} className="border rounded-lg p-4">
                  <Link href={`/notizie/${post.slug}`} className="text-blue-500 hover:underline font-medium">
                    {post.title}
                  </Link>
                  {post.excerpt && (
                    <p className="text-gray-600 text-sm mt-2 line-clamp-2">{post.excerpt}</p>
                  )}
                  {post.publishedAt && (
                    <p className="text-gray-400 text-xs mt-2">
                      {new Date(post.publishedAt).toLocaleDateString('it-IT')}
                    </p>
                  )}
                </div>
              ))}
            </div>
            {data.posts.length > 6 && (
              <div className="mt-4">
                <Link href="/notizie" className="text-blue-500 hover:underline font-medium">
                  Vedi tutte le notizie →
                </Link>
              </div>
            )}
          </section>
        )}

        {/* Eventi Recenti */}
        {data.events.length > 0 && (
          <section className="md:col-span-2 lg:col-span-1">
            <h2 className="text-xl font-semibold mb-4 text-indigo-600">Eventi Recenti</h2>
            <div className="space-y-3">
              {data.events.slice(0, 5).map((event) => (
                <div key={event.slug} className="border rounded-lg p-3">
                  <Link href={`/eventi/${event.slug}`} className="text-blue-500 hover:underline font-medium">
                    {event.title}
                  </Link>
                  {event.location && (
                    <p className="text-gray-600 text-sm mt-1">📍 {event.location}</p>
                  )}
                  {event.date && (
                    <p className="text-gray-400 text-xs mt-1">
                      {new Date(event.date).toLocaleDateString('it-IT')}
                    </p>
                  )}
                </div>
              ))}
            </div>
            {data.events.length > 5 && (
              <div className="mt-4">
                <Link href="/eventi" className="text-blue-500 hover:underline font-medium">
                  Vedi tutti gli eventi →
                </Link>
              </div>
            )}
          </section>
        )}
      </div>

      {/* Footer della Sitemap */}
      <div className="mt-12 pt-8 border-t">
        <p className="text-gray-600 text-center">
          Questa mappa del sito viene aggiornata automaticamente quando vengono aggiunti nuovi contenuti.
        </p>
      </div>
    </div>
  );
}