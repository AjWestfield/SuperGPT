'use client';

import { Message } from 'ai';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';
import { Avatar } from '@/components/ui/avatar';
import { MessageContent } from '@/components/chat/message-content';

interface ImageGenerationData {
  id: string;
  url: string;
  prompt: string;
  revisedPrompt?: string;
  status: 'loading' | 'complete' | 'error';
  error?: string;
}

export interface ChatMessageProps {
  message: Message;
  isLoading?: boolean;
  isStreaming?: boolean;
  imageGenerationData?: ImageGenerationData[];
}

export function ChatMessage({
  message,
  isLoading,
  isStreaming,
  imageGenerationData
}: ChatMessageProps) {
  const isUser = message.role === 'user';
  
  // Extract the message content
  const content = useMemo(() => {
    return typeof message.content === 'string' 
      ? message.content 
      : message.content.map(item => item.type === 'text' ? item.text : '').join('');
  }, [message.content]);

  return (
    <div
      className={cn(
        'group relative mb-4 flex items-start md:mb-8',
        isUser ? 'flex-row-reverse' : ''
      )}
    >
      <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border shadow">
        <Avatar role={isUser ? 'user' : 'assistant'} />
      </div>
      
      <div
        className={cn(
          'ml-4 flex-1 space-y-2 overflow-hidden px-1',
          isUser && 'mr-4'
        )}
      >
        <div className="space-y-4">
          <MessageContent 
            content={content} 
            isStreaming={isStreaming}
            streamingAnimation={isStreaming && !isUser}
            imageGenerationData={!isUser ? imageGenerationData : undefined}
          />
        </div>
      </div>
    </div>
  );
}