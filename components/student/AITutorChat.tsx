"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  X,
  Send,
  Paperclip,
  BookOpen,
  Calculator,
  Globe,
  Beaker,
  ImageIcon,
  FileText,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Sparkles,
} from "lucide-react"

interface Message {
  id: string
  text: string
  sender: "user" | "ai"
  timestamp: Date
  subject?: string
  attachments?: Attachment[]
  isTyping?: boolean
  citations?: string[]
  followUpQuestions?: string[]
  helpful?: boolean | null
}

interface Attachment {
  id: string
  name: string
  type: "image" | "pdf" | "document"
  size: number
  url?: string
}

interface AITutorChatProps {
  onClose: () => void
}

export default function AITutorChat({ onClose }: AITutorChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! I'm your AI tutor powered by advanced language models. I can help you with:\n\n📚 **Subject-specific tutoring** in Math, Science, English, and Social Studies\n📄 **Document analysis** - Upload PDFs, images, or documents for help\n🎯 **Step-by-step explanations** for complex problems\n💡 **Practice questions** and study tips\n\nWhat would you like to learn today?",
      sender: "ai",
      timestamp: new Date(),
      followUpQuestions: [
        "Help me with quadratic equations",
        "Explain photosynthesis process",
        "Check my essay for grammar",
        "Solve this math problem",
      ],
    },
  ])
  const [inputText, setInputText] = useState("")
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const subjects = [
    {
      id: "math",
      name: "Mathematics",
      icon: Calculator,
      color: "bg-blue-500",
      description: "Algebra, Geometry, Calculus",
    },
    { id: "science", name: "Science", icon: Beaker, color: "bg-green-500", description: "Physics, Chemistry, Biology" },
    {
      id: "english",
      name: "English",
      icon: BookOpen,
      color: "bg-purple-500",
      description: "Grammar, Literature, Writing",
    },
    {
      id: "social",
      name: "Social Studies",
      icon: Globe,
      color: "bg-orange-500",
      description: "History, Geography, Politics",
    },
  ]

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async () => {
    if (!inputText.trim() && attachments.length === 0) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: "user",
      timestamp: new Date(),
      subject: selectedSubject || undefined,
      attachments: attachments.length > 0 ? [...attachments] : undefined,
    }

    setMessages((prev) => [...prev, userMessage])
    setInputText("")
    setAttachments([])
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getAIResponse(inputText, selectedSubject, attachments),
        sender: "ai",
        timestamp: new Date(),
        subject: selectedSubject || undefined,
        citations: getCitations(selectedSubject),
        followUpQuestions: getFollowUpQuestions(selectedSubject),
      }
      setMessages((prev) => [...prev, aiResponse])
      setIsTyping(false)
    }, 2000)
  }

  const getAIResponse = (question: string, subject: string | null, attachments: Attachment[]): string => {
    if (attachments.length > 0) {
      const fileTypes = attachments.map((a) => a.type).join(", ")
      return `I've analyzed your uploaded ${fileTypes} file(s). Here's what I found:\n\n**Key Points:**\n• The content covers important concepts in ${subject || "the subject"}\n• I've identified areas that might need clarification\n• There are some practice opportunities I can suggest\n\n**Detailed Analysis:**\nBased on the document, I can see you're working on ${subject === "math" ? "mathematical concepts that involve problem-solving strategies" : subject === "science" ? "scientific principles and their applications" : subject === "english" ? "language arts and communication skills" : "social studies topics and their historical context"}.\n\n**Recommendations:**\n1. Focus on the fundamental concepts first\n2. Practice with similar examples\n3. Connect these ideas to real-world applications\n\nWould you like me to create practice questions based on this content?`
    }

    const responses = {
      math: `Great math question! Let me break this down step-by-step:\n\n**Step 1: Identify the Problem Type**\nThis appears to be a ${question.includes("equation") ? "algebraic equation" : question.includes("graph") ? "graphing problem" : question.includes("triangle") ? "geometry problem" : "mathematical concept"} that requires systematic approach.\n\n**Step 2: Apply the Method**\n• Start with the given information\n• Use appropriate formulas or theorems\n• Work through each step carefully\n• Check your answer\n\n**Step 3: Verify the Solution**\nAlways substitute back to verify your answer makes sense.\n\n**Practice Tip:** Try similar problems to reinforce your understanding!`,

      science: `Excellent science question! Let me explain this concept clearly:\n\n**Scientific Principle:**\nThis relates to fundamental laws of ${question.includes("chemical") ? "chemistry" : question.includes("physics") ? "physics" : question.includes("biology") ? "biology" : "science"} that govern natural phenomena.\n\n**Key Concepts:**\n• Cause and effect relationships\n• Observable patterns in nature\n• Experimental evidence supporting theories\n• Real-world applications\n\n**Memory Aid:**\nThink of this like ${question.includes("chemical") ? "a recipe where ingredients combine in specific ways" : question.includes("physics") ? "forces and motion in everyday life" : "how living things adapt and survive"}.\n\n**Lab Connection:** This concept is often demonstrated through hands-on experiments!`,

      english: `Great English question! Let me help you improve your language skills:\n\n**Grammar Focus:**\n${question.includes("grammar") ? "This involves understanding sentence structure and proper usage" : question.includes("writing") ? "Effective writing requires clear organization and engaging style" : question.includes("literature") ? "Literary analysis involves examining themes, characters, and author's techniques" : "Language arts encompasses reading, writing, speaking, and listening skills"}.\n\n**Writing Strategy:**\n• Plan your ideas before writing\n• Use varied sentence structures\n• Choose precise vocabulary\n• Revise and edit carefully\n\n**Reading Tip:** Pay attention to how professional writers craft their sentences and paragraphs.\n\n**Practice Suggestion:** Try writing a short paragraph using the concepts we discussed!`,

      social: `Fascinating social studies question! Let me provide some context:\n\n**Historical Context:**\nThis topic connects to broader patterns in ${question.includes("history") ? "human civilization and historical development" : question.includes("geography") ? "how location influences human activities" : question.includes("government") ? "political systems and civic responsibilities" : "social and cultural development"}.\n\n**Key Connections:**\n• Cause and effect in historical events\n• Geographic influences on society\n• Cultural and economic factors\n• Lessons for today's world\n\n**Critical Thinking:** Consider multiple perspectives and examine primary sources.\n\n**Modern Relevance:** How do these historical patterns relate to current events?`,

      default: `I understand your question and I'm here to help! Let me provide a comprehensive explanation:\n\n**Analysis:**\nYour question touches on important concepts that require careful consideration and step-by-step breakdown.\n\n**Approach:**\n• Break down complex ideas into manageable parts\n• Connect new information to what you already know\n• Practice with examples and applications\n• Ask follow-up questions for clarification\n\n**Learning Strategy:**\nThe best way to master this topic is through active engagement and regular practice.\n\nWould you like me to create some practice problems or explain any specific part in more detail?`,
    }

    return responses[subject as keyof typeof responses] || responses.default
  }

  const getCitations = (subject: string | null): string[] => {
    const citations = {
      math: ["Khan Academy Mathematics", "MIT OpenCourseWare", "Wolfram MathWorld"],
      science: ["National Science Foundation", "Smithsonian Science Education", "NASA Educational Resources"],
      english: ["Purdue Writing Lab", "Grammar Girl", "Literary Devices Handbook"],
      social: ["National Geographic Education", "Library of Congress", "Smithsonian Learning"],
    }
    return citations[subject as keyof typeof citations] || ["Educational Resources Database", "Academic References"]
  }

  const getFollowUpQuestions = (subject: string | null): string[] => {
    const questions = {
      math: [
        "Can you show me a similar example?",
        "What's the real-world application?",
        "How do I avoid common mistakes?",
        "Create practice problems for me",
      ],
      science: [
        "What experiments demonstrate this?",
        "How does this connect to other concepts?",
        "What are the practical applications?",
        "Can you explain the underlying theory?",
      ],
      english: [
        "Help me improve my writing style",
        "What are common grammar mistakes?",
        "How can I analyze literature better?",
        "Give me vocabulary exercises",
      ],
      social: [
        "What were the long-term effects?",
        "How does this relate to today?",
        "What other perspectives exist?",
        "Show me primary sources",
      ],
    }
    return (
      questions[subject as keyof typeof questions] || [
        "Can you explain this differently?",
        "What should I study next?",
        "How can I practice this?",
        "What are the key takeaways?",
      ]
    )
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    setIsUploading(true)
    setUploadProgress(0)

    Array.from(files).forEach((file, index) => {
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)

            const newAttachment: Attachment = {
              id: Date.now().toString() + index,
              name: file.name,
              type: file.type.includes("image") ? "image" : file.type.includes("pdf") ? "pdf" : "document",
              size: file.size,
              url: URL.createObjectURL(file),
            }

            setAttachments((prev) => [...prev, newAttachment])
            setIsUploading(false)
            return 100
          }
          return prev + 10
        })
      }, 100)
    })
  }

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((att) => att.id !== id))
  }

  const handleFollowUpClick = (question: string) => {
    setInputText(question)
  }

  const handleMessageFeedback = (messageId: string, helpful: boolean) => {
    setMessages((prev) => prev.map((msg) => (msg.id === messageId ? { ...msg, helpful } : msg)))
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const getAttachmentIcon = (type: string) => {
    switch (type) {
      case "image":
        return <ImageIcon className="w-4 h-4" />
      case "pdf":
        return <FileText className="w-4 h-4 text-red-500" />
      case "document":
        return <FileText className="w-4 h-4 text-blue-500" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl h-[700px] flex flex-col bg-white shadow-2xl">
        <CardHeader className="flex-row items-center justify-between pb-3 border-b bg-gradient-to-r from-primary to-accent text-white">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            AI Tutor Chat
            <Badge className="bg-white/20 text-white border-white/30 ml-2">Advanced AI</Badge>
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        {/* Subject Selection */}
        <div className="p-4 border-b bg-gray-50">
          <p className="text-sm font-medium text-gray-700 mb-2">Choose a subject for specialized help:</p>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedSubject === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedSubject(null)}
              className="h-8"
            >
              <Sparkles className="w-3 h-3 mr-1" />
              General
            </Button>
            {subjects.map((subject) => {
              const Icon = subject.icon
              return (
                <Button
                  key={subject.id}
                  variant={selectedSubject === subject.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedSubject(subject.id)}
                  className="h-8"
                  title={subject.description}
                >
                  <Icon className="w-3 h-3 mr-1" />
                  {subject.name}
                </Button>
              )
            })}
          </div>
        </div>

        {/* Messages */}
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] p-4 rounded-lg ${
                  message.sender === "user"
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-800 border border-gray-200"
                }`}
              >
                {message.subject && (
                  <Badge variant="secondary" className="mb-2 text-xs">
                    {subjects.find((s) => s.id === message.subject)?.name || "General"}
                  </Badge>
                )}

                {/* Message Text */}
                <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.text}</div>

                {/* Attachments */}
                {message.attachments && message.attachments.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {message.attachments.map((attachment) => (
                      <div key={attachment.id} className="flex items-center gap-2 p-2 bg-white/10 rounded-lg">
                        {getAttachmentIcon(attachment.type)}
                        <span className="text-xs font-medium">{attachment.name}</span>
                        <span className="text-xs opacity-70">({formatFileSize(attachment.size)})</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Citations */}
                {message.citations && message.sender === "ai" && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs font-medium text-gray-600 mb-1">Sources:</p>
                    <div className="flex flex-wrap gap-1">
                      {message.citations.map((citation, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {citation}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Follow-up Questions */}
                {message.followUpQuestions && message.sender === "ai" && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs font-medium text-gray-600 mb-2">Suggested follow-ups:</p>
                    <div className="space-y-1">
                      {message.followUpQuestions.map((question, index) => (
                        <button
                          key={index}
                          onClick={() => handleFollowUpClick(question)}
                          className="block w-full text-left text-xs p-2 bg-white/50 hover:bg-white/70 rounded border border-gray-200 transition-colors"
                        >
                          {question}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Message Actions */}
                {message.sender === "ai" && (
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleMessageFeedback(message.id, true)}
                        className={`p-1 rounded transition-colors ${
                          message.helpful === true ? "bg-green-100 text-green-600" : "hover:bg-gray-200"
                        }`}
                      >
                        <ThumbsUp className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleMessageFeedback(message.id, false)}
                        className={`p-1 rounded transition-colors ${
                          message.helpful === false ? "bg-red-100 text-red-600" : "hover:bg-gray-200"
                        }`}
                      >
                        <ThumbsDown className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => copyToClipboard(message.text)}
                        className="p-1 rounded hover:bg-gray-200 transition-colors"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="text-xs opacity-70">{message.timestamp.toLocaleTimeString()}</p>
                  </div>
                )}

                {message.sender === "user" && (
                  <p className="text-xs opacity-70 mt-2">{message.timestamp.toLocaleTimeString()}</p>
                )}
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </CardContent>

        {/* Input Area */}
        <div className="p-4 border-t bg-gray-50">
          {/* Attachments Preview */}
          {attachments.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="flex items-center gap-2 p-2 bg-white rounded-lg border border-gray-200"
                >
                  {getAttachmentIcon(attachment.type)}
                  <span className="text-sm font-medium">{attachment.name}</span>
                  <span className="text-xs text-gray-500">({formatFileSize(attachment.size)})</span>
                  <button onClick={() => removeAttachment(attachment.id)} className="text-red-500 hover:text-red-700">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Upload Progress */}
          {isUploading && (
            <div className="mb-3">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                <span>Uploading files...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}

          {/* Input Controls */}
          <div className="flex gap-2">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
              <Paperclip className="w-4 h-4" />
            </Button>
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask a question, upload a file, or request help with homework..."
              onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
              className="flex-1"
              disabled={isUploading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={(!inputText.trim() && attachments.length === 0) || isUploading}
              className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="mt-2 flex gap-2 flex-wrap">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-6"
              onClick={() => handleFollowUpClick("Explain this step-by-step")}
            >
              "Explain step-by-step"
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-6"
              onClick={() => handleFollowUpClick("Create practice problems")}
            >
              "Create practice problems"
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-6"
              onClick={() => handleFollowUpClick("Check my work")}
            >
              "Check my work"
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-6"
              onClick={() => handleFollowUpClick("Simplify this concept")}
            >
              "Simplify this concept"
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
