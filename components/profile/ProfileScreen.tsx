"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Award,
  BookOpen,
  Clock,
  Zap,
  Settings,
  LogOut,
  Edit2,
  TrendingUp,
  Target,
} from "lucide-react"

interface Achievement {
  id: string
  name: string
  icon: string
  description: string
  date: string
}

export default function ProfileScreen() {
  const achievements: Achievement[] = [
    {
      id: "1",
      name: "Quick Learner",
      icon: "⚡",
      description: "Completed first course",
      date: "Mar 5, 2025",
    },
    {
      id: "2",
      name: "Consistent",
      icon: "🔥",
      description: "7 day learning streak",
      date: "Mar 10, 2025",
    },
    {
      id: "3",
      name: "Knowledge Seeker",
      icon: "📚",
      description: "Enrolled in 3 courses",
      date: "Mar 12, 2025",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 pb-24">
      {/* Header */}
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Profile Card */}
          <Card className="border-0 rounded-xl bg-white shadow-sm overflow-hidden mb-8">
            <div className="h-32 bg-gradient-to-r from-purple-500 to-purple-600" />

            <div className="px-6 pb-6">
              {/* Avatar */}
              <div className="relative -mt-16 mb-6">
                <div className="w-28 h-28 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center text-5xl border-4 border-white shadow-lg">
                  👩
                </div>
              </div>

              {/* Profile Info */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h1 className="text-3xl font-bold text-slate-900">Sarah Johnson</h1>
                  <Button variant="outline" size="sm" className="border-slate-300 text-slate-700 bg-transparent">
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </div>
                <p className="text-slate-600 mb-4">@sarahjohnson | Joined March 2025</p>

                {/* Bio */}
                <p className="text-slate-700">
                  Passionate learner exploring web development and design. Coffee enthusiast and
                  lifelong student.
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">3</p>
                  <p className="text-xs text-slate-600 mt-1">Courses</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">48h</p>
                  <p className="text-xs text-slate-600 mt-1">Learning</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">12</p>
                  <p className="text-xs text-slate-600 mt-1">Streak</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">3</p>
                  <p className="text-xs text-slate-600 mt-1">Badges</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Achievements */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Achievements</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {achievements.map((achievement) => (
                <Card key={achievement.id} className="border-0 rounded-xl bg-white shadow-sm p-6">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900">{achievement.name}</h3>
                      <p className="text-sm text-slate-600 mt-1">{achievement.description}</p>
                      <p className="text-xs text-slate-500 mt-2">{achievement.date}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Learning Statistics */}
          <Card className="border-0 rounded-xl bg-white shadow-sm p-6 mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Learning Statistics</h2>

            <div className="space-y-6">
              {/* Course Progress */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-900">Courses Completed</span>
                  <span className="text-sm font-bold text-slate-900">1 / 3</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full"
                    style={{ width: "33%" }}
                  />
                </div>
              </div>

              {/* Time Spent */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="border border-slate-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-xs text-slate-600">This Week</p>
                      <p className="text-lg font-bold text-slate-900">8h 45m</p>
                    </div>
                  </div>
                </Card>

                <Card className="border border-slate-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-xs text-slate-600">Total Hours</p>
                      <p className="text-lg font-bold text-slate-900">48h</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </Card>

          {/* Settings */}
          <Card className="border-0 rounded-xl bg-white shadow-sm p-6 mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Account</h2>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-slate-50 transition-colors text-left">
                <div className="flex items-center gap-3">
                  <Settings className="w-5 h-5 text-slate-600" />
                  <span className="font-medium text-slate-900">Settings</span>
                </div>
                <span className="text-slate-400">›</span>
              </button>

              <button className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-slate-50 transition-colors text-left">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-slate-600" />
                  <span className="font-medium text-slate-900">Help & Support</span>
                </div>
                <span className="text-slate-400">›</span>
              </button>

              <button className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-red-50 transition-colors text-left text-red-600">
                <div className="flex items-center gap-3">
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Sign Out</span>
                </div>
                <span className="text-red-400">›</span>
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
