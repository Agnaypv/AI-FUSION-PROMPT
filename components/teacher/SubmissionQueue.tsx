"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import {
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  MessageSquare,
  AlertTriangle,
  FileText,
  ImageIcon,
  Video,
  Download,
} from "lucide-react"

interface Submission {
  id: string
  studentName: string
  assignment: string
  subject: string
  submittedAt: Date
  type: "image" | "video" | "document"
  status: "pending" | "reviewing" | "approved" | "rejected"
  aiAnalysis: {
    plagiarismScore: number
    aiGeneratedScore: number
    confidence: number
    flags: string[]
    notes: string
  }
  mediaUrl?: string
  description: string
}

export default function SubmissionQueue() {
  const [selectedSubmission, setSelectedSubmission] = useState<string | null>(null)
  const [feedback, setFeedback] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")

  const submissions: Submission[] = [
    {
      id: "1",
      studentName: "Alex Johnson",
      assignment: "Plastic-Free Lunchbox Day",
      subject: "Environment",
      submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      type: "image",
      status: "pending",
      description: "My plastic-free lunch with reusable containers and homemade snacks.",
      aiAnalysis: {
        plagiarismScore: 0.05,
        aiGeneratedScore: 0.12,
        confidence: 0.89,
        flags: ["lowBrightness"],
        notes: "Image appears authentic with natural lighting variations. Low risk of AI generation.",
      },
    },
    {
      id: "2",
      studentName: "Emma Wilson",
      assignment: "Weekly Exercise Video",
      subject: "Physical Education",
      submittedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      type: "video",
      status: "pending",
      description: "Completed 20 push-ups and 30 jumping jacks as assigned.",
      aiAnalysis: {
        plagiarismScore: 0.02,
        aiGeneratedScore: 0.08,
        confidence: 0.95,
        flags: [],
        notes: "Video shows consistent movement patterns and natural audio. Very low risk of manipulation.",
      },
    },
    {
      id: "3",
      studentName: "Liam Chen",
      assignment: "Water Usage Tracking",
      subject: "Mathematics",
      submittedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      type: "document",
      status: "reviewing",
      description: "3-day water usage data with bar graph analysis.",
      aiAnalysis: {
        plagiarismScore: 0.35,
        aiGeneratedScore: 0.45,
        confidence: 0.72,
        flags: ["similarContent", "unusualFormatting"],
        notes: "Some sections show similarity to online templates. Moderate confidence in authenticity.",
      },
    },
    {
      id: "4",
      studentName: "Sophia Davis",
      assignment: "Creative Poem Presentation",
      subject: "English",
      submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      type: "video",
      status: "approved",
      description: "Original poem about nature using 10 vocabulary words.",
      aiAnalysis: {
        plagiarismScore: 0.08,
        aiGeneratedScore: 0.15,
        confidence: 0.91,
        flags: [],
        notes: "Creative content with personal expression. High confidence in student authenticity.",
      },
    },
  ]

  const filteredSubmissions = submissions.filter((sub) => {
    if (filterStatus === "all") return true
    return sub.status === filterStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200"
      case "reviewing":
        return "bg-blue-100 text-blue-700 border-blue-200"
      case "approved":
        return "bg-green-100 text-green-700 border-green-200"
      case "rejected":
        return "bg-red-100 text-red-700 border-red-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "image":
        return <ImageIcon className="w-4 h-4" />
      case "video":
        return <Video className="w-4 h-4" />
      case "document":
        return <FileText className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  const getRiskLevel = (aiAnalysis: Submission["aiAnalysis"]) => {
    const { plagiarismScore, aiGeneratedScore, confidence } = aiAnalysis
    if (plagiarismScore > 0.4 || aiGeneratedScore > 0.7) return "high"
    if (plagiarismScore > 0.2 || aiGeneratedScore > 0.4 || confidence < 0.8) return "medium"
    return "low"
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "high":
        return "text-red-600 bg-red-50 border-red-200"
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "low":
        return "text-green-600 bg-green-50 border-green-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const handleApprove = (submissionId: string) => {
    console.log("Approved submission:", submissionId, "Feedback:", feedback)
    setFeedback("")
    setSelectedSubmission(null)
  }

  const handleReject = (submissionId: string) => {
    console.log("Rejected submission:", submissionId, "Feedback:", feedback)
    setFeedback("")
    setSelectedSubmission(null)
  }

  const getTimeAgo = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(hours / 24)

    if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`
    return "Just now"
  }

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto">
        {[
          { id: "all", label: "All Submissions", count: submissions.length },
          { id: "pending", label: "Pending", count: submissions.filter((s) => s.status === "pending").length },
          { id: "reviewing", label: "Reviewing", count: submissions.filter((s) => s.status === "reviewing").length },
          { id: "approved", label: "Approved", count: submissions.filter((s) => s.status === "approved").length },
          { id: "rejected", label: "Rejected", count: submissions.filter((s) => s.status === "rejected").length },
        ].map((filter) => (
          <button
            key={filter.id}
            onClick={() => setFilterStatus(filter.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
              filterStatus === filter.id
                ? "bg-primary text-white shadow-md"
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            {filter.label}
            <Badge variant="secondary" className="text-xs">
              {filter.count}
            </Badge>
          </button>
        ))}
      </div>

      {/* Submissions List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredSubmissions.map((submission) => {
          const riskLevel = getRiskLevel(submission.aiAnalysis)
          return (
            <Card key={submission.id} className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg font-bold text-gray-800">{submission.studentName}</CardTitle>
                    <p className="text-sm text-gray-600">{submission.assignment}</p>
                  </div>
                  <Badge className={`${getStatusColor(submission.status)} text-xs`}>
                    {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Submission Details */}
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    {getTypeIcon(submission.type)}
                    <span className="capitalize">{submission.type}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {submission.subject}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {getTimeAgo(submission.submittedAt)}
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{submission.description}</p>

                {/* AI Analysis */}
                <Card className="bg-gray-50 border border-gray-200">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-800 text-sm">AI Analysis</h4>
                      <Badge className={`${getRiskColor(riskLevel)} text-xs border`}>
                        {riskLevel.toUpperCase()} RISK
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">Plagiarism Score</span>
                        <span className="font-medium">{(submission.aiAnalysis.plagiarismScore * 100).toFixed(1)}%</span>
                      </div>
                      <Progress value={submission.aiAnalysis.plagiarismScore * 100} className="h-1" />

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">AI Generated Score</span>
                        <span className="font-medium">
                          {(submission.aiAnalysis.aiGeneratedScore * 100).toFixed(1)}%
                        </span>
                      </div>
                      <Progress value={submission.aiAnalysis.aiGeneratedScore * 100} className="h-1" />

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">Confidence</span>
                        <span className="font-medium">{(submission.aiAnalysis.confidence * 100).toFixed(1)}%</span>
                      </div>
                      <Progress value={submission.aiAnalysis.confidence * 100} className="h-1" />
                    </div>

                    {submission.aiAnalysis.flags.length > 0 && (
                      <div className="mt-2">
                        <div className="flex items-center gap-1 text-xs text-orange-600 mb-1">
                          <AlertTriangle className="w-3 h-3" />
                          Flags Detected
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {submission.aiAnalysis.flags.map((flag, index) => (
                            <Badge key={index} variant="outline" className="text-xs text-orange-600 border-orange-200">
                              {flag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <p className="text-xs text-gray-600 mt-2 italic">{submission.aiAnalysis.notes}</p>
                  </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedSubmission(submission.id)}
                    className="flex-1 bg-transparent"
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    Review
                  </Button>
                  <Button variant="outline" size="sm" className="bg-transparent">
                    <Download className="w-3 h-3" />
                  </Button>
                </div>

                {/* Review Panel */}
                {selectedSubmission === submission.id && (
                  <div className="space-y-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 text-sm font-medium text-blue-800">
                      <MessageSquare className="w-4 h-4 mr-1" />
                      Provide Feedback
                    </div>
                    <Textarea
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Write your feedback for the student..."
                      className="min-h-[80px] bg-white"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleApprove(submission.id)}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReject(submission.id)}
                        className="border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
                      >
                        <XCircle className="w-3 h-3 mr-1" />
                        Reject
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setSelectedSubmission(null)}
                        className="text-gray-600"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredSubmissions.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No submissions found</h3>
          <p className="text-gray-500">
            {filterStatus === "all" ? "No submissions to review at the moment" : `No ${filterStatus} submissions`}
          </p>
        </div>
      )}
    </div>
  )
}
