export async function handler(event) {

  const { hrac, email, trening } = JSON.parse(event.body);

  // EMAIL přes Resend (secure)
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.RESEND_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: "onboarding@resend.dev",
      to: [email, "pojdtrenovat@gmail.com"],
      subject: "Rezervace potvrzena",
      html: `
        <h2>Rezervace ✅</h2>
        <p><b>Hráč:</b> ${hrac}</p>
        <p><b>Trénink:</b> ${trening.nazev}</p>
        <p>${trening.datum} ${trening.cas_od}</p>
        <p>📍 ${trening.misto}</p>
      `
    })
  });

  return {
    statusCode: 200,
    body: JSON.stringify({ ok: true })
  };
}
