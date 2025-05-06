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
      size: z
        .enum(['1024x1024', '1536x1024', '1024x1536', 'auto'])
        .default('auto')
        .describe('The size/aspect ratio of the image to generate'),
      quality: z
        .enum(['low', 'medium', 'high', 'auto'])
        .default('high')
        .describe('The quality of the image to generate'),
      background: z
        .enum(['transparent', 'opaque', 'auto'])
        .default('auto')
        .describe('Whether to use a transparent background'),
      output_format: z
        .enum(['png', 'jpeg', 'webp'])
        .default('png')
        .describe('The output format of the image'),
    }),
    execute: async ({ prompt, size, quality, background, output_format }) => {
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
        // Generate the image using OpenAI GPT-image-1
        const image = await generateImage({
          prompt,
          size,
          quality,
          background,
          output_format,
          model: 'gpt-image-1',
        });

        // Send the generated image to the client
        dataStream.writeData({
          type: 'image-generation-complete',
          content: {
            id,
            base64: image.base64,
            prompt,
          },
        });

        return {
          id,
          success: true,
          message: `Image has been generated based on: "${prompt}"`,
          base64: image.base64,
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