import { createClient } from "@supabase/supabase-js";

export async function handler(event) {

  try {

    const { hrac, email, treningId } = JSON.parse(event.body);

    const supabase = createClient(
      "https://kgmdyhiwkkviswluuwkg.supabase.co",
      process.env.SUPABASE_SERVICE_KEY
    );

    // trénink
    const { data: trening, error } = await supabase
      .from("treninky")
      .select("*")
      .eq("id", treningId)
      .single();

    if(error) throw error;

    // EMAIL RODIČ
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.RESEND_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "onboarding@resend.dev",
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

    // EMAIL TRENÉŘI
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.RESEND_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "onboarding@resend.dev",
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
      body: JSON.stringify({ error: e.message })
    };
  }
}
