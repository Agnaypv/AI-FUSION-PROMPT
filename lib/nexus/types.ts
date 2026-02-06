// ============================================
// NEXUS TYPE SYSTEM
// Central type definitions for the intelligence layer
// ============================================

// --- SIGNAL TYPES ---
export type SignalSource =
  | "timetable"
  | "email"
  | "mess"
  | "academic"
  | "marketplace"
  | "travel"
  | "explorer"
  | "user_activity"

export type SignalPriority = "critical" | "high" | "medium" | "low" | "ambient"

export interface Signal {
  id: string
  source: SignalSource
  type: string
  payload: Record<string, unknown>
  priority: SignalPriority
  timestamp: Date
  expiresAt?: Date
  userId: string
}

// --- CIE (Central Intelligence Engine) ---
export interface CIEContext {
  currentTime: Date
  dayOfWeek: number
  hourOfDay: number
  isWeekend: boolean
  academicStress: number // 0-100
  upcomingDeadlines: number
  nextClassIn: number | null // minutes
  mealStatus: "pending" | "eaten" | "skipped"
  recentActivity: SignalSource[]
}

export interface CIEInsight {
  id: string
  type: "alert" | "recommendation" | "reminder" | "suppression"
  title: string
  description: string
  priority: SignalPriority
  source: SignalSource
  actionUrl?: string
  actionLabel?: string
  expiresAt?: Date
  icon?: string
}

// --- TIMETABLE ---
export interface TimetableEntry {
  id: string
  subject: string
  code: string
  type: "lecture" | "lab" | "tutorial" | "seminar"
  professor: string
  room: string
  building: string
  dayOfWeek: number // 0=Sun, 1=Mon, ...
  startTime: string // "HH:mm"
  endTime: string // "HH:mm"
  color: string
}

// --- EMAIL / MAIL ---
export type EmailCategory = "academic" | "event" | "urgent" | "administrative" | "social" | "spam"

export interface Email {
  id: string
  from: string
  fromName: string
  subject: string
  body: string
  receivedAt: Date
  isRead: boolean
  category: EmailCategory
  aiSummary?: string
  priorityScore?: number // 0-100
  extractedDeadline?: Date
  extractedAction?: string
  isRelevantToday?: boolean
}

// --- MESS / DINING ---
export type MealType = "breakfast" | "lunch" | "snacks" | "dinner"

export interface MenuItem {
  name: string
  isVeg: boolean
  nutritionTag?: "protein" | "carb" | "fiber" | "light"
  calories?: number
}

export interface MealSlot {
  type: MealType
  startTime: string
  endTime: string
  items: MenuItem[]
  crowdLevel: "low" | "medium" | "high"
  aiRecommendation?: string
}

export interface DailyMenu {
  date: string
  meals: MealSlot[]
}

// --- ACADEMIC ---
export interface Assignment {
  id: string
  title: string
  subject: string
  subjectCode: string
  dueDate: Date
  status: "pending" | "in_progress" | "submitted" | "graded"
  grade?: string
  maxMarks: number
  weight: number // percentage of final grade
  description: string
}

export interface SubjectGrade {
  subjectCode: string
  subject: string
  assignments: number
  quizzes: number
  midterm: number | null
  final: number | null
  currentGrade: string
  percentage: number
  trend: "up" | "stable" | "down"
}

export interface StudyPlan {
  id: string
  subject: string
  topic: string
  difficulty: "easy" | "medium" | "hard"
  estimatedMinutes: number
  scheduledFor: Date
  completed: boolean
  examReadiness: number // 0-100
}

// --- MARKETPLACE ---
export interface MarketplaceListing {
  id: string
  title: string
  description: string
  price: number
  suggestedPrice?: number
  condition: "new" | "like_new" | "good" | "fair" | "poor"
  category: string
  imageUrl: string
  sellerId: string
  sellerName: string
  sellerTrustScore: number
  createdAt: Date
  status: "active" | "sold" | "reserved"
}

// --- LOST & FOUND ---
export interface LostFoundItem {
  id: string
  type: "lost" | "found"
  title: string
  description: string
  category: string
  location: string
  building: string
  dateReported: Date
  dateOccurred: Date
  imageUrl?: string
  status: "open" | "matched" | "resolved"
  matchConfidence?: number
  reportedBy: string
  contactInfo: string
}

// --- TRAVEL SHARING ---
export interface TravelGroup {
  id: string
  destination: string
  departureLocation: string
  departureTime: Date
  seats: number
  seatsAvailable: number
  estimatedCost: number
  costPerPerson: number
  organizer: string
  organizerTrustScore: number
  safetyScore: number
  members: string[]
}

// --- EXPLORER ---
export type VibeTag = "study" | "chill" | "budget" | "social" | "food" | "adventure"

export interface Place {
  id: string
  name: string
  type: string
  vibeTags: VibeTag[]
  distance: string
  crowdLevel: "low" | "medium" | "high"
  rating: number
  priceLevel: 1 | 2 | 3
  openNow: boolean
  imageUrl: string
  description: string
}

// --- ROLES & AUTH ---
export type UserRole = "student" | "faculty" | "admin"

export interface AuthCredentials {
  uniqueId: string
  password: string
  role: UserRole
}

export interface RolePermissions {
  viewMessMenu: boolean
  editMessMenu: boolean
  viewAcademic: boolean
  viewAcademicAggregate: boolean
  useLostFound: boolean
  useMarketplace: boolean
  useResaleHub: boolean
  useTravelSharing: boolean
  useExplorer: boolean
  viewAnalytics: boolean
  postAnnouncements: boolean
  moderateContent: boolean
  manageCampusMap: boolean
}

export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  student: {
    viewMessMenu: true,
    editMessMenu: false,
    viewAcademic: true,
    viewAcademicAggregate: false,
    useLostFound: true,
    useMarketplace: true,
    useResaleHub: true,
    useTravelSharing: true,
    useExplorer: true,
    viewAnalytics: false,
    postAnnouncements: false,
    moderateContent: false,
    manageCampusMap: false,
  },
  faculty: {
    viewMessMenu: true,
    editMessMenu: true,
    viewAcademic: false,
    viewAcademicAggregate: true,
    useLostFound: true,
    useMarketplace: false,
    useResaleHub: false,
    useTravelSharing: false,
    useExplorer: true,
    viewAnalytics: false,
    postAnnouncements: true,
    moderateContent: false,
    manageCampusMap: false,
  },
  admin: {
    viewMessMenu: true,
    editMessMenu: true,
    viewAcademic: true,
    viewAcademicAggregate: true,
    useLostFound: true,
    useMarketplace: true,
    useResaleHub: true,
    useTravelSharing: true,
    useExplorer: true,
    viewAnalytics: true,
    postAnnouncements: true,
    moderateContent: true,
    manageCampusMap: true,
  },
}

// --- USER ---
export interface NexusUser {
  id: string
  name: string
  email: string
  avatar: string
  department: string
  role: UserRole
  year: number
  semester: number
  trustScore: number
  mobile: string
  password: string
  preferences: {
    dietaryPreference: "veg" | "non-veg" | "vegan"
    notificationLevel: "all" | "important" | "critical"
  }
}
