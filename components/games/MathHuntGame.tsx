"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { X, Heart, Clock, Trophy, Target, Star } from "lucide-react"

interface MathQuestion {
  id: number
  question: string
  answer: number
  options: number[]
  topic: string
  difficulty: "easy" | "medium" | "hard"
}

interface Bubble {
  id: string
  value: number
  x: number
  y: number
  isCorrect: boolean
  isShot: boolean
}

interface MathHuntGameProps {
  onClose: () => void
}

export default function MathHuntGame({ onClose }: MathHuntGameProps) {
  const [currentLevel, setCurrentLevel] = useState(1)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [lives, setLives] = useState(3)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(15)
  const [gameState, setGameState] = useState<"playing" | "paused" | "gameOver" | "levelComplete">("playing")
  const [bubbles, setBubbles] = useState<Bubble[]>([])
  const [showResult, setShowResult] = useState(false)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [crosshairPosition, setCrosshairPosition] = useState({ x: 50, y: 50 })

  // Sample math questions
  const questions: MathQuestion[] = [
    // Easy
    {
      id: 1,
      question: "What is 15 + 23?",
      answer: 38,
      options: [38, 35, 41, 33],
      topic: "Addition",
      difficulty: "easy",
    },
    {
      id: 2,
      question: "What is 8 × 7?",
      answer: 56,
      options: [56, 54, 58, 52],
      topic: "Multiplication",
      difficulty: "easy",
    },
    {
      id: 3,
      question: "What is 144 ÷ 12?",
      answer: 12,
      options: [12, 14, 10, 16],
      topic: "Division",
      difficulty: "easy",
    },
    // Medium
    {
      id: 4,
      question: "What is 25% of 80?",
      answer: 20,
      options: [20, 25, 15, 30],
      topic: "Percentage",
      difficulty: "medium",
    },
    {
      id: 5,
      question: "Solve: 3x + 5 = 20",
      answer: 5,
      options: [5, 3, 7, 4],
      topic: "Algebra",
      difficulty: "medium",
    },
    {
      id: 6,
      question: "What is the area of a rectangle with length 8 and width 6?",
      answer: 48,
      options: [48, 42, 54, 36],
      topic: "Geometry",
      difficulty: "medium",
    },
    // Hard
    {
      id: 7,
      question: "What is √169?",
      answer: 13,
      options: [13, 12, 14, 15],
      topic: "Square Roots",
      difficulty: "hard",
    },
    {
      id: 8,
      question: "If sin(30°) = 0.5, what is sin(60°)?",
      answer: 0.866,
      options: [0.866, 0.5, 0.707, 1],
      topic: "Trigonometry",
      difficulty: "hard",
    },
  ]

  const currentQ = questions[currentQuestion % questions.length]
  const totalQuestions = Math.min(50, questions.length) // 50 questions per level

  // Initialize bubbles when question changes
  useEffect(() => {
    if (currentQ) {
      const newBubbles: Bubble[] = currentQ.options.map((option, index) => ({
        id: `bubble-${index}`,
        value: option,
        x: 20 + (index % 2) * 60 + Math.random() * 10,
        y: 20 + Math.floor(index / 2) * 40 + Math.random() * 10,
        isCorrect: option === currentQ.answer,
        isShot: false,
      }))
      setBubbles(newBubbles)
    }
  }, [currentQuestion, currentQ])

  // Timer effect
  useEffect(() => {
    if (gameState !== "playing" || timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimeUp()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [gameState, timeLeft])

  const handleTimeUp = useCallback(() => {
    setLives((prev) => prev - 1)
    if (lives <= 1) {
      setGameState("gameOver")
    } else {
      nextQuestion()
    }
  }, [lives])

  const handleBubbleShoot = (bubbleId: string) => {
    if (showResult) return

    const bubble = bubbles.find((b) => b.id === bubbleId)
    if (!bubble || bubble.isShot) return

    setBubbles((prev) => prev.map((b) => (b.id === bubbleId ? { ...b, isShot: true } : b)))

    setShowResult(true)

    if (bubble.isCorrect) {
      setScore((prev) => prev + getScoreForDifficulty(currentQ.difficulty))
      setCorrectAnswers((prev) => prev + 1)
      // Show success animation
      setTimeout(() => {
        nextQuestion()
      }, 1500)
    } else {
      setLives((prev) => prev - 1)
      setTimeout(() => {
        if (lives <= 1) {
          setGameState("gameOver")
        } else {
          nextQuestion()
        }
      }, 1500)
    }
  }

  const getScoreForDifficulty = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return 10
      case "medium":
        return 20
      case "hard":
        return 35
      default:
        return 10
    }
  }

  const nextQuestion = () => {
    if (currentQuestion + 1 >= totalQuestions) {
      setGameState("levelComplete")
    } else {
      setCurrentQuestion((prev) => prev + 1)
      setTimeLeft(15 + currentLevel * 3) // Increase time with level
      setShowResult(false)
    }
  }

  const nextLevel = () => {
    setCurrentLevel((prev) => prev + 1)
    setCurrentQuestion(0)
    setLives(3)
    setTimeLeft(15 + currentLevel * 3)
    setShowResult(false)
    setGameState("playing")
    setCorrectAnswers(0)
  }

  const restartGame = () => {
    setCurrentLevel(1)
    setCurrentQuestion(0)
    setLives(3)
    setScore(0)
    setTimeLeft(15)
    setShowResult(false)
    setGameState("playing")
    setCorrectAnswers(0)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-700 border-green-200"
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200"
      case "hard":
        return "bg-red-100 text-red-700 border-red-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  if (gameState === "gameOver") {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-md bg-white shadow-2xl">
          <CardHeader className="text-center pb-4 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-t-lg">
            <CardTitle className="text-2xl font-bold">Game Over!</CardTitle>
          </CardHeader>
          <CardContent className="p-6 text-center space-y-4">
            <div className="text-6xl">💥</div>
            <div className="space-y-2">
              <p className="text-xl font-semibold text-gray-800">Final Score: {score}</p>
              <p className="text-gray-600">Level Reached: {currentLevel}</p>
              <p className="text-gray-600">Correct Shots: {correctAnswers}</p>
              <div className="flex items-center justify-center gap-1">
                {[...Array(3)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      correctAnswers >= (i + 1) * 10 ? "text-yellow-400 fill-current" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={restartGame} className="flex-1 bg-gradient-to-r from-primary to-accent">
                Play Again
              </Button>
              <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
                Exit
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (gameState === "levelComplete") {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-md bg-white shadow-2xl">
          <CardHeader className="text-center pb-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-t-lg">
            <CardTitle className="text-2xl font-bold">Level Complete! 🎯</CardTitle>
          </CardHeader>
          <CardContent className="p-6 text-center space-y-4">
            <div className="text-6xl">🏆</div>
            <div className="space-y-2">
              <p className="text-xl font-semibold text-gray-800">Level {currentLevel} Completed!</p>
              <p className="text-gray-600">Score: {score}</p>
              <p className="text-gray-600">Accuracy: {Math.round((correctAnswers / totalQuestions) * 100)}%</p>
              <div className="flex items-center justify-center gap-1">
                {[...Array(3)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-6 h-6 ${
                      correctAnswers >= (i + 1) * 15 ? "text-yellow-400 fill-current" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={nextLevel} className="flex-1 bg-gradient-to-r from-primary to-accent">
                Next Level
              </Button>
              <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
                Exit
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-5xl max-h-[90vh] overflow-hidden bg-white shadow-2xl">
        {/* Header */}
        <CardHeader className="flex-row items-center justify-between pb-3 border-b bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Target className="w-6 h-6" />
            Math Hunt - Bubble Shooter
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        {/* Game Stats */}
        <div className="p-4 bg-gray-50 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge className="bg-blue-100 text-blue-700 border-blue-200">Level {currentLevel}</Badge>
              <div className="flex items-center gap-1">
                {[...Array(3)].map((_, i) => (
                  <Heart key={i} className={`w-5 h-5 ${i < lives ? "text-red-500 fill-current" : "text-gray-300"}`} />
                ))}
              </div>
              <div className="flex items-center gap-1 text-sm font-semibold text-gray-700">
                <Trophy className="w-4 h-4 text-yellow-500" />
                {score}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-sm font-semibold text-gray-700">
                <Clock className="w-4 h-4 text-blue-500" />
                {timeLeft}s
              </div>
              <div className="text-sm text-gray-600">
                {currentQuestion + 1}/{totalQuestions}
              </div>
            </div>
          </div>
          <Progress value={((currentQuestion + 1) / totalQuestions) * 100} className="mt-2 h-2" />
        </div>

        {/* Game Area */}
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Question */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Badge className={`${getDifficultyColor(currentQ.difficulty)}`}>
                  {currentQ.difficulty.toUpperCase()}
                </Badge>
                <Badge variant="outline">{currentQ.topic}</Badge>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Shoot the correct answer!</h2>
              <p className="text-xl text-gray-700 leading-relaxed">{currentQ.question}</p>
            </div>

            {/* Game Canvas */}
            <div className="relative bg-gradient-to-b from-sky-100 to-blue-200 rounded-xl h-80 overflow-hidden border-2 border-blue-300">
              {/* Crosshair */}
              <div
                className="absolute w-8 h-8 pointer-events-none z-10"
                style={{
                  left: `${crosshairPosition.x}%`,
                  top: `${crosshairPosition.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div className="w-full h-full border-2 border-red-500 rounded-full bg-red-500/20">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-1 h-4 bg-red-500"></div>
                    <div className="absolute w-4 h-1 bg-red-500"></div>
                  </div>
                </div>
              </div>

              {/* Floating Bubbles */}
              {bubbles.map((bubble) => (
                <button
                  key={bubble.id}
                  onClick={() => handleBubbleShoot(bubble.id)}
                  disabled={bubble.isShot || showResult}
                  className={`absolute w-16 h-16 rounded-full border-4 font-bold text-lg transition-all duration-300 ${
                    bubble.isShot
                      ? bubble.isCorrect
                        ? "bg-green-500 border-green-600 text-white scale-125 animate-pulse"
                        : "bg-red-500 border-red-600 text-white scale-75 opacity-50"
                      : "bg-white border-blue-400 text-blue-800 hover:scale-110 hover:border-blue-600 shadow-lg"
                  }`}
                  style={{
                    left: `${bubble.x}%`,
                    top: `${bubble.y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  {bubble.value}
                </button>
              ))}

              {/* Shooting Gun at Bottom */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <div className="w-12 h-16 bg-gray-700 rounded-t-lg relative">
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-2 h-8 bg-gray-800 rounded-full"></div>
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-4 bg-gray-600 rounded-b-lg"></div>
                </div>
              </div>
            </div>

            {/* Result Message */}
            {showResult && (
              <div className="text-center">
                {bubbles.find((b) => b.isShot)?.isCorrect ? (
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-2xl mb-2">🎯</div>
                    <p className="text-green-700 font-semibold">
                      Perfect Shot! +{getScoreForDifficulty(currentQ.difficulty)} points
                    </p>
                  </div>
                ) : (
                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <div className="text-2xl mb-2">💥</div>
                    <p className="text-red-700 font-semibold">Missed! The correct answer was: {currentQ.answer}</p>
                  </div>
                )}
              </div>
            )}

            {/* Timer Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full transition-all duration-1000"
                style={{ width: `${(timeLeft / (15 + currentLevel * 3)) * 100}%` }}
              ></div>
            </div>

            {/* Instructions */}
            <div className="text-center text-sm text-gray-600">
              <p>🎯 Click on the bubble with the correct answer to shoot it!</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
