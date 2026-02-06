"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Download,
  MapPin,
  Calendar,
  User,
  AlertTriangle,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
} from "lucide-react"

interface Submission {
  id: string
  studentName: string
  studentId: string
  assignmentTitle: string
  submittedAt: string
  status: "pending" | "approved" | "rejected" | "needs_review"
  aiScore: number
  teacherScore?: number
  files: {
    type: "image" | "video" | "document"
    url: string
    name: string
    size: string
  }[]
  location?: {
    lat: number
    lng: number
    address: string
  }
  notes: string
  aiAnalysis: {
    authenticity: number
    relevance: number
    quality: number
    feedback: string
  }
  teacherFeedback?: string
}

export default function SubmissionViewer() {
  const [submissions, setSubmissions] = useState<Submission[]>([
    {
      id: "1",
      studentName: "Alex Johnson",
      studentId: "STU001",
      assignmentTitle: "Plant Growth Documentation",
      submittedAt: "2024-01-15T10:30:00Z",
      status: "pending",
      aiScore: 85,
      files: [
        {
          type: "image",
          url: "/plant-day1.jpg",
          name: "plant-day1.jpg",
          size: "2.3 MB",
        },
        {
          type: "image",
          url: "/plant-day7.jpg",
          name: "plant-day7.jpg",
          size: "2.1 MB",
        },
        {
          type: "document",
          url: "/growth-log.pdf",
          name: "growth-log.pdf",
          size: "1.2 MB",
        },
      ],
      location: {
        lat: 40.7128,
        lng: -74.006,
        address: "Home Garden, New York",
      },
      notes:
        "I documented my tomato plant's growth over 14 days. The plant showed significant growth in the first week.",
      aiAnalysis: {
        authenticity: 92,
        relevance: 88,
        quality: 82,
        feedback:
          "Images show consistent lighting and angle. Growth progression is clearly documented. Measurements appear accurate.",
      },
    },
    {
      id: "2",
      studentName: "Emma Wilson",
      studentId: "STU002",
      assignmentTitle: "Mathematical Patterns in Nature",
      submittedAt: "2024-01-14T15:45:00Z",
      status: "approved",
      aiScore: 94,
      teacherScore: 92,
      files: [
        {
          type: "image",
          url: "/fibonacci-spiral.jpg",
          name: "fibonacci-spiral.jpg",
          size: "3.1 MB",
        },
        {
          type: "image",
          url: "/hexagon-pattern.jpg",
          name: "hexagon-pattern.jpg",
          size: "2.8 MB",
        },
        {
          type: "document",
          url: "/math-analysis.pdf",
          name: "math-analysis.pdf",
          size: "1.8 MB",
        },
      ],
      location: {
        lat: 40.7589,
        lng: -73.9851,
        address: "Central Park, New York",
      },
      notes: "Found amazing examples of Fibonacci spirals in pinecones and hexagonal patterns in honeycomb structures.",
      aiAnalysis: {
        authenticity: 96,
        relevance: 94,
        quality: 92,
        feedback:
          "Excellent documentation of mathematical patterns. Clear explanations and accurate measurements provided.",
      },
      teacherFeedback:
        "Outstanding work! Your analysis of the Fibonacci sequence in nature is thorough and well-presented.",
    },
    {
      id: "3",
      studentName: "Michael Chen",
      studentId: "STU003",
      assignmentTitle: "Local History Interview",
      submittedAt: "2024-01-13T09:20:00Z",
      status: "needs_review",
      aiScore: 76,
      files: [
        {
          type: "video",
          url: "/history-interview.mp4",
          name: "history-interview.mp4",
          size: "45.2 MB",
        },
        {
          type: "document",
          url: "/interview-transcript.pdf",
          name: "interview-transcript.pdf",
          size: "2.1 MB",
        },
      ],
      notes:
        "Interviewed my grandfather about the neighborhood's history in the 1960s. He shared fascinating stories about local businesses.",
      aiAnalysis: {
        authenticity: 88,
        relevance: 82,
        quality: 68,
        feedback: "Audio quality could be improved. Content is relevant but video editing needs enhancement.",
      },
    },
  ])

  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected" | "needs_review">("all")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700 border-green-200"
      case "rejected":
        return "bg-red-100 text-red-700 border-red-200"
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200"
      case "needs_review":
        return "bg-orange-100 text-orange-700 border-orange-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4" />
      case "rejected":
        return <XCircle className="w-4 h-4" />
      case "pending":
        return <Clock className="w-4 h-4" />
      case "needs_review":
        return <AlertTriangle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const handleApprove = (submissionId: string, score: number) => {
    setSubmissions(
      submissions.map((sub) =>
        sub.id === submissionId ? { ...sub, status: "approved" as const, teacherScore: score } : sub,
      ),
    )
  }

  const handleReject = (submissionId: string, feedback: string) => {
    setSubmissions(
      submissions.map((sub) =>
        sub.id === submissionId ? { ...sub, status: "rejected" as const, teacherFeedback: feedback } : sub,
      ),
    )
  }

  const filteredSubmissions = submissions.filter((sub) => filter === "all" || sub.status === filter)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Assignment Submissions</h2>
          <p className="text-gray-600">Review and grade student submissions with AI assistance</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as typeof filter)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Submissions</option>
            <option value="pending">Pending Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="needs_review">Needs Review</option>
          </select>
        </div>
      </div>

      {/* Submissions Grid */}
      <div className="grid gap-4">
        {filteredSubmissions.map((submission) => (
          <Card key={submission.id} className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold text-gray-800">{submission.studentName}</CardTitle>
                      <p className="text-sm text-gray-600">{submission.assignmentTitle}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(submission.submittedAt).toLocaleDateString()}
                    </span>
                    {submission.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {submission.location.address}
                      </span>
                    )}
                    <Badge className={`border ${getStatusColor(submission.status)}`}>
                      {getStatusIcon(submission.status)}
                      <span className="ml-1 capitalize">{submission.status.replace("_", " ")}</span>
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-800">AI Score: {submission.aiScore}%</div>
                    {submission.teacherScore && (
                      <div className="text-sm text-gray-600">Teacher: {submission.teacherScore}%</div>
                    )}
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setSelectedSubmission(submission)}>
                    <Eye className="w-4 h-4 mr-1" />
                    Review
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Files */}
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Submitted Files:</h4>
                  <div className="flex flex-wrap gap-2">
                    {submission.files.map((file, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg border">
                        <div className="p-1 bg-primary/10 rounded">
                          {file.type === "image" && <Eye className="w-4 h-4 text-primary" />}
                          {file.type === "video" && <Eye className="w-4 h-4 text-primary" />}
                          {file.type === "document" && <Download className="w-4 h-4 text-primary" />}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">{file.name}</p>
                          <p className="text-xs text-gray-600">{file.size}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Student Notes */}
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Student Notes:</h4>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{submission.notes}</p>
                </div>

                {/* AI Analysis */}
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">AI Analysis:</h4>
                  <div className="bg-blue-50 p-3 rounded-lg space-y-2">
                    <div className="flex items-center gap-4 text-sm">
                      <span>Authenticity: {submission.aiAnalysis.authenticity}%</span>
                      <span>Relevance: {submission.aiAnalysis.relevance}%</span>
                      <span>Quality: {submission.aiAnalysis.quality}%</span>
                    </div>
                    <p className="text-sm text-gray-700">{submission.aiAnalysis.feedback}</p>
                  </div>
                </div>

                {/* Teacher Feedback */}
                {submission.teacherFeedback && (
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">Teacher Feedback:</h4>
                    <p className="text-sm text-gray-700 bg-green-50 p-3 rounded-lg">{submission.teacherFeedback}</p>
                  </div>
                )}

                {/* Action Buttons */}
                {submission.status === "pending" || submission.status === "needs_review" ? (
                  <div className="flex items-center gap-2 pt-2">
                    <Button
                      size="sm"
                      onClick={() => handleApprove(submission.id, 90)}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <ThumbsUp className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleReject(submission.id, "Please resubmit with improvements")}
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <ThumbsDown className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                    <Button size="sm" variant="outline">
                      <MessageSquare className="w-4 h-4 mr-1" />
                      Add Feedback
                    </Button>
                  </div>
                ) : null}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Review Modal would go here */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Detailed Review - {selectedSubmission.studentName}</CardTitle>
                <Button variant="outline" onClick={() => setSelectedSubmission(null)}>
                  Close
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Detailed review content would go here */}
              <p className="text-gray-600">Detailed submission review interface would be implemented here.</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
