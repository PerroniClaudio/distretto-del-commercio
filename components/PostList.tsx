import { sanityFetch } from "@/sanity/lib/live";
import { PopulatedPost } from "@/types/post";
import PostCard from "./ui/PostCard";
import { NEWS_VISIBILITY_CONDITIONS } from "@/lib/eventUtils";

const POSTS_TO_SHOW = 6;

async function PostList() {
  const postsQuery = `*[_type == "post" && ${NEWS_VISIBILITY_CONDITIONS}] | order(publishedAt desc)[0...${POSTS_TO_SHOW}] {
    _id,
    title,
    slug,
    excerpt,
    category[]->{title},
    comuni[]->{title},
    publishedAt,
    image{
      asset->{
        _id,
        url
      },
      alt
    }
  }`;

  const { data: posts } = await sanityFetch({
    query: postsQuery,
  });

  return (
    <div className="article-list mt-4">
      {posts.length === 0 ? (
        <p>Nessun articolo trovato.</p>
      ) : (
        <div className="articles-grid row">
          {posts.map((post: PopulatedPost) => (
            <div key={post._id} className="col-12 col-md-6 col-lg-4 mb-4">
              <PostCard post={post} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PostList;
