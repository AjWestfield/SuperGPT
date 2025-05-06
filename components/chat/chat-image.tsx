'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';

interface ChatImageProps {
  imageUrl?: string;
  base64?: string;
  prompt: string;
  revisedPrompt?: string;
  status: 'loading' | 'complete' | 'error';
  error?: string;
}

export function ChatImage({
  imageUrl,
  base64,
  prompt,
  revisedPrompt,
  status,
  error,
}: ChatImageProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  
  // Determine image source (URL or base64)
  const imageSrc = imageUrl 
    ? imageUrl 
    : base64 
      ? `data:image/png;base64,${base64}` 
      : '';

  return (
    <Card className="w-full max-w-lg my-4 overflow-hidden">
      <CardContent className="p-4 space-y-3">
        {status === 'loading' && (
          <div className="w-full aspect-square bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Generating image with GPT-image-1...</p>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="w-full aspect-square bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <div className="text-center p-4">
              <p className="text-red-500 font-medium">Error generating image</p>
              <p className="text-sm text-muted-foreground mt-1">{error || 'Unknown error'}</p>
            </div>
          </div>
        )}

        {status === 'complete' && imageSrc && (
          <>
            <div className="relative aspect-square w-full">
              {!isImageLoaded && (
                <Skeleton className="absolute inset-0 w-full h-full" />
              )}
              <img
                src={imageSrc}
                alt={prompt}
                className="w-full h-full object-cover rounded-md"
                onLoad={() => setIsImageLoaded(true)}
                style={{ display: isImageLoaded ? 'block' : 'none' }}
              />
            </div>
            <div className="space-y-1 pt-2">
              <p className="text-sm text-muted-foreground">{prompt}</p>
              {revisedPrompt && revisedPrompt !== prompt && (
                <details className="text-xs">
                  <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                    Revised prompt
                  </summary>
                  <p className="mt-1 text-muted-foreground">{revisedPrompt}</p>
                </details>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}