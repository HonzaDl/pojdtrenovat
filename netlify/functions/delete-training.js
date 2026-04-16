import { createClient } from "@supabase/supabase-js";

export const handler = async (event) => {
  try {
    const { id } = JSON.parse(event.body || "{}");

    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "chybí ID" })
      };
    }

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );

    const { error } = await supabase
      .from("treninky")
      .delete()
      .eq("id", id);

    if (error) throw error;

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
