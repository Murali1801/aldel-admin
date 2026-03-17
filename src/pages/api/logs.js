import { getDocs, collection, query, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();
  try {
    if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
      return res.json({ logs: [] });
    }
    const snap = await getDocs(
      query(collection(db, "aldel_logs"), limit(100))
    );
    const logs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    logs.sort((a, b) => (new Date(b.createdAt || b.timestamp || 0) - new Date(a.createdAt || a.timestamp || 0)));
    res.json({ logs: logs.slice(0, 100) });
  } catch (e) {
    res.json({ logs: [] });
  }
}
