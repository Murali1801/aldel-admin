import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function Dashboard() {
  const router = useRouter();
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const s = sessionStorage.getItem("aldel_admin");
    if (!s) {
      router.replace("/login");
      return;
    }
    fetchAttempts();
    const id = setInterval(fetchAttempts, 3000);
    return () => clearInterval(id);
  }, [router]);

  const api = process.env.NEXT_PUBLIC_ALDEL_API_URL || "http://localhost:8001";

  async function fetchAttempts() {
    try {
      const res = await fetch(`${api}/aldel/attempts`);
      const data = await res.json();
      setAttempts(data.attempts || []);
    } catch (_) {}
    setLoading(false);
  }

  const logout = () => {
    sessionStorage.removeItem("aldel_admin");
    router.replace("/login");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <header className="flex justify-between items-center border-b border-slate-700 pb-4 mb-6">
        <h1 className="text-2xl font-bold text-cyan-400">ALDEL Behavioral Monitor</h1>
        <button onClick={logout} className="px-4 py-2 text-slate-400 hover:text-white border border-slate-600 rounded-lg">
          Logout
        </button>
      </header>

      <p className="text-slate-400 text-sm mb-4">
        Login attempts from report.aldel.org. Behavioral patterns (mouse, keystroke) are analyzed; bots are restricted.
      </p>

      <div className="border border-slate-700 rounded-lg overflow-hidden">
        {loading && attempts.length === 0 ? (
          <div className="py-12 text-center text-slate-500">Loading...</div>
        ) : attempts.length === 0 ? (
          <div className="py-12 text-center text-slate-500">No attempts yet. Use the ALDEL Behavioral Monitor extension on report.aldel.org.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-800 text-slate-300">
                  <th className="py-3 px-4 text-left">Time</th>
                  <th className="py-3 px-4 text-left">Page</th>
                  <th className="py-3 px-4 text-left">Risk</th>
                  <th className="py-3 px-4 text-left">Access</th>
                  <th className="py-3 px-4 text-left">Dwell</th>
                  <th className="py-3 px-4 text-left">Flight</th>
                  <th className="py-3 px-4 text-left">Mouse</th>
                </tr>
              </thead>
              <tbody>
                {attempts.map((a) => (
                  <tr key={a.id} className={`border-t border-slate-700 ${a.access_granted ? "bg-emerald-500/5" : "bg-red-500/5"}`}>
                    <td className="py-3 px-4 font-mono text-slate-400">{a.timestamp ? new Date(a.timestamp).toLocaleTimeString() : "-"}</td>
                    <td className="py-3 px-4">{a.page}</td>
                    <td className={`py-3 px-4 font-semibold ${a.risk_score <= 30 ? "text-emerald-400" : a.risk_score <= 60 ? "text-amber-400" : "text-red-500"}`}>{a.risk_score}%</td>
                    <td className={`py-3 px-4 font-semibold ${a.access_granted ? "text-emerald-400" : "text-red-500"}`}>{a.access_granted ? "Granted" : "Restricted"}</td>
                    <td className="py-3 px-4 font-mono">{a.biometrics?.avg_dwell?.toFixed(0) ?? "-"}ms</td>
                    <td className="py-3 px-4 font-mono">{a.biometrics?.avg_flight?.toFixed(0) ?? "-"}ms</td>
                    <td className="py-3 px-4 font-mono">{a.biometrics?.mouse_speed?.toFixed(0) ?? "-"} px/s</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
