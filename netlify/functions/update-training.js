const { createClient } = require("@supabase/supabase-js");

exports.handler = async (event) => {

  try {

    const data = JSON.parse(event.body);

    const supabase = createClient(
      "https://kgmdyhiwkkviswluuwkg.supabase.co",
      process.env.SUPABASE_SERVICE_KEY
    );

    const { error } = await supabase
      .from("treninky")
      .update({
        nazev: data.nazev,
        datum: data.datum,
        cas_od: data.cas_od,
        cas_do: data.cas_do,
        kapacita: data.kapacita,
        misto: data.misto,
        cena: data.cena,
        popis: data.popis
      })
      .eq("id", data.id);

    if(error){
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message })
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
};
