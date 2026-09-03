// src/pages/SignUpPage.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const SignUpPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.username || !form.email || !form.password) {
      setError("Fill in all fields to continue.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/v0/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Couldn't create your account.");
      }
      
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-ink px-6 text-paper">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Link to="/" className="font-molgan text-xl">
            Contract_IQ
          </Link>
          <h1 className="mt-6 text-2xl font-medium">Create your account</h1>
          <p className="mt-2 text-sm text-fog">Start analyzing contracts in minutes</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-lg border border-steel bg-slate p-6"
        >
          {error && (
            <div className="mb-4 rounded-md border border-flag/40 bg-flag/10 px-3 py-2 text-sm text-flag">
              {error}
            </div>
          )}

          <label className="mb-1 block text-xs text-fog" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            placeholder="janedoe"
            value={form.username}
            onChange={handleChange}
            className="mb-4 w-full rounded-md border border-steel bg-ink px-3 py-2 text-sm text-paper placeholder:text-fog/60 focus:border-evidence focus:outline-none"
          />

          <label className="mb-1 block text-xs text-fog" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="name@company.com"
            value={form.email}
            onChange={handleChange}
            className="mb-4 w-full rounded-md border border-steel bg-ink px-3 py-2 text-sm text-paper placeholder:text-fog/60 focus:border-evidence focus:outline-none"
          />

          <label className="mb-1 block text-xs text-fog" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="At least 6 characters"
            value={form.password}
            onChange={handleChange}
            className="mb-6 w-full rounded-md border border-steel bg-ink px-3 py-2 text-sm text-paper placeholder:text-fog/60 focus:border-evidence focus:outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-evidence px-4 py-2.5 text-sm font-medium text-ink transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-fog">
          Already have an account?{" "}
          <Link to="/login" className="text-evidence hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;