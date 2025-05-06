'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import TextareaAutosize from 'react-textarea-autosize';

export interface TextareaAutoSizeProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  minRows?: number;
  maxRows?: number;
  onValueChange?: (value: string) => void;
}

const TextareaAutoSize = React.forwardRef<HTMLTextAreaElement, TextareaAutoSizeProps>(
  ({ className, minRows = 1, maxRows, value, onChange, onValueChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange?.(e);
      onValueChange?.(e.target.value);
    };

    return (
      <TextareaAutosize
        minRows={minRows}
        maxRows={maxRows}
        className={cn(
          'flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        value={value}
        onChange={handleChange}
        {...props}
      />
    );
  }
);

TextareaAutoSize.displayName = 'TextareaAutoSize';

export { TextareaAutoSize };