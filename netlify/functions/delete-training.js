import { createClient } from "@supabase/supabase-js";

export async function handler(event) {
  try {
    const { id } = JSON.parse(event.body);

    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing id" })
      };
    }

    const supabase = createClient(
      "https://kgmdyhiwkkviswluuwkg.supabase.co",
      process.env.SUPABASE_SERVICE_KEY
    );

    // 1) smazat rezervace
    await supabase
      .from("rezervace")
      .delete()
      .eq("trening_id", id);

    // 2) smazat trénink
    const { error } = await supabase
      .from("treninky")
      .delete()
      .eq("id", id);

    if (error) {
      console.log(error);
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
    console.log(e);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message })
    };
  }
}
  }
}
