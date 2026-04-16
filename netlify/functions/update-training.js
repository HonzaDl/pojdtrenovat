const { createClient } = require("@supabase/supabase-js");

exports.handler = async (event) => {

  try {

    const body = JSON.parse(event.body);

    const supabase = createClient(
      "https://kgmdyhiwkkviswluuwkg.supabase.co",
      process.env.SUPABASE_SERVICE_KEY
    );

    const { data, error } = await supabase
      .from("treninky")
      .update(body)
      .eq("id", body.id)
      .select();

    return {
      statusCode: 200,
      body: JSON.stringify({
        sent: body,
        result: data,
        error: error
      })
    };

  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message })
    };
  }
};
