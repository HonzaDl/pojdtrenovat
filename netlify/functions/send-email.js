import { createClient } from "@supabase/supabase-js";

export async function handler(event) {

  try {

    const { hrac, email, treningId } = JSON.parse(event.body);

    if (!hrac || !email || !treningId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ ok: false, error: "Missing data" })
      };
    }

    const supabase = createClient(
      "https://kgmdyhiwkkviswluuwkg.supabase.co",
      process.env.SUPABASE_SERVICE_KEY
    );

    const { data: trening, error } = await supabase
      .from("treninky")
      .select("*")
      .eq("id", treningId)
      .single();

    if (error || !trening) {
      return {
        statusCode: 404,
        body: JSON.stringify({ ok: false, error: "Training not found" })
      };
    }

    // =========================
    // EMAIL RODIČ
    // =========================
    const userRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "info@pojdtrenovat.cz",
        to: [email],
        subject: "✅ Rezervace potvrzena",
        html: `
          <div style="font-family:Arial;background:#f6f6f6;padding:20px;border-radius:10px">
            <h2 style="color:#e60000">Rezervace potvrzena ✅</h2>
            <p>Dobrý den,</p>
            <p>vaše rezervace byla úspěšně vytvořena.</p>

            <div style="background:#fff;padding:15px;border-radius:10px">
              <p><b>Hráč:</b> ${hrac}</p>
              <p><b>Trénink:</b> ${trening.nazev}</p>
              <p><b>Datum:</b> ${trening.datum}</p>
              <p><b>Čas:</b> ${trening.cas_od} - ${trening.cas_do}</p>
            </div>

            <p style="margin-top:15px">Těšíme se na vás 🏒</p>
          </div>
        `
      })
    });

    const userJson = await userRes.json();

    // =========================
    // EMAIL TRENÉR
    // =========================
    const coachRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "info@pojdtrenovat.cz",
        to: ["mara.pavel@seznam.cz", "pojdtrenovat@gmail.com"],
        subject: "🔥 Nová rezervace",
        html: `
          <div style="font-family:Arial;background:#111;color:#fff;padding:20px;border-radius:10px">
            <h2 style="color:#ff3b3b">Nový hráč 🔥</h2>

            <div style="background:#222;padding:15px;border-radius:10px">
              <p><b>Hráč:</b> ${hrac}</p>
              <p><b>Email rodiče:</b> ${email}</p>
            </div>

            <div style="margin-top:15px;background:#222;padding:15px;border-radius:10px">
              <p><b>Trénink:</b> ${trening.nazev}</p>
              <p><b>Datum:</b> ${trening.datum}</p>
              <p><b>Čas:</b> ${trening.cas_od} - ${trening.cas_do}</p>
            </div>
          </div>
        `
      })
    });

    const coachJson = await coachRes.json();

    console.log("USER:", userRes.status, userJson);
    console.log("COACH:", coachRes.status, coachJson);

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true })
    };

  } catch (e) {

    console.log("ERROR:", e);

    return {
      statusCode: 500,
      body: JSON.stringify({ ok: false, error: e.message })
    };
  }
}
}
