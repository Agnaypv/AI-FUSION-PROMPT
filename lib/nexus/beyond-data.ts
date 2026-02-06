// ============================================
// NEXUS BEYOND-THE-PILLARS MOCK DATA
// Plug-in module data for all innovation features
// ============================================

import type {
  GamificationProfile, Badge, LeaderboardEntry,
  Club, ForumPost, Poll, MentorshipMatch, GroupChat,
  WellnessReminder, SportsSlot, WorkoutPartner,
  FeeRecord, LibraryBook, LeaveApplication, ScholarshipDeadline, AttendanceRecord,
  LaundryMachine, MaintenanceRequest, SOSAlert, AnonymousReport,
  SentimentIndex, AnomalyFlag,
} from "./beyond-types"

const now = new Date()
const daysAgo = (n: number) => new Date(now.getTime() - n * 24 * 60 * 60 * 1000)
const daysFromNow = (n: number) => new Date(now.getTime() + n * 24 * 60 * 60 * 1000)

// =================== GAMIFICATION ===================
export const badges: Badge[] = [
  { id: "b1", name: "Early Bird", description: "Attended 5 morning classes in a row", icon: "sunrise", earnedAt: daysAgo(10), category: "academic" },
  { id: "b2", name: "Helpful Hand", description: "Helped 3 students find lost items", icon: "hand-helping", earnedAt: daysAgo(5), category: "contribution" },
  { id: "b3", name: "Wellness Warrior", description: "Completed 7-day meditation streak", icon: "heart-pulse", earnedAt: daysAgo(2), category: "wellness" },
  { id: "b4", name: "Social Butterfly", description: "Joined 3 clubs", icon: "users", earnedAt: daysAgo(15), category: "social" },
  { id: "b5", name: "First Lister", description: "Listed first item on resale hub", icon: "store", earnedAt: daysAgo(20), category: "contribution" },
]

export const gamificationProfile: GamificationProfile = {
  userId: "STU2026001",
  points: 2450,
  level: 8,
  badges,
  streak: 12,
  rank: 23,
}

export const leaderboard: LeaderboardEntry[] = [
  { userId: "usr_042", userName: "Sneha Patel", department: "CSE", points: 4200, rank: 1, badges: 12 },
  { userId: "usr_018", userName: "Divya Krishnan", department: "ECE", points: 3890, rank: 2, badges: 10 },
  { userId: "usr_005", userName: "Neha Sharma", department: "ME", points: 3650, rank: 3, badges: 9 },
  { userId: "usr_022", userName: "Arun Kumar", department: "CSE", points: 3400, rank: 4, badges: 8 },
  { userId: "STU2026001", userName: "Arjun Mehta", department: "CSE", points: 2450, rank: 23, badges: 5 },
]

// =================== SOCIAL & COMMUNITY ===================
export const clubs: Club[] = [
  {
    id: "club_1", name: "ACM Student Chapter", description: "Competitive programming and software development",
    category: "technical", members: 156, admins: ["usr_042"],
    events: [
      { id: "ev1", clubId: "club_1", title: "Code Sprint 2026", description: "24hr hackathon", date: daysFromNow(7), location: "Lab Complex", attendees: 80 },
      { id: "ev2", clubId: "club_1", title: "CP Workshop", description: "Dynamic programming masterclass", date: daysFromNow(3), location: "LH-201", attendees: 45 },
    ],
  },
  {
    id: "club_2", name: "Robotics Club", description: "Build, program, and compete with robots",
    category: "technical", members: 89, admins: ["usr_030"],
    events: [
      { id: "ev3", clubId: "club_2", title: "Robo Wars Qualifier", description: "Regional qualifier round", date: daysFromNow(14), location: "Sports Ground", attendees: 60 },
    ],
  },
  {
    id: "club_3", name: "Literary Society", description: "Debates, poetry, and creative writing",
    category: "cultural", members: 72, admins: ["usr_024"],
    events: [],
  },
  {
    id: "club_4", name: "NSS Unit", description: "National Service Scheme campus unit",
    category: "social", members: 210, admins: ["usr_008"],
    events: [
      { id: "ev4", clubId: "club_4", title: "Blood Donation Drive", description: "Annual campus blood donation camp", date: daysFromNow(5), location: "Health Center", attendees: 120 },
    ],
  },
]

