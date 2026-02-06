"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, FileText, Mail, Plus, TrendingUp, AlertCircle, CheckCircle, Clock } from "lucide-react"

interface GradeRecord {
  courseId: string
  courseName: string
  credits: number
  letterGrade: string
  numericGrade: number
  semester: string
}

interface Transcript {
  id: string
  gpa: number
  totalCredits: number
  standinng: "Good" | "Academic Probation" | "Dean's List"
  graduationDate: string
  degree: string
}

const gpa = 3.65
const academicStanding = "Dean's List"

const gradeHistory: GradeRecord[] = [
  {
    courseId: "CS101",
    courseName: "Introduction to Computer Science",
    credits: 3,
    letterGrade: "A",
    numericGrade: 95,
    semester: "Fall 2023",
  },
  {
    courseId: "MATH201",
    courseName: "Calculus II",
    credits: 4,
    letterGrade: "A-",
    numericGrade: 92,
    semester: "Fall 2023",
  },
  {
    courseId: "ENG102",
    courseName: "Advanced Writing",
    credits: 3,
    letterGrade: "A",
    numericGrade: 94,
    semester: "Fall 2023",
  },
  {
    courseId: "PHYS201",
    courseName: "Physics II",
    credits: 4,
    letterGrade: "B+",
    numericGrade: 89,
    semester: "Spring 2023",
  },
  {
    courseId: "CS201",
    courseName: "Data Structures",
    credits: 3,
    letterGrade: "A-",
    numericGrade: 91,
    semester: "Spring 2023",
  },
]

