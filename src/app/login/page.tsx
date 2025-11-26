"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { loginAdmin } from "~/app/actions/admin";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await loginAdmin(password);

    if (result.success) {
      router.push("/admin");
    } else {
      setError(result.error || "Invalid password");
      setPassword("");
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] py-8 sm:py-12">
      <div className="w-full max-w-md">
        <div className="rounded-xl bg-accent/20 border border-border/40 p-8">
          <h1 className="text-2xl font-bold mb-2">Admin Login</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Enter your admin password to access the admin panel.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:border-fuchsia-300 focus:outline-none focus:ring-2 focus:ring-fuchsia-300/20 transition-colors"
                required
                disabled={loading}
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 rounded-lg bg-fuchsia-300/20 text-fuchsia-300 border border-fuchsia-300/40 hover:bg-fuchsia-300/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
