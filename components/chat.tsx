'use client'

import { Message } from 'ai'
import { useChat } from 'ai/react'
import { ChatMessage } from '@/components/chat/chat-message'
import { ChatPanel } from '@/components/chat-panel'
import { ChatScrollAnchor } from '@/components/chat-scroll-anchor'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { DEFAULT_MODEL } from '@/lib/constants'
import { RenderMessage } from '@/components/render-message'

interface ImageGenerationData {
  id: string
  url: string
  prompt: string
  revisedPrompt?: string
  status: 'loading' | 'complete' | 'error'
  error?: string
}

export default function Chat() {
  const searchParams = useSearchParams()
  const model = searchParams.get('model') || DEFAULT_MODEL
  const [chatModel, setChatModel] = useLocalStorage('chatModel', model)
  const [imageGenerationData, setImageGenerationData] = useState<ImageGenerationData[]>([])

  useEffect(() => {
    setChatModel(model)
  }, [model, setChatModel])

  const { messages, append, reload, stop, isLoading, input, setInput } =
    useChat({
      initialMessages: [],
      id: 'main-chat',
      body: {
        selectedChatModel: chatModel
      },
      onFinish: (message) => {
        // Check for image generation data in the response
        const imageGenData = extractImageGenerationData(message.content)
        if (imageGenData) {
          setImageGenerationData(prev => {
            // Find and update the loading image with the completed one
            const updatedData = [...prev]
            const loadingImageIndex = updatedData.findIndex(img => img.status === 'loading')
            
            if (loadingImageIndex !== -1) {
              updatedData[loadingImageIndex] = {
                ...updatedData[loadingImageIndex],
                ...imageGenData,
                status: 'complete'
              }
              return updatedData
            } else {
              // If no loading image placeholder exists, add a new one
              return [...prev, { ...imageGenData, status: 'complete' }]
            }
          })
        }
      },
      onError: (error) => {
        // Update any loading images to error state
        setImageGenerationData(prev => {
          return prev.map(img => 
            img.status === 'loading' 
              ? { ...img, status: 'error', error: error.message }
              : img
          )
        })
      }
    })

  // Function to extract image generation data from message content
  const extractImageGenerationData = (content: string): ImageGenerationData | null => {
    // Check for image URL patterns in the message
    const urlMatch = content.match(/https?:\/\/[^\s"'<>()]+\.(jpg|jpeg|png|gif|webp)/i)
    
    if (urlMatch) {
      const url = urlMatch[0]
      // Try to extract prompt by looking for patterns like "Image generated: [prompt]"
      const promptMatch = content.match(/(?:image generated|created image)[^"]*"([^"]+)"/i) || 
                          content.match(/(?:image of|picture of|generated)[^:]*:\s*([^\.]+)/i)
      
      const prompt = promptMatch ? promptMatch[1].trim() : 'Unknown prompt'
      
      return {
        id: Date.now().toString(),
        url,
        prompt,
        status: 'complete'
      }
    }
    
    return null
  }

  return (
    <div className="flex flex-col min-h-screen">
      {messages.length > 0 ? (
        <div className="pb-[200px] pt-4 md:pt-10">
          {messages.map((message, i) => (
            <div
              key={message.id}
              className="group mx-auto w-full max-w-2xl px-4 animate-in fade-in slide-in-from-bottom-4"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <ChatMessage
                message={message}
                isLoading={isLoading && i === messages.length - 1}
                imageGenerationData={
                  message.role === 'assistant' ? imageGenerationData : undefined
                }
              />
            </div>
          ))}
          <ChatScrollAnchor messages={messages} />
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center px-4 text-center">
          <div className="max-w-lg">
            <h1 className="mb-2 text-2xl font-bold">
              Welcome to SuperGPT
            </h1>
            <p className="mb-4 text-muted-foreground">
              Ask me anything about web search or try generating an image by typing something like "Generate an image of..."
            </p>
          </div>
        </div>
      )}

      <ChatPanel
        isLoading={isLoading}
        stop={stop}
        append={append}
        input={input}
        setInput={setInput}
        messages={messages}
        setImageGenerationData={setImageGenerationData}
      />
    </div>
  )
}