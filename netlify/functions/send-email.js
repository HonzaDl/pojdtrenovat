export async function handler(event) {
  try {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Method not allowed" })
      };
    }

    const { hrac, email, treningId } = JSON.parse(event.body || "{}");

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "info@pojdtrenovat.cz",
        to: ["pojdtrenovat@gmail.com"],
        subject: "Nová rezervace",
        html: `
          <h2>Nová rezervace</h2>
          <p><b>Hráč:</b> ${hrac || "-"}</p>
          <p><b>Email:</b> ${email || "-"}</p>
          <p><b>Trénink ID:</b> ${treningId || "-"}</p>
        `
      })
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Resend failed", detail: data })
      };
    }

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
}
