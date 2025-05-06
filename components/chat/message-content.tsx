'use client';

import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { cn } from '@/lib/utils';
import { BotMessage } from '@/components/message';
import { ChatImage } from '@/components/chat/chat-image';

interface ImageData {
  id: string;
  url: string;
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
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  useEffect(() => {
    setRenderedContent(content);
  }, [content]);

  return (
    <div 
      ref={ref} 
      className={cn('space-y-4', className)}
    >
      <BotMessage 
        message={isStreaming && streamingAnimation ? `${renderedContent}▍` : renderedContent} 
        className="mb-2"
      />
      
      {imageGenerationData.map((imageData) => (
        <ChatImage
          key={imageData.id}
          imageUrl={imageData.url}
          prompt={imageData.prompt}
          revisedPrompt={imageData.revisedPrompt}
          status={imageData.status}
          error={imageData.error}
        />
      ))}
    </div>
  );
}