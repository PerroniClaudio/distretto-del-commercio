import EventList from "@/components/EventList";
import PostListPaginated from "@/components/PostListPaginated";
import EventsHero from "@/components/ui/EventsHero";
import PostsHero from "@/components/ui/PostsHero";

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