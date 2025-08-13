import ImportEventsForm from "@/components/ImportEventsForm";

// Pagina di import eventi da Excel
export default function ImportEventsTool() {
  return (
    <div style={{ padding: 32 }}>
      <h1>Importa eventi da Excel</h1>
      {/* Qui puoi inserire il componente di upload, ad esempio <ImportEventsForm /> */}
      <p>Carica un file Excel per importare eventi in Sanity.</p>
      <ImportEventsForm />
    </div>
  );
}
