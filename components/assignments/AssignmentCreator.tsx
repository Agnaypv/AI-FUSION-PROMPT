"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Camera, FileText, MapPin, Clock, Users, Target, CheckCircle, AlertTriangle } from "lucide-react"

interface Assignment {
  id: string
  title: string
  description: string
  subject: string
  type: "photo" | "video" | "document" | "location" | "quiz"
  dueDate: string
  points: number
  difficulty: "easy" | "medium" | "hard"
  requirements: string[]
  aiVerification: boolean
  status: "draft" | "published"
  submissions: number
  maxSubmissions: number
}

export default function AssignmentCreator() {
  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: "1",
      title: "Plant Growth Documentation",
      description: "Document the growth of a plant over 2 weeks with daily photos and measurements",
      subject: "Science",
      type: "photo",
      dueDate: "2024-02-15",
      points: 50,
      difficulty: "medium",
      requirements: ["Daily photos", "Growth measurements", "Written observations"],
      aiVerification: true,
      status: "published",
      submissions: 23,
      maxSubmissions: 30,
    },
    {
      id: "2",
      title: "Local History Interview",
      description: "Interview an elderly community member about local history and create a video report",
      subject: "Social Studies",
      type: "video",
      dueDate: "2024-02-20",
      points: 75,
      difficulty: "hard",
      requirements: ["10-minute video", "Interview transcript", "Historical context"],
      aiVerification: true,
      status: "published",
      submissions: 18,
      maxSubmissions: 25,
    },
    {
      id: "3",
      title: "Mathematical Patterns in Nature",
      description: "Find and photograph examples of mathematical patterns in your environment",
      subject: "Mathematics",
      type: "photo",
      dueDate: "2024-02-10",
      points: 40,
      difficulty: "easy",
      requirements: ["5 different patterns", "Mathematical explanations", "Location data"],
      aiVerification: true,
      status: "published",
      submissions: 28,
      maxSubmissions: 30,
    },
  ])

  const [showCreateForm, setShowCreateForm] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subject: "",
    type: "photo" as Assignment["type"],
    dueDate: "",
    points: 50,
    difficulty: "medium" as Assignment["difficulty"],
    requirements: [""],
    aiVerification: true,
    maxSubmissions: 30,
  })

  const subjects = ["Mathematics", "Science", "English", "Social Studies", "Art", "Physical Education"]
  const assignmentTypes = [
    { value: "photo", label: "Photo Documentation", icon: Camera },
    { value: "video", label: "Video Report", icon: FileText },
    { value: "document", label: "Written Report", icon: FileText },
    { value: "location", label: "Location-based", icon: MapPin },
    { value: "quiz", label: "Interactive Quiz", icon: Target },
  ]

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-700 border-green-200"
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200"
      case "hard":
        return "bg-red-100 text-red-700 border-red-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const getTypeIcon = (type: string) => {
    const typeConfig = assignmentTypes.find((t) => t.value === type)
    return typeConfig ? typeConfig.icon : FileText
  }

  const addRequirement = () => {
    setFormData({ ...formData, requirements: [...formData.requirements, ""] })
  }

  const updateRequirement = (index: number, value: string) => {
    const newRequirements = [...formData.requirements]
    newRequirements[index] = value
    setFormData({ ...formData, requirements: newRequirements })
  }

  const removeRequirement = (index: number) => {
    if (formData.requirements.length > 1) {
      const newRequirements = formData.requirements.filter((_, i) => i !== index)
      setFormData({ ...formData, requirements: newRequirements })
    }
  }

  const handleCreateAssignment = () => {
    const newAssignment: Assignment = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      subject: formData.subject,
      type: formData.type,
      dueDate: formData.dueDate,
      points: formData.points,
      difficulty: formData.difficulty,
      requirements: formData.requirements.filter((req) => req.trim()),
      aiVerification: formData.aiVerification,
      status: "published",
      submissions: 0,
      maxSubmissions: formData.maxSubmissions,
    }

    setAssignments([newAssignment, ...assignments])
    setShowCreateForm(false)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      subject: "",
      type: "photo",
      dueDate: "",
      points: 50,
      difficulty: "medium",
      requirements: [""],
      aiVerification: true,
      maxSubmissions: 30,
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Real-Life Assignments</h2>
          <p className="text-gray-600">Create engaging assignments that connect learning to the real world</p>
        </div>
        <Button
          onClick={() => setShowCreateForm(true)}
          className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Assignment
        </Button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-800">Create New Assignment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Title</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Assignment title"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Subject</label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select Subject</option>
                  {subjects.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detailed assignment description"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Assignment Type</label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {assignmentTypes.map((type) => {
                  const Icon = type.icon
                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, type: type.value as Assignment["type"] })}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        formData.type === type.value
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <Icon className="w-5 h-5 mx-auto mb-1" />
                      <span className="text-xs font-medium">{type.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Due Date</label>
                <Input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Points</label>
                <Input
                  type="number"
                  value={formData.points}
                  onChange={(e) => setFormData({ ...formData, points: Number.parseInt(e.target.value) || 0 })}
                  min="1"
                  max="100"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Difficulty</label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as Assignment["difficulty"] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Requirements</label>
              <div className="space-y-2">
                {formData.requirements.map((requirement, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={requirement}
                      onChange={(e) => updateRequirement(index, e.target.value)}
                      placeholder={`Requirement ${index + 1}`}
                      className="flex-1"
                    />
                    {formData.requirements.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeRequirement(index)}
                        className="px-3"
                      >
                        ×
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addRequirement}
                  className="w-full bg-transparent"
                >
                  + Add Requirement
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="aiVerification"
                  checked={formData.aiVerification}
                  onChange={(e) => setFormData({ ...formData, aiVerification: e.target.checked })}
                  className="rounded"
                />
                <label htmlFor="aiVerification" className="text-sm text-gray-700">
                  Enable AI Verification
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-700">Max Submissions:</label>
                <Input
                  type="number"
                  value={formData.maxSubmissions}
                  onChange={(e) => setFormData({ ...formData, maxSubmissions: Number.parseInt(e.target.value) || 30 })}
                  className="w-20"
                  min="1"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleCreateAssignment}
                disabled={!formData.title || !formData.subject || !formData.description}
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
              >
                Create Assignment
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreateForm(false)
                  resetForm()
                }}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Assignments List */}
      <div className="grid gap-4">
        {assignments.map((assignment) => {
          const Icon = getTypeIcon(assignment.type)
          const progressPercentage = (assignment.submissions / assignment.maxSubmissions) * 100

          return (
            <Card key={assignment.id} className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-bold text-gray-800">{assignment.title}</CardTitle>
                        <p className="text-sm text-gray-600">{assignment.subject}</p>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-3">{assignment.description}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <Badge className={`border ${getDifficultyColor(assignment.difficulty)}`}>
                        {assignment.difficulty}
                      </Badge>
                      <span className="flex items-center gap-1 text-gray-600">
                        <Clock className="w-4 h-4" />
                        Due: {new Date(assignment.dueDate).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1 text-gray-600">
                        <Target className="w-4 h-4" />
                        {assignment.points} points
                      </span>
                      <span className="flex items-center gap-1 text-gray-600">
                        <Users className="w-4 h-4" />
                        {assignment.submissions}/{assignment.maxSubmissions} submissions
                      </span>
                      {assignment.aiVerification && (
                        <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          AI Verified
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      View Submissions
                    </Button>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Requirements */}
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">Requirements:</h4>
                    <div className="flex flex-wrap gap-2">
                      {assignment.requirements.map((req, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {req}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">Submission Progress</span>
                      <span className="text-sm text-gray-600">{progressPercentage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Status Indicators */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1 text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        {Math.floor(assignment.submissions * 0.8)} Approved
                      </span>
                      <span className="flex items-center gap-1 text-yellow-600">
                        <Clock className="w-4 h-4" />
                        {Math.floor(assignment.submissions * 0.15)} Pending
                      </span>
                      <span className="flex items-center gap-1 text-red-600">
                        <AlertTriangle className="w-4 h-4" />
                        {Math.floor(assignment.submissions * 0.05)} Needs Review
                      </span>
                    </div>
                    <Badge
                      className={
                        assignment.status === "published"
                          ? "bg-green-100 text-green-700 border-green-200"
                          : "bg-gray-100 text-gray-700 border-gray-200"
                      }
                    >
                      {assignment.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
