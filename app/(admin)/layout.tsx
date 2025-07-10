export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Layout per l'area admin - senza Navigation
  return <>{children}</>;
}
