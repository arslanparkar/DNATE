"use client"

import { useState, useRef, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Send, Loader2, Sparkles } from "lucide-react"

type Message = {
  id: string
  role: "assistant" | "user" | "system"
  content: string
  timestamp: Date
  isTyping?: boolean
}

type ChatInterfaceProps = {
  persona?: {
    name: string
    title?: string
    specialty?: string
    avatar?: string
  }
  onSendMessage?: (message: string) => Promise<void>
  initialMessages?: Message[]
  placeholder?: string
  enableAI?: boolean
}

export function ChatInterface({
  persona,
  onSendMessage,
  initialMessages = [],
  placeholder = "Type your response here...",
  enableAI = true,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    setMessages(initialMessages)
  }, [initialMessages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      if (onSendMessage) {
        await onSendMessage(input.trim())
      } else if (enableAI) {
        // Show typing indicator
        const typingMessage: Message = {
          id: `typing-${Date.now()}`,
          role: "assistant",
          content: "",
          timestamp: new Date(),
          isTyping: true,
        }
        setMessages((prev) => [...prev, typingMessage])

        // Simulate AI response (replace with actual AI SDK call)
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Remove typing indicator and add actual response
        setMessages((prev) => {
          const filtered = prev.filter((m) => !m.isTyping)
          return [
            ...filtered,
            {
              id: Date.now().toString(),
              role: "assistant",
              content: generateContextualResponse(input.trim()),
              timestamp: new Date(),
            },
          ]
        })
      }
    } catch (error) {
      console.error("[v0] Chat error:", error)
      setMessages((prev) => {
        const filtered = prev.filter((m) => !m.isTyping)
        return [
          ...filtered,
          {
            id: Date.now().toString(),
            role: "system",
            content: "Sorry, I encountered an error. Please try again.",
            timestamp: new Date(),
          },
        ]
      })
    } finally {
      setIsLoading(false)
    }
  }

  const generateContextualResponse = (userInput: string): string => {
    // Built-in fallback responses based on context
    const lowerInput = userInput.toLowerCase()

    if (lowerInput.includes("mechanism") || lowerInput.includes("action")) {
      return "That's a good explanation of the mechanism of action. Could you elaborate on how this translates to clinical benefits for patients?"
    }

    if (lowerInput.includes("side effect") || lowerInput.includes("adverse")) {
      return "Thank you for addressing the safety profile. How would you counsel a patient who experiences these side effects?"
    }

    if (lowerInput.includes("study") || lowerInput.includes("trial") || lowerInput.includes("data")) {
      return "Interesting perspective on the clinical data. Can you compare this to the standard of care?"
    }

    if (lowerInput.includes("patient") || lowerInput.includes("treatment")) {
      return "I appreciate your patient-centered approach. What would you say to a patient who is hesitant about this treatment?"
    }

    // Default responses
    const defaultResponses = [
      "That's an interesting point. Can you provide more details?",
      "I see. How would you handle a situation where the patient has comorbidities?",
      "Thank you for that explanation. What evidence supports this approach?",
      "Good answer. How does this compare to alternative treatments?",
      "I understand. Can you walk me through your clinical reasoning?",
    ]

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
  }

  const personaInitials = persona?.name
    ? persona.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "AI"

  return (
    <div className="flex h-full flex-col">
      {/* Chat Header */}
      {persona && (
        <div className="border-b bg-card px-6 py-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border-2 border-primary/20">
              <AvatarImage src={persona.avatar || "/placeholder.svg"} />
              <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-semibold">
                {personaInitials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-foreground">{persona.name}</h3>
              {persona.specialty && <p className="text-sm text-muted-foreground">{persona.specialty}</p>}
              {enableAI && (
                <div className="mt-1 flex items-center gap-1 text-xs text-primary">
                  <Sparkles className="h-3 w-3" />
                  <span>AI-Powered</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto bg-gradient-to-br from-background to-accent/20 p-6">
        <div className="mx-auto max-w-4xl space-y-6">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              {message.role === "system" ? (
                <div className="mx-auto">
                  <Card className="bg-muted/50 px-4 py-2">
                    <p className="text-xs text-muted-foreground">{message.content}</p>
                  </Card>
                </div>
              ) : (
                <div className={`flex max-w-[80%] gap-3 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  <Avatar className="h-10 w-10 flex-shrink-0">
                    {message.role === "assistant" && persona ? (
                      <>
                        <AvatarImage src={persona.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-sm">
                          {personaInitials}
                        </AvatarFallback>
                      </>
                    ) : (
                      <AvatarFallback className="bg-gradient-to-br from-chart-3 to-chart-3/80 text-white text-sm">
                        You
                      </AvatarFallback>
                    )}
                  </Avatar>

                  <div
                    className={`rounded-2xl px-4 py-3 shadow-sm ${
                      message.role === "assistant" ? "bg-card border" : "bg-primary text-primary-foreground"
                    }`}
                  >
                    {message.isTyping ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm text-muted-foreground">Thinking...</span>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm leading-relaxed">{message.content}</p>
                        <p
                          className={`mt-2 text-xs ${
                            message.role === "assistant" ? "text-muted-foreground" : "text-primary-foreground/70"
                          }`}
                        >
                          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t bg-card px-6 py-4">
        <div className="mx-auto max-w-4xl">
          <div className="flex gap-3">
            <Textarea
              placeholder={placeholder}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
              className="min-h-[80px] resize-none"
              disabled={isLoading}
            />
            <Button
              size="icon"
              className="h-20 w-20 rounded-xl bg-primary hover:bg-primary/90"
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            </Button>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Press Enter to send, Shift+Enter for new line
            {enableAI && " • AI-powered responses enabled"}
          </p>
        </div>
      </div>
    </div>
  )
}
