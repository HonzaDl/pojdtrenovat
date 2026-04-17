exports.handler = async function (event) {

  try {

    const { hrac, email, treningId } = JSON.parse(event.body || "{}");

    // TEST EMAIL
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "info@pojdtrenovat.cz",
        to: ["pojdtrenovat@gmail.com"],
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
};
