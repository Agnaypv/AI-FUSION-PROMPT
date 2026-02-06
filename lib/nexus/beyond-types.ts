// ============================================
// NEXUS BEYOND-THE-PILLARS TYPE DEFINITIONS
// Plug-in module types for innovation features
// ============================================

// --- GAMIFICATION ---
export interface GamificationProfile {
  userId: string
  points: number
  level: number
  badges: Badge[]
  streak: number // consecutive active days
  rank: number // leaderboard position
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  earnedAt: Date
  category: "academic" | "social" | "wellness" | "contribution" | "special"
}

export interface LeaderboardEntry {
  userId: string
  userName: string
  department: string
  points: number
  rank: number
  badges: number
}

// --- SOCIAL & COMMUNITY ---
export interface StudentProfile {
  userId: string
  bio: string
  interests: string[]
  skills: string[]
  connections: string[]
  clubs: string[]
  isPublic: boolean
}

export interface Club {
  id: string
  name: string
  description: string
  category: "technical" | "cultural" | "sports" | "social" | "academic"
  members: number
  events: ClubEvent[]
  admins: string[]
}

export interface ClubEvent {
  id: string
  clubId: string
  title: string
  description: string
  date: Date
  location: string
  attendees: number
}

export interface ForumPost {
  id: string
  authorId: string
  authorName: string
  title: string
  content: string
  category: string
  tags: string[]
  upvotes: number
  downvotes: number
  replies: ForumReply[]
  createdAt: Date
  isAnonymous: boolean
}

export interface ForumReply {
  id: string
  postId: string
  authorId: string
  authorName: string
  content: string
  upvotes: number
  createdAt: Date
  isAnonymous: boolean
}

export interface Poll {
  id: string
  question: string
  options: PollOption[]
  createdBy: string
  isAnonymous: boolean
  expiresAt: Date
  totalVotes: number
  category: string
}

export interface PollOption {
  id: string
  text: string
  votes: number
}

export interface MentorshipMatch {
  id: string
  mentorId: string
  mentorName: string
  menteeId: string
  menteeName: string
  department: string
  matchScore: number
  sharedInterests: string[]
  status: "suggested" | "accepted" | "active" | "completed"
}

export interface GroupChat {
  id: string
  name: string
  members: string[]
  messages: ChatMessage[]
  createdAt: Date
  type: "club" | "study" | "project" | "general"
}

export interface ChatMessage {
  id: string
  senderId: string
  senderName: string
  content: string
  timestamp: Date
}

// --- WELLNESS & LIFESTYLE ---
export interface WellnessProfile {
  userId: string
  dailyStepGoal: number
  meditationMinutes: number
  sleepTarget: number // hours
  workoutDays: number[] // 0-6 days of week
  optedIn: boolean
}

export interface WellnessReminder {
  id: string
  type: "hydration" | "stretch" | "sleep" | "meditation" | "exercise"
  message: string
  scheduledTime: string // HH:mm
  isActive: boolean
}

export interface WorkoutPartner {
  userId: string
  userName: string
  sport: string
  schedule: string
  matchScore: number
}

export interface SportsSlot {
  id: string
  sport: string
  facility: string
  date: Date
  startTime: string
  endTime: string
  maxPlayers: number
  currentPlayers: number
  organizer: string
}

// --- ADMINISTRATIVE ---
export interface FeeRecord {
  id: string
  userId: string
  semester: string
  totalAmount: number
  paidAmount: number
  dueDate: Date
  status: "paid" | "partial" | "pending" | "overdue"
  breakdown: { label: string; amount: number }[]
}

export interface LibraryBook {
  id: string
  title: string
  author: string
  isbn: string
  available: boolean
  reservedBy: string | null
  dueDate: Date | null
  location: string
}

export interface DigitalID {
  userId: string
  fullName: string
  department: string
  enrollmentNo: string
  validUntil: Date
  photoUrl: string
  qrCode: string
  barcode: string
}

export interface LeaveApplication {
  id: string
  userId: string
  type: "medical" | "personal" | "academic" | "emergency"
  fromDate: Date
  toDate: Date
  reason: string
  status: "pending" | "approved" | "rejected"
  appliedAt: Date
  reviewedBy: string | null
}

