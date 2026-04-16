const { createClient } = require("@supabase/supabase-js");

exports.handler = async (event) => {
  try {
    const { id } = JSON.parse(event.body);

    const supabase = createClient(
      "https://kgmdyhiwkkviswluuwkg.supabase.co",
      process.env.SUPABASE_SERVICE_KEY
    );

    await supabase
      .from("rezervace")
      .delete()
      .eq("trening_id", id);

    const { error } = await supabase
      .from("treninky")
      .delete()
      .eq("id", id);

    if (error) {
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
