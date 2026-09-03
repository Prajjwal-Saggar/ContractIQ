// src/pages/Dashboard.jsx
import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const statusStyles = {
  UPLOADING: "text-fog",
  PROCESSING: "text-evidence",
  READY: "text-verified",
  FAILED: "text-flag",
};

const Dashboard = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [documents, setDocuments] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const fetchDocuments = async () => {
    const res = await fetch(`${API_URL}/api/v0/docs`, {
      credentials: "include",
    });
    const data = await res.json();
    return res.ok ? data.docs || data.data || [] : [];
  };

  useEffect(() => {
    fetchDocuments()
      .then(setDocuments)
      .catch(() => {
        // silently fail — empty state covers this
      })
      .finally(() => {
        setLoadingDocs(false);
      });
  }, []);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setError("");
    setUploading(true);

    const formData = new FormData();
    formData.append("document", file);

    try {
      const res = await fetch(`${API_URL}/api/v0/docs/upload`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Upload failed. Try again.");
      }

      setDocuments((prev) => [data.data, ...prev]);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleLogout = async () => {
    await fetch(`${API_URL}/api/v0/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    navigate("/login");
  };

  return (
    <div className="min-h-screen w-full bg-ink text-paper">
      {/* Navbar */}
      <header className="border-b border-steel/60 px-6 py-4 md:px-10">
        <nav className="mx-auto flex max-w-6xl items-center justify-between">
          <Link to="/" className="font-molgan text-xl">
            Contract_IQ
          </Link>
          <button
            onClick={handleLogout}
            className="text-sm text-fog hover:text-paper transition-colors"
          >
            Log out
          </button>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10 md:px-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-medium">Your contracts</h1>
            <p className="mt-1 text-sm text-fog">
              Upload a contract to start asking questions about it.
            </p>
          </div>

          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="rounded-md bg-evidence px-4 py-2.5 text-sm font-medium text-ink transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {uploading ? "Uploading…" : "Upload contract"}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-md border border-flag/40 bg-flag/10 px-4 py-3 text-sm text-flag">
            {error}
          </div>
        )}

        {loadingDocs ? (
          <p className="text-sm text-fog">Loading your contracts…</p>
        ) : documents.length === 0 ? (
          <div className="rounded-lg border border-dashed border-steel bg-slate/40 px-6 py-16 text-center">
            <h2 className="text-base font-medium">No contracts yet</h2>
            <p className="mt-2 text-sm text-fog">
              Upload your first PDF to get started.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {documents.map((doc) => (
              <div
                key={doc._id}
                className="rounded-lg border border-steel bg-slate p-5 transition-colors hover:border-evidence/50"
              >
                <p className="truncate text-sm font-medium">{doc.filename}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span
                    className={`text-xs font-mono ${
                      statusStyles[doc.status] || "text-fog"
                    }`}
                  >
                    {doc.status}
                  </span>
                  {doc.pageCount && (
                    <span className="text-xs text-fog">
                      {doc.pageCount} pages
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;