export const forumPosts: ForumPost[] = [
  {
    id: "fp_1", authorId: "usr_042", authorName: "Sneha Patel", title: "Best resources for DSA prep?",
    content: "I'm preparing for placements. What are the best resources for Data Structures and Algorithms? Currently using Striver's sheet.",
    category: "Academic", tags: ["placements", "dsa", "cse"], upvotes: 34, downvotes: 2,
    createdAt: daysAgo(1), isAnonymous: false,
    replies: [
      { id: "fr_1", postId: "fp_1", authorId: "usr_022", authorName: "Arun Kumar", content: "NeetCode 150 is solid. Also try LeetCode's top interview questions.", upvotes: 12, createdAt: daysAgo(1), isAnonymous: false },
      { id: "fr_2", postId: "fp_1", authorId: "usr_018", authorName: "Divya Krishnan", content: "CLRS for theory, LeetCode for practice. That combo worked for me.", upvotes: 8, createdAt: daysAgo(0), isAnonymous: false },
    ],
  },
  {
    id: "fp_2", authorId: "anon", authorName: "Anonymous", title: "Mess food quality declining",
    content: "The mess food quality has been consistently bad this week. The dal was undercooked and the rice was stale. Can the administration look into this?",
    category: "Campus Life", tags: ["mess", "food", "complaint"], upvotes: 56, downvotes: 3,
    createdAt: daysAgo(2), isAnonymous: true, replies: [],
  },
  {
    id: "fp_3", authorId: "usr_005", authorName: "Neha Sharma", title: "Study group for Thermodynamics",
    content: "Looking for people to form a study group for the upcoming Thermo midterm. Planning to meet at the library every evening this week.",
    category: "Academic", tags: ["study-group", "mechanical", "midterms"], upvotes: 18, downvotes: 0,
    createdAt: daysAgo(0), isAnonymous: false, replies: [],
  },
]

export const polls: Poll[] = [
  {
    id: "poll_1", question: "Best time for weekend coding workshops?",
    options: [
      { id: "po_1", text: "Saturday 10 AM", votes: 45 },
      { id: "po_2", text: "Saturday 3 PM", votes: 32 },
      { id: "po_3", text: "Sunday 11 AM", votes: 28 },
    ],
    createdBy: "usr_042", isAnonymous: false, expiresAt: daysFromNow(3), totalVotes: 105, category: "Events",
  },
  {
    id: "poll_2", question: "Should the library extend hours during exams?",
    options: [
      { id: "po_4", text: "Yes, until midnight", votes: 189 },
      { id: "po_5", text: "Yes, 24/7", votes: 156 },
      { id: "po_6", text: "Current hours are fine", votes: 23 },
    ],
    createdBy: "anon", isAnonymous: true, expiresAt: daysFromNow(5), totalVotes: 368, category: "Campus Life",
  },
]

export const mentorshipMatches: MentorshipMatch[] = [
  { id: "mm_1", mentorId: "usr_042", mentorName: "Sneha Patel", menteeId: "STU2026001", menteeName: "Arjun Mehta", department: "CSE", matchScore: 92, sharedInterests: ["competitive programming", "web development", "ML"], status: "active" },
  { id: "mm_2", mentorId: "usr_022", mentorName: "Arun Kumar", menteeId: "STU2026002", menteeName: "Priya Nair", department: "ECE", matchScore: 78, sharedInterests: ["IoT", "embedded systems"], status: "suggested" },
]

export const groupChats: GroupChat[] = [
  {
    id: "gc_1", name: "ACM Competitive Programming", members: ["STU2026001", "usr_042", "usr_022"], type: "club", createdAt: daysAgo(30),
    messages: [
      { id: "msg_1", senderId: "usr_042", senderName: "Sneha Patel", content: "Reminder: CP contest this Saturday at 2 PM", timestamp: daysAgo(0) },
      { id: "msg_2", senderId: "STU2026001", senderName: "Arjun Mehta", content: "I'll be there. Should we form a team?", timestamp: daysAgo(0) },
    ],
  },
  {
    id: "gc_2", name: "Thermo Study Group", members: ["STU2026001", "usr_005", "usr_018"], type: "study", createdAt: daysAgo(3),
    messages: [
      { id: "msg_3", senderId: "usr_005", senderName: "Neha Sharma", content: "Meeting at library 6 PM today", timestamp: daysAgo(0) },
    ],
  },
]

// =================== WELLNESS & LIFESTYLE ===================
export const wellnessReminders: WellnessReminder[] = [
  { id: "wr_1", type: "hydration", message: "Time to drink water! Stay hydrated.", scheduledTime: "10:00", isActive: true },
  { id: "wr_2", type: "stretch", message: "Take a 5-minute stretch break.", scheduledTime: "14:00", isActive: true },
  { id: "wr_3", type: "sleep", message: "Wind down for the night. Good sleep improves memory.", scheduledTime: "22:30", isActive: true },
  { id: "wr_4", type: "meditation", message: "5-minute breathing exercise. Find a quiet spot.", scheduledTime: "07:00", isActive: false },
  { id: "wr_5", type: "exercise", message: "Time for your evening workout!", scheduledTime: "18:00", isActive: true },
]

