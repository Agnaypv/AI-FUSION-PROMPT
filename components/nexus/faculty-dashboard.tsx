"use client"

import React, { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/nexus/auth-context"
import {
  Utensils,
  GraduationCap,
  Megaphone,
  User,
  Calendar,
  Plus,
  Trash2,
  Save,
  AlertTriangle,
  AlertCircle,
  Info,
  TrendingUp,
  BarChart3,
  Clock,
  BookOpen,
  Send,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// ========================================
// FACULTY TABS
// ========================================
type FacultyTab = "mess" | "academic" | "announcements" | "profile"

const tabs: { id: FacultyTab; label: string; icon: typeof Utensils }[] = [
  { id: "mess", label: "Mess Management", icon: Utensils },
  { id: "academic", label: "Academic Oversight", icon: GraduationCap },
  { id: "announcements", label: "Announcements", icon: Megaphone },
  { id: "profile", label: "Profile", icon: User },
]

// ========================================
// MESS MANAGEMENT DATA
// ========================================
type MealType = "breakfast" | "lunch" | "snacks" | "dinner"

interface EditableMenuItem {
  id: string
  name: string
  isVeg: boolean
}

interface EditableMeal {
  type: MealType
  items: EditableMenuItem[]
}

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
]
const MEAL_TYPES: MealType[] = ["breakfast", "lunch", "snacks", "dinner"]
const SEASONS = ["Summer", "Winter", "Monsoon", "Exam Season"] as const

function generateId() {
  return Math.random().toString(36).slice(2, 8)
}

const defaultDayMenu: EditableMeal[] = [
  {
    type: "breakfast",
    items: [
      { id: "b1", name: "Poha", isVeg: true },
      { id: "b2", name: "Bread Toast", isVeg: true },
      { id: "b3", name: "Tea/Coffee", isVeg: true },
    ],
  },
  {
    type: "lunch",
    items: [
      { id: "l1", name: "Rice", isVeg: true },
      { id: "l2", name: "Dal Fry", isVeg: true },
      { id: "l3", name: "Seasonal Sabzi", isVeg: true },
      { id: "l4", name: "Roti", isVeg: true },
    ],
  },
  {
    type: "snacks",
    items: [
      { id: "s1", name: "Samosa", isVeg: true },
      { id: "s2", name: "Tea", isVeg: true },
    ],
  },
  {
    type: "dinner",
    items: [
      { id: "d1", name: "Paneer Curry", isVeg: true },
      { id: "d2", name: "Rice", isVeg: true },
      { id: "d3", name: "Roti", isVeg: true },
      { id: "d4", name: "Sweet", isVeg: true },
    ],
  },
]

// ========================================
// MESS MANAGEMENT COMPONENT
// ========================================
function MessManagement() {
  const [viewMode, setViewMode] = useState<"daily" | "weekly" | "seasonal">(
    "daily",
  )
  const [selectedDay, setSelectedDay] = useState(DAYS[0])
  const [selectedSeason, setSelectedSeason] = useState<string>(SEASONS[0])
  const [menuData, setMenuData] = useState<Record<string, EditableMeal[]>>({})
  const [saveStatus, setSaveStatus] = useState<string | null>(null)

  // Initialize menu data for all days
  useEffect(() => {
    const data: Record<string, EditableMeal[]> = {}
    for (const day of DAYS) {
      data[day] = defaultDayMenu.map((meal) => ({
        ...meal,
        items: meal.items.map((item) => ({ ...item, id: generateId() })),
      }))
    }
    setMenuData(data)
  }, [])

  const currentDayMenu = menuData[selectedDay] || []

  const updateItem = (
    mealType: MealType,
    itemId: string,
    field: "name" | "isVeg",
    value: string | boolean,
  ) => {
    setMenuData((prev) => ({
      ...prev,
      [selectedDay]: prev[selectedDay].map((meal) =>
        meal.type === mealType
          ? {
              ...meal,
              items: meal.items.map((item) =>
                item.id === itemId ? { ...item, [field]: value } : item,
              ),
            }
          : meal,
      ),
    }))
  }

  const addItem = (mealType: MealType) => {
    setMenuData((prev) => ({
      ...prev,
      [selectedDay]: prev[selectedDay].map((meal) =>
        meal.type === mealType
          ? {
              ...meal,
              items: [
                ...meal.items,
                { id: generateId(), name: "", isVeg: true },
              ],
            }
          : meal,
      ),
    }))
  }

  const removeItem = (mealType: MealType, itemId: string) => {
    setMenuData((prev) => ({
      ...prev,
      [selectedDay]: prev[selectedDay].map((meal) =>
        meal.type === mealType
          ? {
              ...meal,
              items: meal.items.filter((item) => item.id !== itemId),
            }
          : meal,
      ),
    }))
  }

  const handleSave = () => {
    // In real app, this would push to Supabase -> CIE -> student views
    setSaveStatus("Menu saved! Changes will reflect instantly for students.")
    setTimeout(() => setSaveStatus(null), 3000)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* View mode tabs */}
      <div className="flex gap-2">
        {(["daily", "weekly", "seasonal"] as const).map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => setViewMode(mode)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-all",
              viewMode === mode
                ? "bg-nexus-gold/15 text-nexus-gold"
                : "text-muted-foreground hover:bg-secondary",
            )}
          >
            {mode}
          </button>
        ))}
      </div>

      {/* Day selector */}
      {(viewMode === "daily" || viewMode === "weekly") && (
        <div className="flex flex-wrap gap-1.5">
          {DAYS.map((day) => (
            <button
              key={day}
              type="button"
              onClick={() => setSelectedDay(day)}
              className={cn(
                "rounded-md px-2.5 py-1 text-[11px] font-medium transition-all",
                selectedDay === day
                  ? "bg-nexus-gold/15 text-nexus-gold"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              {day.slice(0, 3)}
            </button>
          ))}
        </div>
      )}

      {/* Season selector */}
      {viewMode === "seasonal" && (
        <div className="flex flex-wrap gap-1.5">
          {SEASONS.map((season) => (
            <button
              key={season}
              type="button"
              onClick={() => setSelectedSeason(season)}
              className={cn(
                "rounded-md px-2.5 py-1 text-[11px] font-medium transition-all",
                selectedSeason === season
                  ? "bg-nexus-gold/15 text-nexus-gold"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              {season}
            </button>
          ))}
          <p className="mt-2 w-full text-xs text-muted-foreground">
            Seasonal templates apply default menu adjustments. Select a season
            and edit as needed.
          </p>
        </div>
      )}

      {/* Meal editors */}
      <div className="flex flex-col gap-3">
        {currentDayMenu.map((meal) => (
          <div
            key={meal.type}
            className="rounded-lg border border-border bg-card p-3"
          >
            <div className="mb-2 flex items-center justify-between">
              <h4 className="font-display text-[10px] font-semibold uppercase tracking-wider text-nexus-gold">
                {meal.type}
              </h4>
              <button
                type="button"
                onClick={() => addItem(meal.type)}
                className="flex items-center gap-1 rounded px-2 py-0.5 text-[10px] text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <Plus className="h-3 w-3" />
                Add Item
              </button>
            </div>
            <div className="flex flex-col gap-1.5">
              {meal.items.map((item) => (
                <div key={item.id} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      updateItem(meal.type, item.id, "isVeg", !item.isVeg)
                    }
                    className={cn(
                      "flex h-5 w-5 shrink-0 items-center justify-center rounded border text-[8px] font-bold",
                      item.isVeg
                        ? "border-nexus-success text-nexus-success"
                        : "border-nexus-urgent text-nexus-urgent",
                    )}
                  >
                    {item.isVeg ? "V" : "N"}
                  </button>
                  <Input
                    value={item.name}
                    onChange={(e) =>
                      updateItem(meal.type, item.id, "name", e.target.value)
                    }
                    placeholder="Item name..."
                    className="h-7 text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => removeItem(meal.type, item.id)}
                    className="shrink-0 text-muted-foreground transition-colors hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Save button */}
      <div className="flex items-center gap-3">
        <Button
          onClick={handleSave}
          className="bg-nexus-gold font-semibold text-background hover:bg-nexus-lightning"
        >
          <Save className="mr-2 h-4 w-4" />
          Save & Publish Menu
        </Button>
        {saveStatus && (
          <span className="text-xs text-nexus-success">{saveStatus}</span>
        )}
      </div>
    </div>
  )
}

// ========================================
// ACADEMIC OVERSIGHT COMPONENT
// ========================================
interface StressData {
  department: string
  stressLevel: number
  examCount: number
  assignmentsDue: number
}

const departmentStress: StressData[] = [
  {
    department: "Computer Science",
    stressLevel: 72,
    examCount: 3,
    assignmentsDue: 8,
  },
  { department: "Electronics", stressLevel: 65, examCount: 2, assignmentsDue: 6 },
  { department: "Mechanical", stressLevel: 45, examCount: 1, assignmentsDue: 4 },
  { department: "Civil", stressLevel: 38, examCount: 1, assignmentsDue: 3 },
  { department: "Electrical", stressLevel: 58, examCount: 2, assignmentsDue: 5 },
]

const examSchedule = [
  { subject: "Data Structures", date: "Feb 10", dept: "CS", difficulty: "High" },
  { subject: "Signal Processing", date: "Feb 12", dept: "ECE", difficulty: "Medium" },
  { subject: "Thermodynamics", date: "Feb 14", dept: "ME", difficulty: "High" },
  { subject: "Database Systems", date: "Feb 15", dept: "CS", difficulty: "Medium" },
  { subject: "Control Systems", date: "Feb 18", dept: "EE", difficulty: "High" },
]

function AcademicOversight() {
  return (
    <div className="flex flex-col gap-5">
      {/* Department Stress Overview */}
      <div>
        <h4 className="mb-3 flex items-center gap-2 font-display text-xs font-semibold uppercase tracking-wider text-foreground">
          <BarChart3 className="h-4 w-4 text-nexus-gold/70" />
          Department Stress (Anonymized)
        </h4>
        <div className="flex flex-col gap-2">
          {departmentStress.map((dept) => {
            const color =
              dept.stressLevel >= 70
                ? "bg-nexus-urgent"
                : dept.stressLevel >= 50
                  ? "bg-nexus-warn"
                  : "bg-nexus-success"
            const textColor =
              dept.stressLevel >= 70
                ? "text-nexus-urgent"
                : dept.stressLevel >= 50
                  ? "text-nexus-warn"
                  : "text-nexus-success"
            return (
              <div
                key={dept.department}
                className="rounded-lg border border-border bg-card p-3"
              >
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-xs font-medium text-foreground">
                    {dept.department}
                  </span>
                  <span
                    className={cn(
                      "font-display text-[10px] font-semibold",
                      textColor,
                    )}
                  >
                    {dept.stressLevel}%
                  </span>
                </div>
                <div className="mb-2 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className={cn("h-full rounded-full transition-all", color)}
                    style={{ width: `${dept.stressLevel}%` }}
                  />
                </div>
                <div className="flex gap-4 text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <BookOpen className="h-3 w-3" />
                    {dept.examCount} exams upcoming
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {dept.assignmentsDue} assignments due
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Upcoming Exam Density */}
      <div>
        <h4 className="mb-3 flex items-center gap-2 font-display text-xs font-semibold uppercase tracking-wider text-foreground">
          <Calendar className="h-4 w-4 text-nexus-gold/70" />
          Exam Density This Month
        </h4>
        <div className="flex flex-col gap-1.5">
          {examSchedule.map((exam) => (
            <div
              key={exam.subject}
              className="flex items-center justify-between rounded-lg border border-border bg-card p-3"
            >
              <div className="flex flex-col">
                <span className="text-xs font-medium text-foreground">
                  {exam.subject}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {exam.dept} Department
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[10px] font-medium",
                    exam.difficulty === "High"
                      ? "bg-nexus-urgent/10 text-nexus-urgent"
                      : "bg-nexus-warn/10 text-nexus-warn",
                  )}
                >
                  {exam.difficulty}
                </span>
                <span className="font-mono text-[11px] text-muted-foreground">
                  {exam.date}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Assignment Load Trend Summary */}
      <div className="rounded-lg border border-border bg-card p-4">
        <h4 className="mb-2 flex items-center gap-2 font-display text-xs font-semibold uppercase tracking-wider text-foreground">
          <TrendingUp className="h-4 w-4 text-nexus-gold/70" />
          Assignment Load Trend
        </h4>
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg bg-secondary/50 p-3 text-center">
            <p className="text-lg font-semibold text-foreground">26</p>
            <p className="text-[10px] text-muted-foreground">Active Assignments</p>
          </div>
          <div className="rounded-lg bg-secondary/50 p-3 text-center">
            <p className="text-lg font-semibold text-nexus-warn">12</p>
            <p className="text-[10px] text-muted-foreground">Due This Week</p>
          </div>
          <div className="rounded-lg bg-secondary/50 p-3 text-center">
            <p className="text-lg font-semibold text-nexus-urgent">4</p>
            <p className="text-[10px] text-muted-foreground">Overdue</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ========================================
// ANNOUNCEMENT CENTER COMPONENT
// ========================================
type Urgency = "low" | "medium" | "high"

interface Announcement {
  id: string
  title: string
  body: string
  urgency: Urgency
  timestamp: string
  author: string
}

const urgencyConfig: Record<
  Urgency,
  { label: string; icon: typeof Info; color: string; bg: string }
> = {
  low: {
    label: "Low",
    icon: Info,
    color: "text-nexus-info",
    bg: "bg-nexus-info/10",
  },
  medium: {
    label: "Medium",
    icon: AlertCircle,
    color: "text-nexus-warn",
    bg: "bg-nexus-warn/10",
  },
  high: {
    label: "High",
    icon: AlertTriangle,
    color: "text-nexus-urgent",
    bg: "bg-nexus-urgent/10",
  },
}

function AnnouncementCenter() {
  const { user } = useAuth()
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [urgency, setUrgency] = useState<Urgency>("medium")
  const [announcements, setAnnouncements] = useState<Announcement[]>([
    {
      id: "a1",
      title: "Mid-semester exams start Feb 10",
      body: "All departments. Check your timetable for updated schedules. Carry ID cards.",
      urgency: "high",
      timestamp: "2 hours ago",
      author: "Dr. Priya Sharma",
    },
    {
      id: "a2",
      title: "Lab 3 closed for maintenance",
      body: "CS Lab 3 will be closed from Feb 7-9 for equipment upgrades. Use Lab 2 or 4.",
      urgency: "medium",
      timestamp: "1 day ago",
      author: "Dr. Priya Sharma",
    },
    {
      id: "a3",
      title: "Hackathon registrations open",
      body: "Register your team for TechNova 2026 by Feb 15. Max 4 members per team.",
      urgency: "low",
      timestamp: "3 days ago",
      author: "Dr. Priya Sharma",
    },
  ])

  const handlePost = () => {
    if (!title.trim() || !body.trim()) return
    const newAnnouncement: Announcement = {
      id: generateId(),
      title: title.trim(),
      body: body.trim(),
      urgency,
      timestamp: "Just now",
      author: user?.name || "Faculty",
    }
    // Prepend -- newest first. In real app, pushes to Supabase -> student Mail Summarizer
    setAnnouncements((prev) => [newAnnouncement, ...prev])
    setTitle("")
    setBody("")
    setUrgency("medium")
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Compose */}
      <div className="rounded-lg border border-border bg-card p-4">
        <h4 className="mb-3 font-display text-xs font-semibold uppercase tracking-wider text-foreground">
          Post New Announcement
        </h4>
        <div className="flex flex-col gap-3">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Announcement title..."
            className="text-sm"
          />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Announcement details..."
            className="min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <div className="flex items-center justify-between">
            <div className="flex gap-1.5">
              {(Object.keys(urgencyConfig) as Urgency[]).map((u) => {
                const cfg = urgencyConfig[u]
                return (
                  <button
                    key={u}
                    type="button"
                    onClick={() => setUrgency(u)}
                    className={cn(
                      "flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-medium transition-all",
                      urgency === u
                        ? `${cfg.bg} ${cfg.color}`
                        : "text-muted-foreground hover:bg-secondary",
                    )}
                  >
                    <cfg.icon className="h-3 w-3" />
                    {cfg.label}
                  </button>
                )
              })}
            </div>
            <Button
              onClick={handlePost}
              disabled={!title.trim() || !body.trim()}
              size="sm"
              className="bg-nexus-gold font-semibold text-background hover:bg-nexus-lightning"
            >
              <Send className="mr-1.5 h-3.5 w-3.5" />
              Post
            </Button>
          </div>
        </div>
      </div>

      {/* Posted Announcements */}
      <div>
        <h4 className="mb-3 font-display text-xs font-semibold uppercase tracking-wider text-foreground">
          Recent Announcements
        </h4>
        <div className="flex flex-col gap-2">
          {announcements.map((ann) => {
            const cfg = urgencyConfig[ann.urgency]
            const UrgencyIcon = cfg.icon
            return (
              <div
                key={ann.id}
                className="rounded-lg border border-border bg-card p-3"
              >
                <div className="mb-1 flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <UrgencyIcon className={cn("h-3.5 w-3.5 shrink-0", cfg.color)} />
                    <span className="text-xs font-semibold text-foreground">
                      {ann.title}
                    </span>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 rounded-full px-2 py-0.5 text-[9px] font-medium",
                      cfg.bg,
                      cfg.color,
                    )}
                  >
                    {cfg.label}
                  </span>
                </div>
                <p className="mb-2 text-[11px] leading-relaxed text-muted-foreground">
                  {ann.body}
                </p>
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground/60">
                  <span>{ann.author}</span>
                  <span>--</span>
                  <span>{ann.timestamp}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ========================================
// FACULTY PROFILE COMPONENT
// ========================================
function FacultyProfile() {
  const { user } = useAuth()

  // Mock extended faculty data
  const facultyData = {
    id: user?.id || "FAC2026001",
    name: user?.name || "Dr. Priya Sharma",
    department: user?.department || "Computer Science",
    email: user?.email || "priya.sharma@university.edu",
    mobile: user?.mobile || "9876543220",
    subjects: [
      "Data Structures & Algorithms",
      "Database Management Systems",
      "Advanced Programming",
    ],
    officeHours: "Mon & Wed, 2:00 PM - 4:00 PM",
    office: "Block A, Room 305",
    designation: "Associate Professor",
    experience: "12 years",
  }

  const fields = [
    { label: "Faculty ID", value: facultyData.id, mono: true },
    { label: "Name", value: facultyData.name },
    { label: "Designation", value: facultyData.designation },
    { label: "Department", value: facultyData.department },
    { label: "Email", value: facultyData.email },
    { label: "Mobile", value: facultyData.mobile, mono: true },
    { label: "Office", value: facultyData.office },
    { label: "Office Hours", value: facultyData.officeHours },
    { label: "Experience", value: facultyData.experience },
  ]

  return (
    <div className="flex flex-col gap-5">
      {/* Profile card */}
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="mb-4 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-nexus-gold/10">
            <User className="h-7 w-7 text-nexus-gold" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">
              {facultyData.name}
            </h3>
            <p className="text-xs text-muted-foreground">
              {facultyData.designation} -- {facultyData.department}
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {fields.map((f) => (
            <div key={f.label} className="rounded-lg bg-secondary/50 p-2.5">
              <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                {f.label}
              </p>
              <p
                className={cn(
                  "mt-0.5 text-sm text-foreground",
                  f.mono && "font-mono",
                )}
              >
                {f.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Subjects Taught */}
      <div className="rounded-lg border border-border bg-card p-4">
        <h4 className="mb-3 font-display text-xs font-semibold uppercase tracking-wider text-foreground">
          Subjects Taught
        </h4>
        <div className="flex flex-col gap-1.5">
          {facultyData.subjects.map((subject) => (
            <div
              key={subject}
              className="flex items-center gap-2 rounded-lg bg-secondary/50 p-2.5"
            >
              <BookOpen className="h-3.5 w-3.5 text-nexus-gold/60" />
              <span className="text-xs font-medium text-foreground">
                {subject}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ========================================
// MAIN FACULTY DASHBOARD EXPORT
// ========================================
export function FacultyDashboard() {
  const [activeTab, setActiveTab] = useState<FacultyTab>("mess")
  const { user } = useAuth()

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 lg:px-6 nexus-fade-in">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-xl font-semibold text-foreground text-balance">
          Welcome, {user?.name?.split(" ").slice(0, 2).join(" ") || "Faculty"}
        </h1>
        <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
          <span className="nexus-signal-dot bg-nexus-gold nexus-pulse" />
          Faculty Control Panel
        </p>
      </header>

      {/* Tab Navigation */}
      <div className="mb-5 flex flex-wrap gap-1.5 rounded-lg border border-border bg-card p-1.5">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-xs font-medium transition-all",
                activeTab === tab.id
                  ? "bg-nexus-gold/15 text-nexus-gold"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      <div className="nexus-fade-in">
        {activeTab === "mess" && <MessManagement />}
        {activeTab === "academic" && <AcademicOversight />}
        {activeTab === "announcements" && <AnnouncementCenter />}
        {activeTab === "profile" && <FacultyProfile />}
      </div>
    </div>
  )
}
