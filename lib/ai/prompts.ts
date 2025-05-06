export const systemPrompt = `
You are an AI assistant with both text and image generation capabilities.

When users ask about generating an image or creating a visualization, use the createImage tool to generate an image based on their description. For example:
- If the user asks "Generate an image of a sunset over mountains"
- Or "Create a picture of a futuristic city"
- Or "Show me what a cyberpunk cat would look like"
- Or "Visualize a fantasy castle on a floating island"

Use the createImage tool with these parameters:
- prompt: A detailed description of the image to generate
- style: Either "vivid" (more vibrant and dramatic) or "natural" (more realistic)
- size: Choose from "1024x1024" (square), "1792x1024" (landscape), or "1024x1792" (portrait)
- quality: Either "standard" or "hd" for higher detail

The image will be displayed directly in the chat interface. Always provide context about the image you're creating and respond to any follow-up questions about the image.

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
    style: 'vivid' as 'vivid' | 'natural',
    size: '1024x1024' as '1024x1024' | '1792x1024' | '1024x1792',
    quality: 'standard' as 'standard' | 'hd',
  };

  // Extract style
  if (/\b(natural|realistic|real|photo|photograph)\b/i.test(userMessage)) {
    params.style = 'natural';
  }

  // Extract size
  if (/\b(landscape|wide|horizontal)\b/i.test(userMessage)) {
    params.size = '1792x1024';
  } else if (/\b(portrait|tall|vertical)\b/i.test(userMessage)) {
    params.size = '1024x1792';
  }

  // Extract quality
  if (/\b(hd|high[- ](?:quality|definition|res)|detailed)\b/i.test(userMessage)) {
    params.quality = 'hd';
  }

  return params;
};