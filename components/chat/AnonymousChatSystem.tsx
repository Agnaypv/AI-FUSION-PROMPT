"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  MessageCircle,
  Send,
  AlertTriangle,
  Shield,
  Eye,
  EyeOff,
  Flag,
  CheckCircle,
  Clock,
  User,
  Bot,
} from "lucide-react"

interface AnonymousMessage {
  id: string
  content: string
  timestamp: string
  status: "pending" | "approved" | "flagged" | "rejected"
  aiModeration: {
    score: number
    flags: string[]
    approved: boolean
  }
  teacherResponse?: string
  responseTimestamp?: string
  reportCount: number
}

interface AnonymousChatSystemProps {
  userRole: "student" | "teacher"
}

export default function AnonymousChatSystem({ userRole }: AnonymousChatSystemProps) {
  const [messages, setMessages] = useState<AnonymousMessage[]>([
    {
      id: "1",
      content:
        "I'm struggling with the quadratic equations assignment. Could you explain the discriminant formula again?",
      timestamp: "2024-01-15T10:30:00Z",
      status: "approved",
      aiModeration: {
        score: 95,
        flags: [],
        approved: true,
      },
      teacherResponse:
        "Of course! The discriminant is b² - 4ac. It tells us about the nature of roots. If it's positive, we have two real roots; if zero, one real root; if negative, no real roots. Would you like me to work through an example?",
      responseTimestamp: "2024-01-15T11:15:00Z",
      reportCount: 0,
    },
    {
      id: "2",
      content:
        "I feel really anxious about the upcoming science test. I've been studying but I'm worried I'll forget everything.",
      timestamp: "2024-01-14T15:45:00Z",
      status: "approved",
      aiModeration: {
        score: 98,
        flags: [],
        approved: true,
      },
      teacherResponse:
        "Test anxiety is completely normal! Try these techniques: review your notes one more time tonight, get good sleep, and remember to breathe during the test. You've been doing well in class - trust your preparation!",
      responseTimestamp: "2024-01-14T16:20:00Z",
      reportCount: 0,
    },
    {
      id: "3",
      content:
        "Some students in my class are making fun of my accent when I speak English. It makes me not want to participate.",
      timestamp: "2024-01-13T09:20:00Z",
      status: "flagged",
      aiModeration: {
        score: 85,
        flags: ["bullying_concern", "emotional_distress"],
        approved: true,
      },
      teacherResponse:
        "I'm sorry you're experiencing this. Your accent is part of what makes you unique, and everyone should feel safe to participate. I'll address this with the class about respect and inclusion. Please don't let this stop you from sharing your thoughts.",
      responseTimestamp: "2024-01-13T10:45:00Z",
      reportCount: 0,
    },
    {
      id: "4",
      content:
        "Can you help me understand why we need to learn history? It feels like it's not relevant to my future career in technology.",
      timestamp: "2024-01-12T14:30:00Z",
      status: "approved",
      aiModeration: {
        score: 92,
        flags: [],
        approved: true,
      },
      reportCount: 0,
    },
  ])

  const [newMessage, setNewMessage] = useState("")
  const [showModerationDetails, setShowModerationDetails] = useState<string | null>(null)
  const [filter, setFilter] = useState<"all" | "pending" | "flagged" | "approved">("all")

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    // Simulate AI moderation
    const aiScore = Math.floor(Math.random() * 30) + 70 // 70-100 range
    const flags: string[] = []

    // Simple content analysis simulation
    if (newMessage.toLowerCase().includes("hate") || newMessage.toLowerCase().includes("stupid")) {
      flags.push("inappropriate_language")
    }
    if (newMessage.toLowerCase().includes("hurt") || newMessage.toLowerCase().includes("sad")) {
      flags.push("emotional_distress")
    }

    const message: AnonymousMessage = {
      id: Date.now().toString(),
      content: newMessage,
      timestamp: new Date().toISOString(),
      status: flags.length > 0 ? "flagged" : aiScore > 80 ? "approved" : "pending",
      aiModeration: {
        score: aiScore,
        flags,
        approved: aiScore > 80 && flags.length === 0,
      },
      reportCount: 0,
    }

    setMessages([message, ...messages])
    setNewMessage("")
  }

  const handleReportMessage = (messageId: string) => {
    setMessages(
      messages.map((msg) =>
        msg.id === messageId
          ? { ...msg, reportCount: msg.reportCount + 1, status: msg.reportCount >= 2 ? "flagged" : msg.status }
          : msg,
      ),
    )
  }

  const handleTeacherResponse = (messageId: string, response: string) => {
    setMessages(
      messages.map((msg) =>
        msg.id === messageId
          ? {
              ...msg,
              teacherResponse: response,
              responseTimestamp: new Date().toISOString(),
            }
          : msg,
      ),
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200"
      case "flagged":
        return "bg-red-100 text-red-700 border-red-200"
      case "rejected":
        return "bg-gray-100 text-gray-700 border-gray-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-3 h-3" />
      case "pending":
        return <Clock className="w-3 h-3" />
      case "flagged":
        return <AlertTriangle className="w-3 h-3" />
      case "rejected":
        return <AlertTriangle className="w-3 h-3" />
      default:
        return <Clock className="w-3 h-3" />
    }
  }

  const filteredMessages = messages.filter((msg) => filter === "all" || msg.status === filter)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <MessageCircle className="w-6 h-6" />
            Anonymous Chat System
          </h2>
          <p className="text-gray-600">
            {userRole === "student"
              ? "Send anonymous messages to your teachers. All messages are AI-moderated for safety."
              : "Respond to anonymous student messages. Help create a supportive learning environment."}
          </p>
        </div>

        {userRole === "teacher" && (
          <div className="flex items-center gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as typeof filter)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Messages</option>
              <option value="pending">Pending Review</option>
              <option value="flagged">Flagged</option>
              <option value="approved">Approved</option>
            </select>
          </div>
        )}
      </div>

      {/* AI Moderation Notice */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-800">AI-Powered Safety</h3>
              <p className="text-sm text-blue-700 mt-1">
                All messages are automatically screened for inappropriate content, bullying, and safety concerns.
                Messages flagged by our AI or reported by users are reviewed by teachers before being visible.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Message Composer (Student Only) */}
      {userRole === "student" && (
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-800">Send Anonymous Message</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Ask a question, share a concern, or request help... Your identity will remain anonymous."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Shield className="w-4 h-4" />
                <span>AI-moderated for safety</span>
              </div>
              <Button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
              >
                <Send className="w-4 h-4 mr-2" />
                Send Anonymously
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Messages List */}
      <div className="space-y-4">
        {filteredMessages.map((message) => (
          <Card key={message.id} className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full">
                    <User className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-800">Anonymous Student</span>
                      <Badge className={`text-xs border ${getStatusColor(message.status)}`}>
                        {getStatusIcon(message.status)}
                        <span className="ml-1 capitalize">{message.status}</span>
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500">{new Date(message.timestamp).toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {userRole === "teacher" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowModerationDetails(showModerationDetails === message.id ? null : message.id)}
                    >
                      {showModerationDetails === message.id ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                      AI Details
                    </Button>
                  )}

                  {userRole === "student" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleReportMessage(message.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Flag className="w-4 h-4" />
                      Report
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Student Message */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-800">{message.content}</p>
              </div>

              {/* AI Moderation Details (Teacher Only) */}
              {userRole === "teacher" && showModerationDetails === message.id && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-800 mb-2">AI Moderation Analysis</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-blue-700">Safety Score:</span>
                      <span className="font-medium text-blue-800">{message.aiModeration.score}/100</span>
                    </div>
                    {message.aiModeration.flags.length > 0 && (
                      <div>
                        <span className="text-blue-700">Flags:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {message.aiModeration.flags.map((flag, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs bg-red-50 text-red-700 border-red-200"
                            >
                              {flag.replace("_", " ")}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {message.reportCount > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-blue-700">User Reports:</span>
                        <span className="font-medium text-red-600">{message.reportCount}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Teacher Response */}
              {message.teacherResponse && (
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Bot className="w-4 h-4 text-green-600" />
                    <span className="font-medium text-green-800">Teacher Response</span>
                    <span className="text-xs text-green-600">
                      {new Date(message.responseTimestamp!).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-green-800">{message.teacherResponse}</p>
                </div>
              )}

              {/* Teacher Response Form */}
              {userRole === "teacher" && !message.teacherResponse && message.status === "approved" && (
                <div className="border-t pt-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type your response to help this student..."
                      className="flex-1"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          const input = e.target as HTMLInputElement
                          if (input.value.trim()) {
                            handleTeacherResponse(message.id, input.value)
                            input.value = ""
                          }
                        }
                      }}
                    />
                    <Button
                      size="sm"
                      onClick={(e) => {
                        const input = (e.target as HTMLElement).parentElement?.querySelector(
                          "input",
                        ) as HTMLInputElement
                        if (input?.value.trim()) {
                          handleTeacherResponse(message.id, input.value)
                          input.value = ""
                        }
                      }}
                      className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMessages.length === 0 && (
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-8 text-center">
            <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="font-medium text-gray-800 mb-2">No Messages Yet</h3>
            <p className="text-gray-600">
              {userRole === "student"
                ? "Send your first anonymous message to get help from your teachers."
                : "No anonymous messages to review at the moment."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
