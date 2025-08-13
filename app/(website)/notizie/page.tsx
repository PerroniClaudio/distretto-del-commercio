import PostListPaginated from "@/components/PostListPaginated";
import PostsHero from "@/components/ui/PostsHero";

// Le informazioni devono aggiornarsi dinamicamente. O così o usando il revalidate in sanityFetch
export const dynamic = "force-dynamic";

export default function NotiziePage() {
  return (
    <>
    <PostsHero />
    <div className="container my-5">
      <PostListPaginated/>
    </div>
    </>
  );
}