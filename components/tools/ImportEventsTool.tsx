import ImportEventsForm from "@/components/ImportEventsForm";
// Non usare design-react-kit nei tool di sanity perchè dà problemi con typegen. 
// Se si vuole usare vanno disabilitati i tool in sanity.config prima di usare typegen.

// Pagina di import eventi da Excel
export default function ImportEventsTool() {
  return (
    <div style={{ padding: 32 }}>
      <h1>Importa eventi da Excel</h1>
      <div style={{ marginTop: "1rem" }}>
        <p>
          Scarica il template e compilalo, senza modificare il formato delle
          celle.
        </p>
        <a href="/template-import-eventi.xlsx" download>
          <button
            className="btn btn-primary btn-outline"
            type="button"
            style={{
              padding: "8px 16px",
              border: "1px solid #0066cc",
              backgroundColor: "transparent",
              color: "#0066cc",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Scarica template
          </button>
        </a>
      </div>
      <div style={{ marginTop: "1rem" }}>
        <p>Carica il template compilato per importare gli eventi.</p>
        <p>
          Immagini e allegati vanno caricati dall&apos;evento, dopo averlo
          generato.
        </p>
        <ImportEventsForm />
      </div>
    </div>
  );
}
