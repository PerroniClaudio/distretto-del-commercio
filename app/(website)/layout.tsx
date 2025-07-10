import Navigation from "@/components/Navigation";

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Layout per il sito web - con Navigation
  return (
    <>
      <Navigation />
      <div className="container">{children}</div>
    </>
  );
}
