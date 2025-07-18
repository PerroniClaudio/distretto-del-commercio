"use client";
import {
  Container,
  Button,
  Icon,
  Breadcrumb,
  BreadcrumbItem,
  Hero,
  HeroBackground,
  HeroBody,
  HeroTitle,
} from "design-react-kit";
import { PortableText } from "next-sanity";
import { PopulatedPost } from "@/types/post";
import Link from "next/link";

interface PostContentProps {
  post: PopulatedPost;
}

function PostContent({ post }: PostContentProps) {
  return (
    <>
      {/* Hero con immagine principale e titolo */}
      {post.image && (
        <Hero overlay="dark">
          <HeroBackground
            src={post.image.asset.url}
            alt={post.image.alt || post.title || "Immagine dell'articolo"}
            title={post.title}
          />
          <HeroBody>
            {/* Titolo principale */}
            <HeroTitle tag="h1">{post.title}</HeroTitle>

            {/* Estratto */}
            {post.excerpt && (
              <p className="d-none d-lg-block">{post.excerpt}</p>
            )}
          </HeroBody>
        </Hero>
      )}

      <Container className="my-5">
        <section>
          <Breadcrumb>
            <BreadcrumbItem>
              <Icon
                aria-hidden
                className="align-top me-1"
                color="secondary"
                icon="it-link"
                size="sm"
              />
              <Link href="/">Home</Link>
              <span className="separator">/</span>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <Icon
                aria-hidden
                className="align-top me-1"
                color="secondary"
                icon="it-link"
                size="sm"
              />
              <Link href="/notizie">Notizie</Link>
              <span className="separator">/</span>
            </BreadcrumbItem>
            <BreadcrumbItem active>
              <Icon
                aria-hidden
                className="align-top me-1"
                color="secondary"
                icon="it-link"
                size="sm"
              />
              {post.title}
            </BreadcrumbItem>
          </Breadcrumb>
        </section>

        <div className="mb-4">
          {/* Data di pubblicazione */}
          <div className="d-flex align-items-center gap-3 mb-3 text-muted">
            <div className="d-flex align-items-center">
              <Icon
                className="icon-sm me-1"
                color="secondary"
                icon="it-calendar"
              />
              <span>
                {post.publishedAt
                  ? new Date(post.publishedAt).toLocaleDateString("it-IT")
                  : "Data non disponibile"}
              </span>
            </div>
          </div>

          {/* Badge per categorie e comuni */}
          {((post.category && post.category.length > 0) ||
            (post.comuni && post.comuni.length > 0)) && (
            <div className="d-flex flex-wrap gap-2 mb-3">
              {post.category && post.category.length > 0 && (
                <>
                  {post.category.map((cat, index) => (
                    <span
                      key={`cat-${index}`}
                      className="badge bg-secondary fs-6">
                      {cat.title}
                    </span>
                  ))}
                </>
              )}
              {post.comuni && post.comuni.length > 0 && (
                <>
                  {post.comuni.map((comune, index) => (
                    <span
                      key={`comune-${index}`}
                      className="badge bg-primary fs-6">
                      {comune.title}
                    </span>
                  ))}
                </>
              )}
            </div>
          )}

          {/* Estratto per mobile (quando nascosto nell'Hero) */}
          {post.excerpt && (
            <p className="lead text-muted mb-4 d-lg-none">{post.excerpt}</p>
          )}
        </div>

        {/* Contenuto dell'articolo */}
        {post.content && (
          <article className="mb-5">
            <div className="content-body">
              <PortableText value={post.content} />
            </div>
          </article>
        )}

        {/* Azioni */}
        <div className="d-flex gap-2">
          <Button size="sm" onClick={() => window.history.back()}>
            <Icon icon="it-arrow-left" className="me-1" />
            Indietro
          </Button>
        </div>
      </Container>
    </>
  );
}

export default PostContent;
