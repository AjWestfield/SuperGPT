import OpenAI from "openai";

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface GenerateImageParams {
  prompt: string;
  size?: "1024x1024" | "1792x1024" | "1024x1792";
  quality?: "standard" | "hd";
  style?: "natural" | "vivid";
  model?: string;
  n?: number;
}

export interface GeneratedImage {
  url: string;
  base64?: string;
  revisedPrompt?: string;
}

/**
 * Generate an image using OpenAI's DALL-E models
 */
export async function generateImage({
  prompt,
  size = "1024x1024",
  quality = "standard",
  style = "vivid",
  model = "dall-e-3",
  n = 1,
}: GenerateImageParams): Promise<GeneratedImage> {
  try {
    // For GPT-4 vision/image-1 model when it becomes available in the API
    // Replace with appropriate parameters when OpenAI releases this model
    const useNewModel = model === "gpt-image-1";
    
    const response = await openai.images.generate({
      model: useNewModel ? "dall-e-3" : model, // Fallback to dall-e-3 until gpt-image-1 is available
      prompt,
      n,
      size,
      quality,
      style,
      response_format: "url", // Change to b64_json if base64 is needed
    });

    if (!response.data || response.data.length === 0) {
      throw new Error("No image generated");
    }

    return {
      url: response.data[0].url || "",
      revisedPrompt: response.data[0].revised_prompt,
    };
  } catch (error: any) {
    console.error("Error generating image:", error);
    throw new Error(`Failed to generate image: ${error.message}`);
  }
}