"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2, Users, Calendar, Target } from "lucide-react"

interface Quest {
  id: string
  title: string
  subject: string
  description: string
  type: "realworld" | "game" | "quiz"
  instructions: string
  groupAllowed: boolean
  startDate: Date
  endDate: Date
  rewardXP: number
  rewardEcoCoins: number
  assignedTo: string[]
  submissions: number
  status: "draft" | "active" | "completed"
}

export default function QuestManager() {
  const [quests, setQuests] = useState<Quest[]>([
    {
      id: "1",
      title: "Plastic-Free Lunchbox Challenge",
      subject: "Environment",
      description: "Promote environmental awareness through practical action",
      type: "realworld",
      instructions: "Pack a completely plastic-free lunch for one day and document it with photos.",
      groupAllowed: false,
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      rewardXP: 50,
      rewardEcoCoins: 25,
      assignedTo: ["Class 10A"],
      submissions: 18,
      status: "active",
    },
    {
      id: "2",
      title: "Water Usage Mathematics",
      subject: "Mathematics",
      description: "Apply mathematical concepts to real-world data collection",
      type: "realworld",
      instructions: "Track your family's water usage for 3 days and create a bar graph showing daily consumption.",
      groupAllowed: true,
      startDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      rewardXP: 75,
      rewardEcoCoins: 30,
      assignedTo: ["Class 10A", "Class 10B"],
      submissions: 24,
      status: "active",
    },
    {
      id: "3",
      title: "Creative Poetry Presentation",
      subject: "English",
      description: "Enhance vocabulary and presentation skills",
      type: "realworld",
      instructions:
        "Write an original poem using 10 new vocabulary words and present it to the class or record a video.",
      groupAllowed: false,
      startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      rewardXP: 60,
      rewardEcoCoins: 20,
      assignedTo: ["Class 10A"],
      submissions: 28,
      status: "completed",
    },
  ])

  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingQuest, setEditingQuest] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    description: "",
    type: "realworld" as Quest["type"],
    instructions: "",
    groupAllowed: false,
    endDate: "",
    rewardXP: 50,
    rewardEcoCoins: 20,
    assignedTo: [] as string[],
  })

  const subjects = ["Mathematics", "Science", "English", "Social Studies", "Environment", "Physical Education"]
  const classes = ["Class 10A", "Class 10B", "Class 10C"]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-700 border-gray-200"
      case "active":
        return "bg-green-100 text-green-700 border-green-200"
      case "completed":
        return "bg-blue-100 text-blue-700 border-blue-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "realworld":
        return "🌍"
      case "game":
        return "🎮"
      case "quiz":
        return "📝"
      default:
        return "📋"
    }
  }

  const getDaysRemaining = (endDate: Date) => {
    const now = new Date()
    const diff = endDate.getTime() - now.getTime()
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24))

    if (days < 0) return "Ended"
    if (days === 0) return "Ends today"
    if (days === 1) return "1 day left"
    return `${days} days left`
  }

  const handleCreateQuest = () => {
    const newQuest: Quest = {
      id: Date.now().toString(),
      ...formData,
      startDate: new Date(),
      endDate: new Date(formData.endDate),
      submissions: 0,
      status: "active",
    }

    setQuests([...quests, newQuest])
    setShowCreateForm(false)
    resetForm()
  }

  const handleEditQuest = (questId: string) => {
    const quest = quests.find((q) => q.id === questId)
    if (quest) {
      setFormData({
        title: quest.title,
        subject: quest.subject,
        description: quest.description,
        type: quest.type,
        instructions: quest.instructions,
        groupAllowed: quest.groupAllowed,
        endDate: quest.endDate.toISOString().split("T")[0],
        rewardXP: quest.rewardXP,
        rewardEcoCoins: quest.rewardEcoCoins,
        assignedTo: quest.assignedTo,
      })
      setEditingQuest(questId)
      setShowCreateForm(true)
    }
  }

  const handleUpdateQuest = () => {
    if (!editingQuest) return

    setQuests(
      quests.map((quest) =>
        quest.id === editingQuest
          ? {
              ...quest,
              ...formData,
              endDate: new Date(formData.endDate),
            }
          : quest,
      ),
    )

    setShowCreateForm(false)
    setEditingQuest(null)
    resetForm()
  }

  const handleDeleteQuest = (questId: string) => {
    setQuests(quests.filter((q) => q.id !== questId))
  }

  const resetForm = () => {
    setFormData({
      title: "",
      subject: "",
      description: "",
      type: "realworld",
      instructions: "",
      groupAllowed: false,
      endDate: "",
      rewardXP: 50,
      rewardEcoCoins: 20,
      assignedTo: [],
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Assignment Manager</h2>
          <p className="text-gray-600">Create and manage real-world assignments for your students</p>
        </div>
        <Button
          onClick={() => setShowCreateForm(true)}
          className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Assignment
        </Button>
      </div>

      {/* Create/Edit Form */}
      {showCreateForm && (
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-800">
              {editingQuest ? "Edit Assignment" : "Create New Assignment"}
            </CardTitle>
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
                <Select
                  value={formData.subject}
                  onValueChange={(value) => setFormData({ ...formData, subject: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of the assignment"
                rows={2}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Instructions</label>
              <Textarea
                value={formData.instructions}
                onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                placeholder="Detailed instructions for students"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Type</label>
                <Select
                  value={formData.type}
                  onValueChange={(value: Quest["type"]) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="realworld">Real World</SelectItem>
                    <SelectItem value="game">Game</SelectItem>
                    <SelectItem value="quiz">Quiz</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">End Date</label>
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Group Work</label>
                <Select
                  value={formData.groupAllowed.toString()}
                  onValueChange={(value) => setFormData({ ...formData, groupAllowed: value === "true" })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="false">Individual</SelectItem>
                    <SelectItem value="true">Group Allowed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">XP Reward</label>
                <Input
                  type="number"
                  value={formData.rewardXP}
                  onChange={(e) => setFormData({ ...formData, rewardXP: Number.parseInt(e.target.value) })}
                  min="10"
                  max="200"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Eco-Coins Reward</label>
                <Input
                  type="number"
                  value={formData.rewardEcoCoins}
                  onChange={(e) => setFormData({ ...formData, rewardEcoCoins: Number.parseInt(e.target.value) })}
                  min="5"
                  max="100"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={editingQuest ? handleUpdateQuest : handleCreateQuest}
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
              >
                {editingQuest ? "Update Assignment" : "Create Assignment"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreateForm(false)
                  setEditingQuest(null)
                  resetForm()
                }}
                className="bg-transparent"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quests List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {quests.map((quest) => (
          <Card key={quest.id} className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{getTypeIcon(quest.type)}</span>
                    <CardTitle className="text-lg font-bold text-gray-800">{quest.title}</CardTitle>
                  </div>
                  <p className="text-sm text-gray-600">{quest.description}</p>
                </div>
                <Badge className={`${getStatusColor(quest.status)} text-xs ml-2`}>
                  {quest.status.charAt(0).toUpperCase() + quest.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Quest Details */}
              <div className="space-y-2">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <Badge variant="outline" className="text-xs">
                    {quest.subject}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {getDaysRemaining(quest.endDate)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {quest.submissions} submissions
                  </div>
                </div>

                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{quest.instructions}</p>
              </div>

              {/* Rewards */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-sm">
                  <Target className="w-4 h-4 text-yellow-500" />
                  <span className="font-medium">{quest.rewardXP} XP</span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span className="font-medium">{quest.rewardEcoCoins} Coins</span>
                </div>
                {quest.groupAllowed && (
                  <Badge variant="outline" className="text-xs">
                    Group Work
                  </Badge>
                )}
              </div>

              {/* Assigned Classes */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Assigned to:</p>
                <div className="flex flex-wrap gap-1">
                  {quest.assignedTo.map((className) => (
                    <Badge key={className} variant="secondary" className="text-xs">
                      {className}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2 border-t border-gray-100">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditQuest(quest.id)}
                  className="flex-1 bg-transparent"
                >
                  <Edit className="w-3 h-3 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteQuest(quest.id)}
                  className="border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {quests.length === 0 && (
        <div className="text-center py-12">
          <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No assignments created yet</h3>
          <p className="text-gray-500">Create your first assignment to engage students with real-world learning</p>
        </div>
      )}
    </div>
  )
}
