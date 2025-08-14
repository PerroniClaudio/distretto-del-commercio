import ImportEventsForm from "@/components/ImportEventsForm";
import { Button } from "design-react-kit";

// Pagina di import eventi da Excel
export default function ImportEventsTool() {
  return (
    <div style={{ padding: 32 }}>
      <h1>Importa eventi da Excel</h1>
      <div style={{ marginTop: "1rem" }}>
        <p>Scarica il template e compilalo, senza modificare il formato delle celle.</p>
        <a href="/template-import-eventi.xlsx" download>
          <Button color="primary" outline type="button">
              Scarica template
          </Button>
        </a>
      </div>
      <div style={{ marginTop: "1rem" }}>
        <p>Carica il template compilato per importare eventi in Sanity.</p>
        <ImportEventsForm />
      </div>
    </div>
  );
}
