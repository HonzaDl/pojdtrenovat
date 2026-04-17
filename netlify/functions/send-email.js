exports.handler = async function (event) {
  try {
    const { hrac, email, treningId } = JSON.parse(event.body || "{}");

    if (!hrac || !email || !treningId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "missing data" })
      };
    }

    const supabaseUrl = "https://kgmdyhiwkkviswluuwkg.supabase.co";
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

    // 🔥 načtení detailu tréninku
    const trainingRes = await fetch(`${supabaseUrl}/rest/v1/treninky?id=eq.${treningId}`, {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`
      }
    });

    const trainings = await trainingRes.json();
    const t = trainings?.[0];

    if (!t) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "training not found" })
      };
    }

    const emailBodyParent = `
      <h2>Rezervace potvrzena</h2>
      <p>Dobrý den,</p>
      <p>hráč <b>${hrac}</b> byl úspěšně přihlášen.</p>

      <hr>

      <p><b>Trénink:</b> ${t.nazev}</p>
      <p><b>Datum:</b> ${t.datum}</p>
      <p><b>Čas:</b> ${t.cas_od} - ${t.cas_do}</p>
      <p><b>Místo:</b> ${t.misto || "-"}</p>

      <br>
      <p>Děkujeme 👊</p>
    `;

    const emailBodyTrainer = `
      <h2>Nová rezervace</h2>

      <p><b>Hráč:</b> ${hrac}</p>
      <p><b>Email rodiče:</b> ${email}</p>

      <hr>

      <p><b>Trénink:</b> ${t.nazev}</p>
      <p><b>Datum:</b> ${t.datum}</p>
      <p><b>Čas:</b> ${t.cas_od} - ${t.cas_do}</p>
      <p><b>Místo:</b> ${t.misto || "-"}</p>
    `;

    // 📩 rodič
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "pojdtrenovat@tvujweb.cz",
        to: [email],
        subject: "Potvrzení rezervace tréninku",
        html: emailBodyParent
      })
    });

    // 📩 trenéři
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "pojdtrenovat@tvujweb.cz",
        to: [
          "pojdtrenovat@gmail.com",
          "mara.pavel@seznam.cz"
        ],
        subject: "Nová rezervace tréninku",
        html: emailBodyTrainer
      })
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true })
    };

  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message })
    };
  }
};
