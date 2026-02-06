"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageCircle, BarChart3, Users, Sparkles } from "lucide-react"
import AITutorChat from "@/components/student/AITutorChat"
import ClassPolling from "@/components/student/ClassPolling"
import AnonymousChatSystem from "@/components/chat/AnonymousChatSystem"

export default function QuickActions() {
  const [showAIChat, setShowAIChat] = useState(false)
  const [showPolling, setShowPolling] = useState(false)
  const [showAnonymousChat, setShowAnonymousChat] = useState(false)

  return (
    <>
      <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* AI Tutor Chat */}
          <Button
            onClick={() => setShowAIChat(true)}
            className="w-full justify-start h-12 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white shadow-md"
          >
            <MessageCircle className="w-4 h-4 mr-3" />
            <div className="text-left">
              <div className="font-semibold">AI Tutor Chat</div>
              <div className="text-xs opacity-90">Ask questions, get help</div>
            </div>
          </Button>

          {/* Class Polling */}
          <Button
            onClick={() => setShowPolling(true)}
            variant="outline"
            className="w-full justify-start h-12 border-accent/30 hover:bg-accent/10"
          >
            <BarChart3 className="w-4 h-4 mr-3 text-accent" />
            <div className="text-left">
              <div className="font-semibold text-gray-800">Class Polling</div>
              <div className="text-xs text-gray-600">Vote on difficult topics</div>
            </div>
          </Button>

          {/* Anonymous Chat */}
          <Button
            onClick={() => setShowAnonymousChat(true)}
            variant="outline"
            className="w-full justify-start h-12 border-game-primary/30 hover:bg-game-primary/10 bg-transparent"
          >
            <Users className="w-4 h-4 mr-3 text-game-primary" />
            <div className="text-left">
              <div className="font-semibold text-gray-800">Anonymous Chat</div>
              <div className="text-xs text-gray-600">Message teachers privately</div>
            </div>
          </Button>

          {/* Quick Stats */}
          <div className="pt-3 border-t border-gray-100">
            <div className="grid grid-cols-2 gap-2">
              <div className="text-center p-2 bg-green-50 rounded-lg">
                <div className="text-lg font-bold text-green-600">85%</div>
                <div className="text-xs text-gray-600">Accuracy</div>
              </div>
              <div className="text-center p-2 bg-blue-50 rounded-lg">
                <div className="text-lg font-bold text-blue-600">12</div>
                <div className="text-xs text-gray-600">Streak Days</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Tutor Chat Modal */}
      {showAIChat && <AITutorChat onClose={() => setShowAIChat(false)} />}

      {/* Class Polling Modal */}
      {showPolling && <ClassPolling onClose={() => setShowPolling(false)} />}

      {/* Anonymous Chat Modal */}
      {showAnonymousChat && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Anonymous Chat</h2>
                <Button variant="outline" onClick={() => setShowAnonymousChat(false)}>
                  Close
                </Button>
              </div>
              <AnonymousChatSystem userRole="student" />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
