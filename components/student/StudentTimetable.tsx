"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Calendar,
  Clock,
  User,
  BookOpen,
  TestTube,
  Vote,
  Star,
  CheckCircle,
  XCircle,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

interface TimetableSession {
  id: string
  time: string
  subject: string
  type: "class" | "test" | "buffer"
  teacher: string
  topic: string
  color: string
  duration: number
  quizAttempted: boolean
  quizScore?: number
  quizAttempts: number
  isTestReady?: boolean
}

interface StudentTimetableProps {
  isOpen: boolean
  onClose: () => void
}

const subjectColors = {
  Physics: "bg-blue-500",
  Chemistry: "bg-orange-500",
  Biology: "bg-green-500",
  Mathematics: "bg-red-500",
  Hindi: "bg-purple-500",
  English: "bg-yellow-500",
  Geography: "bg-teal-500",
  "History & Civics": "bg-amber-700",
  Arts: "bg-pink-500",
  "Computer Applications": "bg-gray-500",
}

export default function StudentTimetable({ isOpen, onClose }: StudentTimetableProps) {
  const [currentWeek, setCurrentWeek] = useState(0)
  const [selectedDay, setSelectedDay] = useState(0)
  const [showQuiz, setShowQuiz] = useState<string | null>(null)
  const [showPoll, setShowPoll] = useState<string | null>(null)
  const [quizCooldown, setQuizCooldown] = useState<Record<string, number>>({})

  // Sample timetable data - changes weekly
  const weeklyTimetables = [
    {
      week: "Week 1 - Nov 13-17",
      days: [
        {
          day: "Monday",
          date: "Nov 13",
          sessions: [
            {
              id: "m1",
              time: "8:30-9:15",
              subject: "Physics",
              type: "class",
              teacher: "Dr. Sharma",
              topic: "Projectile Motion",
              color: "bg-blue-500",
              duration: 45,
              quizAttempted: true,
              quizScore: 4,
              quizAttempts: 1,
            },
            {
              id: "m2",
              time: "9:15-10:00",
              subject: "Chemistry",
              type: "test",
              teacher: "Ms. Patel",
              topic: "Organic Chemistry Test",
              color: "bg-orange-500",
              duration: 45,
              quizAttempted: false,
              quizAttempts: 0,
              isTestReady: true,
            },
            {
              id: "m3",
              time: "10:00-10:30",
              subject: "Break",
              type: "buffer",
              teacher: "",
              topic: "Lunch Break",
              color: "bg-gray-300",
              duration: 30,
              quizAttempted: false,
              quizAttempts: 0,
            },
            {
              id: "m4",
              time: "10:30-11:05",
              subject: "Mathematics",
              type: "class",
              teacher: "Mr. Kumar",
              topic: "Trigonometry",
              color: "bg-red-500",
              duration: 35,
              quizAttempted: false,
              quizAttempts: 0,
            },
            {
              id: "m5",
              time: "11:05-11:40",
              subject: "English",
              type: "class",
              teacher: "Ms. Singh",
              topic: "Grammar & Composition",
              color: "bg-yellow-500",
              duration: 35,
              quizAttempted: false,
              quizAttempts: 0,
            },
            {
              id: "m6",
              time: "11:40-12:25",
              subject: "Buffer Session",
              type: "buffer",
              teacher: "Choice",
              topic: "Music/Dance/Extra Activities",
              color: "bg-purple-300",
              duration: 45,
              quizAttempted: false,
              quizAttempts: 0,
            },
          ],
        },
      ],
    },
  ]

  const currentTimetable = weeklyTimetables[currentWeek]
  const currentDay = currentTimetable.days[selectedDay]

  const handleQuizAttempt = (sessionId: string) => {
    if (quizCooldown[sessionId] && quizCooldown[sessionId] > Date.now()) {
      return
    }
    setShowQuiz(sessionId)
  }

  const handleQuizComplete = (sessionId: string, score: number) => {
    setShowQuiz(null)
    if (score < 3) {
      // Set 15-minute cooldown
      setQuizCooldown((prev) => ({
        ...prev,
        [sessionId]: Date.now() + 15 * 60 * 1000,
      }))
    }
  }

  const handleTestPoll = (sessionId: string) => {
    setShowPoll(sessionId)
  }

  const getCooldownTime = (sessionId: string) => {
    const cooldownEnd = quizCooldown[sessionId]
    if (!cooldownEnd || cooldownEnd <= Date.now()) return 0
    return Math.ceil((cooldownEnd - Date.now()) / 1000 / 60)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-white shadow-2xl">
        <CardHeader className="flex-row items-center justify-between pb-4 border-b bg-gradient-to-r from-blue-50 to-purple-50">
          <div>
            <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <Calendar className="w-7 h-7 text-blue-600" />
              Student Timetable
            </CardTitle>
            <p className="text-gray-600 mt-1">{currentTimetable.week}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>

        <CardContent className="p-6">
          {/* Week Navigation */}
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentWeek(Math.max(0, currentWeek - 1))}
              disabled={currentWeek === 0}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous Week
            </Button>
            <h3 className="font-semibold text-lg">{currentTimetable.week}</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentWeek(Math.min(weeklyTimetables.length - 1, currentWeek + 1))}
              disabled={currentWeek === weeklyTimetables.length - 1}
            >
              Next Week
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          {/* Day Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto">
            {currentTimetable.days.map((day, index) => (
              <Button
                key={index}
                variant={selectedDay === index ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedDay(index)}
                className={`min-w-fit ${selectedDay === index ? "bg-gradient-to-r from-blue-500 to-purple-600" : ""}`}
              >
                {day.day}
                <br />
                <span className="text-xs opacity-75">{day.date}</span>
              </Button>
            ))}
          </div>

          {/* Timetable Sessions */}
          <div className="space-y-4">
            {currentDay.sessions.map((session) => (
              <Card
                key={session.id}
                className="border-l-4 hover:shadow-md transition-shadow duration-200"
                style={{ borderLeftColor: session.color.replace("bg-", "#") }}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <Clock className="w-5 h-5 text-gray-500 mx-auto mb-1" />
                        <p className="text-sm font-medium">{session.time}</p>
                        <p className="text-xs text-gray-500">{session.duration}min</p>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className={`${session.color} text-white`}>{session.subject}</Badge>
                          {session.type === "test" && (
                            <Badge variant="destructive">
                              <TestTube className="w-3 h-3 mr-1" />
                              Test
                            </Badge>
                          )}
                          {session.type === "buffer" && (
                            <Badge variant="secondary">
                              <Star className="w-3 h-3 mr-1" />
                              Choice Period
                            </Badge>
                          )}
                        </div>

                        <h4 className="font-semibold text-gray-800">{session.topic}</h4>
                        {session.teacher && (
                          <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                            <User className="w-3 h-3" />
                            {session.teacher}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                      {session.type === "test" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleTestPoll(session.id)}
                          className="text-blue-600 border-blue-200 hover:bg-blue-50"
                        >
                          <Vote className="w-4 h-4 mr-1" />
                          Poll Ready?
                        </Button>
                      )}

                      {session.type === "class" && (
                        <div className="flex items-center gap-2">
                          {session.quizAttempted ? (
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-5 h-5 text-green-500" />
                              <span className="text-sm font-medium text-green-600">
                                {session.quizScore}/5 ({session.quizAttempts} attempts)
                              </span>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => handleQuizAttempt(session.id)}
                              disabled={getCooldownTime(session.id) > 0}
                              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                            >
                              <BookOpen className="w-4 h-4 mr-1" />
                              {getCooldownTime(session.id) > 0 ? `Wait ${getCooldownTime(session.id)}min` : "Take Quiz"}
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quiz Modal */}
          {showQuiz && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
              <Card className="w-full max-w-2xl mx-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    Daily Quiz - 10 Minutes
                  </CardTitle>
                  <Progress value={60} className="w-full" />
                  <p className="text-sm text-gray-600">6:30 remaining</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Question 1 of 5</h4>
                      <p className="text-gray-700 mb-4">What is the acceleration due to gravity on Earth?</p>
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full justify-start bg-transparent">
                          A) 9.8 m/s²
                        </Button>
                        <Button variant="outline" className="w-full justify-start bg-transparent">
                          B) 10 m/s²
                        </Button>
                        <Button variant="outline" className="w-full justify-start bg-transparent">
                          C) 9.6 m/s²
                        </Button>
                        <Button variant="outline" className="w-full justify-start bg-transparent">
                          D) 8.9 m/s²
                        </Button>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <Button variant="outline" onClick={() => setShowQuiz(null)}>
                        Cancel
                      </Button>
                      <Button onClick={() => handleQuizComplete(showQuiz, 4)}>Submit Answer</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Test Poll Modal */}
          {showPoll && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
              <Card className="w-full max-w-md mx-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Vote className="w-5 h-5 text-blue-600" />
                    Test Readiness Poll
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">Are you ready for today's Chemistry test?</p>
                  <div className="space-y-3">
                    <Button className="w-full bg-green-500 hover:bg-green-600">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Yes, I'm Ready!
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      No, Need More Time
                    </Button>
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <Button variant="ghost" onClick={() => setShowPoll(null)} className="w-full">
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
