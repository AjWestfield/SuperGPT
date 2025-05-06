'use client'

import { ChatInputBar } from '@/components/chat/chat-input-bar'
import { Button } from '@/components/ui/button'
import { Message } from 'ai'
import { IconArrowUp, IconStop } from '@/components/ui/icons'
import { useState, useEffect, useRef } from 'react'
import { TextareaAutosize } from '@/components/ui/textarea-autosize'
import { detectImageGenerationPrompt, extractImageParameters } from '@/lib/ai/prompts'
import { CornerDownLeft } from 'lucide-react'

interface ImageGenerationData {
  id: string
  url: string
  prompt: string
  revisedPrompt?: string
  status: 'loading' | 'complete' | 'error'
  error?: string
}

interface ChatPanelProps {
  isLoading: boolean
  stop: () => void
  append: (message: Message) => Promise<void>
  input: string
  setInput: (value: string) => void
  messages: Message[]
  setImageGenerationData: React.Dispatch<React.SetStateAction<ImageGenerationData[]>>
}

export function ChatPanel({
  isLoading,
  stop,
  append,
  input,
  setInput,
  messages,
  setImageGenerationData
}: ChatPanelProps) {
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = async (message: string) => {
    if (!message.trim() || isLoading) return

    // Check if message is asking for image generation
    const isImageGenerationRequest = detectImageGenerationPrompt(message)

    if (isImageGenerationRequest) {
      setIsGeneratingImage(true)
      
      // Extract image parameters from the message
      const imageParams = extractImageParameters(message)
      
      // Create a placeholder for the image loading state
      const imageId = Date.now().toString()
      setImageGenerationData(prev => [
        ...prev,
        {
          id: imageId,
          url: '',
          prompt: message,
          status: 'loading'
        }
      ])
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      role: 'user'
    }

    setInput('')
    inputRef.current?.focus()

    await append(userMessage)

    if (isGeneratingImage) {
      setIsGeneratingImage(false)
    }
  }

  const handleInputChange = (value: string) => {
    setInput(value)
  }

  return (
    <div className="fixed inset-x-0 bottom-0 bg-gradient-to-t from-background from-50% to-transparent">
      <div className="mx-auto sm:max-w-2xl sm:px-4">
        <div className="space-y-4 border-t bg-background px-4 py-2 shadow-lg sm:rounded-t-xl sm:border md:py-4">
          <ChatInputBar onSubmit={handleSubmit} disabled={isLoading} />
        </div>
      </div>
    </div>
  )
}