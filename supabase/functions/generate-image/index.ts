import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Style modifiers for different art styles
const STYLE_MODIFIERS: Record<string, string> = {
  photorealistic: "ultra realistic photograph, 8k uhd, high detail, professional photography, sharp focus, natural lighting",
  anime: "anime style, studio ghibli inspired, vibrant colors, detailed anime illustration, manga art style",
  "oil-painting": "oil painting style, classical art, rich textures, masterpiece painting, renaissance style, brush strokes visible",
  cyberpunk: "cyberpunk style, neon lights, futuristic city, high tech low life, blade runner aesthetic, glowing elements",
  watercolor: "watercolor painting, soft colors, artistic, flowing paint, delicate details, traditional art",
  "3d-render": "3D render, octane render, cinema 4D, highly detailed, volumetric lighting, realistic textures",
  sketch: "pencil sketch, detailed drawing, artistic sketch, graphite art, hand drawn illustration",
  fantasy: "fantasy art style, magical, ethereal, detailed fantasy illustration, epic fantasy scene",
  "pop-art": "pop art style, bold colors, comic book style, roy lichtenstein inspired, graphic design",
  vintage: "vintage style, retro aesthetic, 1950s photography, nostalgic, sepia tones, classic look",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, style = "photorealistic" } = await req.json();
    const BYTEZ_API_KEY = Deno.env.get("BYTEZ_API_KEY");

    if (!BYTEZ_API_KEY) {
      console.error("BYTEZ_API_KEY is not configured");
      throw new Error("Image generation systems not configured");
    }

    // Apply style modifier to prompt
    const styleModifier = STYLE_MODIFIERS[style] || STYLE_MODIFIERS.photorealistic;
    const enhancedPrompt = `${prompt}, ${styleModifier}`;
    
    console.log("Generating image with style:", style);
    console.log("Enhanced prompt:", enhancedPrompt);

    // Use Bytez API for image generation
    const response = await fetch("https://api.bytez.com/model/v1/stabilityai/stable-diffusion-xl-base-1.0", {
      method: "POST",
      headers: {
        "Authorization": `Key ${BYTEZ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: enhancedPrompt,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Bytez API error:", response.status, errorText);
      throw new Error("Image generation failed");
    }

    const data = await response.json();
    console.log("Image generation successful");

    return new Response(
      JSON.stringify({ 
        success: true, 
        output: data.output,
        prompt: enhancedPrompt,
        style 
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
