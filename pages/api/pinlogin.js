import { supabase } from "@/utils/supabaseClient";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { pin } = req.body;

  try {
    const { data, error } = await supabase
      .from("login_pin")
      .select("staff_pin")
      .limit(1);

    console.log("Raw Supabase data:", data);
    console.log("Raw Supabase error:", error);

    // ✅ Place this line RIGHT HERE
    const pinFromDB = data?.[0]?.staff_pin;
    console.log("Fetched PIN from DB:", pinFromDB);

    if (!pinFromDB) {
      return res.status(500).json({ success: false, message: "No PIN set" });
    }

    if (pinFromDB === pin) {
      return res.status(200).json({ success: true, role: "staff" });
    }

    return res.status(401).json({ success: false, message: "Wrong PIN" });
  } catch (err) {
    console.error("Unexpected server error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Unexpected server error" });
  }
}
