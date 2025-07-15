import PostList from "@/components/PostList";
import HeroSection from "@/components/ui/HeroSection";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <div className="container">
        <PostList />
      </div>
    </div>
  );
}
