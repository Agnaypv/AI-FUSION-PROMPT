"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Upload, Camera, FileText, Clock, CheckCircle, AlertCircle, Target } from "lucide-react"
import AssignmentSubmissionModal from "@/components/assignments/AssignmentSubmissionModal"

interface Assignment {
  id: string
  title: string
  subject: string
  description: string
  type: "image" | "video" | "document"
  dueDate: Date
  status: "pending" | "submitted" | "approved" | "rejected"
  xpReward: number
  difficulty: "Easy" | "Medium" | "Hard"
}

export default function RealLifeAssignments() {
  const [selectedAssignment, setSelectedAssignment] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [showSubmissionModal, setShowSubmissionModal] = useState(false)
  const [assignmentToSubmit, setAssignmentToSubmit] = useState<Assignment | null>(null)

  const assignments: Assignment[] = [
    {
      id: "1",
      title: "Write a Creative Poem",
      subject: "English",
      description: "Write a short poem using 10 new vocabulary words and present it in class or record a video.",
      type: "video",
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      status: "pending",
      xpReward: 50,
      difficulty: "Medium",
    },
    {
      id: "2",
      title: "Water Usage Tracking",
      subject: "Mathematics",
      description: "Track water usage at home for 3 days and create a bar graph in the app.",
      type: "image",
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      status: "pending",
      xpReward: 40,
      difficulty: "Easy",
    },
    {
      id: "3",
      title: "Renewable Energy Model",
      subject: "Science",
      description: "Build a small renewable energy model (windmill with cardboard/fan) and demonstrate it.",
      type: "video",
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      status: "pending",
      xpReward: 75,
      difficulty: "Hard",
    },
    {
      id: "4",
      title: "Interview a Grandparent",
      subject: "Social Studies",
      description: "Interview a grandparent/neighbor about how life was 30 years ago and record key points.",
      type: "document",
      dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      status: "submitted",
      xpReward: 60,
      difficulty: "Medium",
    },
    {
      id: "5",
      title: "Plastic-Free Lunchbox Day",
      subject: "Environment",
      description: "Do a plastic-free lunchbox day and share a photo with explanation.",
      type: "image",
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      status: "approved",
      xpReward: 30,
      difficulty: "Easy",
    },
    {
      id: "6",
      title: "Weekly Exercise Video",
      subject: "Physical Education",
      description: "Upload a video of this week's assigned exercise routine (mandatory weekly upload).",
      type: "video",
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      status: "pending",
      xpReward: 25,
      difficulty: "Easy",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200"
      case "submitted":
        return "bg-blue-100 text-blue-700 border-blue-200"
      case "approved":
        return "bg-green-100 text-green-700 border-green-200"
      case "rejected":
        return "bg-red-100 text-red-700 border-red-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-3 h-3" />
      case "submitted":
        return <Upload className="w-3 h-3" />
      case "approved":
        return <CheckCircle className="w-3 h-3" />
      case "rejected":
        return <AlertCircle className="w-3 h-3" />
      default:
        return <Clock className="w-3 h-3" />
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "image":
        return <Camera className="w-4 h-4" />
      case "video":
        return <Camera className="w-4 h-4" />
      case "document":
        return <FileText className="w-4 h-4" />
      default:
        return <Upload className="w-4 h-4" />
    }
  }

  const getDaysRemaining = (dueDate: Date) => {
    const now = new Date()
    const diff = dueDate.getTime() - now.getTime()
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24))

    if (days < 0) return "Overdue"
    if (days === 0) return "Due today"
    if (days === 1) return "Due tomorrow"
    return `${days} days left`
  }

  const handleSubmitAssignment = (assignmentId: string) => {
    const assignment = assignments.find((a) => a.id === assignmentId)
    if (assignment) {
      setAssignmentToSubmit(assignment)
      setShowSubmissionModal(true)
    }
  }

  const handleSubmissionComplete = (submissionData: any) => {
    console.log("Submission completed:", submissionData)
    setShowSubmissionModal(false)
    setAssignmentToSubmit(null)
    // In a real app, you'd update the assignment status here
  }

  return (
    <>
      <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              <Target className="w-3 h-3 text-white" />
            </div>
            Real-Life Assignments
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {assignments.map((assignment) => (
            <Card key={assignment.id} className="border border-gray-200">
              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* Assignment Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-800">{assignment.title}</h3>
                        <Badge variant="outline" className="text-xs">
                          {assignment.subject}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{assignment.description}</p>
                    </div>
                    <Badge className={`${getStatusColor(assignment.status)} text-xs`}>
                      {getStatusIcon(assignment.status)}
                      <span className="ml-1 capitalize">{assignment.status}</span>
                    </Badge>
                  </div>

                  {/* Assignment Details */}
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      {getTypeIcon(assignment.type)}
                      <span className="capitalize">{assignment.type}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {getDaysRemaining(assignment.dueDate)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Target className="w-4 h-4" />
                      {assignment.xpReward} XP
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {assignment.difficulty}
                    </Badge>
                  </div>

                  {/* Action Button */}
                  {assignment.status === "pending" && (
                    <Button
                      size="sm"
                      onClick={() => handleSubmitAssignment(assignment.id)}
                      disabled={isUploading && selectedAssignment === assignment.id}
                      className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                    >
                      <Upload className="w-3 h-3 mr-1" />
                      Submit Proof
                    </Button>
                  )}

                  {assignment.status === "submitted" && (
                    <div className="p-2 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm text-blue-700">✓ Submitted successfully. Waiting for teacher review.</p>
                    </div>
                  )}

                  {assignment.status === "approved" && (
                    <div className="p-2 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-sm text-green-700">✓ Approved! You earned {assignment.xpReward} XP.</p>
                    </div>
                  )}

                  {assignment.status === "rejected" && (
                    <div className="p-2 bg-red-50 rounded-lg border border-red-200">
                      <p className="text-sm text-red-700">✗ Needs revision. Check teacher feedback and resubmit.</p>
                      <Button size="sm" variant="outline" className="mt-2 bg-transparent">
                        View Feedback
                      </Button>
                    </div>
                  )}

                  {/* Upload Progress */}
                  {isUploading && selectedAssignment === assignment.id && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Uploading...</span>
                        <span className="text-gray-600">{uploadProgress}%</span>
                      </div>
                      <Progress value={uploadProgress} className="h-2" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* Submission Modal */}
      {showSubmissionModal && assignmentToSubmit && (
        <AssignmentSubmissionModal
          assignment={assignmentToSubmit}
          onClose={() => {
            setShowSubmissionModal(false)
            setAssignmentToSubmit(null)
          }}
          onSubmit={handleSubmissionComplete}
        />
      )}
    </>
  )
}
