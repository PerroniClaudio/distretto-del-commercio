"use client";
import {
  Card,
  CardBody,
  CardImg,
  CardTagsHeader,
  CardText,
  CardTitle,
} from "design-react-kit";
import { PopulatedPost } from "@/types/post";

function PostCard({ post }: { post: PopulatedPost }) {
  return (
    <Card className="card-bg  border-bottom-card">
      <CardImg
        className="img-fluid post-card-image"
        src={post.image?.asset.url || "https://picsum.photos/1920/1080"}
        alt={post.image?.alt || post.title || "Titolo dell'articolo"}
        width={480}
        height={270}
      />
      <CardBody>
        <div className="text-muted d-flex align-items-center gap-1">
          {/* <Icon
            className="icon-sm"
            color="secondary"
            icon="it-calendar"
            padding
          /> */}
          Data pubblicazione:
          <span>
            {post.publishedAt
              ? new Date(post.publishedAt).toLocaleDateString("it-IT")
              : "Non specificata"}
          </span>
        </div>
        <a
          href={post.slug?.current ? `/notizie/${post.slug.current}` : "#"}
          className="stretched-link">
          <CardTitle tag="h5">{post.title || "Titolo dell'articolo"}</CardTitle>
        </a>
        <CardTagsHeader>
          {(post.category && post.category.length > 0) ||
          (post.comuni && post.comuni.length > 0) ? (
            <div className="d-flex flex-wrap gap-1 mb-2 font-sans-serif">
              {post.category && post.category.length > 0 && (
                <>
                  {post.category.map((cat, index) => (
                    <span key={`cat-${index}`} className="badge bg-secondary">
                      {cat.title}
                    </span>
                  ))}
                  {post.comuni && post.comuni.length > 0 && (
                    <span className="text-muted mx-1">•</span>
                  )}
                </>
              )}
              {post.comuni && post.comuni.length > 0 && (
                <>
                  {post.comuni.map((comune, index) => (
                    <div
                      key={`comune-${index}`}
                      className="badge bg-primary font-sans-serif">
                      <span>{comune.title}</span>
                    </div>
                  ))}
                </>
              )}
            </div>
          ) : null}
        </CardTagsHeader>
        <CardText className="font-sans-serif">
          {post.excerpt ||
            "Breve descrizione dell'articolo. Scopri di più cliccando sul titolo."}
        </CardText>
      </CardBody>
    </Card>
  );
}
export default PostCard;
