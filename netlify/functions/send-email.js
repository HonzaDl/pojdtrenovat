import { createClient } from "@supabase/supabase-js";

export async function handler(event) {

  try {

    const { hrac, email, treningId } = JSON.parse(event.body);

    const supabase = createClient(
      "https://kgmdyhiwkkviswluuwkg.supabase.co",
      process.env.SUPABASE_SERVICE_KEY
    );

    const { data: trening } = await supabase
      .from("treninky")
      .select("*")
      .eq("id", treningId)
      .single();

    // =========================
    // 1. EMAIL RODIČ
    // =========================
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.RESEND_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "pojdtrenovat@onboarding.dev",
        to: [email],
        subject: "Potvrzení rezervace",
        html: `
          <h2>Rezervace potvrzena ✅</h2>
          <p><b>${hrac}</b></p>
          <p>${trening.nazev}</p>
          <p>${trening.datum} ${trening.cas_od}</p>
        `
      })
    });

    // =========================
    // 2. EMAIL TRENÉR
    // =========================
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.RESEND_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "pojdtrenovat@onboarding.dev",
        to: ["mara.pavel@seznam.cz", "pojdtrenovat@gmail.com"],
        subject: "Nová rezervace 🔥",
        html: `
          <h2>Nová rezervace</h2>
          <p><b>Hráč:</b> ${hrac}</p>
          <p><b>Email:</b> ${email}</p>
          <p><b>Trénink:</b> ${trening.nazev}</p>
          <p>${trening.datum} ${trening.cas_od}</p>
        `
      })
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true })
    };

  } catch (e) {
    console.log(e);

    return {
      statusCode: 500,
      body: JSON.stringify({ ok: false, error: e.message })
    };
  }
}
