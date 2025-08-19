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
  List,
  ListItem,
} from "design-react-kit";
import { PortableText } from "next-sanity";
import { PopulatedPost } from "@/types/post";
import Link from "next/link";

interface PostContentProps {
  post: PopulatedPost;
}

type FileItem = {
  asset?: {
    _id: string;
    url: string;
    originalFilename?: string;
  };
  title?: string;
  _key: string;
  _type: "file";
};

function PostContent({ post }: PostContentProps) {

  const handleDownload = (fileItem: FileItem) => {
    if (fileItem.asset?.url) {
      const link = document.createElement('a');
      link.href = fileItem.asset.url;
      link.download = fileItem.asset.originalFilename || 'file';
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  

  return (
    <>
      {/* Hero con immagine principale e titolo */}
      {(post?.image || post?.comuni?.[0]?.image) && (
        <Hero overlay="dark">
          <HeroBackground
            src={post?.image?.asset?.url || post?.comuni?.[0]?.image?.asset?.url || ""}
            alt={post?.image?.alt || post.title || "Immagine dell'articolo"}
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
              <h2>{post.title}</h2>
              <PortableText value={post.content} />
            </div>
          </article>
        )}

        {/* Sezione Allegati */}
        {post.files && post.files.length > 0 && (
          <section className="mb-5 border-top pt-4">
            <h3 className="h4 mb-3">
              <Icon icon="it-clip" className="me-2" />
              Allegati
            </h3>
            <div className="d-flex flex-column gap-2">
              <List>
                {post.files.map((fileItem) => (
                  <ListItem key={fileItem._key}>
                    <div className="file-list-item">
                      <Button
                        size="xs"
                        className="flex-shrink-0 mb-2 btn-secondary"
                        onClick={() => handleDownload(fileItem)}>
                        <Icon icon="it-download" className="me-1 white" />
                        Scarica
                      </Button>
                      {/* <Icon icon="it-file" className="icon-sm me-2" /> */}
                      <span>{fileItem.title || fileItem.asset?.originalFilename || "File senza nome"}</span>
                    </div>
                  </ListItem>
                ))}
              </List>
            </div>
          </section>
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
