"use client";
import {
  Container,
  Row,
  Col,
  Button,
  Icon,
  Breadcrumb,
  BreadcrumbItem,
  Hero,
  HeroBackground,
  HeroBody,
  HeroCategory,
  HeroTitle,
} from "design-react-kit";
import { PortableText } from "next-sanity";
import { PopulatedPost } from "@/types/post";

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

      <Container fluid className="px-4 py-5">
        <Row>
          <Col lg={8} className="mx-auto">
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
                  <a href="/">Home</a>
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
                  <a href="/notizie">Notizie</a>
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

            {/* Meta informazioni del post */}
            {post.image && (
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
                  <p className="lead text-muted mb-4 d-lg-none">
                    {post.excerpt}
                  </p>
                )}
              </div>
            )}

            {/* Header dell'articolo (solo se non c'è immagine) */}
            {!post.image && (
              <header className="mb-4">
                <h1 className="display-4 mb-3">{post.title}</h1>

                {/* Meta informazioni */}
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
                  <div className="d-flex flex-wrap gap-2 mb-4">
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

                {/* Estratto */}
                {post.excerpt && (
                  <p className="lead text-muted mb-4">{post.excerpt}</p>
                )}
              </header>
            )}

            {/* Contenuto dell'articolo */}
            {post.content && (
              <article className="mb-5">
                <div className="content-body">
                  <PortableText value={post.content} />
                </div>
              </article>
            )}

            {/* Azioni */}
            <div className="d-flex gap-2 mt-5">
              <Button
                color="outline-primary"
                size="sm"
                onClick={() => window.history.back()}>
                <Icon icon="it-arrow-left" className="me-1" />
                Indietro
              </Button>

              <Button
                color="outline-secondary"
                size="sm"
                onClick={() => window.print()}>
                <Icon icon="it-print" className="me-1" />
                Stampa
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default PostContent;
