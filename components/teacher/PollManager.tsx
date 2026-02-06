"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus } from "lucide-react"

interface Poll {
  id: string
  question: string
  options: { id: string; text: string; votes: number }[]
  totalVotes: number
  category: string
  visibleTo: string[]
  createdAt: Date
  endAt: Date
  status: "active" | "ended"
  anonymous: boolean
}

export default function PollManager() {
  const [polls, setPolls] = useState<Poll[]>([
    {
      id: "1",
      question: "Which subject do you find the most difficult?",
      options: [
        { id: "math", text: "Mathematics", votes: 12 },
        { id: "science", text: "Science", votes: 8 },
        { id: "english", text: "English", votes: 5 },
        { id: "social", text: "Social Studies", votes: 3 },
      ],
      totalVotes: 28,
      category: "General",
      visibleTo: ["Class 10A"],
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      endAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      status: "active",
      anonymous: true,
    },
    {
      id: "2",
      question: "Which Math topic needs more revision?",
      options: [
        { id: "algebra", text: "Algebra", votes: 15 },
        { id: "geometry", text: "Geometry", votes: 10 },
        { id: "trigonometry", text: "Trigonometry", votes: 18 },
        { id: "calculus", text: "Calculus", votes: 7 },
      ],
      totalVotes: 50,
      category: "Mathematics",
      visibleTo: ["Class 10A", "Class 10B"],
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      endAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      status: "active",
      anonymous: true,
    },
    {
      id: "3",
      question: "How would you rate today's Science experiment?",
      options: [
        { id: "excellent", text: "Excellent", votes: 22 },
        { id: "good", text: "Good", votes: 15 },
        { id: "average", text: "Average", votes: 8 },
        { id: "poor", text: "Needs Improvement", votes: 2 },
      ],
      totalVotes: 47,
      category: "Science",
      visibleTo: ["Class 10A"],
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      endAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      status: "ended",
      anonymous: false,
    },
  ])

  const [showCreateForm, setShowCreateForm] = useState(false)
  const [formData, setFormData] = useState({
    question: "",
    options: ["", ""],
    category: "",
    visibleTo: [] as string[],
    endDate: "",
    anonymous: true,
  })

  const categories = ["General", "Mathematics", "Science", "English", "Social Studies", "Environment"]
  const classes = ["Class 10A", "Class 10B", "Class 10C"]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700 border-green-200"
      case "ended":
        return "bg-gray-100 text-gray-700 border-gray-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const getTimeRemaining = (endDate: Date) => {
    const now = new Date()
    const diff = endDate.getTime() - now.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

    if (diff < 0) return "Ended"
    if (days > 0) return `${days}d ${hours}h left`
    if (hours > 0) return `${hours}h left`
    return "Ending soon"
  }

  const addOption = () => {
    if (formData.options.length < 6) {
      setFormData({ ...formData, options: [...formData.options, ""] })
    }
  }

  const removeOption = (index: number) => {
    if (formData.options.length > 2) {
      const newOptions = formData.options.filter((_, i) => i !== index)
      setFormData({ ...formData, options: newOptions })
    }
  }

  const updateOption = (index: number, value: string) => {
    const newOptions = [...formData.options]
    newOptions[index] = value
    setFormData({ ...formData, options: newOptions })
  }

  const handleCreatePoll = () => {
    const newPoll: Poll = {
      id: Date.now().toString(),
      question: formData.question,
      options: formData.options
        .filter((opt) => opt.trim())
        .map((opt, index) => ({
          id: `option_${index}`,
          text: opt.trim(),
          votes: 0,
        })),
      totalVotes: 0,
      category: formData.category,
      visibleTo: formData.visibleTo,
      createdAt: new Date(),
      endAt: new Date(formData.endDate),
      status: "active",
      anonymous: formData.anonymous,
    }

    setPolls([newPoll, ...polls])
    setShowCreateForm(false)
    resetForm()
  }

  const handleDeletePoll = (pollId: string) => {
    setPolls(polls.filter((p) => p.id !== pollId))
  }

  const resetForm = () => {
    setFormData({
      question: "",
      options: ["", ""],
      category: "",
      visibleTo: [],
      endDate: "",
      anonymous: true,
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Poll Manager</h2>
          <p className="text-gray-600">Create polls to gather student feedback and identify learning needs</p>
        </div>
        <Button
          onClick={() => setShowCreateForm(true)}
          className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Poll
        </Button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-800">Create New Poll</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Question</label>
              <Input
                value={formData.question}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                placeholder="What would you like to ask your students?"
                className="w-full"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Options</label>
              <div className="space-y-2">
                {formData.options.map((option, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                      className="flex-1"
                    />
                    {formData.options.length > 2 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeOption(index)}
                        className="px-3"
                      >
                        ×
                      </Button>
                    )}
                  </div>
                ))}
                {formData.options.length < 6 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addOption}
                    className="w-full bg-transparent"
                  >
                    + Add Option
                  </Button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">End Date</label>
                <Input
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Visible To</label>
              <div className="flex flex-wrap gap-2">
                {classes.map((cls) => (
                  <label key={cls} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.visibleTo.includes(cls)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({ ...formData, visibleTo: [...formData.visibleTo, cls] })
                        } else {
                          setFormData({
                            ...formData,
                            visibleTo: formData.visibleTo.filter((c) => c !== cls),
                          })
                        }
                      }}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-700">{cls}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="anonymous"
                checked={formData.anonymous}
                onChange={(e) => setFormData({ ...formData, anonymous: e.target.checked })}
                className="rounded"
              />
              <label htmlFor="anonymous" className="text-sm text-gray-700">
                Anonymous Poll
              </label>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleCreatePoll}
                disabled={!formData.question || formData.options.filter((o) => o.trim()).length < 2}
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
              >
                Create Poll
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

      {/* Polls List */}
      <div className="grid gap-4">
        {polls.map((poll) => (
          <Card key={poll.id} className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg font-bold text-gray-800 mb-2">{poll.question}</CardTitle>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">{poll.category}</span>
                    <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(poll.status)}`}>
                      {poll.status === "active" ? getTimeRemaining(poll.endAt) : "Ended"}
                    </span>
                    <span>{poll.totalVotes} votes</span>
                    {poll.anonymous && <span className="text-green-600">Anonymous</span>}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeletePoll(poll.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  Delete
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {poll.options.map((option) => {
                  const percentage = poll.totalVotes > 0 ? (option.votes / poll.totalVotes) * 100 : 0
                  return (
                    <div key={option.id} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-700">{option.text}</span>
                        <span className="text-gray-600">
                          {option.votes} ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="mt-4 text-xs text-gray-500">
                Created: {poll.createdAt.toLocaleDateString()} • Visible to: {poll.visibleTo.join(", ")}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
