"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import {
  Star,
  Trophy,
  Zap,
  Target,
  Award,
  Volume2,
  VolumeX,
  RotateCcw,
  ChevronRight,
  Sparkles,
  Crown,
  Medal,
  X,
} from "lucide-react"

interface Question {
  id: string
  title: string
  scenario: string
  question: string
  answer: string | number
  unit?: string
  hint: string
  artifact: string
  explanation: string
}

interface PlayerStats {
  xp: number
  artifacts: string[]
  correctAnswers: number
  totalQuestions: number
  currentStreak: number
}

interface Achievement {
  id: string
  title: string
  description: string
  rarity: "common" | "rare" | "legendary"
  unlocked: boolean
}

interface TimeTravelClassroomProps {
  isOpen: boolean
  onClose: () => void
}

const mughalQuestions: Question[] = [
  {
    id: "m1",
    title: "The Siege Cannon",
    scenario:
      "You're an engineer in Akbar's army during the siege of Chittor Fort (1567). The cannon must fire projectiles over the fort walls.",
    question: "If a cannon fires at 45° with initial velocity 50 m/s, what's the maximum range? (g = 10 m/s²)",
    answer: 250,
    unit: "meters",
    hint: "Range = v²sin(2θ)/g. At 45°, sin(90°) = 1",
    artifact: "Akbar's Royal Cannon",
    explanation:
      "The maximum range formula gives us 50²×1/10 = 250 meters. This knowledge helped Mughal engineers position their artillery effectively.",
  },
  {
    id: "m2",
    title: "The Persian Cipher",
    scenario:
      "You've intercepted a coded message from Shah Jahan's court. The Persian script uses a simple letter shift cipher.",
    question: "If 'SHAH' becomes 'VKDK' (each letter shifted by 3), what does 'PXJKDO' decode to?",
    answer: "MUGHAL",
    hint: "Shift each letter back by 3 positions in the alphabet",
    artifact: "Royal Seal of Shah Jahan",
    explanation: "P→M, X→U, J→G, K→H, D→A, O→L spells MUGHAL. Such ciphers protected royal communications.",
  },
  {
    id: "m3",
    title: "The Red Fort Geometry",
    scenario:
      "You're designing the octagonal layout of the Red Fort's Diwan-i-Khas. Each wall must be precisely calculated.",
    question: "In a regular octagon with side length 20 meters, what's the interior angle of each corner?",
    answer: 135,
    unit: "degrees",
    hint: "Interior angle = (n-2)×180°/n, where n = 8",
    artifact: "Architect's Golden Compass",
    explanation:
      "Each interior angle = (8-2)×180°/8 = 135°. This precision made Mughal architecture geometrically perfect.",
  },
]

const wwiiQuestions: Question[] = [
  {
    id: "w1",
    title: "The Enigma Code",
    scenario:
      "You're a codebreaker at Bletchley Park. An intercepted German message uses a Caesar cipher as backup encryption.",
    question: "If 'DWWDFN' means 'ATTACK' (shifted by 3), what does 'UHWUHDW' mean?",
    answer: "RETREAT",
    hint: "Each letter is shifted forward by 3 positions",
    artifact: "Enigma Machine Rotor",
    explanation:
      "R→U, E→H, T→W, R→U, E→H, A→D, T→W spells RETREAT when decoded. Breaking such codes saved countless lives.",
  },
  {
    id: "w2",
    title: "The Fuel Calculation",
    scenario:
      "You're planning a B-17 bombing mission over Germany. Fuel efficiency is critical for the 1,200-mile round trip.",
    question: "If the B-17 consumes 200 gallons per hour at 180 mph, how many gallons needed for the mission?",
    answer: 1334,
    unit: "gallons",
    hint: "Time = Distance/Speed, then multiply by consumption rate",
    artifact: "Navigator's Flight Computer",
    explanation:
      "1200 miles ÷ 180 mph = 6.67 hours. 6.67 × 200 = 1,334 gallons. Precise calculations meant mission success.",
  },
  {
    id: "w3",
    title: "The Bridge Engineering",
    scenario: "You're calculating the angle for explosive charges to destroy a strategic bridge in occupied France.",
    question: "If a bridge cable makes a 30° angle with horizontal and is 100m long, what's the vertical height?",
    answer: 50,
    unit: "meters",
    hint: "Use trigonometry: height = length × sin(angle)",
    artifact: "Resistance Radio Transmitter",
    explanation:
      "Height = 100 × sin(30°) = 100 × 0.5 = 50 meters. Such calculations were vital for sabotage operations.",
  },
]

