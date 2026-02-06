"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { TrendingUp, TrendingDown, Trophy, Clock, BookOpen, Target } from "lucide-react"

interface Student {
  id: string
  name: string
  avatar: string
  totalXP: number
  weeklyXP: number
  currentStreak: number
  belt: string
  subjects: {
    name: string
    score: number
    progress: number
    trend: number
  }[]
  recentActivity: {
    action: string
    time: string
    points: number
  }[]
  weakTopics: string[]
  rank: number
}

export default function StudentProgress() {
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<"rank" | "xp" | "progress">("rank")

  const students: Student[] = [
    {
      id: "1",
      name: "Alex Johnson",
      avatar: "AJ",
      totalXP: 1250,
      weeklyXP: 180,
      currentStreak: 12,
      belt: "Silver",
      rank: 3,
      subjects: [
        { name: "Math", score: 88, progress: 75, trend: 5 },
        { name: "Science", score: 92, progress: 85, trend: 3 },
        { name: "English", score: 85, progress: 70, trend: -2 },
        { name: "Social", score: 78, progress: 60, trend: 8 },
      ],
      recentActivity: [
        { action: "Completed Math Quiz", time: "2 hours ago", points: 25 },
        { action: "Submitted Science Project", time: "1 day ago", points: 50 },
        { action: "Played Word Racer", time: "2 days ago", points: 15 },
      ],
      weakTopics: ["Complex Equations", "Essay Writing", "Historical Dates"],
    },
    {
      id: "2",
      name: "Emma Wilson",
      avatar: "EW",
      totalXP: 1580,
      weeklyXP: 220,
      currentStreak: 18,
      belt: "Gold",
      rank: 1,
      subjects: [
        { name: "Math", score: 95, progress: 90, trend: 8 },
        { name: "Science", score: 89, progress: 88, trend: 2 },
        { name: "English", score: 94, progress: 92, trend: 6 },
        { name: "Social", score: 87, progress: 85, trend: 4 },
      ],
      recentActivity: [
        { action: "Achieved Gold Belt", time: "1 hour ago", points: 100 },
        { action: "Perfect Math Quiz", time: "3 hours ago", points: 35 },
        { action: "Completed Reading Assignment", time: "1 day ago", points: 40 },
      ],
      weakTopics: ["Advanced Calculus", "Scientific Method"],
    },
    {
      id: "3",
      name: "Liam Chen",
      avatar: "LC",
      totalXP: 1420,
      weeklyXP: 195,
      currentStreak: 15,
      belt: "Silver",
      rank: 2,
      subjects: [
        { name: "Math", score: 91, progress: 82, trend: 7 },
        { name: "Science", score: 88, progress: 80, trend: 1 },
        { name: "English", score: 82, progress: 75, trend: -1 },
        { name: "Social", score: 85, progress: 78, trend: 5 },
      ],
      recentActivity: [
        { action: "Math Hunt Level 5", time: "30 minutes ago", points: 30 },
        { action: "Science Experiment", time: "4 hours ago", points: 45 },
        { action: "English Essay", time: "2 days ago", points: 35 },
      ],
      weakTopics: ["Grammar Rules", "Chemical Formulas"],
    },
  ]

  const sortedStudents = [...students].sort((a, b) => {
    switch (sortBy) {
      case "rank":
        return a.rank - b.rank
      case "xp":
        return b.totalXP - a.totalXP
      case "progress":
        return b.subjects.reduce((sum, s) => sum + s.progress, 0) - a.subjects.reduce((sum, s) => sum + s.progress, 0)
      default:
        return a.rank - b.rank
    }
  })

  const getBeltColor = (belt: string) => {
    switch (belt) {
      case "Gold":
        return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white"
      case "Silver":
        return "bg-gradient-to-r from-gray-300 to-gray-500 text-white"
      case "Bronze":
        return "bg-gradient-to-r from-orange-400 to-orange-600 text-white"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const selectedStudentData = students.find((s) => s.id === selectedStudent)

  return (
    <div className="space-y-6">
      {/* Sort Controls */}
      <div className="flex gap-2">
        <Button
          variant={sortBy === "rank" ? "default" : "outline"}
          size="sm"
          onClick={() => setSortBy("rank")}
          className={sortBy !== "rank" ? "bg-transparent" : ""}
        >
          By Rank
        </Button>
        <Button
          variant={sortBy === "xp" ? "default" : "outline"}
          size="sm"
          onClick={() => setSortBy("xp")}
          className={sortBy !== "xp" ? "bg-transparent" : ""}
        >
          By XP
        </Button>
        <Button
          variant={sortBy === "progress" ? "default" : "outline"}
          size="sm"
          onClick={() => setSortBy("progress")}
          className={sortBy !== "progress" ? "bg-transparent" : ""}
        >
          By Progress
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Students List */}
        <div className="space-y-4">
          {sortedStudents.map((student) => (
            <Card
              key={student.id}
              className={`bg-white/70 backdrop-blur-sm border-0 shadow-lg cursor-pointer transition-all ${
                selectedStudent === student.id ? "ring-2 ring-primary" : "hover:shadow-xl"
              }`}
              onClick={() => setSelectedStudent(student.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  {/* Avatar and Rank */}
                  <div className="relative">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white font-semibold">
                        {student.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                      #{student.rank}
                    </div>
                  </div>

                  {/* Student Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-800">{student.name}</h3>
                      <Badge className={`${getBeltColor(student.belt)} text-xs px-2 py-1`}>{student.belt}</Badge>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Trophy className="w-3 h-3 text-yellow-500" />
                        {student.totalXP} XP
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-blue-500" />
                        {student.currentStreak} day streak
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 text-green-500" />+{student.weeklyXP} this week
                      </div>
                    </div>

                    {/* Subject Progress */}
                    <div className="mt-2 grid grid-cols-4 gap-1">
                      {student.subjects.map((subject) => (
                        <div key={subject.name} className="text-center">
                          <div className="text-xs text-gray-600 mb-1">{subject.name}</div>
                          <div className="w-full bg-gray-200 rounded-full h-1">
                            <div
                              className="bg-gradient-to-r from-primary to-accent h-1 rounded-full"
                              style={{ width: `${subject.progress}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">{subject.score}%</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Student Detail Panel */}
        <div className="sticky top-6">
          {selectedStudentData ? (
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white font-semibold text-sm">
                      {selectedStudentData.avatar}
                    </AvatarFallback>
                  </Avatar>
                  {selectedStudentData.name}
                  <Badge className={`${getBeltColor(selectedStudentData.belt)} text-xs px-2 py-1 ml-auto`}>
                    {selectedStudentData.belt}
                  </Badge>
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Performance Overview */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{selectedStudentData.totalXP}</div>
                    <div className="text-xs text-gray-600">Total XP</div>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">#{selectedStudentData.rank}</div>
                    <div className="text-xs text-gray-600">Class Rank</div>
                  </div>
                </div>

                {/* Subject Details */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Subject Performance</h4>
                  <div className="space-y-3">
                    {selectedStudentData.subjects.map((subject) => (
                      <div key={subject.name}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-gray-800">{subject.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-800">{subject.score}%</span>
                            <div
                              className={`flex items-center gap-1 text-xs ${
                                subject.trend > 0 ? "text-green-600" : "text-red-600"
                              }`}
                            >
                              {subject.trend > 0 ? (
                                <TrendingUp className="w-3 h-3" />
                              ) : (
                                <TrendingDown className="w-3 h-3" />
                              )}
                              {Math.abs(subject.trend)}
                            </div>
                          </div>
                        </div>
                        <Progress value={subject.progress} className="h-2" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Activity */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Recent Activity</h4>
                  <div className="space-y-2">
                    {selectedStudentData.recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-800 text-sm">{activity.action}</p>
                          <p className="text-gray-600 text-xs">{activity.time}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          +{activity.points} XP
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Weak Topics */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Target className="w-4 h-4 text-orange-500" />
                    Focus Areas
                  </h4>
                  <div className="space-y-2">
                    {selectedStudentData.weakTopics.map((topic, index) => (
                      <div key={index} className="p-2 bg-orange-50 rounded-lg border border-orange-200">
                        <p className="text-sm font-medium text-orange-700">{topic}</p>
                        <p className="text-xs text-orange-600">Needs additional practice</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1 bg-gradient-to-r from-primary to-accent">
                    <BookOpen className="w-3 h-3 mr-1" />
                    Assign Task
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    Send Message
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Select a Student</h3>
                <p className="text-gray-500">Click on a student to view their detailed progress and performance</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