export const sportsSlots: SportsSlot[] = [
  { id: "ss_1", sport: "Badminton", facility: "Indoor Court A", date: daysFromNow(1), startTime: "17:00", endTime: "18:00", maxPlayers: 4, currentPlayers: 2, organizer: "usr_022" },
  { id: "ss_2", sport: "Football", facility: "Main Ground", date: daysFromNow(2), startTime: "16:30", endTime: "18:00", maxPlayers: 22, currentPlayers: 14, organizer: "usr_030" },
  { id: "ss_3", sport: "Table Tennis", facility: "Hostel Common Room", date: daysFromNow(0), startTime: "20:00", endTime: "21:00", maxPlayers: 4, currentPlayers: 3, organizer: "STU2026001" },
]

export const workoutPartners: WorkoutPartner[] = [
  { userId: "usr_030", userName: "Sanjay Reddy", sport: "Running", schedule: "6 AM daily", matchScore: 88 },
  { userId: "usr_005", userName: "Neha Sharma", sport: "Badminton", schedule: "5 PM Mon/Wed/Fri", matchScore: 82 },
  { userId: "usr_018", userName: "Divya Krishnan", sport: "Yoga", schedule: "7 AM Tue/Thu/Sat", matchScore: 75 },
]

// =================== ADMINISTRATIVE ===================
export const feeRecords: FeeRecord[] = [
  {
    id: "fee_1", userId: "STU2026001", semester: "Spring 2026", totalAmount: 125000, paidAmount: 125000,
    dueDate: daysAgo(30), status: "paid",
    breakdown: [{ label: "Tuition", amount: 100000 }, { label: "Hostel", amount: 15000 }, { label: "Mess", amount: 8000 }, { label: "Misc", amount: 2000 }],
  },
  {
    id: "fee_2", userId: "STU2026001", semester: "Fall 2026", totalAmount: 125000, paidAmount: 62500,
    dueDate: daysFromNow(45), status: "partial",
    breakdown: [{ label: "Tuition", amount: 100000 }, { label: "Hostel", amount: 15000 }, { label: "Mess", amount: 8000 }, { label: "Misc", amount: 2000 }],
  },
]

export const libraryBooks: LibraryBook[] = [
  { id: "lib_1", title: "Introduction to Algorithms (CLRS)", author: "Cormen, Leiserson, Rivest, Stein", isbn: "978-0262033848", available: true, reservedBy: null, dueDate: null, location: "Shelf A-12" },
  { id: "lib_2", title: "Operating System Concepts", author: "Silberschatz, Galvin, Gagne", isbn: "978-1119800361", available: false, reservedBy: "STU2026001", dueDate: daysFromNow(7), location: "Shelf B-04" },
  { id: "lib_3", title: "Digital Signal Processing", author: "Proakis, Manolakis", isbn: "978-0131873742", available: true, reservedBy: null, dueDate: null, location: "Shelf C-08" },
  { id: "lib_4", title: "Artificial Intelligence: A Modern Approach", author: "Russell, Norvig", isbn: "978-0134610993", available: false, reservedBy: "usr_018", dueDate: daysFromNow(3), location: "Shelf A-20" },
]

export const leaveApplications: LeaveApplication[] = [
  { id: "la_1", userId: "STU2026001", type: "medical", fromDate: daysAgo(5), toDate: daysAgo(3), reason: "Fever and cold", status: "approved", appliedAt: daysAgo(6), reviewedBy: "FAC2026001" },
  { id: "la_2", userId: "STU2026001", type: "personal", fromDate: daysFromNow(10), toDate: daysFromNow(12), reason: "Family function", status: "pending", appliedAt: daysAgo(1), reviewedBy: null },
]

export const scholarshipDeadlines: ScholarshipDeadline[] = [
  { id: "sch_1", name: "INSPIRE Fellowship", provider: "DST, Govt of India", amount: 80000, deadline: daysFromNow(20), eligibility: "CGPA > 8.0, Science/Engineering", status: "open", url: "#" },
  { id: "sch_2", name: "MCM Scholarship", provider: "MHRD", amount: 36000, deadline: daysFromNow(35), eligibility: "Family income < 4.5 LPA", status: "open", url: "#" },
  { id: "sch_3", name: "Google STEP Internship", provider: "Google", amount: 150000, deadline: daysAgo(5), eligibility: "1st/2nd year CS/ECE", status: "closed", url: "#" },
]

