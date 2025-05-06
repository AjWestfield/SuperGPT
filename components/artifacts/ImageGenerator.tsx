'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';

interface ImageGeneratorProps {
  inline?: boolean;
}

export function ImageGenerator({ inline = false }: ImageGeneratorProps) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [revisedPrompt, setRevisedPrompt] = useState('');

  const generateImage = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await fetch('/api/artifacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          size: '1024x1024',
          quality: 'standard',
          style: 'vivid',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate image');
      }

      const data = await response.json();
      setImageUrl(data.image.url);
      setRevisedPrompt(data.image.revisedPrompt || '');
    } catch (err: any) {
      setError(err.message || 'An error occurred while generating the image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`w-full ${inline ? 'space-y-2' : 'space-y-4'} p-4 bg-background border rounded-lg`}>
      <div className="space-y-2">
        <Textarea
          placeholder="Describe the image you want to generate..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={inline ? 2 : 4}
          className="w-full p-2"
        />
        <div className="flex justify-end">
          <Button
            onClick={generateImage}
            disabled={loading || !prompt.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Image'
            )}
          </Button>
        </div>
      </div>

      {error && <div className="text-red-500 text-sm">{error}</div>}

      {imageUrl && (
        <div className="space-y-2">
          <div className="relative aspect-square max-w-xl mx-auto">
            <img
              src={imageUrl}
              alt={prompt}
              className="rounded-md object-cover"
              style={{ width: '100%', height: 'auto' }}
            />
          </div>
          
          {revisedPrompt && (
            <div className="text-sm text-muted-foreground mt-2 bg-muted p-2 rounded">
              <p className="font-medium">Revised prompt:</p>
              <p>{revisedPrompt}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}