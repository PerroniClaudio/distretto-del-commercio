"use client";
import { useState, useCallback } from "react";

export default function ImportEventsForm() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>("");

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    
    setLoading(true);
    setMessage("");
    
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/import-events", { method: "POST", body: formData });
      
      if (res.ok) {
        setMessage("Importazione completata!");
      } else {
        const data = await res.json();
        if (data?.errors && Array.isArray(data.errors)) {
          setMessage("Errore:\n" + data.errors.join("\n"));
        } else if (data?.error) {
          setMessage("Errore: " + data.error);
        } else {
          setMessage("Errore nell'importazione");
        }
      }
    } catch (error) {
      console.log("Errore durante importazione:", error instanceof Error ? error.message : "Errore sconosciuto");
      setMessage("Errore nell'importazione");
    } finally {
      setLoading(false);
    }
  }, [file]);

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <input 
          type="file" 
          accept=".xlsx,.xls" 
          onChange={handleFileChange}
        />
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
      {message && <div className="mt-2" style={{ whiteSpace: 'pre-line' }}>{message}</div>}
    </form>
  );
}
