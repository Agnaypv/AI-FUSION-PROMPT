"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Users, BookOpen, Trophy, AlertCircle, CheckCircle } from "lucide-react"

export default function ClassAnalytics() {
  const classStats = {
    totalStudents: 28,
    activeStudents: 24,
    averageScore: 82,
    completionRate: 76,
    weeklyEngagement: 89,
    pendingSubmissions: 12,
  }

  const subjectPerformance = [
    { subject: "Mathematics", average: 78, trend: "+5", students: 28, color: "bg-blue-500" },
    { subject: "Science", average: 85, trend: "+3", students: 28, color: "bg-green-500" },
    { subject: "English", average: 82, trend: "-2", students: 28, color: "bg-purple-500" },
    { subject: "Social Studies", average: 79, trend: "+8", students: 28, color: "bg-orange-500" },
  ]

  const recentActivity = [
    {
      id: 1,
      student: "Alex Johnson",
      action: "Completed Math Quiz",
      score: 95,
      time: "2 hours ago",
      type: "success",
    },
    {
      id: 2,
      student: "Emma Wilson",
      action: "Submitted Science Project",
      score: null,
      time: "3 hours ago",
      type: "pending",
    },
    {
      id: 3,
      student: "Liam Chen",
      action: "Achieved Gold Belt in English",
      score: null,
      time: "5 hours ago",
      type: "achievement",
    },
    {
      id: 4,
      student: "Sophia Davis",
      action: "Missed Assignment Deadline",
      score: null,
      time: "1 day ago",
      type: "warning",
    },
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "pending":
        return <BookOpen className="w-4 h-4 text-blue-500" />
      case "achievement":
        return <Trophy className="w-4 h-4 text-yellow-500" />
      case "warning":
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return <BookOpen className="w-4 h-4 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-800">{classStats.totalStudents}</p>
                <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  {classStats.activeStudents} active
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Score</p>
                <p className="text-2xl font-bold text-gray-800">{classStats.averageScore}%</p>
                <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  +3% this week
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold text-gray-800">{classStats.completionRate}%</p>
                <Progress value={classStats.completionRate} className="mt-2 h-2" />
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Reviews</p>
                <p className="text-2xl font-bold text-gray-800">{classStats.pendingSubmissions}</p>
                <p className="text-xs text-orange-600 mt-1">Need attention</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subject Performance */}
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-800">Subject Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {subjectPerformance.map((subject) => (
              <div key={subject.subject} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${subject.color}`}></div>
                    <span className="font-medium text-gray-800">{subject.subject}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-800">{subject.average}%</span>
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        subject.trend.startsWith("+")
                          ? "text-green-600 border-green-200"
                          : "text-red-600 border-red-200"
                      }`}
                    >
                      {subject.trend}
                    </Badge>
                  </div>
                </div>
                <Progress value={subject.average} className="h-2" />
                <p className="text-xs text-gray-500">{subject.students} students enrolled</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-800">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                {getActivityIcon(activity.type)}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 text-sm">{activity.student}</p>
                  <p className="text-gray-600 text-xs">{activity.action}</p>
                  {activity.score && (
                    <Badge variant="outline" className="text-xs mt-1">
                      Score: {activity.score}%
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Weekly Engagement Chart */}
      <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-gray-800">Weekly Engagement</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Overall Engagement</span>
              <span className="text-lg font-bold text-gray-800">{classStats.weeklyEngagement}%</span>
            </div>
            <Progress value={classStats.weeklyEngagement} className="h-3" />

            <div className="grid grid-cols-7 gap-2 mt-4">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => {
                const engagement = [85, 92, 78, 88, 95, 82, 90][index]
                return (
                  <div key={day} className="text-center">
                    <div className="text-xs text-gray-600 mb-1">{day}</div>
                    <div
                      className="bg-gradient-to-t from-primary to-accent rounded-sm mx-auto"
                      style={{
                        height: `${engagement}px`,
                        width: "20px",
                      }}
                    ></div>
                    <div className="text-xs text-gray-500 mt-1">{engagement}%</div>
                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
