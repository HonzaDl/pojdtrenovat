const nodemailer = require("nodemailer");

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body || "{}");

    const { hrac, email, rocnik_klub, trening_id } = body;

    if (!hrac || !email || !trening_id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "chybějící data" })
      };
    }

    // 🔧 SMTP nastavení (doplníš svoje údaje)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    // =========================
    // 📩 EMAIL 1 – HRÁČ
    // =========================
    const mailHraci = {
      from: "pojdtrenovat@gmail.com",
      to: email,
      subject: "Potvrzení rezervace tréninku 💪",
      html: `
        <h2>Rezervace potvrzena</h2>
        <p>Ahoj <b>${hrac}</b>,</p>
        <p>tvoje rezervace byla úspěšně vytvořena.</p>

        <p><b>Ročník / klub:</b> ${rocnik_klub || "-"}</p>
        <p>Uvidíme se na tréninku 💪</p>

        <hr>
        <p>Pojď trénovat</p>
      `
    };

    // =========================
    // 📩 EMAIL 2 – TRENÉR
    // =========================
    const mailTrener = {
      from: "pojdtrenovat@gmail.com",
      to: "pojdtrenovat@gmail.com", // 👈 tady můžeš dát i více emailů
      subject: "Nová rezervace tréninku 🔔",
      html: `
        <h2>Nová rezervace</h2>

        <p><b>Hráč:</b> ${hrac}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Ročník / klub:</b> ${rocnik_klub || "-"}</p>
        <p><b>Trénink ID:</b> ${trening_id}</p>

        <hr>
        <p>Systém pojdtrenovat.cz</p>
      `
    };

    // 🔥 ODESLÁNÍ
    await transporter.sendMail(mailHraci);
    await transporter.sendMail(mailTrener);

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true })
    };

  } catch (err) {
    console.log("EMAIL ERROR:", err);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: "email error" })
    };
  }
};