export interface ScholarshipDeadline {
  id: string
  name: string
  provider: string
  amount: number
  deadline: Date
  eligibility: string
  status: "open" | "applied" | "closed"
  url: string
}

export interface AttendanceRecord {
  subjectCode: string
  subject: string
  totalClasses: number
  attended: number
  percentage: number
  lastUpdated: Date
}

// --- UTILITY & SAFETY ---
export interface LaundryMachine {
  id: string
  location: string
  type: "washer" | "dryer"
  status: "available" | "in_use" | "out_of_order"
  estimatedFreeAt: Date | null
  currentUser: string | null
}

export interface MaintenanceRequest {
  id: string
  userId: string
  category: "electrical" | "plumbing" | "furniture" | "cleaning" | "network" | "other"
  location: string
  description: string
  priority: "low" | "medium" | "high" | "urgent"
  status: "submitted" | "assigned" | "in_progress" | "resolved"
  createdAt: Date
  resolvedAt: Date | null
}

export interface NightCanteenOrder {
  id: string
  userId: string
  items: { name: string; qty: number; price: number }[]
  totalAmount: number
  status: "placed" | "preparing" | "ready" | "picked_up"
  placedAt: Date
  estimatedReady: Date
}

export interface SOSAlert {
  id: string
  userId: string
  type: "medical" | "security" | "fire" | "other"
  location: string
  message: string
  timestamp: Date
  status: "active" | "responding" | "resolved"
  respondedBy: string | null
}

export interface SafeWalkRequest {
  id: string
  requesterId: string
  from: string
  to: string
  requestedAt: Date
  status: "waiting" | "matched" | "in_progress" | "completed"
  companionId: string | null
}

export interface AnonymousReport {
  id: string
  category: "harassment" | "bullying" | "substance" | "theft" | "safety" | "other"
  description: string
  location: string
  timestamp: Date
  status: "submitted" | "reviewing" | "action_taken" | "resolved"
}

// --- AI / ML ---
export interface CourseDifficultyPrediction {
  subjectCode: string
  subject: string
  difficultyScore: "low" | "medium" | "high"
  confidence: number
  factors: string[]
  recommendation: string
}

export interface StudyTimeSuggestion {
  windowStart: string // HH:mm
  windowEnd: string
  quality: "peak" | "good" | "moderate"
  subject: string
  reasoning: string
}

export interface GradeForecast {
  subjectCode: string
  subject: string
  currentPercentage: number
  projectedGrade: string
  projectedPercentage: number
  confidence: number
  explanation: string
}

export interface SentimentIndex {
  date: string
  overall: number // -1 to 1
  positive: number
  neutral: number
  negative: number
  topTopics: { topic: string; sentiment: number }[]
  sampleSize: number
}

export interface RecommendationItem {
  id: string
  type: "action" | "alert" | "suggestion" | "content"
  title: string
  description: string
  score: number // 0-100 relevance
  source: string
  actionUrl?: string
  expiresAt?: Date
}

export interface AnomalyFlag {
  id: string
  type: "spam" | "fake_listing" | "suspicious_travel" | "abuse" | "unusual_pattern"
  entityId: string
  entityType: "post" | "listing" | "travel" | "user" | "report"
  confidence: number
  reason: string
  detectedAt: Date
  status: "flagged" | "reviewing" | "confirmed" | "dismissed"
  reviewedBy: string | null
}

export interface NLGSummary {
  type: "weekly_academic" | "activity_summary" | "campus_insights"
  period: string
  generatedAt: Date
  content: string
  highlights: string[]
  metrics: Record<string, number>
}

// --- CHATBOT ---
export type ChatbotIntent =
  | "navigation"
  | "feature_help"
  | "daily_summary"
  | "academic_query"
  | "mess_query"
  | "travel_query"
  | "general"

export interface ChatbotQuery {
  message: string
  userId: string
  role: string
  context?: Record<string, unknown>
}

export interface ChatbotResponse {
  reply: string
  intent: ChatbotIntent
  suggestions?: string[]
  actionUrl?: string
  confidence: number
}
