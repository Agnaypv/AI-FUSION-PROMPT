// ============================================
// NEXUS CENTRAL INTELLIGENCE ENGINE (CIE)
// The brain that connects all signals
// ============================================

import type { CIEContext, CIEInsight, SignalPriority } from "./types"
import { timetable, assignments, emails, dailyMenu } from "./mock-data"
import { format, differenceInMinutes, differenceInHours, differenceInDays, isSameDay } from "date-fns"

// Build the current context from all available signals
export function buildContext(now: Date = new Date()): CIEContext {
  const hourOfDay = now.getHours()
  const dayOfWeek = now.getDay()
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6

  // Calculate academic stress from deadlines
  const upcomingDeadlines = assignments.filter(
    (a) => a.status !== "submitted" && a.status !== "graded" && a.dueDate > now
  )
  const urgentDeadlines = upcomingDeadlines.filter(
    (a) => differenceInDays(a.dueDate, now) <= 3
  )
  const academicStress = Math.min(
    100,
    urgentDeadlines.length * 25 + upcomingDeadlines.length * 10
  )

  // Find next class
  const todaysClasses = timetable
    .filter((t) => t.dayOfWeek === (dayOfWeek === 0 ? 7 : dayOfWeek))
    .sort((a, b) => a.startTime.localeCompare(b.startTime))

  const currentTimeStr = format(now, "HH:mm")
  const nextClass = todaysClasses.find((c) => c.startTime > currentTimeStr)
  let nextClassIn: number | null = null

  if (nextClass) {
    const [h, m] = nextClass.startTime.split(":").map(Number)
    const classTime = new Date(now)
    classTime.setHours(h, m, 0, 0)
    nextClassIn = differenceInMinutes(classTime, now)
    if (nextClassIn < 0) nextClassIn = null
  }

  // Determine meal status based on time
  const mealStatus =
    hourOfDay < 9
      ? "pending"
      : hourOfDay < 14
        ? "eaten"
        : hourOfDay < 20
          ? "eaten"
          : "eaten"

  return {
    currentTime: now,
    dayOfWeek,
    hourOfDay,
    isWeekend,
    academicStress,
    upcomingDeadlines: upcomingDeadlines.length,
    nextClassIn,
    mealStatus,
    recentActivity: ["timetable", "email", "academic"],
  }
}

// Generate prioritized insights based on context
export function generateInsights(context: CIEContext): CIEInsight[] {
  const insights: CIEInsight[] = []
  const now = context.currentTime

  // --- TIMETABLE SIGNALS ---
  if (context.nextClassIn !== null && context.nextClassIn <= 30 && context.nextClassIn > 0) {
    const todaysClasses = timetable
      .filter((t) => t.dayOfWeek === (context.dayOfWeek === 0 ? 7 : context.dayOfWeek))
      .sort((a, b) => a.startTime.localeCompare(b.startTime))
    const currentTimeStr = format(now, "HH:mm")
    const nextClass = todaysClasses.find((c) => c.startTime > currentTimeStr)

    if (nextClass) {
      insights.push({
        id: `ins_class_${nextClass.id}`,
        type: "alert",
        title: `${nextClass.subject} in ${context.nextClassIn}m`,
        description: `${nextClass.type.charAt(0).toUpperCase() + nextClass.type.slice(1)} at ${nextClass.room}, ${nextClass.building}`,
        priority: context.nextClassIn <= 10 ? "critical" : "high",
        source: "timetable",
        icon: "clock",
      })
    }
  }

  // --- DEADLINE SIGNALS ---
  const urgentAssignments = assignments
    .filter((a) => a.status !== "submitted" && a.status !== "graded")
    .filter((a) => {
      const daysUntil = differenceInDays(a.dueDate, now)
      return daysUntil >= 0 && daysUntil <= 3
    })
    .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())

  for (const assignment of urgentAssignments) {
    const hoursLeft = differenceInHours(assignment.dueDate, now)
    const daysLeft = differenceInDays(assignment.dueDate, now)

    let priority: SignalPriority = "medium"
    if (hoursLeft <= 12) priority = "critical"
    else if (daysLeft <= 1) priority = "high"

    insights.push({
      id: `ins_deadline_${assignment.id}`,
      type: "alert",
      title: `${assignment.title}`,
      description: `Due ${daysLeft === 0 ? `in ${hoursLeft}h` : `in ${daysLeft}d`} -- ${assignment.subject}`,
      priority,
      source: "academic",
      actionUrl: "/academic",
      actionLabel: "View details",
      icon: "alert-triangle",
    })
  }

  // --- EMAIL SIGNALS ---
  const urgentEmails = emails
    .filter((e) => !e.isRead && (e.priorityScore ?? 0) >= 75)
    .sort((a, b) => (b.priorityScore ?? 0) - (a.priorityScore ?? 0))

  for (const email of urgentEmails.slice(0, 3)) {
    insights.push({
      id: `ins_email_${email.id}`,
      type: "alert",
      title: email.fromName,
      description: email.extractedAction || email.subject,
      priority: (email.priorityScore ?? 0) >= 90 ? "high" : "medium",
      source: "email",
      actionUrl: "/mail",
      actionLabel: "Read mail",
      icon: "mail",
    })
  }

  // --- MEAL SIGNALS ---
  const hour = context.hourOfDay
  let currentMealSlot = dailyMenu.meals.find((m) => {
    const [startH] = m.startTime.split(":").map(Number)
    const [endH] = m.endTime.split(":").map(Number)
    return hour >= startH - 1 && hour <= endH
  })

  if (currentMealSlot) {
    if (currentMealSlot.crowdLevel === "high") {
      insights.push({
        id: `ins_mess_crowd_${currentMealSlot.type}`,
        type: "recommendation",
        title: `Mess is crowded right now`,
        description: currentMealSlot.aiRecommendation || `${currentMealSlot.type} crowd level is high. Consider going later.`,
        priority: "low",
        source: "mess",
        icon: "users",
      })
    }

    if (currentMealSlot.aiRecommendation) {
      insights.push({
        id: `ins_mess_rec_${currentMealSlot.type}`,
        type: "recommendation",
        title: `Smart meal suggestion`,
        description: currentMealSlot.aiRecommendation,
        priority: "ambient",
        source: "mess",
        icon: "utensils",
      })
    }
  }

  // --- ACADEMIC STRESS SIGNALS ---
  if (context.academicStress >= 70) {
    insights.push({
      id: "ins_stress_high",
      type: "recommendation",
      title: "High academic load detected",
      description: `${context.upcomingDeadlines} deadlines approaching. Consider using the AI Study Planner to optimize your time.`,
      priority: "medium",
      source: "academic",
      actionUrl: "/academic",
      actionLabel: "Open study planner",
      icon: "brain",
    })
  }

  // --- PROACTIVE SUGGESTIONS ---
  if (context.isWeekend && context.hourOfDay >= 10 && context.hourOfDay <= 16) {
    insights.push({
      id: "ins_weekend_explore",
      type: "recommendation",
      title: "Free this afternoon?",
      description: "The Quiet Bean has low crowd. Great for a study session or catching up.",
      priority: "ambient",
      source: "explorer",
      actionUrl: "/explore",
      actionLabel: "Explore places",
      icon: "compass",
    })
  }

  // Sort by priority weight
  const priorityWeight: Record<SignalPriority, number> = {
    critical: 5,
    high: 4,
    medium: 3,
    low: 2,
    ambient: 1,
  }

  return insights.sort(
    (a, b) => priorityWeight[b.priority] - priorityWeight[a.priority]
  )
}

