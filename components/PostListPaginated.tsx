"use client";

import { useState, useEffect, useCallback, Suspense, useRef } from "react";
import { client } from "@/sanity/lib/client";
import { PopulatedPost } from "@/types/post";
import PostCard from "./ui/PostCard";
import { Button, Icon, Select } from "design-react-kit";
import { useComuni } from "@/hooks/useComuni";
import { useCategories } from "@/hooks/useCategories";
import { useRouter, useSearchParams } from "next/navigation";
import { NEWS_VISIBILITY_CONDITIONS } from "@/lib/queryUtils";

const POSTS_PER_PAGE = 6;

function PostListPaginatedContent() {
  const [posts, setPosts] = useState<PopulatedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // const [selectedComune, setSelectedComune] = useState<string[]>([]);
  // const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [selectedComune, setSelectedComune] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const paginationTopRef = useRef<HTMLDivElement | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { comuni, loading: loadingComuni, error: errorComuni } = useComuni();
  const {
    categories,
    loading: loadingCategories,
    error: errorCategories,
  } = useCategories();

  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

  const fetchPosts = useCallback(
    async (page: number) => {
      setLoading(true);
      setError(null);

      try {
        const offset = (page - 1) * POSTS_PER_PAGE;

        // Aggiungi i filtri per comune e categoria
        const filters = [];
        if (selectedComune) {
          console.log("Selected Comune:", selectedComune);
          filters.push(
            `references(*[_type == "comune" && slug.current == "${selectedComune}"]._id)`
          );
        }
        if (selectedCategory) {
          console.log("Selected Category:", selectedCategory);
          filters.push(
            `references(*[_type == "category" && slug.current == "${selectedCategory}"]._id)`
          );
        }
        const filterQuery =
          filters.length > 0 ? `&& ${filters.join(" && ")}` : "";

        // Query per ottenere i post paginati
        const postsQuery = `*[_type == "post"${filterQuery} && ${NEWS_VISIBILITY_CONDITIONS}] | order(publishedAt desc) [${offset}...${
          offset + POSTS_PER_PAGE
        }] {
        _id,
        title,
        slug,
        excerpt,
        category[]->{title},
        comuni[]->{
          title,
          image{
            asset->{
              _id,
              url
            },
            alt
          }
        },
        publishedAt,
        image{
          asset->{
            _id,
            url
          },
          alt
        },
        enti[]->{
          _id,
          title,
          slug
        }
      }`;

        // Query per contare il totale dei post (con gli stessi filtri)
        const countQuery = `count(*[_type == "post"${filterQuery} && ${NEWS_VISIBILITY_CONDITIONS}])`;

        const [postsData, totalCount] = await Promise.all([
          client.fetch(postsQuery),
          client.fetch(countQuery),
        ]);

        setPosts(postsData);
        setTotalPosts(totalCount);
      } catch (err) {
        setError("Errore nel caricamento degli articoli");
        console.error("Errore fetch posts:", err);
      } finally {
        setLoading(false);
      }
    },
    [selectedComune, selectedCategory]
  );

  useEffect(() => {
    fetchPosts(currentPage);
  }, [currentPage, selectedCategory, selectedComune, fetchPosts]);

  useEffect(() => {
    console.log({ posts });
  }, [posts]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll verso l'alto quando cambia pagina
    // window.scrollTo({ top: 0, behavior: "smooth" });
    if (paginationTopRef.current) {
      paginationTopRef.current.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const comune = searchParams.get("comune");
    const category = searchParams.get("category");
    if (comune) setSelectedComune(comune);
    if (category) setSelectedCategory(category);
  }, [searchParams]);

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Aggiusta l'inizio se siamo vicini alla fine
    if (endPage - startPage + 1 < maxVisiblePages && totalPages > 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Pulsante "Prima pagina" (sempre visibile)
    pages.push(
      <li
        key="first"
        className={`page-item arrow ${
          currentPage === 1 || totalPages <= 1 ? "disabled" : ""
        }`}>
        <Button
          size="xs"
          className=""
          onClick={() =>
            currentPage !== 1 && totalPages > 1
              ? handlePageChange(1)
              : undefined
          }
          disabled={currentPage === 1 || totalPages <= 1}
          aria-label="Prima pagina">
          <div className="double-chevron">
            <Icon
              className="icon-sm me-2"
              color="secondary"
              icon="it-chevron-left"
              padding={false}
            />
            <Icon
              className="icon-sm me-2"
              color="secondary"
              icon="it-chevron-left"
              padding={false}
            />
          </div>
        </Button>
      </li>
    );

    // Pulsante "Precedente" (sempre visibile)
    pages.push(
      <li
        key="prev"
        className={`page-item arrow ${
          currentPage <= 1 || totalPages <= 1 ? "disabled" : ""
        }`}>
        <Button
          size="xs"
          className=""
          onClick={() =>
            currentPage > 1 && totalPages > 1
              ? handlePageChange(currentPage - 1)
              : undefined
          }
          disabled={currentPage <= 1 || totalPages <= 1}
          aria-label="Pagina precedente">
          <Icon
            className="icon-sm me-md-2"
            color="secondary"
            icon="it-chevron-left"
            padding={false}
          />
        </Button>
      </li>
    );

    // Ellipsis iniziale se necessario (solo se ci sono più pagine)
    if (startPage > 1 && totalPages > 1) {
      if (startPage > 2) {
        pages.push(
          <li key="ellipsis1" className="page-item disabled">
            <span className="">...</span>
          </li>
        );
      }
    }

    // Pagine visibili (almeno la pagina 1)
    const actualEndPage = totalPages === 0 ? 1 : endPage;
    for (let i = startPage; i <= actualEndPage; i++) {
      pages.push(
        <li
          key={i}
          className={`page-item ${i === currentPage ? "active" : ""}`}>
          <Button
            color={`${i === currentPage ? "secondary" : "primary"}`}
            size="xs"
            className=""
            onClick={() => (totalPages > 1 ? handlePageChange(i) : undefined)}
            disabled={totalPages <= 1}
            aria-current={i === currentPage ? "page" : undefined}>
            {i}
          </Button>
        </li>
      );
    }

    // Ellipsis finale se necessario (solo se ci sono più pagine)
    if (endPage < totalPages && totalPages > 1) {
      if (endPage < totalPages - 1) {
        pages.push(
          <li key="ellipsis2" className="page-item disabled">
            <span className="">...</span>
          </li>
        );
      }
    }

    // Pulsante "Successivo" (sempre visibile)
    pages.push(
      <li
        key="next"
        className={`page-item arrow ${
          currentPage >= totalPages || totalPages <= 1 ? "disabled" : ""
        }`}>
        <Button
          size="xs"
          className=""
          onClick={() =>
            currentPage < totalPages && totalPages > 1
              ? handlePageChange(currentPage + 1)
              : undefined
          }
          disabled={currentPage >= totalPages || totalPages <= 1}
          aria-label="Pagina successiva">
          <Icon
            className="icon-sm me-md-2"
            color="secondary"
            icon="it-chevron-right"
            padding={false}
          />
        </Button>
      </li>
    );

    // Pulsante "Ultima pagina" (sempre visibile)
    pages.push(
      <li
        key="last"
        className={`page-item arrow ${
          currentPage === totalPages || totalPages <= 1 ? "disabled" : ""
        }`}>
        <Button
          size="xs"
          className=""
          onClick={() =>
            currentPage !== totalPages && totalPages > 1
              ? handlePageChange(totalPages)
              : undefined
          }
          disabled={currentPage === totalPages || totalPages <= 1}
          aria-label="Ultima pagina">
          <div className="double-chevron">
            <Icon
              className="icon-sm me-2"
              color="secondary"
              icon="it-chevron-right"
              padding={false}
            />
            <Icon
              className="icon-sm me-2"
              color="secondary"
              icon="it-chevron-right"
              padding={false}
            />
          </div>
        </Button>
      </li>
    );

    return (
      <nav aria-label="Navigazione pagine articoli" className="mt-4">
        <ul className="pagination justify-content-center align-items-center">{pages}</ul>
      </nav>
    );
  };

  if (loading) {
    return (
      <div className="article-list mt-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Caricamento...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="article-list mt-4">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="position-relative">
      <div ref={paginationTopRef} id="post-pagination-top" className="d-hidden position-absolute" style={{ top: '-8rem' }}></div>
      <div className="article-filters-wrapper">
        <Select
          id="select-category"
          label="Filtra per categoria"
          value={selectedCategory || ""}
          onChange={(value: string) => {
            setSelectedCategory(value);
            setCurrentPage(1); // Reset pagina quando cambia filtro
            router.push(`/notizie?category=${encodeURIComponent(value)}`);
          }}>
          <>
            {loadingCategories ? (
              <option value="" disabled>
                Caricamento categorie...
              </option>
            ) : errorCategories ? (
              <option value="" disabled>
                Errore nel caricamento categorie
              </option>
            ) : (
              <option value="">Scegli un&apos;opzione</option>
            )}
            {!!categories &&
              categories.map((category) => (
                <option key={category._id} value={category.slug.current}>
                  {category.title}
                </option>
              ))}
          </>
        </Select>
        <Select
          id="select-comune"
          label="Filtra per comune"
          value={selectedComune || ""}
          onChange={(value: string) => {
            setSelectedComune(value);
            setCurrentPage(1); // Reset pagina quando cambia filtro
            router.push(`/notizie?comune=${encodeURIComponent(value)}`);
          }}>
          <>
            {loadingComuni ? (
              <option value="" disabled>
                Caricamento comuni...
              </option>
            ) : errorComuni ? (
              <option value="" disabled>
                Errore nel caricamento comuni
              </option>
            ) : (
              <option value="">Scegli un&apos;opzione</option>
            )}
            {!!comuni &&
              comuni.map((comune) => (
                <option key={comune._id} value={comune.slug.current}>
                  {comune.title}
                </option>
              ))}
          </>
        </Select>
      </div>
      <div className="article-list mt-4">
        {posts.length === 0 ? (
          <p>Nessun articolo trovato.</p>
        ) : (
          <>
            <div className="articles-grid row">
              {posts.map((post: PopulatedPost) => (
                <div key={post._id} className="col-12 col-md-6 col-lg-4 mb-4">
                  <PostCard post={post} />
                </div>
              ))}
            </div>

            {/* Info paginazione */}
            <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
              <small className="text-muted">
                Visualizzando {(currentPage - 1) * POSTS_PER_PAGE + 1}-
                {Math.min(currentPage * POSTS_PER_PAGE, totalPosts)} di{" "}
                {totalPosts} articoli
              </small>
              <small className="text-muted">
                Pagina {currentPage} di {totalPages}
              </small>
            </div>

            {/* Paginazione */}
            {renderPagination()}
          </>
        )}
      </div>
    </div>
  );
}

// Componente di fallback durante il caricamento
function PostListPaginatedFallback() {
  return (
    <div className="text-center py-5">
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Caricamento...</span>
      </div>
      <p className="mt-2">Caricamento attività commerciali...</p>
    </div>
  );
}

// Componente principale che avvolge il contenuto in un Suspense boundary
export default function PostListPaginated() {
  return (
    <Suspense fallback={<PostListPaginatedFallback />}>
      <PostListPaginatedContent />
    </Suspense>
  );
}
