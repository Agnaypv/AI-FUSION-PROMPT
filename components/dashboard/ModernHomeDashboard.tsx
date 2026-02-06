"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Clock,
  CheckCircle2,
  Zap,
  TrendingUp,
  Play,
  Calendar,
  BookOpen,
  ArrowRight,
} from "lucide-react"

interface Course {
  id: string
  title: string
  progress: number
  nextLesson: string
  icon: string
  color: string
  schedule?: string
}

interface Task {
  id: string
  title: string
  course: string
  dueDate: string
  priority: "high" | "medium" | "low"
}

interface ProgressRingProps {
  percentage: number
  size?: number
  strokeWidth?: number
  color?: string
}

function ProgressRing({
  percentage,
  size = 120,
  strokeWidth = 8,
  color = "url(#gradient)",
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#667eea" />
          <stop offset="100%" stopColor="#a78bfa" />
        </linearGradient>
      </defs>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#e5e7eb"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="progress-ring transition-all duration-500"
      />
      <text
        x={size / 2}
        y={size / 2}
        textAnchor="middle"
        dy="0.3em"
        className="text-sm font-bold fill-slate-900"
      >
        {Math.round(percentage)}%
      </text>
    </svg>
  )
}

export default function ModernHomeDashboard() {
  const [activeCourses] = useState<Course[]>([
    {
      id: "1",
      title: "React Fundamentals",
      progress: 65,
      nextLesson: "Hooks & State Management",
      icon: "⚛️",
      color: "from-blue-400 to-blue-600",
      schedule: "Mon, Wed, Fri",
    },
    {
      id: "2",
      title: "UI/UX Design Basics",
      progress: 42,
      nextLesson: "Color Theory & Typography",
      icon: "🎨",
      color: "from-pink-400 to-rose-600",
      schedule: "Tue, Thu",
    },
    {
      id: "3",
      title: "JavaScript Advanced",
      progress: 78,
      nextLesson: "Async Programming",
      icon: "✨",
      color: "from-yellow-400 to-orange-600",
      schedule: "Daily",
    },
  ])

  const [upcomingTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Build a todo app with React",
      course: "React Fundamentals",
      dueDate: "Tomorrow",
      priority: "high",
    },
    {
      id: "2",
      title: "Design a landing page mockup",
      course: "UI/UX Design Basics",
      dueDate: "in 2 days",
      priority: "medium",
    },
    {
      id: "3",
      title: "Complete async/await challenges",
      course: "JavaScript Advanced",
      dueDate: "in 3 days",
      priority: "low",
    },
  ])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-300"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      case "low":
        return "bg-green-100 text-green-800 border-green-300"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-indigo-50 to-pink-50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-indigo-100 to-transparent rounded-full opacity-40 blur-3xl" />
      <div className="absolute bottom-20 left-0 w-96 h-96 bg-gradient-to-tr from-pink-100 to-transparent rounded-full opacity-40 blur-3xl" />
      
      {/* Header Section */}
      <div className="px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 fade-in">
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">Welcome back!</h1>
              <p className="text-gray-600">You're on track. Keep up the great work!</p>
            </div>
            <Button className="bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 text-white rounded-xl h-11 px-8 font-semibold shadow-lg hover:shadow-xl transition-all">
              <Zap className="w-4 h-4 mr-2" />
              Continue Learning
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="border-0 rounded-2xl bg-white shadow-md hover:shadow-lg transition-all duration-300 float-up" style={{ animationDelay: '0.1s' }}>
              <div className="p-6 bg-gradient-to-br from-blue-50 to-transparent">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium mb-1">Active Courses</p>
                    <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">3</p>
                  </div>
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center shadow-md">
                    <BookOpen className="w-7 h-7 text-blue-600" />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="border-0 rounded-2xl bg-white shadow-md hover:shadow-lg transition-all duration-300 float-up" style={{ animationDelay: '0.2s' }}>
              <div className="p-6 bg-gradient-to-br from-green-50 to-transparent">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium mb-1">Completed Tasks</p>
                    <p className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">24</p>
                  </div>
                  <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center shadow-md">
                    <CheckCircle2 className="w-7 h-7 text-green-600" />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="border-0 rounded-2xl bg-white shadow-md hover:shadow-lg transition-all duration-300 float-up" style={{ animationDelay: '0.3s' }}>
              <div className="p-6 bg-gradient-to-br from-purple-50 to-transparent">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium mb-1">Learning Streak</p>
                    <p className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">12 days</p>
                  </div>
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center shadow-md">
                    <TrendingUp className="w-7 h-7 text-purple-600" />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="border-0 rounded-2xl bg-white shadow-md hover:shadow-lg transition-all duration-300 float-up" style={{ animationDelay: '0.4s' }}>
              <div className="p-6 bg-gradient-to-br from-orange-50 to-transparent">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium mb-1">Total Hours</p>
                    <p className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">48h</p>
                  </div>
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-red-100 rounded-xl flex items-center justify-center shadow-md">
                    <Clock className="w-7 h-7 text-orange-600" />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Active Courses Section */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Active Courses</h2>

                <div className="space-y-4">
                  {activeCourses.map((course, idx) => (
                    <Card
                      key={course.id}
                      className="border-0 rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 course-card overflow-hidden fade-in"
                      style={{ animationDelay: `${0.5 + idx * 0.1}s` }}
                    >
                      <div className="p-6 bg-gradient-to-br from-white to-gray-50">
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <div className="flex items-start gap-4 flex-1">
                            <div className="text-5xl drop-shadow-md">{course.icon}</div>
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-gray-900 mb-1">
                                {course.title}
                              </h3>
                              <p className="text-sm text-gray-600 mb-3">{course.nextLesson}</p>
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                <span className="text-xs text-gray-600 font-medium">{course.schedule}</span>
                              </div>
                            </div>
                          </div>
                          <ProgressRing percentage={course.progress} size={110} />
                        </div>

                        {/* Progress bar */}
                        <div className="mb-6">
                          <div className="flex justify-between mb-2">
                            <span className="text-xs font-semibold text-gray-700">Progress</span>
                            <span className="text-xs font-bold text-indigo-600">{course.progress}%</span>
                          </div>
                          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                            <div
                              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-500 progress-fill"
                              style={{ width: `${course.progress}%` }}
                            />
                          </div>
                        </div>

                        <Button
                          className="w-full bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 text-white rounded-xl h-11 font-semibold shadow-md hover:shadow-lg transition-all"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Start Next Lesson
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

            {/* Upcoming Tasks Sidebar */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Next Up</h2>

              <div className="space-y-3">
                {upcomingTasks.map((task, idx) => (
                  <Card 
                    key={task.id} 
                    className="border-1 rounded-xl bg-white shadow-md hover:shadow-lg transition-all duration-300 task-item fade-in overflow-hidden"
                    style={{ animationDelay: `${0.8 + idx * 0.1}s` }}
                  >
                    <div className="p-5 relative overflow-hidden">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <h4 className="font-bold text-gray-900 text-sm flex-1 leading-snug">
                          {task.title}
                        </h4>
                        <Badge
                          className={`text-xs whitespace-nowrap font-semibold px-2 py-1 ${getPriorityColor(
                            task.priority
                          )}`}
                        >
                          {task.priority}
                        </Badge>
                      </div>

                      <p className="text-xs text-gray-600 mb-4 font-medium">{task.course}</p>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <div className="flex items-center gap-1 text-gray-500">
                          <Clock className="w-3.5 h-3.5" />
                          <span className="text-xs font-medium">{task.dueDate}</span>
                        </div>
                        <button className="text-indigo-600 hover:text-pink-600 transition-colors">
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Recommended Next */}
              <Card className="border-0 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-xl mt-6 fade-in overflow-hidden" style={{ animationDelay: '1.2s' }}>
                <div className="p-6 relative">
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl" />
                  
                  <div className="relative z-10">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-3 shadow-lg">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-white mb-2 text-lg">Recommended for you</h3>
                    <p className="text-sm text-white/90 mb-5 leading-relaxed">
                      Based on your progress, we suggest taking the React Testing course next.
                    </p>
                    <Button className="w-full bg-white text-indigo-600 hover:bg-white/95 rounded-xl h-10 font-semibold shadow-md hover:shadow-lg transition-all">
                      View Course
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
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
