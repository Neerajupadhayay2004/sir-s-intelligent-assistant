import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, type = "image" } = await req.json();
    const BYTEZ_API_KEY = Deno.env.get("BYTEZ_API_KEY");

    if (!BYTEZ_API_KEY) {
      console.error("BYTEZ_API_KEY is not configured");
      throw new Error("Image generation systems not configured");
    }

    console.log("Generating image with prompt:", prompt);

    // Use Bytez API for image generation
    const response = await fetch("https://api.bytez.com/model/v1/stabilityai/stable-diffusion-xl-base-1.0", {
      method: "POST",
      headers: {
        "Authorization": `Key ${BYTEZ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: prompt,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Bytez API error:", response.status, errorText);
      throw new Error("Image generation failed");
    }

    const data = await response.json();
    console.log("Image generation successful");

    // The API returns the image data
    return new Response(
      JSON.stringify({ 
        success: true, 
        output: data.output,
        prompt 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Image generation error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
