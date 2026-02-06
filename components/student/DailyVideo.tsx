"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Clock, Star, CheckCircle } from "lucide-react"

export default function DailyVideo() {
  const [isWatched, setIsWatched] = useState(false)
  const [showVideo, setShowVideo] = useState(false)

  const dailyVideo = {
    title: "Understanding Quadratic Equations",
    subject: "Mathematics",
    duration: "8:45",
    thumbnail: "/mathematics-quadratic-equations-chalkboard.jpg",
    description: "Learn the fundamentals of quadratic equations with step-by-step examples",
    xpReward: 25,
    difficulty: "Medium",
  }

  const handleWatchVideo = () => {
    setShowVideo(true)
    // Simulate video completion after 3 seconds for demo
    setTimeout(() => {
      setIsWatched(true)
      setShowVideo(false)
      // Show XP gain animation
      const confetti = document.createElement("div")
      confetti.className = "confetti"
      confetti.textContent = `+${dailyVideo.xpReward} XP`
      confetti.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(45deg, #15803d, #84cc16);
        color: white;
        padding: 8px 16px;
        border-radius: 20px;
        font-weight: bold;
        z-index: 1000;
        pointer-events: none;
      `
      document.body.appendChild(confetti)
      setTimeout(() => document.body.removeChild(confetti), 1000)
    }, 3000)
  }

  return (
    <>
      <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <Play className="w-3 h-3 text-white" />
              </div>
              Daily Must-Watch Video
            </CardTitle>
            {isWatched && (
              <Badge className="bg-green-100 text-green-700 border-green-200">
                <CheckCircle className="w-3 h-3 mr-1" />
                Completed
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Video Thumbnail */}
          <div className="relative group cursor-pointer" onClick={handleWatchVideo}>
            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={dailyVideo.thumbnail || "/placeholder.svg"}
                alt={dailyVideo.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Play className="w-6 h-6 text-primary ml-1" />
                </div>
              </div>
            </div>
          </div>

          {/* Video Info */}
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-gray-800 text-lg">{dailyVideo.title}</h3>
              <p className="text-sm text-gray-600">{dailyVideo.description}</p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <Badge variant="outline" className="text-primary border-primary/30">
                {dailyVideo.subject}
              </Badge>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                {dailyVideo.duration}
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Star className="w-4 h-4" />
                {dailyVideo.difficulty}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="text-sm text-gray-600">
                Watch to unlock <span className="font-semibold text-accent">+{dailyVideo.xpReward} XP</span>
              </div>
              <Button
                onClick={handleWatchVideo}
                disabled={isWatched}
                className={`${
                  isWatched
                    ? "bg-green-100 text-green-700 hover:bg-green-100"
                    : "bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                }`}
              >
                {isWatched ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Watched
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Watch Now
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Video Modal */}
      {showVideo && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <div className="aspect-video bg-gray-900 rounded-lg mb-4 flex items-center justify-center">
              <div className="text-white text-center">
                <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
                <p>Playing: {dailyVideo.title}</p>
                <p className="text-sm opacity-70">Video will complete in 3 seconds for demo</p>
              </div>
            </div>
            <Button variant="outline" onClick={() => setShowVideo(false)} className="w-full">
              Close Video
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
