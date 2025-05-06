'use client';

import { ImageGenerator } from '@/components/artifacts/ImageGenerator';

export default function GeneratePage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Image Generation with GPT-image-1</h1>
      <div className="max-w-3xl mx-auto">
        <ImageGenerator />
      </div>
    </div>
  );
}