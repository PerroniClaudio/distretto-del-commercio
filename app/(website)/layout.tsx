import FooterSection from "@/components/ui/FooterSection";
import Navigation from "@/components/ui/Navigation";

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Layout per il sito web - con Navigation
  return (
    <div className="min-vh-100 d-flex flex-column justify-content-between" id="website-layout">
      <div>
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000 }}>
          <Navigation />
        </div>
        <div>{children}</div>
      </div>
      <FooterSection />
    </div>
  );
}
