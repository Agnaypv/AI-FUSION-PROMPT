"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Star,
  Users,
  Clock,
  Award,
  Play,
  Check,
  ChevronDown,
  Lock,
  ArrowLeft,
} from "lucide-react"

interface Module {
  id: string
  title: string
  lessons: {
    id: string
    title: string
    duration: string
    completed: boolean
    locked: boolean
  }[]
}

interface CourseDetailProps {
  onBack?: () => void
}

export default function CourseDetail({ onBack }: CourseDetailProps) {
  const [expandedModule, setExpandedModule] = useState<string | null>("1")

  const modules: Module[] = [
    {
      id: "1",
      title: "Getting Started with React",
      lessons: [
        { id: "1-1", title: "What is React?", duration: "12 min", completed: true, locked: false },
        { id: "1-2", title: "Setting Up Your Environment", duration: "18 min", completed: true, locked: false },
        { id: "1-3", title: "JSX Basics", duration: "25 min", completed: true, locked: false },
        { id: "1-4", title: "Components & Props", duration: "30 min", completed: false, locked: false },
      ],
    },
    {
      id: "2",
      title: "State & Lifecycle",
      lessons: [
        { id: "2-1", title: "Understanding State", duration: "28 min", completed: false, locked: false },
        { id: "2-2", title: "Hooks Introduction", duration: "35 min", completed: false, locked: false },
        { id: "2-3", title: "useEffect Hook", duration: "32 min", completed: false, locked: false },
      ],
    },
    {
      id: "3",
      title: "Advanced Patterns",
      lessons: [
        { id: "3-1", title: "Context API", duration: "40 min", completed: false, locked: true },
        { id: "3-2", title: "Custom Hooks", duration: "38 min", completed: false, locked: true },
        { id: "3-3", title: "Performance Optimization", duration: "45 min", completed: false, locked: true },
      ],
    },
  ]

  const courseProgress = 4
  const totalLessons = modules.reduce((sum, m) => sum + m.lessons.length, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="px-4 sm:px-6 lg:px-8 py-8 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
        <div className="max-w-6xl mx-auto">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-2 mb-6 text-slate-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Courses
            </button>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {/* Course Info */}
            <div className="md:col-span-2">
              <div className="flex items-start gap-6 mb-6">
                <div className="text-6xl">⚛️</div>
                <div className="flex-1">
                  <Badge className="mb-3 bg-purple-500 text-white">Beginner</Badge>
                  <h1 className="text-4xl font-bold mb-3">React Fundamentals</h1>
                  <p className="text-slate-300 mb-4">
                    Master the basics of React and build interactive web applications from scratch.
                  </p>
                  <div className="flex flex-wrap gap-6">
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      <span className="font-medium">4.8</span>
                      <span className="text-slate-400">(12.4K reviews)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-blue-400" />
                      <span className="text-slate-300">12,400 students</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-green-400" />
                      <span className="text-slate-300">8 weeks</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Card */}
            <Card className="border-0 rounded-xl bg-white shadow-lg">
              <div className="p-6">
                <div className="mb-6">
                  <p className="text-sm text-slate-600 mb-2">Your Progress</p>
                  <div className="flex items-end gap-2">
                    <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-purple-600"
                        style={{ width: `${(courseProgress / totalLessons) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-slate-900">
                      {courseProgress}/{totalLessons}
                    </span>
                  </div>
                </div>

                <Button className="w-full h-12 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-lg mb-3 font-medium">
                  <Play className="w-5 h-5 mr-2" />
                  Continue Learning
                </Button>

                <Button variant="outline" className="w-full h-11 border-slate-300 text-slate-700 rounded-lg bg-transparent">
                  Share Course
                </Button>

                <div className="mt-6 pt-6 border-t border-slate-200 space-y-3">
                  <div className="flex items-start gap-3">
                    <Award className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-semibold text-slate-900">Certificate included</p>
                      <p className="text-slate-600">Upon completion</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-semibold text-slate-900">Lifetime access</p>
                      <p className="text-slate-600">Learn at your own pace</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* About */}
              <Card className="border-0 rounded-xl bg-white shadow-sm p-8 mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">About this course</h2>
                <p className="text-slate-700 leading-relaxed mb-4">
                  This comprehensive course covers everything you need to know about React. From basic
                  concepts to advanced patterns, you'll learn by building real-world applications.
                </p>
                <p className="text-slate-700 leading-relaxed">
                  By the end of this course, you'll be able to build complex interactive UIs, manage state
                  effectively, and understand React's ecosystem.
                </p>
              </Card>

              {/* Instructor */}
              <Card className="border-0 rounded-xl bg-white shadow-sm p-8 mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Meet your instructor</h2>
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-2xl flex-shrink-0">
                    👨
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">Sarah Chen</h3>
                    <p className="text-sm text-slate-600 mb-3">
                      Full-stack developer with 8+ years of experience building React applications
                    </p>
                    <p className="text-sm text-slate-600">
                      Teaching is my passion. I love helping students understand complex concepts through
                      practical examples.
                    </p>
                  </div>
                </div>
              </Card>

              {/* Curriculum */}
              <Card className="border-0 rounded-xl bg-white shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-200">
                  <h2 className="text-2xl font-bold text-slate-900">Curriculum</h2>
                </div>

                <div className="divide-y divide-slate-200">
                  {modules.map((module) => (
                    <div key={module.id} className="border-0">
                      <button
                        onClick={() =>
                          setExpandedModule(expandedModule === module.id ? null : module.id)
                        }
                        className="w-full px-8 py-6 flex items-center justify-between hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex-1 text-left">
                          <h3 className="font-semibold text-slate-900">{module.title}</h3>
                          <p className="text-sm text-slate-600 mt-1">
                            {module.lessons.length} lessons
                          </p>
                        </div>
                        <ChevronDown
                          className={`w-5 h-5 text-slate-400 transition-transform ${
                            expandedModule === module.id ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {expandedModule === module.id && (
                        <div className="px-8 py-4 bg-slate-50 space-y-3">
                          {module.lessons.map((lesson) => (
                            <div
                              key={lesson.id}
                              className="flex items-center gap-4 p-3 rounded-lg bg-white hover:bg-slate-100 cursor-pointer transition-colors"
                            >
                              {lesson.locked ? (
                                <Lock className="w-5 h-5 text-slate-400 flex-shrink-0" />
                              ) : lesson.completed ? (
                                <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                              ) : (
                                <Play className="w-5 h-5 text-slate-400 flex-shrink-0" />
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-slate-900">{lesson.title}</p>
                                <p className="text-xs text-slate-600">{lesson.duration}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div>
              <Card className="border-0 rounded-xl bg-white shadow-sm p-6 sticky top-8">
                <h3 className="font-bold text-slate-900 mb-4">What you'll learn</h3>
                <ul className="space-y-3">
                  {[
                    "Build interactive UIs with React",
                    "Manage component state and lifecycle",
                    "Work with hooks and custom hooks",
                    "Handle forms and validation",
                    "Integrate APIs and external services",
                    "Deploy React applications",
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
