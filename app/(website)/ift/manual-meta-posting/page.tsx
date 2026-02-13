"use client";

import { FormEvent, useState } from "react";

type PublishResponse = {
  success: boolean;
  error?: string;
  sanityPostId?: string;
};

export default function ManualMetaPostingPage() {
  const [sanityPostId, setSanityPostId] = useState("");
  const [secret, setSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PublishResponse | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/social/manual/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sanityPostId, secret }),
      });

      const payload = (await response.json()) as PublishResponse;
      setResult(payload);
    } catch {
      setResult({ success: false, error: "Network error while calling manual publish route." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container py-5" style={{ marginTop: "120px", maxWidth: "760px" }}>
      <h1 className="mb-4">Manual Meta Posting</h1>
      <p className="mb-4">
        Esegui la pubblicazione manuale su Facebook e Instagram inserendo l&apos;ID del post Sanity.
      </p>

      <form onSubmit={onSubmit} className="d-flex flex-column gap-3">
        <div>
          <label htmlFor="sanityPostId" className="form-label">
            Sanity Post ID
          </label>
          <input
            id="sanityPostId"
            className="form-control"
            value={sanityPostId}
            onChange={(e) => setSanityPostId(e.target.value)}
            placeholder="post-id-from-sanity"
            required
          />
        </div>

        <div>
          <label htmlFor="manualSecret" className="form-label">
            Manual Posting Secret
          </label>
          <input
            id="manualSecret"
            type="password"
            className="form-control"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder="META_MANUAL_POSTING_SECRET"
            required
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Publishing..." : "Publish now"}
        </button>
      </form>

      {result && (
        <div className={`alert mt-4 ${result.success ? "alert-success" : "alert-danger"}`} role="alert">
          {result.success
            ? `Pubblicazione completata per il post ${result.sanityPostId || sanityPostId}.`
            : `Errore: ${result.error || "Unknown error"}`}
        </div>
      )}
    </main>
  );
}
