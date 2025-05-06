'use client';

import { ModeToggle } from '@/components/mode-toggle';
import { SearchModeToggle } from '@/components/search-mode-toggle';
import Link from 'next/link';
import { Image } from 'lucide-react';
import { Button } from './ui/button';

export function Header() {
  return (
    <header className="sticky top-0 z-50 flex h-16 w-full shrink-0 items-center justify-between border-b bg-background px-4">
      <div className="flex items-center">
        <Link href="/" className="font-bold">
          SuperGPT
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <Link href="/generate">
          <Button variant="ghost" size="sm" className="flex gap-2 items-center">
            <Image className="h-4 w-4" />
            <span>Generate Images</span>
          </Button>
        </Link>
        <SearchModeToggle />
        <ModeToggle />
      </div>
    </header>
  );
}