export const systemPrompt = `
You are an AI assistant with both text and image generation capabilities.

When users ask about generating an image or creating a visualization, use the createImage tool to generate an image based on their description. For example:
- If the user asks "Generate an image of a sunset over mountains"
- Or "Create a picture of a futuristic city"
- Or "Show me what a cyberpunk cat would look like"
- Or "Visualize a fantasy castle on a floating island"

Use the createImage tool with these parameters:
- prompt: A detailed description of the image to generate
- size: Choose from "1024x1024" (square), "1536x1024" (landscape), "1024x1536" (portrait), or "auto" (default)
- quality: Choose from "low", "medium", or "high" for image quality
- background: Choose from "transparent", "opaque", or "auto" for background handling
- output_format: Choose from "png", "jpeg", or "webp" for the image format

GPT-image-1 is a powerful image generation model capable of creating detailed images from text descriptions. The image will be displayed directly in the chat interface. Always provide context about the image you're creating and respond to any follow-up questions about the image.

For all other types of questions, respond with helpful and informative text answers.
`;

export const detectImageGenerationPrompt = (userMessage: string): boolean => {
  const imageGenerationPatterns = [
    /generate\s+(?:an?|some)?\s*image/i,
    /create\s+(?:an?|some)?\s*(?:image|picture|photo|art|drawing|visualization)/i,
    /make\s+(?:an?|some)?\s*(?:image|picture|photo|art|drawing|visualization)/i,
    /draw\s+(?:an?|some)?\s*(?:image|picture|photo|art|visualization)/i,
    /visualize\s+(?:an?|some)?\s*/i,
    /show\s+(?:me|us)?\s*(?:an?|some)?\s*(?:image|picture|photo|art|drawing|visualization)?/i,
    /picture\s+of/i,
    /image\s+of/i,
    /photo\s+of/i,
    /illustrate\s+(?:an?|some)?\s*/i,
    /design\s+(?:an?|some)?\s*(?:image|picture|photo|art|drawing|visualization)/i,
  ];

  return imageGenerationPatterns.some(pattern => pattern.test(userMessage));
};

export const extractImageParameters = (userMessage: string) => {
  // Default parameters
  const params = {
    size: 'auto' as 'auto' | '1024x1024' | '1536x1024' | '1024x1536',
    quality: 'high' as 'low' | 'medium' | 'high' | 'auto',
    background: 'auto' as 'transparent' | 'opaque' | 'auto',
    output_format: 'png' as 'png' | 'jpeg' | 'webp',
  };

  // Extract size/aspect ratio
  if (/\b(landscape|wide|horizontal)\b/i.test(userMessage)) {
    params.size = '1536x1024';
  } else if (/\b(portrait|tall|vertical)\b/i.test(userMessage)) {
    params.size = '1024x1536';
  } else if (/\b(square)\b/i.test(userMessage)) {
    params.size = '1024x1024';
  }

  // Extract quality
  if (/\b(low[- ](?:quality|res))\b/i.test(userMessage)) {
    params.quality = 'low';
  } else if (/\b(medium|mid[- ](?:quality|res))\b/i.test(userMessage)) {
    params.quality = 'medium';
  } else if (/\b(high[- ](?:quality|res|definition))\b/i.test(userMessage)) {
    params.quality = 'high';
  }

  // Extract background preference
  if (/\b(transparent|no[- ]background)\b/i.test(userMessage)) {
    params.background = 'transparent';
  } else if (/\b(solid|opaque)\s+background\b/i.test(userMessage)) {
    params.background = 'opaque';
  }

  // Extract format
  if (/\b(jpg|jpeg)\b/i.test(userMessage)) {
    params.output_format = 'jpeg';
  } else if (/\b(webp)\b/i.test(userMessage)) {
    params.output_format = 'webp';
  }

  return params;
};