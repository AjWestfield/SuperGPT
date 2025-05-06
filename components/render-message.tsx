'use client';

import { Message } from 'ai';
import { BotMessage } from '@/components/message';

interface RenderMessageProps {
  message: Message;
}

export function RenderMessage({ message }: RenderMessageProps) {
  return (
    <div className="mb-4 flex">
      <div className="prose w-full dark:prose-invert">
        <BotMessage message={message.content} />
      </div>
    </div>
  );
}