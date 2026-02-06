"use client"

import React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import { useAuth } from "@/lib/nexus/auth-context"
import { MessageSquare, Send, X, Loader2, Sparkles, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  suggestions?: string[]
  actionUrl?: string
}

export function ChatbotWidget() {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Hi${user ? `, ${user.name.split(" ")[0]}` : ""}! I'm your NEXUS assistant. Ask me anything about the app, your schedule, or campus life.`,
      suggestions: ["Summarize my day", "Where do I find the mess menu?", "Help with academics"],
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      role: "user",
      content: text.trim(),
    }
    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setIsLoading(true)

    try {
      const res = await fetch("/api/beyond/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text.trim(),
          role: user?.role || "student",
          context: { userId: user?.id },
        }),
      })
      const data = await res.json()

      const botMsg: ChatMessage = {
        id: `bot_${Date.now()}`,
        role: "assistant",
        content: data.reply || "I'm not sure how to help with that. Try asking about a specific module.",
        suggestions: data.suggestions,
        actionUrl: data.actionUrl,
      }
      setMessages((prev) => [...prev, botMsg])
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: `err_${Date.now()}`, role: "assistant", content: "Something went wrong. Please try again." },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  if (!user) return null

  return (
    <>
      {/* Floating trigger button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-nexus-gold text-primary-foreground shadow-lg transition-transform hover:scale-105 nexus-glow lg:bottom-6"
          aria-label="Open NEXUS assistant"
        >
          <MessageSquare className="h-5 w-5" />
        </button>
      )}

      {/* Chat panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 z-50 flex h-[28rem] w-80 flex-col overflow-hidden rounded-xl border border-border bg-card shadow-2xl lg:bottom-6 lg:h-[32rem] lg:w-96">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border bg-card px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-nexus-gold/15">
                <Sparkles className="h-3.5 w-3.5 text-nexus-gold" />
              </div>
              <div>
                <p className="font-display text-xs font-bold tracking-wider text-foreground">NEXUS ASSISTANT</p>
                <p className="text-[9px] text-muted-foreground">Powered by CIE</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
              <span className="sr-only">Close chat</span>
            </Button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-3">
            <div className="flex flex-col gap-3">
              {messages.map((msg) => (
                <div key={msg.id} className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
                  <div className={cn(
                    "max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed",
                    msg.role === "user"
                      ? "bg-nexus-gold text-primary-foreground"
                      : "bg-secondary text-foreground"
                  )}>
                    <p className="whitespace-pre-wrap">{msg.content}</p>

                    {/* Suggestions */}
                    {msg.suggestions && msg.suggestions.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {msg.suggestions.map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => sendMessage(s)}
                            className="rounded-full border border-border bg-card px-2 py-0.5 text-[9px] text-muted-foreground transition-colors hover:border-nexus-gold hover:text-nexus-gold"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Action link */}
                    {msg.actionUrl && (
                      <a
                        href={msg.actionUrl}
                        className="mt-1.5 flex items-center gap-1 text-[10px] font-medium text-nexus-gold hover:underline"
                      >
                        Go to module <ChevronRight className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="rounded-xl bg-secondary px-3 py-2">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="border-t border-border bg-card p-3">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything..."
                className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-nexus-gold"
                disabled={isLoading}
              />
              <Button
                type="submit"
                size="icon"
                className="h-8 w-8 shrink-0 bg-nexus-gold text-primary-foreground hover:bg-nexus-gold/90"
                disabled={!input.trim() || isLoading}
              >
                <Send className="h-3.5 w-3.5" />
                <span className="sr-only">Send message</span>
              </Button>
            </div>
          </form>
        </div>
      )}
    </>
  )
}
