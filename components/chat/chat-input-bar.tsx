'use client';

import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Image as ImageIcon } from 'lucide-react';
import { ImageGenerator } from '@/components/artifacts/ImageGenerator';

interface ChatInputBarProps {
  onSubmit: (message: string) => void;
  disabled?: boolean;
}

export function ChatInputBar({ onSubmit, disabled = false }: ChatInputBarProps) {
  const [message, setMessage] = useState('');
  const [showImageGenerator, setShowImageGenerator] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSubmit(message);
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="sticky bottom-0 bg-background pt-4 pb-8">
      {showImageGenerator && (
        <div className="mb-4">
          <ImageGenerator inline={true} />
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex space-x-2 items-end">
        <div className="relative flex-grow">
          <Textarea
            ref={textareaRef}
            placeholder="Type your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            className="resize-none pr-10 min-h-[60px] max-h-[200px]"
            rows={1}
          />
        </div>
        <div className="flex space-x-2">
          <Button
            type="button"
            size="icon"
            variant="outline"
            onClick={() => setShowImageGenerator(!showImageGenerator)}
          >
            <ImageIcon className="h-5 w-5" />
          </Button>
          <Button
            type="submit"
            size="icon"
            disabled={disabled || !message.trim()}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </form>
    </div>
  );
}