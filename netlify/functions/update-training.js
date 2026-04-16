import { createClient } from "@supabase/supabase-js";

export async function handler(event) {
  try {

    const body = JSON.parse(event.body);

    if(!body.id){
      return { statusCode: 400, body: JSON.stringify({ error: "missing id" }) };
    }

    const supabase = createClient(
      "https://kgmdyhiwkkviswluuwkg.supabase.co",
      process.env.SUPABASE_SERVICE_KEY
    );

    const { id, ...update } = body;

    const { data, error } = await supabase
      .from("treninky")
      .update(update)
      .eq("id", id)
      .select();

    if(error){
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true, data })
    };

  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message })
    };
  }
}
