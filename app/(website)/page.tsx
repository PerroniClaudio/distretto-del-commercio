import ArticleList from "@/components/ArticleList";
import HeroSection from "@/components/ui/HeroSection";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <div className="container">
        <ArticleList />
      </div>
    </div>
  );
}
