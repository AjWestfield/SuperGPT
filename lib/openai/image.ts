import OpenAI from "openai";

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface GenerateImageParams {
  prompt: string;
  size?: "1024x1024" | "1536x1024" | "1024x1536" | "auto";
  quality?: "low" | "medium" | "high" | "auto";
  background?: "transparent" | "opaque" | "auto";
  output_format?: "png" | "jpeg" | "webp";
  model?: string;
  n?: number;
}

export interface GeneratedImage {
  url?: string;
  base64?: string;
  revisedPrompt?: string;
}

/**
 * Generate an image using OpenAI's GPT-image-1 model
 */
export async function generateImage({
  prompt,
  size = "auto",
  quality = "high",
  background = "auto",
  output_format = "png",
  model = "gpt-image-1",
  n = 1,
}: GenerateImageParams): Promise<GeneratedImage> {
  try {
    // GPT-image-1 specific settings
    const response = await openai.images.generate({
      model: "gpt-image-1",
      prompt,
      n,
      size,
      quality,
      background,
      output_format,
    });

    if (!response.data || response.data.length === 0) {
      throw new Error("No image generated");
    }

    // GPT-image-1 returns base64-encoded images by default
    return {
      base64: response.data[0].b64_json || "",
    };
  } catch (error: any) {
    console.error("Error generating image:", error);
    throw new Error(`Failed to generate image: ${error.message}`);
  }
}