"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Calculator, Beaker, Globe, Languages, Play, Trophy, Star } from "lucide-react"
import WordRacerGame from "@/components/games/WordRacerGame"
import MathHuntGame from "@/components/games/MathHuntGame"
import LiveBooks from "@/components/student/LiveBooks"

interface Subject {
  id: string
  name: string
  icon: any
  color: string
  level: number
  progress: number
  xp: number
  hasGame: boolean
  gameType?: string
  stars: number
}

export default function Subjects() {
  const [selectedGame, setSelectedGame] = useState<string | null>(null)
  const [selectedLiveBook, setSelectedLiveBook] = useState<string | null>(null)

  const subjects: Subject[] = [
    {
      id: "english",
      name: "English",
      icon: BookOpen,
      color: "from-purple-500 to-pink-500",
      level: 8,
      progress: 75,
      xp: 1250,
      hasGame: true,
      gameType: "word-racer",
      stars: 4,
    },
    {
      id: "mathematics",
      name: "Mathematics",
      icon: Calculator,
      color: "from-blue-500 to-cyan-500",
      level: 6,
      progress: 60,
      xp: 980,
      hasGame: true,
      gameType: "math-hunt",
      stars: 3,
    },
    {
      id: "science",
      name: "Science",
      icon: Beaker,
      color: "from-green-500 to-emerald-500",
      level: 7,
      progress: 85,
      xp: 1150,
      hasGame: false,
      stars: 5,
    },
    {
      id: "social",
      name: "Social Studies",
      icon: Globe,
      color: "from-orange-500 to-red-500",
      level: 5,
      progress: 45,
      xp: 720,
      hasGame: false,
      stars: 3,
    },
    {
      id: "regional",
      name: "Regional Language",
      icon: Languages,
      color: "from-indigo-500 to-purple-500",
      level: 4,
      progress: 30,
      xp: 560,
      hasGame: false,
      stars: 2,
    },
  ]

  const handlePlayGame = (gameType: string) => {
    setSelectedGame(gameType)
  }

  const handleOpenLiveBook = (subjectId: string) => {
    setSelectedLiveBook(subjectId)
  }

  return (
    <>
      <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-game-primary to-game-secondary rounded-lg flex items-center justify-center">
              <Trophy className="w-3 h-3 text-white" />
            </div>
            Subjects
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {subjects.map((subject) => {
            const Icon = subject.icon
            return (
              <Card key={subject.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    {/* Subject Icon */}
                    <div
                      className={`w-12 h-12 bg-gradient-to-br ${subject.color} rounded-xl flex items-center justify-center flex-shrink-0`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>

                    {/* Subject Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-800">{subject.name}</h3>
                        <Badge variant="outline" className="text-xs">
                          Level {subject.level}
                        </Badge>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < subject.stars ? "text-yellow-400 fill-current" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">{subject.xp} XP</span>
                          <span className="text-gray-600">{subject.progress}% Complete</span>
                        </div>
                        <Progress value={subject.progress} className="h-2" />
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-4">
                    {subject.hasGame && (
                      <Button
                        size="sm"
                        onClick={() => handlePlayGame(subject.gameType!)}
                        className="bg-gradient-to-r from-game-primary to-game-secondary hover:from-game-primary/90 hover:to-game-secondary/90 text-white"
                      >
                        <Play className="w-3 h-3 mr-1" />
                        Play Game
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenLiveBook(subject.id)}
                      className="border-primary/30 hover:bg-primary/10"
                    >
                      <BookOpen className="w-3 h-3 mr-1" />
                      Live Book
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </CardContent>
      </Card>

      {/* Game Modals */}
      {selectedGame === "word-racer" && <WordRacerGame onClose={() => setSelectedGame(null)} />}
      {selectedGame === "math-hunt" && <MathHuntGame onClose={() => setSelectedGame(null)} />}

      {/* Live Books Modal */}
      {selectedLiveBook && <LiveBooks subjectId={selectedLiveBook} onClose={() => setSelectedLiveBook(null)} />}
    </>
  )
}
