"use client"

import { useState } from "react"
import Header from "@/components/layout/Header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  BookOpen,
  Calendar,
  MapPin,
  Clock,
  Users,
  ChevronRight,
  AlertCircle,
  Building2,
  Utensils,
  MoreVertical,
  Search,
  Filter,
} from "lucide-react"

interface User {
  id: string
  name: string
  role: string
  email: string
  studentId?: string
  department?: string
}

interface StudentDashboardProps {
  user: User
  onLogout: () => void
}

export default function StudentDashboard({ user, onLogout }: StudentDashboardProps) {
  const [enrolledCourses] = useState([
    {
      id: "CS101",
      name: "Introduction to Computer Science",
      professor: "Dr. Michael Thompson",
      credits: 3,
      grade: "A-",
      nextClass: "Today at 2:00 PM",
      location: "Tech Building 101",
      status: "Active",
    },
    {
      id: "MATH201",
      name: "Calculus II",
      professor: "Dr. Emily Rodriguez",
      credits: 4,
      grade: "B+",
      nextClass: "Tomorrow at 10:30 AM",
      location: "Science Hall 205",
      status: "Active",
    },
    {
      id: "ENG102",
      name: "Advanced Writing",
      professor: "Prof. James Wilson",
      credits: 3,
      grade: "A",
      nextClass: "Wednesday at 1:00 PM",
      location: "Arts Building 102",
      status: "Active",
    },
  ])

  const [upcomingEvents] = useState([
    {
      id: 1,
      title: "Tech Club Meeting",
      date: "Today",
      time: "5:00 PM",
      location: "Student Center 301",
      attendees: 24,
      category: "Clubs",
    },
    {
      id: 2,
      title: "Spring Career Fair",
      date: "This Saturday",
      time: "10:00 AM",
      location: "Main Gymnasium",
      attendees: 150,
      category: "Career",
    },
    {
      id: 3,
      title: "Campus BBQ Social",
      date: "Friday",
      time: "6:00 PM",
      location: "Green Lawn Area",
      attendees: 200,
      category: "Social",
    },
  ])

  const [assignments] = useState([
    {
      id: 1,
      course: "CS101",
      title: "Programming Assignment 5",
      dueDate: "Tomorrow",
      status: "Not Started",
      priority: "High",
    },
    {
      id: 2,
      course: "MATH201",
      title: "Problem Set Chapter 8",
      dueDate: "In 3 days",
      status: "In Progress",
      priority: "Medium",
    },
    {
      id: 3,
      course: "ENG102",
      title: "Essay: Modern Literature",
      dueDate: "In 5 days",
      status: "In Progress",
      priority: "Medium",
    },
  ])

  const [campusServices] = useState([
    {
      id: 1,
      name: "Health Center",
      icon: Building2,
      location: "Medical Building",
      hours: "8:00 AM - 5:00 PM",
      phone: "(555) 123-4567",
    },
    {
      id: 2,
      name: "Library",
      icon: BookOpen,
      location: "Central Library",
      hours: "7:00 AM - 10:00 PM",
      phone: "(555) 123-4568",
    },
    {
      id: 3,
      name: "Dining",
      icon: Utensils,
      location: "Student Center",
      hours: "7:00 AM - 8:00 PM",
      phone: "(555) 123-4569",
    },
  ])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Header user={user} onLogout={onLogout} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Banner */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-slate-900 rounded-xl p-8 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-4xl font-bold mb-2">Welcome back, {user.name}!</h2>
                <p className="text-blue-100">Spring 2024 Semester • {user.studentId}</p>
              </div>
              <div className="hidden md:flex flex-col items-end gap-2">
                <Badge className="bg-white text-blue-600 font-semibold">Active Student</Badge>
                <p className="text-blue-100 text-sm">3.85 GPA</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-slate-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-4xl font-bold text-blue-600 mb-1">3</p>
                <p className="text-slate-600 text-sm">Courses Enrolled</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-4xl font-bold text-green-600 mb-1">12</p>
                <p className="text-slate-600 text-sm">Credits This Semester</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-4xl font-bold text-orange-600 mb-1">3</p>
                <p className="text-slate-600 text-sm">Pending Assignments</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-4xl font-bold text-purple-600 mb-1">8</p>
                <p className="text-slate-600 text-sm">Events This Week</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Left Column - Courses and Assignments */}
          <div className="lg:col-span-2 space-y-8">
            {/* Enrolled Courses */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-slate-900">Your Courses</h3>
                <Button variant="outline" size="sm" className="gap-2 text-blue-600 border-blue-300 hover:bg-blue-50 bg-transparent">
                  <Search className="w-4 h-4" />
                  Browse All
                </Button>
              </div>

              <div className="space-y-4">
                {enrolledCourses.map((course) => (
                  <Card key={course.id} className="border-slate-200 hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-blue-100 text-blue-700 border-blue-300">{course.id}</Badge>
                            <Badge className="bg-green-100 text-green-700 border-green-300">{course.credits} Credits</Badge>
                          </div>
                          <h4 className="text-lg font-semibold text-slate-900">{course.name}</h4>
                          <p className="text-sm text-slate-600 mt-1">{course.professor}</p>
                        </div>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-5 h-5 text-slate-400" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-3 gap-4 py-4 border-t border-b border-slate-100">
                        <div>
                          <p className="text-xs text-slate-600 mb-1">Grade</p>
                          <p className="font-semibold text-slate-900">{course.grade}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-600 mb-1">Next Class</p>
                          <p className="text-sm text-slate-900">{course.nextClass}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-600 mb-1">Location</p>
                          <p className="text-sm text-slate-900 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {course.location}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 text-slate-700 border-slate-300 hover:bg-slate-50 bg-transparent"
                        >
                          <BookOpen className="w-4 h-4 mr-2" />
                          Course Materials
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <Users className="w-4 h-4 mr-2" />
                          Join Class
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Assignments */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-slate-900">Assignments</h3>
                <Button variant="outline" size="sm" className="gap-2 text-blue-600 border-blue-300 hover:bg-blue-50 bg-transparent">
                  <Filter className="w-4 h-4" />
                  Filter
                </Button>
              </div>

              <div className="space-y-3">
                {assignments.map((assignment) => (
                  <Card key={assignment.id} className="border-slate-200">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-blue-100 text-blue-700">{assignment.course}</Badge>
                            <Badge
                              className={
                                assignment.priority === "High"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }
                            >
                              {assignment.priority}
                            </Badge>
                          </div>
                          <h4 className="font-semibold text-slate-900">{assignment.title}</h4>
                          <p className="text-sm text-slate-600 mt-1 flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            Due: {assignment.dueDate}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge
                            className={
                              assignment.status === "Not Started"
                                ? "bg-red-50 text-red-700 border-red-300"
                                : "bg-yellow-50 text-yellow-700 border-yellow-300"
                            }
                          >
                            {assignment.status}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Events and Services */}
          <div className="space-y-8">
            {/* Upcoming Events */}
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Campus Events</h3>
              <div className="space-y-3">
                {upcomingEvents.map((event) => (
                  <Card
                    key={event.id}
                    className="border-slate-200 hover:shadow-md transition-shadow cursor-pointer group"
                  >
                    <CardContent className="pt-4">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-200 transition-colors">
                          <Calendar className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-slate-900 line-clamp-1">{event.title}</h4>
                          <p className="text-xs text-slate-600 mt-1">{event.date} • {event.time}</p>
                          <p className="text-xs text-slate-600 flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3" />
                            {event.location}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge className="text-xs bg-blue-50 text-blue-700 border-blue-300">
                              {event.category}
                            </Badge>
                            <span className="text-xs text-slate-600">{event.attendees} attending</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4 text-blue-600 border-blue-300 hover:bg-blue-50 bg-transparent">
                View All Events
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            {/* Campus Services */}
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Campus Services</h3>
              <div className="space-y-3">
                {campusServices.map((service) => {
                  const IconComponent = service.icon
                  return (
                    <Card key={service.id} className="border-slate-200 hover:shadow-md transition-shadow">
                      <CardContent className="pt-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <IconComponent className="w-5 h-5 text-slate-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-slate-900">{service.name}</h4>
                            <p className="text-xs text-slate-600 mt-1 flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {service.location}
                            </p>
                            <p className="text-xs text-slate-600 flex items-center gap-1 mt-1">
                              <Clock className="w-3 h-3" />
                              {service.hours}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>

            {/* Alerts */}
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="pt-4">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-orange-900">Outstanding Balance</h4>
                    <p className="text-sm text-orange-700 mt-1">You have a balance of $250 due by March 31st.</p>
                    <Button size="sm" variant="outline" className="mt-3 text-orange-600 border-orange-300 hover:bg-orange-100 bg-transparent">
                      Pay Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