export default function AcademicManagement() {
  const [activeTab, setActiveTab] = useState<"grades" | "transcript" | "enrollment" | "advising">("grades")

  const calculateSemesterGPA = (semester: string) => {
    const semesterGrades = gradeHistory.filter((g) => g.semester === semester)
    if (semesterGrades.length === 0) return 0
    const totalPoints = semesterGrades.reduce((sum, g) => sum + g.numericGrade * g.credits, 0)
    const totalCredits = semesterGrades.reduce((sum, g) => sum + g.credits, 0)
    return (totalPoints / totalCredits / 25).toFixed(2)
  }

  const getSemesters = () => {
    return Array.from(new Set(gradeHistory.map((g) => g.semester)))
  }

  const getLetterGradeColor = (grade: string) => {
    switch (grade) {
      case "A":
      case "A+":
        return "bg-green-100 text-green-700 border-green-300"
      case "A-":
      case "B+":
        return "bg-blue-100 text-blue-700 border-blue-300"
      case "B":
        return "bg-slate-100 text-slate-700 border-slate-300"
      default:
        return "bg-orange-100 text-orange-700 border-orange-300"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Academic Management</h2>
        <p className="text-slate-600">View grades, transcript, course registration, and academic advising</p>
      </div>

      {/* Academic Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-slate-200 bg-gradient-to-br from-green-50 to-slate-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-slate-600 text-sm mb-2">Current GPA</p>
              <p className="text-5xl font-bold text-green-600">{gpa}</p>
              <Badge className="mt-3 bg-green-100 text-green-700 border-green-300">{academicStanding}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-slate-600 text-sm mb-2">Total Credits</p>
              <p className="text-5xl font-bold text-blue-600">87</p>
              <p className="text-xs text-slate-600 mt-2">45 Credits Remaining</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-slate-600 text-sm mb-2">Graduation</p>
              <p className="text-2xl font-bold text-slate-900">May 2025</p>
              <p className="text-xs text-slate-600 mt-2">14 months away</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 overflow-x-auto">
        {[
          { id: "grades", label: "Grades & GPA" },
          { id: "transcript", label: "Transcript" },
          { id: "enrollment", label: "Course Registration" },
          { id: "advising", label: "Academic Advising" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-3 font-medium whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {/* Grades Tab */}
        {activeTab === "grades" && (
          <div className="space-y-6">
            {getSemesters().map((semester) => (
              <div key={semester}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-slate-900">{semester}</h3>
                  <Badge className="bg-blue-100 text-blue-700 border-blue-300">
                    GPA: {calculateSemesterGPA(semester)}
                  </Badge>
                </div>

                <div className="space-y-3">
                  {gradeHistory
                    .filter((g) => g.semester === semester)
                    .map((grade) => (
                      <Card key={grade.courseId} className="border-slate-200">
                        <CardContent className="pt-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold text-slate-900">{grade.courseName}</h4>
                              <p className="text-sm text-slate-600">{grade.courseId} • {grade.credits} Credits</p>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-center">
                                <p className="text-xs text-slate-600 mb-1">Score</p>
                                <p className="text-2xl font-bold text-slate-900">{grade.numericGrade}</p>
                              </div>
                              <Badge className={getLetterGradeColor(grade.letterGrade)}>
                                {grade.letterGrade}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Transcript Tab */}
        {activeTab === "transcript" && (
          <div className="space-y-4">
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg">Official Transcript</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-600">
                  Download or request an official transcript to be sent to other institutions or employers.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                    <Download className="w-4 h-4" />
                    Download PDF
                  </Button>
                  <Button variant="outline" className="gap-2 text-slate-700 border-slate-300 hover:bg-slate-50 bg-transparent">
                    <Mail className="w-4 h-4" />
                    Request Official Copy
                  </Button>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <div className="text-sm text-blue-900">
                      <p className="font-semibold mb-1">Unofficial Transcript</p>
                      <p>The PDF download shows an unofficial transcript. For official transcripts, request through the system.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Course Registration Tab */}
        {activeTab === "enrollment" && (
          <div className="space-y-4">
            <Card className="border-slate-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Spring 2024 Registration</CardTitle>
                  <Badge className="bg-green-100 text-green-700 border-green-300">Open</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-sm text-slate-600 mb-1">Credits Selected</p>
                    <p className="text-2xl font-bold text-slate-900">12</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-sm text-slate-600 mb-1">Max Allowed</p>
                    <p className="text-2xl font-bold text-slate-900">18</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-sm text-slate-600 mb-1">Registration Deadline</p>
                    <p className="text-lg font-bold text-slate-900">April 15</p>
                  </div>
                </div>

                <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="w-4 h-4" />
                  Browse & Add Courses
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Academic Advising Tab */}
        {activeTab === "advising" && (
          <div className="space-y-4">
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg">Academic Advisor</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <h4 className="font-semibold text-slate-900 mb-2">Dr. Emily Rodriguez</h4>
                  <p className="text-sm text-slate-600 mb-4">Computer Science Department</p>
                  <div className="space-y-2 text-sm text-slate-700">
                    <p>
                      <span className="font-semibold">Email:</span> e.rodriguez@university.edu
                    </p>
                    <p>
                      <span className="font-semibold">Phone:</span> (555) 123-4580
                    </p>
                    <p>
                      <span className="font-semibold">Office:</span> Science Building, Room 405
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="font-semibold text-slate-900">Office Hours</p>
                  <div className="space-y-1 text-sm text-slate-700">
                    <p>Monday & Wednesday: 2:00 PM - 4:00 PM</p>
                    <p>Thursday: 10:00 AM - 12:00 PM</p>
                    <p>By appointment on other days</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1 gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                    <Mail className="w-4 h-4" />
                    Send Email
                  </Button>
                  <Button variant="outline" className="flex-1 gap-2 text-slate-700 border-slate-300 hover:bg-slate-50 bg-transparent">
                    <Clock className="w-4 h-4" />
                    Schedule Meeting
                  </Button>
                </div>

                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="flex gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                    <div className="text-sm text-amber-900">
                      <p className="font-semibold mb-1">Upcoming Graduation Audit</p>
                      <p>Schedule your graduation audit with your advisor by May 15th to ensure you meet all requirements.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
