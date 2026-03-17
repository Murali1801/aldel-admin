import { getDocs, collection, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();
  try {
    const snap = await getDocs(
      query(collection(db, "aldel_logs"), orderBy("createdAt", "desc"), limit(100))
    );
    const logs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    res.json({ logs });
  } catch (e) {
    res.status(500).json({ logs: [], error: e.message });
  }
}
