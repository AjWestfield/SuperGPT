'use client';

import { useEffect, useRef } from 'react';
import { Message } from 'ai';

interface ChatScrollAnchorProps {
  messages: Message[];
}

export function ChatScrollAnchor({ messages }: ChatScrollAnchorProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return <div ref={scrollRef} />;
}