"use client"

import { useState } from "react"
import Header from "@/components/layout/Header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  BarChart3,
  Users,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Download,
  Settings,
  MoreVertical,
  TrendingUp,
  Mail,
  Calendar,
} from "lucide-react"

interface User {
  id: string
  name: string
  role: string
  email: string
  studentId?: string
  department?: string
}

interface TeacherDashboardProps {
  user: User
  onLogout: () => void
}

export default function TeacherDashboard({ user, onLogout }: TeacherDashboardProps) {
  const [courses] = useState([
    {
      id: "CS101",
      name: "Introduction to Computer Science",
      section: "01",
      semester: "Spring 2024",
      enrolledStudents: 32,
      totalStudents: 35,
      avgGrade: "B+",
      nextClass: "Today at 2:00 PM",
      room: "Tech Building 101",
    },
    {
      id: "CS301",
      name: "Advanced Algorithms",
      section: "02",
      semester: "Spring 2024",
      enrolledStudents: 24,
      totalStudents: 28,
      avgGrade: "A-",
      nextClass: "Tomorrow at 10:30 AM",
      room: "Tech Building 205",
    },
  ])

  const [recentSubmissions] = useState([
    {
      id: 1,
      course: "CS101",
      assignment: "Programming Assignment 5",
      submitted: 28,
      total: 32,
      graded: 15,
      pending: 13,
      averageScore: 87,
      dueDate: "Today 11:59 PM",
    },
    {
      id: 2,
      course: "CS301",
      assignment: "Algorithm Analysis Project",
      submitted: 22,
      total: 24,
      graded: 18,
      pending: 4,
      averageScore: 92,
      dueDate: "In 2 days",
    },
  ])

  const [studentGrades] = useState([
    {
      id: 1,
      name: "Sarah Chen",
      studentId: "2024001234",
      course: "CS101",
      currentGrade: "A",
      participation: "Excellent",
      assignments: "95%",
      attendance: "98%",
      status: "On Track",
    },
    {
      id: 2,
      name: "Michael Johnson",
      studentId: "2024001235",
      course: "CS101",
      currentGrade: "B-",
      participation: "Fair",
      assignments: "72%",
      attendance: "85%",
      status: "At Risk",
    },
    {
      id: 3,
      name: "Emma Williams",
      studentId: "2024001236",
      course: "CS101",
      currentGrade: "A-",
      participation: "Good",
      assignments: "92%",
      attendance: "96%",
      status: "On Track",
    },
  ])

  const [announcements] = useState([
    {
      id: 1,
      course: "CS101",
      title: "Midterm Exam Schedule Released",
      date: "Posted 2 days ago",
      type: "announcement",
    },
    {
      id: 2,
      course: "CS301",
      title: "Updated Office Hours",
      date: "Posted 1 week ago",
      type: "update",
    },
    {
      id: 3,
      course: "CS101",
      title: "Assignment 5 Extensions Available",
      date: "Posted 3 days ago",
      type: "info",
    },
  ])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Header user={user} onLogout={onLogout} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Banner */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-green-600 to-slate-900 rounded-xl p-8 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-4xl font-bold mb-2">Welcome back, {user.name}!</h2>
                <p className="text-green-100">Spring 2024 Semester • {user.department || "Computer Science"}</p>
              </div>
              <div className="hidden md:flex flex-col items-end gap-2">
                <Badge className="bg-white text-green-600 font-semibold">Faculty</Badge>
                <p className="text-green-100 text-sm">2 Active Courses</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-slate-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-green-600 mb-1">56</p>
                  <p className="text-slate-600 text-sm">Total Students</p>
                </div>
                <Users className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-blue-600 mb-1">50</p>
                  <p className="text-slate-600 text-sm">Assignments Graded</p>
                </div>
                <CheckCircle className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-orange-600 mb-1">13</p>
                  <p className="text-slate-600 text-sm">Pending Submissions</p>
                </div>
                <Clock className="w-8 h-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-purple-600 mb-1">3</p>
                  <p className="text-slate-600 text-sm">At-Risk Students</p>
                </div>
                <AlertCircle className="w-8 h-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Left Column - Courses and Submissions */}
          <div className="lg:col-span-2 space-y-8">
            {/* Courses */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-slate-900">Your Courses</h3>
                <Button size="sm" className="gap-2 bg-green-600 hover:bg-green-700 text-white">
                  <Plus className="w-4 h-4" />
                  Add Course
                </Button>
              </div>

              <div className="space-y-4">
                {courses.map((course) => (
                  <Card key={course.id} className="border-slate-200 hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-green-100 text-green-700 border-green-300">{course.id}</Badge>
                            <Badge className="bg-blue-100 text-blue-700 border-blue-300">Section {course.section}</Badge>
                          </div>
                          <h4 className="text-lg font-semibold text-slate-900">{course.name}</h4>
                          <p className="text-sm text-slate-600 mt-1">{course.semester}</p>
                        </div>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-5 h-5 text-slate-400" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-4 gap-4 py-4 border-t border-b border-slate-100">
                        <div>
                          <p className="text-xs text-slate-600 mb-1">Enrolled</p>
                          <p className="font-semibold text-slate-900">
                            {course.enrolledStudents}/{course.totalStudents}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-600 mb-1">Avg Grade</p>
                          <p className="font-semibold text-slate-900">{course.avgGrade}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-600 mb-1">Next Class</p>
                          <p className="text-sm text-slate-900">{course.nextClass}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-600 mb-1">Location</p>
                          <p className="text-sm text-slate-900">{course.room}</p>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 text-slate-700 border-slate-300 hover:bg-slate-50 bg-transparent"
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          Manage Course
                        </Button>
                        <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                          <Users className="w-4 h-4 mr-2" />
                          View Students
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Recent Submissions */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-slate-900">Assignment Submissions</h3>
                <Button variant="outline" size="sm" className="gap-2 text-blue-600 border-blue-300 hover:bg-blue-50 bg-transparent">
                  <Download className="w-4 h-4" />
                  Export Report
                </Button>
              </div>

              <div className="space-y-4">
                {recentSubmissions.map((submission) => (
                  <Card key={submission.id} className="border-slate-200">
                    <CardContent className="pt-6">
                      <div className="mb-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-slate-900">{submission.assignment}</h4>
                            <p className="text-sm text-slate-600">{submission.course}</p>
                          </div>
                          <Badge className="text-xs">{submission.dueDate}</Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-4 py-4 border-t border-b border-slate-100">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-slate-900">
                            {submission.submitted}/{submission.total}
                          </p>
                          <p className="text-xs text-slate-600 mt-1">Submitted</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-green-600">{submission.graded}</p>
                          <p className="text-xs text-slate-600 mt-1">Graded</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-orange-600">{submission.pending}</p>
                          <p className="text-xs text-slate-600 mt-1">Pending</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-blue-600">{submission.averageScore}</p>
                          <p className="text-xs text-slate-600 mt-1">Avg Score</p>
                        </div>
                      </div>

                      <Button size="sm" className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white">
                        Grade Submissions
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Students and Announcements */}
          <div className="space-y-8">
            {/* At-Risk Students */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-slate-900">Class Performance</h3>
                <Button variant="ghost" size="sm" className="text-blue-600">
                  View All
                </Button>
              </div>

              <div className="space-y-3">
                {studentGrades.map((student) => (
                  <Card key={student.id} className="border-slate-200">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-900">{student.name}</h4>
                          <p className="text-xs text-slate-600">{student.studentId}</p>
                        </div>
                        <Badge
                          className={
                            student.status === "At Risk"
                              ? "bg-red-100 text-red-700 border-red-300"
                              : "bg-green-100 text-green-700 border-green-300"
                          }
                        >
                          {student.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-2 py-3 border-t border-slate-100">
                        <div>
                          <p className="text-xs text-slate-600 mb-1">Grade</p>
                          <p className="font-semibold text-slate-900">{student.currentGrade}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-600 mb-1">Assignments</p>
                          <p className="font-semibold text-slate-900">{student.assignments}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-600 mb-1">Attendance</p>
                          <p className="font-semibold text-slate-900">{student.attendance}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-600 mb-1">Participation</p>
                          <p className="font-semibold text-slate-900 text-sm">{student.participation}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Announcements */}
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Recent Announcements</h3>
              <div className="space-y-3">
                {announcements.map((announcement) => (
                  <Card key={announcement.id} className="border-slate-200 hover:shadow-md transition-shadow">
                    <CardContent className="pt-4">
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-2 h-2 rounded-full flex-shrink-0 mt-2 ${
                            announcement.type === "announcement"
                              ? "bg-blue-600"
                              : announcement.type === "update"
                                ? "bg-green-600"
                                : "bg-purple-600"
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <Badge className="text-xs mb-2 bg-slate-100 text-slate-700">
                            {announcement.course}
                          </Badge>
                          <h4 className="font-semibold text-slate-900 line-clamp-2">{announcement.title}</h4>
                          <p className="text-xs text-slate-600 mt-1">{announcement.date}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4 text-blue-600 border-blue-300 hover:bg-blue-50 bg-transparent">
                Post Announcement
              </Button>
            </div>

            {/* Quick Actions */}
            <Card className="border-slate-200 bg-gradient-to-br from-blue-50 to-slate-50">
              <CardHeader>
                <CardTitle className="text-lg text-slate-900">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 text-slate-700 border-slate-300 hover:bg-white bg-transparent"
                >
                  <Mail className="w-4 h-4" />
                  Message Students
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 text-slate-700 border-slate-300 hover:bg-white bg-transparent"
                >
                  <Calendar className="w-4 h-4" />
                  Schedule Office Hours
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 text-slate-700 border-slate-300 hover:bg-white bg-transparent"
                >
                  <Settings className="w-4 h-4" />
                  Course Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
