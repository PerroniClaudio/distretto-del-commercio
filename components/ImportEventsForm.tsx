"use client";
import { useState } from "react";

export default function ImportEventsForm() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setMessage("");
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/import-events", { method: "POST", body: formData });
    if (res.ok) {
      setMessage("Importazione completata!");
    } else {
      try {
        const data = await res.json();
        if (data?.errors && Array.isArray(data.errors)) {
          setMessage("Errore:\n" + data.errors.join("\n"));
        } else if (data?.error) {
          setMessage("Errore: " + data.error);
        } else {
          setMessage("Errore nell'importazione");
        }
      } catch {
        setMessage("Errore nell'importazione");
      }
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>  {/* dopo aver risolto l'errore nell'api allineare questi elementi. */}
        <input type="file" accept=".xlsx,.xls" onChange={e => setFile(e.target.files?.[0] || null)} />
        {/* <Button color="primary" outline type="submit" disabled={loading || !file} > */}
        <button
            className="btn btn-primary btn-outline"
            type="submit"
            disabled={loading || !file} 
            style={{
              padding: "8px 16px",
              border: "1px solid #0066cc",
              backgroundColor: "transparent",
              color: "#0066cc",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
          {loading ? "Importazione..." : "Importa eventi"}
        </button>
      </div>
      {message && <div className="mt-2">{message}</div>}
    </form>
  );
}
