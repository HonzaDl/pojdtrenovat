import { createClient } from "@supabase/supabase-js";

export async function handler(event) {
  try {

    let body = {};

    try {
      body = event.body ? JSON.parse(event.body) : {};
    } catch (e) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid JSON" })
      };
    }

    if (!body.id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "missing id" })
      };
    }

    const { id, ...update } = body;

    const supabase = createClient(
      "https://kgmdyhiwkkviswluuwkg.supabase.co",
      process.env.SUPABASE_SERVICE_KEY
    );

    const { data, error } = await supabase
      .from("treninky")
      .update(update)
      .eq("id", id)
      .select();

    if (error) {
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