export const attendanceRecords: AttendanceRecord[] = [
  { subjectCode: "CS301", subject: "Data Structures", totalClasses: 42, attended: 38, percentage: 90.5, lastUpdated: daysAgo(0) },
  { subjectCode: "CS302", subject: "Operating Systems", totalClasses: 38, attended: 30, percentage: 78.9, lastUpdated: daysAgo(0) },
  { subjectCode: "MA201", subject: "Probability & Statistics", totalClasses: 36, attended: 32, percentage: 88.9, lastUpdated: daysAgo(1) },
  { subjectCode: "CS303", subject: "Database Systems", totalClasses: 34, attended: 28, percentage: 82.4, lastUpdated: daysAgo(0) },
  { subjectCode: "HS201", subject: "Technical Communication", totalClasses: 20, attended: 16, percentage: 80.0, lastUpdated: daysAgo(2) },
]

// =================== UTILITY & SAFETY ===================
export const laundryMachines: LaundryMachine[] = [
  { id: "lm_1", location: "Hostel A - Ground Floor", type: "washer", status: "available", estimatedFreeAt: null, currentUser: null },
  { id: "lm_2", location: "Hostel A - Ground Floor", type: "washer", status: "in_use", estimatedFreeAt: new Date(now.getTime() + 25 * 60 * 1000), currentUser: "usr_022" },
  { id: "lm_3", location: "Hostel A - Ground Floor", type: "dryer", status: "available", estimatedFreeAt: null, currentUser: null },
  { id: "lm_4", location: "Hostel B - Basement", type: "washer", status: "out_of_order", estimatedFreeAt: null, currentUser: null },
  { id: "lm_5", location: "Hostel B - Basement", type: "dryer", status: "in_use", estimatedFreeAt: new Date(now.getTime() + 40 * 60 * 1000), currentUser: "usr_005" },
]

export const maintenanceRequests: MaintenanceRequest[] = [
  { id: "mr_1", userId: "STU2026001", category: "electrical", location: "Room 204, Hostel A", description: "Ceiling fan not working", priority: "medium", status: "assigned", createdAt: daysAgo(2), resolvedAt: null },
  { id: "mr_2", userId: "STU2026001", category: "network", location: "Room 204, Hostel A", description: "WiFi signal extremely weak", priority: "high", status: "in_progress", createdAt: daysAgo(1), resolvedAt: null },
]

export const sosAlerts: SOSAlert[] = []

export const anonymousReports: AnonymousReport[] = []

// =================== AI / ML MOCK DATA ===================
export const sentimentHistory: SentimentIndex[] = [
  { date: daysAgo(6).toISOString().split("T")[0], overall: 0.35, positive: 52, neutral: 30, negative: 18, topTopics: [{ topic: "Fest preparations", sentiment: 0.8 }, { topic: "Assignment load", sentiment: -0.4 }], sampleSize: 234 },
  { date: daysAgo(5).toISOString().split("T")[0], overall: 0.28, positive: 48, neutral: 32, negative: 20, topTopics: [{ topic: "Mess food", sentiment: -0.6 }, { topic: "Sports event", sentiment: 0.7 }], sampleSize: 198 },
  { date: daysAgo(4).toISOString().split("T")[0], overall: 0.42, positive: 55, neutral: 28, negative: 17, topTopics: [{ topic: "Placement drive", sentiment: 0.5 }, { topic: "Weather", sentiment: -0.2 }], sampleSize: 267 },
  { date: daysAgo(3).toISOString().split("T")[0], overall: 0.15, positive: 40, neutral: 35, negative: 25, topTopics: [{ topic: "Exam schedule", sentiment: -0.5 }, { topic: "Club event", sentiment: 0.6 }], sampleSize: 312 },
  { date: daysAgo(2).toISOString().split("T")[0], overall: 0.38, positive: 50, neutral: 30, negative: 20, topTopics: [{ topic: "Weekend plans", sentiment: 0.7 }, { topic: "Project deadlines", sentiment: -0.3 }], sampleSize: 189 },
  { date: daysAgo(1).toISOString().split("T")[0], overall: 0.22, positive: 44, neutral: 33, negative: 23, topTopics: [{ topic: "Internship results", sentiment: 0.4 }, { topic: "Hostel water issue", sentiment: -0.7 }], sampleSize: 276 },
  { date: daysAgo(0).toISOString().split("T")[0], overall: 0.31, positive: 47, neutral: 31, negative: 22, topTopics: [{ topic: "New library hours", sentiment: 0.6 }, { topic: "Cafeteria prices", sentiment: -0.4 }], sampleSize: 142 },
]

export const anomalyFlags: AnomalyFlag[] = [
  { id: "af_1", type: "spam", entityId: "ml_99", entityType: "listing", confidence: 87, reason: "Duplicate listing posted 5 times in 1 hour with identical content", detectedAt: daysAgo(1), status: "flagged", reviewedBy: null },
  { id: "af_2", type: "suspicious_travel", entityId: "tg_99", entityType: "travel", confidence: 72, reason: "Travel group created at 3 AM with unusual destination pattern", detectedAt: daysAgo(0), status: "reviewing", reviewedBy: "ADM2026001" },
]
