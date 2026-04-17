export async function handler(event) {

  try {

    const { hrac, email, treningId } = JSON.parse(event.body);

    if (!hrac || !email || !treningId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing data" })
      };
    }

    // TEST EMAIL (jednoduchý – bez Supabase)
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "info@pojdtrenovat.cz",
        to: ["pojdtrenovat@gmail.com"],   // ⚠️ pošli jen sobě pro test
        subject: "TEST EMAIL",
        html: `<p>Funguje to ✅</p>`
      })
    });

    const data = await res.json();

    console.log("RESEND:", res.status, data);

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true, resend: data })
    };

  } catch (e) {
    console.log("ERROR:", e);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message })
    };
  }
}
}
