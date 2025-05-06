'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { BotMessage } from '@/components/message';
import { ChatImage } from '@/components/chat/chat-image';

interface ImageData {
  id: string;
  url: string;
  base64?: string;
  prompt: string;
  revisedPrompt?: string;
  status: 'loading' | 'complete' | 'error';
  error?: string;
}

interface MessageContentProps {
  content: string;
  isStreaming?: boolean;
  streamingAnimation?: boolean;
  className?: string;
  imageGenerationData?: ImageData[];
}

export function MessageContent({
  content,
  isStreaming,
  streamingAnimation,
  className,
  imageGenerationData = []
}: MessageContentProps) {
  const [renderedContent, setRenderedContent] = useState(content);

  useEffect(() => {
    setRenderedContent(content);
  }, [content]);

  return (
    <div className={cn('space-y-4', className)}>
      <BotMessage 
        message={isStreaming && streamingAnimation ? `${renderedContent}▍` : renderedContent} 
        className="mb-2"
      />
      
      {imageGenerationData?.map((imageData) => (
        <ChatImage
          key={imageData.id}
          imageUrl={imageData.url}
          base64={imageData.base64}
          prompt={imageData.prompt}
          revisedPrompt={imageData.revisedPrompt}
          status={imageData.status}
          error={imageData.error}
        />
      ))}
    </div>
  );
}