export default function TimeTravelClassroom({ isOpen, onClose }: TimeTravelClassroomProps) {
  const [gameState, setGameState] = useState<"portal" | "mughal" | "wwii" | "complete">("portal")
  const [playerStats, setPlayerStats] = useState<PlayerStats>({
    xp: 0,
    artifacts: [],
    correctAnswers: 0,
    totalQuestions: 0,
    currentStreak: 0,
  })
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswer, setUserAnswer] = useState("")
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes per era
  const [showHint, setShowHint] = useState(false)
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: "first",
      title: "First Steps",
      description: "Answer your first question correctly",
      rarity: "common",
      unlocked: false,
    },
    {
      id: "perfect",
      title: "Perfect Era",
      description: "Complete an era with 100% accuracy",
      rarity: "rare",
      unlocked: false,
    },
    { id: "collector", title: "Artifact Hunter", description: "Collect 3 artifacts", rarity: "rare", unlocked: false },
    {
      id: "master",
      title: "Time Master",
      description: "Complete both eras perfectly",
      rarity: "legendary",
      unlocked: false,
    },
  ])

  const currentQuestions = gameState === "mughal" ? mughalQuestions : wwiiQuestions
  const currentQuestion = currentQuestions[currentQuestionIndex]

  useEffect(() => {
    if (gameState !== "portal" && gameState !== "complete" && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [gameState, timeLeft])

  const playSound = (type: "correct" | "incorrect" | "portal" | "artifact") => {
    if (!soundEnabled) return
    // Sound effects would be implemented here
    console.log(`[v0] Playing ${type} sound effect`)
  }

  const updateStats = (correct: boolean) => {
    setPlayerStats((prev) => ({
      ...prev,
      totalQuestions: prev.totalQuestions + 1,
      correctAnswers: correct ? prev.correctAnswers + 1 : prev.correctAnswers,
      currentStreak: correct ? prev.currentStreak + 1 : 0,
      xp: prev.xp + (correct ? 100 + prev.currentStreak * 10 : 25),
      artifacts: correct ? [...prev.artifacts, currentQuestion.artifact] : prev.artifacts,
    }))

    // Check achievements
    if (correct && playerStats.correctAnswers === 0) {
      unlockAchievement("first")
    }
    if (playerStats.artifacts.length >= 2) {
      unlockAchievement("collector")
    }
  }

  const unlockAchievement = (id: string) => {
    setAchievements((prev) =>
      prev.map((achievement) => (achievement.id === id ? { ...achievement, unlocked: true } : achievement)),
    )
  }

  const handleSubmitAnswer = () => {
    const correct = userAnswer.toString().toLowerCase() === currentQuestion.answer.toString().toLowerCase()
    setIsCorrect(correct)
    setShowResult(true)
    updateStats(correct)
    playSound(correct ? "correct" : "incorrect")
    if (correct) playSound("artifact")
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
      setUserAnswer("")
      setShowResult(false)
      setShowHint(false)
    } else {
      // Era complete
      if (gameState === "mughal") {
        setGameState("portal")
      } else {
        setGameState("complete")
      }
      setCurrentQuestionIndex(0)
      setUserAnswer("")
      setShowResult(false)
      setShowHint(false)
    }
  }

  const selectEra = (era: "mughal" | "wwii") => {
    setGameState(era)
    setTimeLeft(300)
    setCurrentQuestionIndex(0)
    playSound("portal")
  }

  const resetGame = () => {
    setGameState("portal")
    setPlayerStats({ xp: 0, artifacts: [], correctAnswers: 0, totalQuestions: 0, currentStreak: 0 })
    setCurrentQuestionIndex(0)
    setUserAnswer("")
    setShowResult(false)
    setTimeLeft(300)
    setAchievements((prev) => prev.map((a) => ({ ...a, unlocked: false })))
  }

  const getGrade = () => {
    const accuracy =
      playerStats.totalQuestions > 0 ? (playerStats.correctAnswers / playerStats.totalQuestions) * 100 : 0
    if (accuracy >= 90) return { grade: "S", title: "Master Time Traveler", color: "text-yellow-500" }
    if (accuracy >= 80) return { grade: "A", title: "Skilled Historian", color: "text-blue-500" }
    if (accuracy >= 70) return { grade: "B", title: "Time Explorer", color: "text-green-500" }
    return { grade: "C", title: "Novice Traveler", color: "text-gray-500" }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white border-0 shadow-2xl">
        {/* Header */}
        <CardHeader className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm"></div>
          <div className="relative flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl font-bold flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-yellow-400" />
                Time Travel Classroom
              </CardTitle>
              <p className="text-blue-200 mt-1">Journey through history and solve challenges</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="text-white hover:bg-white/10"
              >
                {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/10">
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {/* Portal Selection */}
          {gameState === "portal" && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Choose Your Historical Era</h2>
                <p className="text-blue-200">Step through the time portal and begin your adventure</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Mughal Era */}
                <Card
                  className="bg-gradient-to-br from-amber-800 to-red-900 border-amber-400/30 hover:border-amber-400/60 transition-all duration-300 cursor-pointer transform hover:scale-105"
                  onClick={() => selectEra("mughal")}
                >
                  <CardContent className="p-6 text-center">
                    <Crown className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-yellow-100 mb-2">Mughal Empire</h3>
                    <p className="text-amber-200 mb-4">1526-1857 CE</p>
                    <p className="text-amber-100 text-sm mb-4">
                      Experience the grandeur of Akbar, Shah Jahan, and the architectural marvels of the Mughal dynasty.
                    </p>

                    <div className="space-y-2 text-left">
                      <p className="text-xs text-amber-200 font-semibold">CHALLENGES:</p>
                      <ul className="text-xs text-amber-100 space-y-1">
                        <li>• Siege warfare calculations</li>
                        <li>• Persian cipher decoding</li>
                        <li>• Architectural geometry</li>
                      </ul>

                      <p className="text-xs text-amber-200 font-semibold mt-3">REWARDS:</p>
                      <ul className="text-xs text-amber-100 space-y-1">
                        <li>• Royal artifacts</li>
                        <li>• 300+ XP potential</li>
                        <li>• Historical insights</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                {/* WWII Era */}
                <Card
                  className="bg-gradient-to-br from-slate-800 to-blue-900 border-blue-400/30 hover:border-blue-400/60 transition-all duration-300 cursor-pointer transform hover:scale-105"
                  onClick={() => selectEra("wwii")}
                >
                  <CardContent className="p-6 text-center">
                    <Medal className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-blue-100 mb-2">World War II</h3>
                    <p className="text-blue-200 mb-4">1939-1945 CE</p>
                    <p className="text-blue-100 text-sm mb-4">
                      Join the codebreakers, engineers, and strategists who changed the course of history.
                    </p>

                    <div className="space-y-2 text-left">
                      <p className="text-xs text-blue-200 font-semibold">CHALLENGES:</p>
                      <ul className="text-xs text-blue-100 space-y-1">
                        <li>• Enigma code breaking</li>
                        <li>• Military logistics</li>
                        <li>• Engineering calculations</li>
                      </ul>

                      <p className="text-xs text-blue-200 font-semibold mt-3">REWARDS:</p>
                      <ul className="text-xs text-blue-100 space-y-1">
                        <li>• War artifacts</li>
                        <li>• 300+ XP potential</li>
                        <li>• Strategic knowledge</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Game Play */}
          {(gameState === "mughal" || gameState === "wwii") && (
            <div className="space-y-6">
              {/* Stats Bar */}
              <div className="flex items-center justify-between bg-black/30 rounded-lg p-4">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    <span className="font-bold">{playerStats.xp} XP</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-green-400" />
                    <span>
                      {playerStats.correctAnswers}/{playerStats.totalQuestions}
                    </span>
                  </div>
                  {playerStats.currentStreak > 1 && (
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-orange-400" />
                      <span>{playerStats.currentStreak} streak</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-purple-400" />
                    <span>{playerStats.artifacts.length} artifacts</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-300">Time Left</p>
                    <p className="font-bold text-lg">
                      {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
                    </p>
                  </div>
                  <Progress value={((300 - timeLeft) / 300) * 100} className="w-24" />
                </div>
              </div>

              {/* Question */}
              {!showResult && (
                <Card className="bg-black/40 border-white/20">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl text-white">{currentQuestion.title}</CardTitle>
                      <Badge variant="secondary">
                        Question {currentQuestionIndex + 1} of {currentQuestions.length}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-blue-900/30 p-4 rounded-lg border border-blue-400/30">
                      <p className="text-blue-100 leading-relaxed">{currentQuestion.scenario}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-white mb-3">{currentQuestion.question}</h4>
                      <div className="flex gap-3">
                        <Input
                          value={userAnswer}
                          onChange={(e) => setUserAnswer(e.target.value)}
                          placeholder="Enter your answer..."
                          className="bg-white/10 border-white/30 text-white placeholder:text-gray-400"
                        />
                        {currentQuestion.unit && (
                          <Badge variant="outline" className="px-3 py-2 text-white border-white/30">
                            {currentQuestion.unit}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowHint(!showHint)}
                        className="text-yellow-400 border-yellow-400/50 hover:bg-yellow-400/10"
                      >
                        {showHint ? "Hide Hint" : "Show Hint"}
                      </Button>

                      <Button
                        onClick={handleSubmitAnswer}
                        disabled={!userAnswer.trim()}
                        className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                      >
                        Submit Answer
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>

                    {showHint && (
                      <div className="bg-yellow-900/30 p-3 rounded-lg border border-yellow-400/30">
                        <p className="text-yellow-100 text-sm">💡 {currentQuestion.hint}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Result */}
              {showResult && (
                <Card
                  className={`${isCorrect ? "bg-green-900/40 border-green-400/50" : "bg-red-900/40 border-red-400/50"}`}
                >
                  <CardContent className="p-6 text-center">
                    <div className="mb-4">
                      {isCorrect ? (
                        <div className="text-green-400">
                          <Trophy className="w-16 h-16 mx-auto mb-2" />
                          <h3 className="text-2xl font-bold">Excellent!</h3>
                          <p>You've earned the {currentQuestion.artifact}!</p>
                        </div>
                      ) : (
                        <div className="text-red-400">
                          <X className="w-16 h-16 mx-auto mb-2" />
                          <h3 className="text-2xl font-bold">Not Quite Right</h3>
                          <p>
                            The correct answer was: {currentQuestion.answer} {currentQuestion.unit}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="bg-black/30 p-4 rounded-lg mb-4">
                      <p className="text-gray-200 leading-relaxed">{currentQuestion.explanation}</p>
                    </div>

                    <Button onClick={handleNextQuestion} className="bg-gradient-to-r from-purple-500 to-pink-500">
                      {currentQuestionIndex < currentQuestions.length - 1 ? "Next Challenge" : "Complete Era"}
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Final Report */}
          {gameState === "complete" && (
            <div className="space-y-6 text-center">
              <div className="mb-8">
                <Trophy className="w-20 h-20 text-yellow-400 mx-auto mb-4" />
                <h2 className="text-3xl font-bold mb-2">Journey Complete!</h2>
                <p className="text-blue-200">You've mastered the art of time travel</p>
              </div>

              <Card className="bg-black/40 border-white/20">
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-xl font-bold mb-4">Final Stats</h3>
                      <div className="space-y-3 text-left">
                        <div className="flex justify-between">
                          <span>Total XP:</span>
                          <span className="font-bold text-yellow-400">{playerStats.xp}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Correct Answers:</span>
                          <span className="font-bold text-green-400">
                            {playerStats.correctAnswers}/{playerStats.totalQuestions}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Accuracy:</span>
                          <span className="font-bold text-blue-400">
                            {playerStats.totalQuestions > 0
                              ? Math.round((playerStats.correctAnswers / playerStats.totalQuestions) * 100)
                              : 0}
                            %
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Artifacts Collected:</span>
                          <span className="font-bold text-purple-400">{playerStats.artifacts.length}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold mb-4">Your Grade</h3>
                      <div className="text-center">
                        <div className={`text-6xl font-bold mb-2 ${getGrade().color}`}>{getGrade().grade}</div>
                        <p className="text-lg font-semibold">{getGrade().title}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-white/20">
                    <h3 className="text-xl font-bold mb-4">Achievements Unlocked</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {achievements
                        .filter((a) => a.unlocked)
                        .map((achievement) => (
                          <Badge
                            key={achievement.id}
                            className={`p-2 ${
                              achievement.rarity === "legendary"
                                ? "bg-gradient-to-r from-yellow-400 to-orange-500"
                                : achievement.rarity === "rare"
                                  ? "bg-gradient-to-r from-purple-500 to-blue-500"
                                  : "bg-gradient-to-r from-green-500 to-teal-500"
                            }`}
                          >
                            <div className="text-center">
                              <p className="font-bold text-xs">{achievement.title}</p>
                              <p className="text-xs opacity-90">{achievement.description}</p>
                            </div>
                          </Badge>
                        ))}
                    </div>
                  </div>

                  <Button
                    onClick={resetGame}
                    className="mt-6 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Start New Journey
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
