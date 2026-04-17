import { createClient } from "@supabase/supabase-js";

export async function handler(event) {
  try {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Method not allowed" })
      };
    }

    const body = JSON.parse(event.body || "{}");

    const { id, ...update } = body;

    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "missing id" })
      };
    }

    // bezpečnostní čištění
    delete update.id;
    delete update.created_at;

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
}
