"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Send, MoreVertical, Plus } from "lucide-react"

interface Message {
  id: string
  text: string
  timestamp: string
  isOwn: boolean
}

interface Conversation {
  id: string
  name: string
  avatar: string
  lastMessage: string
  timestamp: string
  unread: number
  isOnline: boolean
  messages: Message[]
}

export default function MessagesScreen() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedConversation, setSelectedConversation] = useState<string>("1")
  const [messageInput, setMessageInput] = useState("")

  const conversations: Conversation[] = [
    {
      id: "1",
      name: "Sarah Chen",
      avatar: "👩",
      lastMessage: "Great! Let's catch up later.",
      timestamp: "2 min ago",
      unread: 1,
      isOnline: true,
      messages: [
        { id: "1", text: "Hey! How's the React course going?", timestamp: "10 min ago", isOwn: false },
        { id: "2", text: "Really enjoying it so far! Just finished the Hooks module.", timestamp: "8 min ago", isOwn: true },
        { id: "3", text: "Great! Let's catch up later.", timestamp: "2 min ago", isOwn: false },
      ],
    },
    {
      id: "2",
      name: "Study Group",
      avatar: "👥",
      lastMessage: "Meeting at 3pm today?",
      timestamp: "1 hour ago",
      unread: 0,
      isOnline: false,
      messages: [
        { id: "1", text: "Who's available for study session?", timestamp: "2 hours ago", isOwn: false },
        { id: "2", text: "I can make it at 2pm", timestamp: "1.5 hours ago", isOwn: true },
        { id: "3", text: "Meeting at 3pm today?", timestamp: "1 hour ago", isOwn: false },
      ],
    },
    {
      id: "3",
      name: "Instructor Mike",
      avatar: "👨",
      lastMessage: "Your assignment looks great!",
      timestamp: "4 hours ago",
      unread: 0,
      isOnline: false,
      messages: [
        { id: "1", text: "Hi Mike, I submitted my assignment", timestamp: "5 hours ago", isOwn: true },
        { id: "2", text: "Your assignment looks great!", timestamp: "4 hours ago", isOwn: false },
      ],
    },
  ]

  const currentConversation = conversations.find((c) => c.id === selectedConversation)

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      setMessageInput("")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 pb-24">
      {/* Header */}
      <div className="px-4 sm:px-6 lg:px-8 py-8 border-b border-slate-200">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-4xl font-bold text-slate-900">Messages</h1>
            <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-lg h-10 w-10 p-0">
              <Plus className="w-5 h-5" />
            </Button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-11 rounded-lg border-slate-300"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
            {/* Conversations List */}
            <div className="lg:col-span-1">
              <Card className="border-0 rounded-xl bg-white shadow-sm h-full overflow-hidden flex flex-col">
                {conversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation.id)}
                    className={`flex items-center gap-3 p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors text-left ${
                      selectedConversation === conversation.id ? "bg-purple-50" : ""
                    }`}
                  >
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-xl">
                        {conversation.avatar}
                      </div>
                      {conversation.isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-semibold text-slate-900">{conversation.name}</h3>
                        {conversation.unread > 0 && (
                          <Badge className="bg-red-500 text-white">{conversation.unread}</Badge>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 truncate mt-1">{conversation.lastMessage}</p>
                      <p className="text-xs text-slate-500 mt-1">{conversation.timestamp}</p>
                    </div>
                  </button>
                ))}
              </Card>
            </div>

            {/* Chat Area */}
            {currentConversation && (
              <div className="lg:col-span-2 flex flex-col">
                <Card className="border-0 rounded-xl bg-white shadow-sm h-full flex flex-col overflow-hidden">
                  {/* Chat Header */}
                  <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-lg">
                        {currentConversation.avatar}
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">{currentConversation.name}</h3>
                        <p className="text-xs text-slate-600">
                          {currentConversation.isOnline ? "Online" : "Offline"}
                        </p>
                      </div>
                    </div>
                    <button className="text-slate-600 hover:text-slate-900 p-2">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {currentConversation.messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-xs px-4 py-2 rounded-lg ${
                            message.isOwn
                              ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white"
                              : "bg-slate-100 text-slate-900"
                          }`}
                        >
                          <p className="text-sm">{message.text}</p>
                          <p className={`text-xs mt-1 ${message.isOwn ? "text-purple-200" : "text-slate-600"}`}>
                            {message.timestamp}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Input */}
                  <div className="px-6 py-4 border-t border-slate-200 flex gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") handleSendMessage()
                      }}
                      className="flex-1 rounded-lg border-slate-300"
                    />
                    <Button
                      onClick={handleSendMessage}
                      className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-lg w-10 h-10 p-0"
                    >
                      <Send className="w-5 h-5" />
                    </Button>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
