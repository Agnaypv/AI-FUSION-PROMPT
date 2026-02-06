"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Plus, AlertCircle, Target, Zap } from "lucide-react"

interface StudySession {
  id: string
  day: string
  date: string
  time: string
  course: string
  topic: string
  duration: number
  difficulty: "easy" | "medium" | "hard"
  completed: boolean
}

interface DaySchedule {
  day: string
  date: string
  sessions: StudySession[]
}

const getDayColor = (day: string) => {
  const colors: Record<string, string> = {
    Monday: "from-blue-400 to-blue-600",
    Tuesday: "from-purple-400 to-purple-600",
    Wednesday: "from-pink-400 to-pink-600",
    Thursday: "from-green-400 to-green-600",
    Friday: "from-yellow-400 to-yellow-600",
    Saturday: "from-indigo-400 to-indigo-600",
    Sunday: "from-red-400 to-red-600",
  }
  return colors[day] || "from-slate-400 to-slate-600"
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "easy":
      return "bg-green-100 text-green-800"
    case "medium":
      return "bg-yellow-100 text-yellow-800"
    case "hard":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function StudyPlanner() {
  const [selectedDay, setSelectedDay] = useState<string | null>("Monday")

  const weekSchedule: DaySchedule[] = [
    {
      day: "Monday",
      date: "Mar 10",
      sessions: [
        {
          id: "1",
          day: "Monday",
          date: "Mar 10",
          time: "09:00 AM",
          course: "React Fundamentals",
          topic: "Components & Props",
          duration: 60,
          difficulty: "medium",
          completed: true,
        },
        {
          id: "2",
          day: "Monday",
          date: "Mar 10",
          time: "02:00 PM",
          course: "UI/UX Design",
          topic: "Color Theory",
          duration: 45,
          difficulty: "easy",
          completed: true,
        },
        {
          id: "3",
          day: "Monday",
          date: "Mar 10",
          time: "04:30 PM",
          course: "JavaScript Advanced",
          topic: "Async/Await",
          duration: 90,
          difficulty: "hard",
          completed: false,
        },
      ],
    },
    {
      day: "Tuesday",
      date: "Mar 11",
      sessions: [
        {
          id: "4",
          day: "Tuesday",
          date: "Mar 11",
          time: "10:00 AM",
          course: "React Fundamentals",
          topic: "Hooks Deep Dive",
          duration: 75,
          difficulty: "hard",
          completed: false,
        },
        {
          id: "5",
          day: "Tuesday",
          date: "Mar 11",
          time: "03:00 PM",
          course: "Python for Data Science",
          topic: "Pandas Basics",
          duration: 60,
          difficulty: "medium",
          completed: false,
        },
      ],
    },
    {
      day: "Wednesday",
      date: "Mar 12",
      sessions: [
        {
          id: "6",
          day: "Wednesday",
          date: "Mar 12",
          time: "09:30 AM",
          course: "UI/UX Design",
          topic: "Typography",
          duration: 50,
          difficulty: "easy",
          completed: false,
        },
        {
          id: "7",
          day: "Wednesday",
          date: "Mar 12",
          time: "02:00 PM",
          course: "JavaScript Advanced",
          topic: "Closures",
          duration: 45,
          difficulty: "hard",
          completed: false,
        },
      ],
    },
    {
      day: "Thursday",
      date: "Mar 13",
      sessions: [
        {
          id: "8",
          day: "Thursday",
          date: "Mar 13",
          time: "11:00 AM",
          course: "React Fundamentals",
          topic: "Context API",
          duration: 60,
          difficulty: "medium",
          completed: false,
        },
      ],
    },
    {
      day: "Friday",
      date: "Mar 14",
      sessions: [
        {
          id: "9",
          day: "Friday",
          date: "Mar 14",
          time: "10:00 AM",
          course: "Project Review",
          topic: "Build & Deploy",
          duration: 120,
          difficulty: "hard",
          completed: false,
        },
      ],
    },
    {
      day: "Saturday",
      date: "Mar 15",
      sessions: [
        {
          id: "10",
          day: "Saturday",
          date: "Mar 15",
          time: "02:00 PM",
          course: "Python for Data Science",
          topic: "Matplotlib",
          duration: 60,
          difficulty: "medium",
          completed: false,
        },
      ],
    },
    {
      day: "Sunday",
      date: "Mar 16",
      sessions: [
        {
          id: "11",
          day: "Sunday",
          date: "Mar 16",
          time: "03:00 PM",
          course: "Review & Planning",
          topic: "Week Recap",
          duration: 30,
          difficulty: "easy",
          completed: false,
        },
      ],
    },
  ]

  const selectedDayData = weekSchedule.find((d) => d.day === selectedDay)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">Study Planner</h1>
              <p className="text-slate-600">Plan your week and stay on track with your learning goals</p>
            </div>
            <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-lg h-11 px-6">
              <Plus className="w-4 h-4 mr-2" />
              Schedule Session
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="border-0 rounded-xl bg-white shadow-sm">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 text-sm font-medium mb-1">This Week</p>
                    <p className="text-3xl font-bold text-slate-900">8h 45m</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="border-0 rounded-xl bg-white shadow-sm">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 text-sm font-medium mb-1">Completed</p>
                    <p className="text-3xl font-bold text-slate-900">3/11</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Target className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="border-0 rounded-xl bg-white shadow-sm">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 text-sm font-medium mb-1">Recommended</p>
                    <p className="text-3xl font-bold text-slate-900">12h</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Zap className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Week Calendar */}
            <div className="lg:col-span-1">
              <Card className="border-0 rounded-xl bg-white shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6">
                  <h3 className="font-bold text-lg">This Week</h3>
                </div>

                <div className="p-4 space-y-2">
                  {weekSchedule.map((dayData) => (
                    <button
                      key={dayData.day}
                      onClick={() => setSelectedDay(dayData.day)}
                      className={`w-full text-left p-4 rounded-lg transition-all ${
                        selectedDay === dayData.day
                          ? "bg-purple-50 border-2 border-purple-500"
                          : "border border-slate-200 hover:border-purple-300"
                      }`}
                    >
                      <p className="font-semibold text-slate-900 text-sm">{dayData.day}</p>
                      <p className="text-xs text-slate-600 mt-1">{dayData.date}</p>
                      <p className="text-xs font-medium text-purple-600 mt-2">
                        {dayData.sessions.length} sessions
                      </p>
                    </button>
                  ))}
                </div>
              </Card>
            </div>

            {/* Day Schedule */}
            <div className="lg:col-span-2">
              {selectedDayData ? (
                <Card className="border-0 rounded-xl bg-white shadow-sm overflow-hidden">
                  {/* Header */}
                  <div className={`bg-gradient-to-r ${getDayColor(selectedDayData.day)} text-white p-6`}>
                    <h2 className="text-3xl font-bold mb-1">{selectedDayData.day}</h2>
                    <p className="text-white/90">{selectedDayData.date}</p>
                  </div>

                  {/* Sessions */}
                  <div className="p-6">
                    <div className="space-y-4">
                      {selectedDayData.sessions.length > 0 ? (
                        selectedDayData.sessions.map((session, index) => (
                          <div
                            key={session.id}
                            className={`p-4 rounded-xl border-2 transition-all task-item ${
                              session.completed
                                ? "bg-green-50 border-green-200"
                                : "bg-slate-50 border-slate-200"
                            }`}
                          >
                            <div className="flex items-start gap-4">
                              <div className="flex-shrink-0 pt-1">
                                <input
                                  type="checkbox"
                                  checked={session.completed}
                                  onChange={() => {}}
                                  className="w-5 h-5 rounded border-slate-300 cursor-pointer accent-purple-600"
                                />
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2 mb-2">
                                  <div>
                                    <h3 className={`font-semibold ${
                                      session.completed ? "text-green-900 line-through" : "text-slate-900"
                                    }`}>
                                      {session.topic}
                                    </h3>
                                    <p className="text-sm text-slate-600 mt-1">{session.course}</p>
                                  </div>
                                  <Badge className={getDifficultyColor(session.difficulty)}>
                                    {session.difficulty}
                                  </Badge>
                                </div>

                                <div className="flex items-center gap-6 mt-3 pt-3 border-t border-slate-200">
                                  <div className="flex items-center gap-2 text-sm text-slate-600">
                                    <Clock className="w-4 h-4" />
                                    {session.time}
                                  </div>
                                  <div className="flex items-center gap-2 text-sm text-slate-600">
                                    <Calendar className="w-4 h-4" />
                                    {session.duration} min
                                  </div>
                                </div>
                              </div>

                              <Button
                                variant="outline"
                                size="sm"
                                className="ml-2 border-slate-300 text-slate-700 hover:bg-slate-100 rounded-lg bg-transparent"
                              >
                                {session.completed ? "Done" : "Start"}
                              </Button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-12">
                          <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                          <p className="text-slate-600">No sessions scheduled for this day</p>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ) : null}

              {/* Tips */}
              <Card className="border-0 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 shadow-sm mt-8 border-l-4 border-blue-500">
                <div className="p-6">
                  <div className="flex gap-4">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-2">Study Tip</h3>
                      <p className="text-sm text-slate-700">
                        Consistency is key. Try to study at the same time each day to build a habit and
                        improve retention.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
