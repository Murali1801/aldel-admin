import { useState } from "react";
import { useRouter } from "next/router";

export default function Login() {
  const router = useRouter();
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const api = process.env.NEXT_PUBLIC_ALDEL_API_URL || "http://localhost:8001";
      const res = await fetch(`${api}/aldel/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: user, password: pass }),
      });
      const data = await res.json();
      if (res.ok) {
        sessionStorage.setItem("aldel_admin", JSON.stringify({ token: data.token, user: data.username }));
        router.push("/dashboard");
      } else setErr("Invalid credentials");
    } catch (e) {
      setErr("Connection error. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-xl p-8">
        <h1 className="text-xl font-bold text-cyan-400 mb-6">ALDEL Admin Login</h1>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1">Username</label>
            <input
              type="text"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Password</label>
            <input
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white"
              required
            />
          </div>
        </div>
        {err && <p className="mt-4 text-red-400 text-sm">{err}</p>}
        <button type="submit" disabled={loading} className="mt-6 w-full py-3 bg-cyan-600 rounded-lg font-medium disabled:opacity-50">
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
