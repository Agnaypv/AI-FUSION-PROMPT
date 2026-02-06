"use client"

import { useState } from "react"
import Header from "@/components/layout/Header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Settings,
  Users,
  Building2,
  Calendar,
  AlertCircle,
  CheckCircle,
  BarChart3,
  Plus,
  Download,
  MoreVertical,
  TrendingUp,
  Zap,
  Mail,
} from "lucide-react"

interface User {
  id: string
  name: string
  role: string
  email: string
  department?: string
}

interface ParentDashboardProps {
  user: User
  onLogout: () => void
}

export default function ParentDashboard({ user, onLogout }: ParentDashboardProps) {
  const [campusStats] = useState([
    {
      id: 1,
      metric: "Total Students",
      value: "4,250",
      change: "+2.5%",
      trend: "up",
      icon: Users,
    },
    {
      id: 2,
      metric: "Faculty Members",
      value: "320",
      change: "+1.2%",
      trend: "up",
      icon: Building2,
    },
    {
      id: 3,
      metric: "Active Courses",
      value: "189",
      change: "+8.3%",
      trend: "up",
      icon: Calendar,
    },
    {
      id: 4,
      metric: "Average GPA",
      value: "3.42",
      change: "+0.05",
      trend: "up",
      icon: TrendingUp,
    },
  ])

  const [pendingTasks] = useState([
    {
      id: 1,
      title: "Student Housing Assignments",
      dueDate: "March 15",
      priority: "High",
      status: "In Progress",
      assignedTo: "Housing Department",
    },
    {
      id: 2,
      title: "Spring Event Budget Approval",
      dueDate: "March 10",
      priority: "High",
      status: "Pending Review",
      assignedTo: "Finance Office",
    },
    {
      id: 3,
      title: "Facility Maintenance Schedule",
      dueDate: "March 20",
      priority: "Medium",
      status: "Not Started",
      assignedTo: "Facilities",
    },
    {
      id: 4,
      title: "New Staff Onboarding",
      dueDate: "March 5",
      priority: "Medium",
      status: "In Progress",
      assignedTo: "HR Department",
    },
  ])

  const [departments] = useState([
    {
      id: 1,
      name: "Student Services",
      head: "Dr. James Wilson",
      staff: 15,
      budget: "$425,000",
      status: "Active",
      icon: Users,
    },
    {
      id: 2,
      name: "Facilities & Operations",
      head: "Michael Chen",
      staff: 42,
      budget: "$850,000",
      status: "Active",
      icon: Building2,
    },
    {
      id: 3,
      name: "Admissions",
      head: "Dr. Sarah Thompson",
      staff: 8,
      budget: "$180,000",
      status: "Active",
      icon: Users,
    },
    {
      id: 4,
      name: "Finance & Accounting",
      head: "Jennifer Davis",
      staff: 12,
      budget: "$200,000",
      status: "Active",
      icon: BarChart3,
    },
  ])

  const [campusAnnouncements] = useState([
    {
      id: 1,
      title: "Campus Closed March 17-19 for Maintenance",
      type: "alert",
      date: "Posted yesterday",
      audience: "All Staff & Students",
    },
    {
      id: 2,
      title: "New Campus WiFi System Rollout",
      type: "info",
      date: "Posted 3 days ago",
      audience: "Campus-Wide",
    },
    {
      id: 3,
      title: "Spring Semester Class Size Adjustments",
      type: "update",
      date: "Posted 1 week ago",
      audience: "Academic Departments",
    },
  ])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Header user={user} onLogout={onLogout} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Banner */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-purple-600 to-slate-900 rounded-xl p-8 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-4xl font-bold mb-2">Campus Operations Dashboard</h2>
                <p className="text-purple-100">Spring 2024 Semester • {user.department || "Administration"}</p>
              </div>
              <div className="hidden md:flex flex-col items-end gap-2">
                <Badge className="bg-white text-purple-600 font-semibold">Staff</Badge>
                <p className="text-purple-100 text-sm">System Administrator</p>
              </div>
            </div>
          </div>
        </div>

        {/* Campus Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {campusStats.map((stat) => {
            const IconComponent = stat.icon
            return (
              <Card key={stat.id} className="border-slate-200">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-slate-600 text-sm mb-2">{stat.metric}</p>
                      <p className="text-3xl font-bold text-slate-900 mb-2">{stat.value}</p>
                      <div className="flex items-center gap-1">
                        <span className="text-green-600 font-semibold text-sm">{stat.change}</span>
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      </div>
                    </div>
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <IconComponent className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Left Column - Tasks and Operations */}
          <div className="lg:col-span-2 space-y-8">
            {/* Pending Tasks */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-slate-900">Pending Tasks</h3>
                <Button size="sm" className="gap-2 bg-purple-600 hover:bg-purple-700 text-white">
                  <Plus className="w-4 h-4" />
                  New Task
                </Button>
              </div>

              <div className="space-y-3">
                {pendingTasks.map((task) => (
                  <Card key={task.id} className="border-slate-200 hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge
                              className={
                                task.priority === "High"
                                  ? "bg-red-100 text-red-700 border-red-300"
                                  : "bg-yellow-100 text-yellow-700 border-yellow-300"
                              }
                            >
                              {task.priority}
                            </Badge>
                            <Badge
                              className={
                                task.status === "In Progress"
                                  ? "bg-blue-100 text-blue-700 border-blue-300"
                                  : task.status === "Pending Review"
                                    ? "bg-orange-100 text-orange-700 border-orange-300"
                                    : "bg-slate-100 text-slate-700 border-slate-300"
                              }
                            >
                              {task.status}
                            </Badge>
                          </div>
                          <h4 className="font-semibold text-slate-900">{task.title}</h4>
                          <div className="flex items-center gap-4 mt-3 text-xs text-slate-600">
                            <span>Assigned to: {task.assignedTo}</span>
                            <span>Due: {task.dueDate}</span>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-5 h-5 text-slate-400" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Department Overview */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-slate-900">Departments</h3>
                <Button variant="outline" size="sm" className="gap-2 text-blue-600 border-blue-300 hover:bg-blue-50 bg-transparent">
                  <Download className="w-4 h-4" />
                  Export Report
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {departments.map((dept) => {
                  const IconComponent = dept.icon
                  return (
                    <Card key={dept.id} className="border-slate-200 hover:shadow-md transition-shadow">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <IconComponent className="w-5 h-5 text-slate-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-slate-900">{dept.name}</h4>
                              <p className="text-sm text-slate-600 mt-1">{dept.head}</p>
                            </div>
                          </div>
                          <Badge className="bg-green-100 text-green-700 border-green-300">{dept.status}</Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-4 py-4 border-t border-slate-100">
                          <div>
                            <p className="text-xs text-slate-600 mb-1">Staff</p>
                            <p className="font-semibold text-slate-900">{dept.staff}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-600 mb-1">Budget</p>
                            <p className="font-semibold text-slate-900">{dept.budget}</p>
                          </div>
                        </div>

                        <Button variant="outline" className="w-full mt-4 text-slate-700 border-slate-300 hover:bg-slate-50 bg-transparent">
                          Manage Department
                        </Button>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Right Column - Announcements and Quick Actions */}
          <div className="space-y-8">
            {/* Campus Announcements */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-slate-900">Announcements</h3>
                <Button variant="ghost" size="sm" className="text-blue-600">
                  View All
                </Button>
              </div>

              <div className="space-y-3">
                {campusAnnouncements.map((announcement) => (
                  <Card key={announcement.id} className="border-slate-200 hover:shadow-md transition-shadow">
                    <CardContent className="pt-4">
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-2 h-2 rounded-full flex-shrink-0 mt-2 ${
                            announcement.type === "alert"
                              ? "bg-red-600"
                              : announcement.type === "update"
                                ? "bg-blue-600"
                                : "bg-green-600"
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-slate-900 line-clamp-2">{announcement.title}</h4>
                          <p className="text-xs text-slate-600 mt-1">{announcement.date}</p>
                          <Badge className="text-xs mt-2 bg-slate-100 text-slate-700">{announcement.audience}</Badge>
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
            <Card className="border-slate-200 bg-gradient-to-br from-purple-50 to-slate-50">
              <CardHeader>
                <CardTitle className="text-lg text-slate-900">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 text-slate-700 border-slate-300 hover:bg-white bg-transparent"
                >
                  <Users className="w-4 h-4" />
                  Manage Users
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 text-slate-700 border-slate-300 hover:bg-white bg-transparent"
                >
                  <BarChart3 className="w-4 h-4" />
                  View Reports
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 text-slate-700 border-slate-300 hover:bg-white bg-transparent"
                >
                  <Settings className="w-4 h-4" />
                  System Settings
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 text-slate-700 border-slate-300 hover:bg-white bg-transparent"
                >
                  <Mail className="w-4 h-4" />
                  Send Bulk Email
                </Button>
              </CardContent>
            </Card>

            {/* System Status */}
            <Card className="border-slate-200 bg-gradient-to-br from-green-50 to-slate-50">
              <CardHeader>
                <CardTitle className="text-lg text-slate-900">System Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-700">Database</span>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-xs text-green-600 font-semibold">Operational</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-700">Email Server</span>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-xs text-green-600 font-semibold">Operational</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-700">File Storage</span>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-xs text-green-600 font-semibold">Operational</span>
                  </div>
                </div>
                <div className="border-t border-slate-200 pt-3">
                  <p className="text-xs text-slate-600">Last checked: 5 minutes ago</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
