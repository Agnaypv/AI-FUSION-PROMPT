"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Heart, Trophy, RotateCcw, CheckCircle, Clock, Star, Award, Zap, Target, BookOpen } from "lucide-react"

interface CrosswordWord {
  word: string
  clue: string
  startRow: number
  startCol: number
  direction: "horizontal" | "vertical"
  found: boolean
  difficulty: "easy" | "medium" | "hard"
  grammarType: "tense" | "voice" | "speech" | "parts" | "mixed"
}

interface CrosswordGameProps {
  onClose: () => void
  onComplete: (score: number, xp: number, mistakes: any[]) => void
  studentLevel?: number
}

interface GameStats {
  totalGames: number
  bestScore: number
  averageTime: number
  xpEarned: number
  badges: string[]
}

interface Mistake {
  selectedWord: string
  correctAnswer: string
  clue: string
  explanation: string
}

export default function CrosswordGame({ onClose, onComplete, studentLevel = 1 }: CrosswordGameProps) {
  const [lives, setLives] = useState(3)
  const [score, setScore] = useState(0)
  const [xp, setXp] = useState(0)
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes
  const [selectedCells, setSelectedCells] = useState<{ row: number; col: number }[]>([])
  const [foundWords, setFoundWords] = useState<string[]>([])
  const [gameComplete, setGameComplete] = useState(false)
  const [isSelecting, setIsSelecting] = useState(false)
  const [startCell, setStartCell] = useState<{ row: number; col: number } | null>(null)
  const [mistakes, setMistakes] = useState<Mistake[]>([])
  const [showMistakeSummary, setShowMistakeSummary] = useState(false)
  const [currentStreak, setCurrentStreak] = useState(0)
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
    studentLevel <= 3 ? "easy" : studentLevel <= 6 ? "medium" : "hard",
  )

  const generatePuzzle = useCallback(() => {
    const grammarSets = {
      easy: {
        tense: [
          { word: "PAST", clue: "Yesterday I ___ to school", explanation: "Simple past tense" },
          { word: "PRESENT", clue: "I ___ go to school daily", explanation: "Present tense" },
          { word: "FUTURE", clue: "Tomorrow I ___ go", explanation: "Future tense" },
        ],
        parts: [
          { word: "NOUN", clue: "A person, place, or thing", explanation: "Names something" },
          { word: "VERB", clue: "An action word", explanation: "Shows action or state" },
          { word: "ADJECTIVE", clue: "Describes a noun", explanation: "Modifies nouns" },
        ],
        voice: [
          { word: "ACTIVE", clue: "Subject does the action", explanation: "Active voice structure" },
          { word: "PASSIVE", clue: "Subject receives action", explanation: "Passive voice structure" },
        ],
      },
      medium: {
        tense: [
          { word: "PERFECT", clue: "I have ___ my homework", explanation: "Present perfect tense" },
          { word: "CONTINUOUS", clue: "I am ___ now", explanation: "Present continuous tense" },
          { word: "CONDITIONAL", clue: "If I were you, I ___", explanation: "Conditional mood" },
        ],
        speech: [
          { word: "DIRECT", clue: "He said, 'I am happy'", explanation: "Direct speech quotes exactly" },
          { word: "INDIRECT", clue: "He said that he was happy", explanation: "Indirect speech reports" },
          { word: "REPORTED", clue: "She told me she ___ coming", explanation: "Reported speech" },
        ],
        parts: [
          { word: "PRONOUN", clue: "Replaces a noun", explanation: "Substitutes for nouns" },
          { word: "ADVERB", clue: "Modifies a verb", explanation: "Describes verbs, adjectives" },
          { word: "PREPOSITION", clue: "Shows relationship", explanation: "Links words in sentences" },
        ],
      },
      hard: {
        tense: [
          { word: "SUBJUNCTIVE", clue: "If I ___ you, I would go", explanation: "Subjunctive mood" },
          { word: "PLUPERFECT", clue: "I had ___ before you came", explanation: "Past perfect tense" },
          { word: "IMPERATIVE", clue: "Command form of verb", explanation: "Gives commands" },
        ],
        voice: [
          { word: "CAUSATIVE", clue: "I had my hair ___", explanation: "Causative construction" },
          { word: "REFLEXIVE", clue: "I hurt ___", explanation: "Action on oneself" },
        ],
        mixed: [
          { word: "GERUND", clue: "Verb acting as noun", explanation: "Verbal noun form" },
          { word: "PARTICIPLE", clue: "Verb form as adjective", explanation: "Verbal adjective" },
          { word: "INFINITIVE", clue: "To + base verb", explanation: "Base form with 'to'" },
        ],
      },
    }

    const currentSet = grammarSets[difficulty]
    const allWords: any[] = []

    // Mix different grammar types based on difficulty
    Object.entries(currentSet).forEach(([type, words]) => {
      words.forEach((wordData) => {
        allWords.push({
          ...wordData,
          grammarType: type,
          difficulty: difficulty,
        })
      })
    })

    // Randomly select 6-10 words based on difficulty
    const wordCount = difficulty === "easy" ? 6 : difficulty === "medium" ? 8 : 10
    const selectedWords = allWords.sort(() => Math.random() - 0.5).slice(0, wordCount)

    // Generate grid positions
    return selectedWords.map((wordData, index) => ({
      ...wordData,
      startRow: Math.floor(Math.random() * 8) + 1,
      startCol: Math.floor(Math.random() * 8) + 1,
      direction: Math.random() > 0.5 ? "horizontal" : "vertical",
      found: false,
    }))
  }, [difficulty])

  const [words, setWords] = useState<CrosswordWord[]>([])
  const [grid, setGrid] = useState<string[][]>([])

  useEffect(() => {
    const newWords = generatePuzzle()
    setWords(newWords)
    setGrid(createGrid(newWords))
    setTimeLeft(difficulty === "easy" ? 300 : difficulty === "medium" ? 240 : 180)
  }, [difficulty, generatePuzzle])

  useEffect(() => {
    if (timeLeft > 0 && !gameComplete && lives > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0) {
      handleGameEnd()
    }
  }, [timeLeft, gameComplete, lives])

  const createGrid = (puzzleWords: CrosswordWord[]) => {
    const gridSize = 12
    const newGrid = Array(gridSize)
      .fill(null)
      .map(() => Array(gridSize).fill(""))

    // Place words in grid
    puzzleWords.forEach((wordObj) => {
      const { word, startRow, startCol, direction } = wordObj
      for (let i = 0; i < word.length; i++) {
        if (direction === "horizontal" && startCol + i < gridSize) {
          newGrid[startRow][startCol + i] = word[i]
        } else if (direction === "vertical" && startRow + i < gridSize) {
          newGrid[startRow + i][startCol] = word[i]
        }
      }
    })

    // Fill empty cells with random letters
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        if (newGrid[row][col] === "") {
          newGrid[row][col] = letters[Math.floor(Math.random() * letters.length)]
        }
      }
    }

    return newGrid
  }

  const handleCellClick = (row: number, col: number) => {
    if (gameComplete || lives === 0 || timeLeft === 0) return

    if (!isSelecting) {
      setIsSelecting(true)
      setStartCell({ row, col })
      setSelectedCells([{ row, col }])
    } else {
      const selection = getSelectionPath(startCell!, { row, col })
      setSelectedCells(selection)
      checkWord(selection)
      setIsSelecting(false)
      setStartCell(null)
    }
  }

  const getSelectionPath = (start: { row: number; col: number }, end: { row: number; col: number }) => {
    const path: { row: number; col: number }[] = []

    if (start.row === end.row) {
      // Horizontal selection
      const minCol = Math.min(start.col, end.col)
      const maxCol = Math.max(start.col, end.col)
      for (let col = minCol; col <= maxCol; col++) {
        path.push({ row: start.row, col })
      }
    } else if (start.col === end.col) {
      // Vertical selection
      const minRow = Math.min(start.row, end.row)
      const maxRow = Math.max(start.row, end.row)
      for (let row = minRow; row <= maxRow; row++) {
        path.push({ row, col: start.col })
      }
    } else {
      // Diagonal selection
      const rowDiff = end.row - start.row
      const colDiff = end.col - start.col
      const steps = Math.max(Math.abs(rowDiff), Math.abs(colDiff))
      const rowStep = rowDiff === 0 ? 0 : rowDiff / Math.abs(rowDiff)
      const colStep = colDiff === 0 ? 0 : colDiff / Math.abs(colDiff)

      for (let i = 0; i <= steps; i++) {
        path.push({
          row: start.row + Math.round(i * rowStep),
          col: start.col + Math.round(i * colStep),
        })
      }
    }

    return path
  }

  const checkWord = (selection: { row: number; col: number }[]) => {
    const selectedWord = selection.map((cell) => grid[cell.row][cell.col]).join("")
    const reverseWord = selectedWord.split("").reverse().join("")

    const foundWord = words.find(
      (wordObj) =>
        (wordObj.word === selectedWord || wordObj.word === reverseWord) && !foundWords.includes(wordObj.word),
    )

    if (foundWord) {
      const basePoints = foundWord.word.length * 10
      const difficultyMultiplier = difficulty === "easy" ? 1 : difficulty === "medium" ? 1.5 : 2
      const timeBonus = Math.floor(timeLeft / 10)
      const streakBonus = currentStreak * 5
      const totalPoints = Math.floor((basePoints + timeBonus + streakBonus) * difficultyMultiplier)

      setFoundWords((prev) => [...prev, foundWord.word])
      setScore((prev) => prev + totalPoints)
      setXp((prev) => prev + Math.floor(totalPoints / 2))
      setCurrentStreak((prev) => prev + 1)

      // Check if game is complete
      if (foundWords.length + 1 === words.length) {
        handleGameEnd(true)
      }
    } else {
      const mistake: Mistake = {
        selectedWord,
        correctAnswer: "N/A",
        clue: "Selected word not in puzzle",
        explanation: "The selected letters don't form any of the target grammar words.",
      }
      setMistakes((prev) => [...prev, mistake])
      setLives((prev) => Math.max(0, prev - 1))
      setCurrentStreak(0)

      if (lives - 1 === 0) {
        handleGameEnd(false)
      }
    }

    setTimeout(() => setSelectedCells([]), 500)
  }

  const handleGameEnd = (completed = false) => {
    setGameComplete(true)

    let finalXP = xp
    if (completed) {
      const completionBonus = difficulty === "easy" ? 50 : difficulty === "medium" ? 100 : 150
      finalXP += completionBonus
      setXp(finalXP)
    }

    setTimeout(() => {
      if (mistakes.length > 0) {
        setShowMistakeSummary(true)
      } else {
        onComplete(score, finalXP, mistakes)
      }
    }, 1000)
  }

  const generateNewPuzzle = () => {
    const newWords = generatePuzzle()
    setWords(newWords)
    setGrid(createGrid(newWords))
    resetGame()
  }

  const resetGame = () => {
    setLives(3)
    setScore(0)
    setXp(0)
    setFoundWords([])
    setGameComplete(false)
    setSelectedCells([])
    setIsSelecting(false)
    setStartCell(null)
    setMistakes([])
    setShowMistakeSummary(false)
    setCurrentStreak(0)
    setTimeLeft(difficulty === "easy" ? 300 : difficulty === "medium" ? 240 : 180)
  }

  const isCellSelected = (row: number, col: number) => {
    return selectedCells.some((cell) => cell.row === row && cell.col === col)
  }

  const isCellInFoundWord = (row: number, col: number) => {
    return words.some((wordObj) => {
      if (!foundWords.includes(wordObj.word)) return false

      const { startRow, startCol, direction, word } = wordObj
      for (let i = 0; i < word.length; i++) {
        const cellRow = direction === "horizontal" ? startRow : startRow + i
        const cellCol = direction === "horizontal" ? startCol + i : startCol
        if (cellRow === row && cellCol === col) return true
      }
      return false
    })
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getTimeColor = () => {
    if (timeLeft > 60) return "text-green-600"
    if (timeLeft > 30) return "text-yellow-600"
    return "text-red-600"
  }

  if (showMistakeSummary) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden bg-white shadow-2xl">
          <CardHeader className="bg-gradient-to-r from-red-500 to-orange-500 text-white">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Mistake Summary & Learning
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {mistakes.map((mistake, index) => (
                <div key={index} className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-red-800">Selected: "{mistake.selectedWord}"</p>
                      <p className="text-sm text-gray-600 mt-1">{mistake.clue}</p>
                      <p className="text-sm text-blue-600 mt-2 font-medium">{mistake.explanation}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex gap-3">
              <Button onClick={() => onComplete(score, xp, mistakes)} className="flex-1">
                Continue
              </Button>
              <Button onClick={generateNewPuzzle} variant="outline">
                Try New Puzzle
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-6xl max-h-[95vh] overflow-hidden bg-white shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 text-white">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Target className="w-5 h-5" />
              Grammar Crossword - {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
              ×
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm mt-3">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              <span>Lives: {lives}</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              <span>Score: {score}</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              <span>XP: {xp}</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span>Streak: {currentStreak}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className={`w-4 h-4 ${getTimeColor()}`} />
              <span className={getTimeColor()}>{formatTime(timeLeft)}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>
                {foundWords.length}/{words.length}
              </span>
            </div>
          </div>

          <div className="mt-3">
            <Progress value={(foundWords.length / words.length) * 100} className="h-2 bg-white/20" />
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Crossword Grid */}
            <div className="xl:col-span-2">
              <div className="inline-block border-2 border-gray-300 rounded-lg overflow-hidden shadow-lg">
                {grid.map((row, rowIndex) => (
                  <div key={rowIndex} className="flex">
                    {row.map((letter, colIndex) => (
                      <button
                        key={`${rowIndex}-${colIndex}`}
                        onClick={() => handleCellClick(rowIndex, colIndex)}
                        className={`
                          w-8 h-8 border border-gray-200 text-xs font-bold
                          transition-all duration-200 hover:scale-105
                          ${
                            isCellSelected(rowIndex, colIndex)
                              ? "bg-blue-400 text-white shadow-md"
                              : isCellInFoundWord(rowIndex, colIndex)
                                ? "bg-green-200 text-green-800"
                                : "bg-white hover:bg-gray-100"
                          }
                        `}
                        disabled={gameComplete || lives === 0 || timeLeft === 0}
                      >
                        {letter}
                      </button>
                    ))}
                  </div>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap gap-3 justify-center">
                <Button onClick={resetGame} variant="outline" size="sm">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
                <Button onClick={generateNewPuzzle} variant="outline" size="sm">
                  <Zap className="w-4 h-4 mr-2" />
                  New Puzzle
                </Button>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as any)}
                  className="px-3 py-1 border rounded text-sm"
                  disabled={gameComplete || foundWords.length > 0}
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg text-gray-800">Grammar Clues</h3>
                <Badge variant="outline" className="text-xs">
                  {difficulty.toUpperCase()}
                </Badge>
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {words.map((wordObj, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border transition-all duration-300 ${
                      foundWords.includes(wordObj.word)
                        ? "bg-green-50 border-green-200 text-green-800 shadow-sm"
                        : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex gap-2">
                        <Badge
                          variant={foundWords.includes(wordObj.word) ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {wordObj.word.length} letters
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {wordObj.grammarType}
                        </Badge>
                      </div>
                      {foundWords.includes(wordObj.word) && <CheckCircle className="w-4 h-4 text-green-600" />}
                    </div>
                    <p className="text-sm font-medium">{wordObj.clue}</p>
                    {foundWords.includes(wordObj.word) && (
                      <div className="mt-2 text-xs">
                        <p className="text-green-600 font-medium">✓ {wordObj.word}</p>
                        <p className="text-gray-600">{wordObj.explanation}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {(gameComplete || lives === 0 || timeLeft === 0) && (
            <div className="mt-6 p-6 rounded-lg text-center">
              {gameComplete && foundWords.length === words.length ? (
                <div className="bg-green-50 border border-green-200 text-green-800">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Award className="w-8 h-8 text-yellow-500" />
                    <h3 className="font-bold text-xl">Perfect Score!</h3>
                  </div>
                  <p className="text-lg mb-2">All words found! 🎉</p>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="font-bold">Final Score</p>
                      <p>{score}</p>
                    </div>
                    <div>
                      <p className="font-bold">XP Earned</p>
                      <p>{xp}</p>
                    </div>
                    <div>
                      <p className="font-bold">Time Bonus</p>
                      <p>{Math.floor(timeLeft / 10)}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-red-50 border border-red-200 text-red-800">
                  <h3 className="font-bold text-lg mb-2">{timeLeft === 0 ? "Time's Up!" : "Game Over"}</h3>
                  <p>
                    Final Score: {score} | XP: {xp}
                  </p>
                  <p className="text-sm mt-2">
                    Found {foundWords.length}/{words.length} words
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
