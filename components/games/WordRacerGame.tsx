"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { X, Heart, Clock, Trophy, Zap } from "lucide-react"

interface Question {
  id: number
  question: string
  answer: string
  options: string[]
  difficulty: "easy" | "medium" | "hard"
}

interface WordRacerGameProps {
  onClose: () => void
}

export default function WordRacerGame({ onClose }: WordRacerGameProps) {
  const [currentLevel, setCurrentLevel] = useState(1)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [lives, setLives] = useState(3)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [gameState, setGameState] = useState<"playing" | "paused" | "gameOver" | "levelComplete">("playing")
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [correctAnswers, setCorrectAnswers] = useState(0)

  // Sample questions for different levels
  const questions: Question[] = [
    // Easy (1-15)
    {
      id: 1,
      question: "Ramesh ____ (play) with his dog every evening.",
      answer: "PLAYS",
      options: ["PLAYS", "PLAYED", "PLAYING", "PLAY"],
      difficulty: "easy",
    },
    {
      id: 2,
      question: "I always ____ (eat) an apple before school.",
      answer: "EAT",
      options: ["EAT", "EATING", "ATE", "EATS"],
      difficulty: "easy",
    },
    {
      id: 3,
      question: "Look! The clock ____ (tick) right now.",
      answer: "IS",
      options: ["IS", "WAS", "TICKING", "TICKS"],
      difficulty: "easy",
    },
    {
      id: 4,
      question: "We ____ (study) in class yesterday.",
      answer: "STUDIED",
      options: ["STUDY", "STUDIED", "STUDYING", "STUDIES"],
      difficulty: "easy",
    },
    {
      id: 5,
      question: "She ____ (go) to the market every Sunday.",
      answer: "GOES",
      options: ["GO", "GOES", "GOING", "WENT"],
      difficulty: "easy",
    },
    // Medium (16-35)
    {
      id: 16,
      question: "Tomorrow I ____ (travel) to Delhi.",
      answer: "WILL",
      options: ["WILL", "WOULD", "TRAVELED", "TRAVEL"],
      difficulty: "medium",
    },
    {
      id: 17,
      question: "She ____ (read) this book since morning.",
      answer: "HAS",
      options: ["HAS", "HAD", "HAVE", "READS"],
      difficulty: "medium",
    },
    {
      id: 18,
      question: "When I reached, they ____ (sing) loudly.",
      answer: "WERE",
      options: ["WERE", "WAS", "ARE", "SANG"],
      difficulty: "medium",
    },
    // Hard (36-50)
    {
      id: 36,
      question: "By 2030, humans ____ (colonize) Mars.",
      answer: "WILLHAVE",
      options: ["WILLHAVE", "WILL", "HAVE", "HAD"],
      difficulty: "hard",
    },
    {
      id: 37,
      question: "She ____ (practice) for 3 hours when the match starts.",
      answer: "WILLBE",
      options: ["WILLBE", "WILL", "WAS", "IS"],
      difficulty: "hard",
    },
  ]

  const currentQ = questions[currentQuestion]
  const totalQuestions = Math.min(10, questions.length) // 10 questions per level

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

  const handleAnswerSelect = (answer: string) => {
    if (showResult) return

    setSelectedAnswer(answer)
    setShowResult(true)

    const isCorrect = answer === currentQ.answer
    if (isCorrect) {
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
        return 15
      case "hard":
        return 25
      default:
        return 10
    }
  }

  const nextQuestion = () => {
    if (currentQuestion + 1 >= totalQuestions) {
      setGameState("levelComplete")
    } else {
      setCurrentQuestion((prev) => prev + 1)
      setTimeLeft(30 + currentLevel * 3) // Increase time with level
      setSelectedAnswer(null)
      setShowResult(false)
    }
  }

  const nextLevel = () => {
    setCurrentLevel((prev) => prev + 1)
    setCurrentQuestion(0)
    setLives(3)
    setTimeLeft(30 + currentLevel * 3)
    setSelectedAnswer(null)
    setShowResult(false)
    setGameState("playing")
    setCorrectAnswers(0)
  }

  const restartGame = () => {
    setCurrentLevel(1)
    setCurrentQuestion(0)
    setLives(3)
    setScore(0)
    setTimeLeft(30)
    setSelectedAnswer(null)
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
            <div className="text-6xl">💔</div>
            <div className="space-y-2">
              <p className="text-xl font-semibold text-gray-800">Final Score: {score}</p>
              <p className="text-gray-600">Level Reached: {currentLevel}</p>
              <p className="text-gray-600">Correct Answers: {correctAnswers}</p>
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
            <CardTitle className="text-2xl font-bold">Level Complete! 🎉</CardTitle>
          </CardHeader>
          <CardContent className="p-6 text-center space-y-4">
            <div className="text-6xl">🏆</div>
            <div className="space-y-2">
              <p className="text-xl font-semibold text-gray-800">Level {currentLevel} Completed!</p>
              <p className="text-gray-600">Score: {score}</p>
              <p className="text-gray-600">Accuracy: {Math.round((correctAnswers / totalQuestions) * 100)}%</p>
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
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden bg-white shadow-2xl">
        {/* Header */}
        <CardHeader className="flex-row items-center justify-between pb-3 border-b bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Zap className="w-6 h-6" />
            Word Racer - Grammar Quest
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        {/* Game Stats */}
        <div className="p-4 bg-gray-50 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge className="bg-purple-100 text-purple-700 border-purple-200">Level {currentLevel}</Badge>
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

        {/* Question */}
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="text-center">
              <Badge className={`${getDifficultyColor(currentQ.difficulty)} mb-3`}>
                {currentQ.difficulty.toUpperCase()}
              </Badge>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Fill in the blank:</h2>
              <p className="text-xl text-gray-700 leading-relaxed">{currentQ.question}</p>
            </div>

            {/* Answer Options */}
            <div className="grid grid-cols-2 gap-4">
              {currentQ.options.map((option) => {
                let buttonClass = "h-16 text-lg font-semibold transition-all duration-300 "

                if (showResult) {
                  if (option === currentQ.answer) {
                    buttonClass += "bg-green-500 text-white border-green-500 hover:bg-green-500"
                  } else if (option === selectedAnswer && option !== currentQ.answer) {
                    buttonClass += "bg-red-500 text-white border-red-500 hover:bg-red-500"
                  } else {
                    buttonClass += "bg-gray-100 text-gray-500 border-gray-200"
                  }
                } else {
                  buttonClass +=
                    "bg-white border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50 text-gray-800"
                }

                return (
                  <Button
                    key={option}
                    onClick={() => handleAnswerSelect(option)}
                    disabled={showResult}
                    className={buttonClass}
                  >
                    {option}
                  </Button>
                )
              })}
            </div>

            {/* Result Message */}
            {showResult && (
              <div className="text-center">
                {selectedAnswer === currentQ.answer ? (
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-2xl mb-2">🎉</div>
                    <p className="text-green-700 font-semibold">
                      Correct! +{getScoreForDifficulty(currentQ.difficulty)} points
                    </p>
                  </div>
                ) : (
                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <div className="text-2xl mb-2">💔</div>
                    <p className="text-red-700 font-semibold">Wrong answer! The correct answer is: {currentQ.answer}</p>
                  </div>
                )}
              </div>
            )}

            {/* Timer Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${(timeLeft / (30 + currentLevel * 3)) * 100}%` }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
