"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, BarChart3, Users, Clock, BookOpen, Star, TrendingUp, Bell } from "lucide-react"

interface SubjectTopic {
  id: string
  name: string
  difficulty: "Easy" | "Medium" | "Hard"
  votes: number
}

interface Poll {
  id: string
  question: string
  options: { id: string; text: string; votes: number; topics?: SubjectTopic[] }[]
  totalVotes: number
  hasVoted: boolean
  endTime: Date
  category: string
  showTopics?: boolean
}

interface ClassPollingProps {
  onClose: () => void
}

export default function ClassPolling({ onClose }: ClassPollingProps) {
  const [polls] = useState<Poll[]>([
    {
      id: "1",
      question: "Which subject do you find the most difficult?",
      options: [
        {
          id: "math",
          text: "Mathematics",
          votes: 15,
          topics: [
            { id: "algebra", name: "Algebra", difficulty: "Medium", votes: 8 },
            { id: "geometry", name: "Geometry", difficulty: "Hard", votes: 12 },
            { id: "trigonometry", name: "Trigonometry", difficulty: "Hard", votes: 18 },
            { id: "calculus", name: "Calculus", difficulty: "Hard", votes: 7 },
          ],
        },
        {
          id: "science",
          text: "Science",
          votes: 10,
          topics: [
            { id: "physics", name: "Physics", difficulty: "Hard", votes: 15 },
            { id: "chemistry", name: "Chemistry", difficulty: "Medium", votes: 8 },
            { id: "biology", name: "Biology", difficulty: "Easy", votes: 5 },
          ],
        },
        {
          id: "english",
          text: "English",
          votes: 8,
          topics: [
            { id: "grammar", name: "Grammar", difficulty: "Medium", votes: 6 },
            { id: "literature", name: "Literature", difficulty: "Hard", votes: 9 },
            { id: "writing", name: "Essay Writing", difficulty: "Medium", votes: 4 },
          ],
        },
        {
          id: "social",
          text: "Social Studies",
          votes: 5,
          topics: [
            { id: "history", name: "History", difficulty: "Medium", votes: 3 },
            { id: "geography", name: "Geography", difficulty: "Easy", votes: 2 },
            { id: "civics", name: "Civics", difficulty: "Medium", votes: 4 },
          ],
        },
      ],
      totalVotes: 38,
      hasVoted: false,
      endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      category: "General",
      showTopics: false,
    },
  ])

  const [selectedPoll, setSelectedPoll] = useState<string | null>(null)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)
  const [showTopicsFor, setShowTopicsFor] = useState<string | null>(null)
  const [showResults, setShowResults] = useState(false)

  const handleSubjectSelect = (pollId: string, optionId: string) => {
    setSelectedPoll(pollId)
    setSelectedOption(optionId)
    setShowTopicsFor(optionId)
  }

  const handleTopicSelect = (topicId: string) => {
    setSelectedTopic(topicId)
  }

  const handleVote = () => {
    if (selectedPoll && selectedOption && selectedTopic) {
      console.log(`[v0] Voted for topic ${selectedTopic} in subject ${selectedOption}`)
      setShowResults(true)
      // Reset selections after a delay
      setTimeout(() => {
        setSelectedPoll(null)
        setSelectedOption(null)
        setSelectedTopic(null)
        setShowTopicsFor(null)
      }, 3000)
    }
  }

  const getTimeRemaining = (endTime: Date) => {
    const now = new Date()
    const diff = endTime.getTime() - now.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

    if (days > 0) return `${days}d ${hours}h left`
    if (hours > 0) return `${hours}h left`
    return "Ending soon"
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-700 border-green-200"
      case "Medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200"
      case "Hard":
        return "bg-red-100 text-red-700 border-red-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[85vh] overflow-y-auto bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 shadow-2xl border-0">
        <CardHeader className="flex-row items-center justify-between pb-4 border-b border-gray-200/50 bg-white/80 backdrop-blur-sm">
          <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-xl">Class Polling</div>
              <div className="text-sm font-normal text-gray-600">Help us improve your learning experience</div>
            </div>
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-red-50 hover:text-red-600">
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>

        <CardContent className="p-8 space-y-8">
          {polls.map((poll) => (
            <Card key={poll.id} className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge
                        variant="outline"
                        className="text-sm px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0"
                      >
                        {poll.category}
                      </Badge>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        {getTimeRemaining(poll.endTime)}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{poll.question}</h3>
                    <p className="text-gray-600">
                      Select a subject, then choose the specific topic you find most challenging.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-lg font-semibold text-gray-700 bg-gray-100 px-3 py-2 rounded-lg">
                    <Users className="w-5 h-5" />
                    {poll.totalVotes}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                {!showResults ? (
                  <div className="space-y-6">
                    {/* Subject Selection */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {poll.options.map((option) => {
                        const percentage = poll.totalVotes > 0 ? (option.votes / poll.totalVotes) * 100 : 0
                        const isSelected = selectedOption === option.id

                        return (
                          <Button
                            key={option.id}
                            variant={isSelected ? "default" : "outline"}
                            onClick={() => handleSubjectSelect(poll.id, option.id)}
                            className={`h-auto p-6 justify-start text-left transition-all duration-300 ${
                              isSelected
                                ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-105"
                                : "hover:shadow-md hover:scale-102 bg-white/80"
                            }`}
                          >
                            <div className="w-full">
                              <div className="flex items-center gap-3 mb-2">
                                <BookOpen className="w-5 h-5" />
                                <span className="font-semibold text-lg">{option.text}</span>
                              </div>
                              <div className="text-sm opacity-80">
                                {option.votes} students find this challenging ({percentage.toFixed(1)}%)
                              </div>
                            </div>
                          </Button>
                        )
                      })}
                    </div>

                    {/* Topic Selection */}
                    {showTopicsFor && (
                      <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
                        <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                          <Star className="w-5 h-5 text-yellow-500" />
                          Which {poll.options.find((o) => o.id === showTopicsFor)?.text} topic do you find most
                          difficult?
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {poll.options
                            .find((o) => o.id === showTopicsFor)
                            ?.topics?.map((topic) => (
                              <Button
                                key={topic.id}
                                variant={selectedTopic === topic.id ? "default" : "outline"}
                                onClick={() => handleTopicSelect(topic.id)}
                                className={`h-auto p-4 justify-start text-left transition-all duration-200 ${
                                  selectedTopic === topic.id
                                    ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-md"
                                    : "bg-white hover:shadow-sm"
                                }`}
                              >
                                <div className="w-full">
                                  <div className="font-medium mb-2">{topic.name}</div>
                                  <div className="flex items-center justify-between">
                                    <Badge className={`text-xs px-2 py-1 ${getDifficultyColor(topic.difficulty)}`}>
                                      {topic.difficulty}
                                    </Badge>
                                    <span className="text-xs opacity-70">{topic.votes} votes</span>
                                  </div>
                                </div>
                              </Button>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* Submit Button */}
                    {selectedTopic && (
                      <div className="flex justify-center pt-4">
                        <Button
                          onClick={handleVote}
                          size="lg"
                          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          Submit Your Vote
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Results display with revision notification */
                  <div className="space-y-6">
                    <div className="text-center p-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                      <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <TrendingUp className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">Vote Submitted Successfully!</h3>
                      <p className="text-gray-600 mb-4">Thank you for helping us understand your learning needs.</p>

                      <div className="bg-white p-4 rounded-lg border border-green-200 max-w-md mx-auto">
                        <p className="text-sm text-gray-700 mb-2">
                          <strong>Most voted topic:</strong> Trigonometry (Mathematics)
                        </p>
                        <div className="flex items-center justify-center gap-2 text-blue-600 font-medium">
                          <Bell className="w-4 h-4" />
                          Revision session scheduled for tomorrow!
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
