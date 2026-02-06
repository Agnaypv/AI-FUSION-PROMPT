"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Award, Zap, Calendar } from "lucide-react"

export default function PerformanceGraph() {
  const performanceData = {
    totalXP: 1250,
    weeklyXP: 180,
    currentStreak: 12,
    rank: 3,
    totalStudents: 28,
    weeklyProgress: [
      { day: "Mon", score: 85 },
      { day: "Tue", score: 92 },
      { day: "Wed", score: 78 },
      { day: "Thu", score: 88 },
      { day: "Fri", score: 95 },
      { day: "Sat", score: 82 },
      { day: "Sun", score: 90 },
    ],
    subjects: [
      { name: "Math", score: 88, change: "+5" },
      { name: "Science", score: 92, change: "+3" },
      { name: "English", score: 85, change: "-2" },
      { name: "Social", score: 78, change: "+8" },
    ],
  }

  const maxScore = Math.max(...performanceData.weeklyProgress.map((d) => d.score))

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-3 h-3 text-white" />
            </div>
            Performance
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Key Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg">
              <div className="text-2xl font-bold text-primary">{performanceData.totalXP}</div>
              <div className="text-xs text-gray-600">Total XP</div>
            </div>
            <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">#{performanceData.rank}</div>
              <div className="text-xs text-gray-600">Class Rank</div>
            </div>
          </div>

          {/* Weekly Progress Chart */}
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-800 text-sm">Weekly Progress</h4>
            <div className="flex items-end justify-between h-20 gap-1">
              {performanceData.weeklyProgress.map((day, index) => (
                <div key={day.day} className="flex flex-col items-center flex-1">
                  <div
                    className="w-full bg-gradient-to-t from-primary to-accent rounded-t-sm transition-all duration-500 hover:opacity-80"
                    style={{
                      height: `${(day.score / maxScore) * 100}%`,
                      minHeight: "8px",
                    }}
                  ></div>
                  <div className="text-xs text-gray-600 mt-1">{day.day}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Stats */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center gap-1 text-sm">
              <Zap className="w-4 h-4 text-orange-500" />
              <span className="text-gray-600">{performanceData.currentStreak} day streak</span>
            </div>
            <Badge className="bg-green-100 text-green-700 border-green-200">
              <TrendingUp className="w-3 h-3 mr-1" />+{performanceData.weeklyXP} this week
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Subject Performance */}
      <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Award className="w-3 h-3 text-white" />
            </div>
            Subject Scores
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          {performanceData.subjects.map((subject) => (
            <div key={subject.name} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-xs font-semibold text-gray-600">{subject.name.slice(0, 2)}</span>
                </div>
                <span className="font-medium text-gray-800">{subject.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-800">{subject.score}%</span>
                <Badge
                  variant="outline"
                  className={`text-xs ${
                    subject.change.startsWith("+") ? "text-green-600 border-green-200" : "text-red-600 border-red-200"
                  }`}
                >
                  {subject.change}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Upcoming Events */}
      <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              <Calendar className="w-3 h-3 text-white" />
            </div>
            Upcoming
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="font-semibold text-yellow-800 text-sm">Math Quiz Tomorrow</div>
            <div className="text-xs text-yellow-600">Quadratic Equations</div>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="font-semibold text-blue-800 text-sm">Science Project Due</div>
            <div className="text-xs text-blue-600">In 3 days</div>
          </div>
          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="font-semibold text-green-800 text-sm">Weekly Challenge</div>
            <div className="text-xs text-green-600">Starts Monday</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
