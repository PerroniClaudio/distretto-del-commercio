import FooterSection from "@/components/ui/FooterSection";
import Navigation from "@/components/ui/Navigation";

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Layout per il sito web - con Navigation
  return (
    <>
      <Navigation />
      <div>{children}</div>
      <FooterSection />
    </>
  );
}
