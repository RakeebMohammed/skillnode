"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ThemeToggle from "@/app/ThemeToggle";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setError(null);
    try {
      const res = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username, password }) });
      if (!res.ok) { const data = await res.json(); setError(data.error || "Login failed."); return; }
      router.push("/admin/dashboard");
    } catch { setError("Unable to sign in. Check your connection and try again."); }
    finally { setLoading(false); }
  }
  return <>
    <ThemeToggle />
    <main className="admin-login-page"><div className="admin-grid" /><div className="admin-glow" /><section className="admin-login-card"><a href="/" className="admin-logo">skillnode<span>.</span></a><div className="admin-login-heading"><p>SKILLNODE CONTROL ROOM</p><h1>Welcome back.</h1><span>Sign in to review learning activity, visitors, and new enquiries.</span></div><form onSubmit={handleSubmit} className="auth-form admin-auth-form"><label>Username<input required autoComplete="username" placeholder="Your username" value={username} onChange={(e) => setUsername(e.target.value)} /></label><label>Password<input required type="password" autoComplete="current-password" placeholder="Your password" value={password} onChange={(e) => setPassword(e.target.value)} /></label>{error && <p className="auth-error">{error}</p>}<button disabled={loading} type="submit">{loading ? "Signing in..." : "Open dashboard"}<span>→</span></button></form><div className="admin-login-footer"><i />Restricted access · Skillnode analytics</div></section></main>
  </>;
}