// Get time-aware greeting
export function getGreeting(name: string, hour: number): string {
  if (hour < 5) return `Still up, ${name}?`
  if (hour < 12) return `Good morning, ${name}`
  if (hour < 17) return `Good afternoon, ${name}`
  if (hour < 21) return `Good evening, ${name}`
  return `Winding down, ${name}?`
}

// Get contextual status line
export function getStatusLine(context: CIEContext): string {
  const parts: string[] = []

  if (context.nextClassIn !== null && context.nextClassIn <= 60) {
    parts.push(`Next class in ${context.nextClassIn}m`)
  }

  if (context.upcomingDeadlines > 0) {
    parts.push(
      `${context.upcomingDeadlines} deadline${context.upcomingDeadlines > 1 ? "s" : ""} this week`
    )
  }

  if (context.academicStress >= 60) {
    parts.push("High workload")
  } else if (context.academicStress <= 30) {
    parts.push("Light schedule")
  }

  if (context.isWeekend) {
    parts.push("Weekend mode")
  }

  return parts.join("  /  ") || "All clear today"
}

// Get current and upcoming classes for today
export function getTodaySchedule(now: Date = new Date()) {
  const dayOfWeek = now.getDay()
  const adjustedDay = dayOfWeek === 0 ? 7 : dayOfWeek
  const currentTimeStr = format(now, "HH:mm")

  const todaysClasses = timetable
    .filter((t) => t.dayOfWeek === adjustedDay)
    .sort((a, b) => a.startTime.localeCompare(b.startTime))

  const currentClass = todaysClasses.find(
    (c) => c.startTime <= currentTimeStr && c.endTime > currentTimeStr
  )
  const upcomingClasses = todaysClasses.filter((c) => c.startTime > currentTimeStr)
  const pastClasses = todaysClasses.filter((c) => c.endTime <= currentTimeStr)

  return { todaysClasses, currentClass, upcomingClasses, pastClasses }
}

// Get relevant emails for today
export function getTodayEmails() {
  return emails
    .filter((e) => e.isRelevantToday || (e.priorityScore ?? 0) >= 60)
    .sort((a, b) => (b.priorityScore ?? 0) - (a.priorityScore ?? 0))
}

// Get upcoming deadlines sorted by urgency
export function getUpcomingDeadlines(now: Date = new Date()) {
  return assignments
    .filter(
      (a) =>
        a.status !== "submitted" &&
        a.status !== "graded" &&
        a.dueDate > now
    )
    .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
}

// Get current meal information
export function getCurrentMeal(now: Date = new Date()) {
  const hour = now.getHours()

  const currentMeal = dailyMenu.meals.find((m) => {
    const [startH] = m.startTime.split(":").map(Number)
    const [endH] = m.endTime.split(":").map(Number)
    return hour >= startH && hour <= endH
  })

  const nextMeal = dailyMenu.meals.find((m) => {
    const [startH] = m.startTime.split(":").map(Number)
    return startH > hour
  })

  return { currentMeal, nextMeal, allMeals: dailyMenu.meals }
}
