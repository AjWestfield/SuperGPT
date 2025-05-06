import { DataStreamWriter, tool } from 'ai';
import { z } from 'zod';
import { generateImage } from '@/lib/openai/image';
import { generateUUID } from '@/lib/utils';

interface CreateImageProps {
  dataStream: DataStreamWriter;
}

export const createImage = ({ dataStream }: CreateImageProps) =>
  tool({
    description:
      'Create an image based on a text description. Use when asked to create, generate, draw, or visualize an image.',
    parameters: z.object({
      prompt: z.string().describe('The text description of the image to create'),
      style: z
        .enum(['vivid', 'natural'])
        .default('vivid')
        .describe('The style of the image, either vivid or natural'),
      size: z
        .enum(['1024x1024', '1792x1024', '1024x1792'])
        .default('1024x1024')
        .describe('The size of the image to generate'),
      quality: z
        .enum(['standard', 'hd'])
        .default('standard')
        .describe('The quality of the image, either standard or hd'),
    }),
    execute: async ({ prompt, style, size, quality }) => {
      const id = generateUUID();

      // Signal the start of image generation to the client
      dataStream.writeData({
        type: 'image-generation-start',
        content: {
          id,
          prompt,
        },
      });

      try {
        // Generate the image using OpenAI
        const image = await generateImage({
          prompt,
          style,
          size,
          quality,
          model: 'gpt-image-1', // Will fallback to DALL-E 3 in implementation
        });

        // Send the generated image to the client
        dataStream.writeData({
          type: 'image-generation-complete',
          content: {
            id,
            url: image.url,
            prompt,
            revisedPrompt: image.revisedPrompt,
          },
        });

        return {
          id,
          success: true,
          message: `Image has been generated based on: "${prompt}"`,
          url: image.url,
        };
      } catch (error: any) {
        // Handle errors and notify the client
        dataStream.writeData({
          type: 'image-generation-error',
          content: {
            id,
            error: error.message || 'Failed to generate image',
          },
        });

        return {
          id,
          success: false,
          message: `Failed to generate image: ${error.message}`,
        };
      }
    },
  });