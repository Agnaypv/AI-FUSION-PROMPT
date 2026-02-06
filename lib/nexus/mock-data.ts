// ============================================
// NEXUS MOCK DATA STORE
// Realistic college life data for prototype
// ============================================

import type {
  NexusUser,
  TimetableEntry,
  Email,
  DailyMenu,
  Assignment,
  SubjectGrade,
  MarketplaceListing,
  LostFoundItem,
  TravelGroup,
  Place,
} from "./types"

// --- MOCK USER DATABASE ---
export const mockUsers: NexusUser[] = [
  {
    id: "STU2026001",
    name: "Arjun Mehta",
    email: "arjun.mehta@university.edu",
    avatar: "",
    department: "Computer Science",
    role: "student",
    year: 3,
    semester: 5,
    trustScore: 87,
    mobile: "9876543210",
    password: "nexus123",
    preferences: {
      dietaryPreference: "non-veg",
      notificationLevel: "important",
    },
  },
  {
    id: "STU2026002",
    name: "Priya Nair",
    email: "priya.nair@university.edu",
    avatar: "",
    department: "Electronics",
    role: "student",
    year: 2,
    semester: 3,
    trustScore: 91,
    mobile: "9876543211",
    password: "nexus123",
    preferences: {
      dietaryPreference: "veg",
      notificationLevel: "all",
    },
  },
  {
    id: "FAC2026001",
    name: "Dr. Priya Sharma",
    email: "priya.sharma@university.edu",
    avatar: "",
    department: "Computer Science",
    role: "faculty",
    year: 0,
    semester: 0,
    trustScore: 98,
    mobile: "9876543220",
    password: "faculty123",
    preferences: {
      dietaryPreference: "veg",
      notificationLevel: "important",
    },
  },
  {
    id: "ADM2026001",
    name: "Registrar Office",
    email: "admin@university.edu",
    avatar: "",
    department: "Administration",
    role: "admin",
    year: 0,
    semester: 0,
    trustScore: 100,
    mobile: "9876543230",
    password: "admin123",
    preferences: {
      dietaryPreference: "veg",
      notificationLevel: "all",
    },
  },
]

// --- CURRENT USER (default) ---
export let currentUser: NexusUser = mockUsers[0]

export function setCurrentUser(user: NexusUser) {
  currentUser = user
}

// --- TIMETABLE ---
export const timetable: TimetableEntry[] = [
  {
    id: "tt_1",
    subject: "Data Structures & Algorithms",
    code: "CS301",
    type: "lecture",
    professor: "Dr. Priya Sharma",
    room: "LH-201",
    building: "Academic Block A",
    dayOfWeek: 1,
    startTime: "09:00",
    endTime: "10:00",
    color: "hsl(166, 62%, 48%)",
  },
  {
    id: "tt_2",
    subject: "Operating Systems",
    code: "CS302",
    type: "lecture",
    professor: "Dr. Rajesh Kumar",
    room: "LH-105",
    building: "Academic Block B",
    dayOfWeek: 1,
    startTime: "10:15",
    endTime: "11:15",
    color: "hsl(200, 70%, 55%)",
  },
  {
    id: "tt_3",
    subject: "Database Management",
    code: "CS303",
    type: "lab",
    professor: "Prof. Anita Desai",
    room: "Lab-302",
    building: "CS Building",
    dayOfWeek: 1,
    startTime: "14:00",
    endTime: "16:00",
    color: "hsl(38, 92%, 55%)",
  },
  {
    id: "tt_4",
    subject: "Computer Networks",
    code: "CS304",
    type: "lecture",
    professor: "Dr. Vikram Singh",
    room: "LH-301",
    building: "Academic Block A",
    dayOfWeek: 2,
    startTime: "09:00",
    endTime: "10:00",
    color: "hsl(280, 65%, 55%)",
  },
  {
    id: "tt_5",
    subject: "Data Structures & Algorithms",
    code: "CS301",
    type: "tutorial",
    professor: "Dr. Priya Sharma",
    room: "TR-104",
    building: "Academic Block A",
    dayOfWeek: 2,
    startTime: "11:00",
    endTime: "12:00",
    color: "hsl(166, 62%, 48%)",
  },
  {
    id: "tt_6",
    subject: "Operating Systems",
    code: "CS302",
    type: "lab",
    professor: "Dr. Rajesh Kumar",
    room: "Lab-201",
    building: "CS Building",
    dayOfWeek: 2,
    startTime: "14:00",
    endTime: "16:00",
    color: "hsl(200, 70%, 55%)",
  },
  {
    id: "tt_7",
    subject: "Database Management",
    code: "CS303",
    type: "lecture",
    professor: "Prof. Anita Desai",
    room: "LH-105",
    building: "Academic Block B",
    dayOfWeek: 3,
    startTime: "09:00",
    endTime: "10:00",
    color: "hsl(38, 92%, 55%)",
  },
  {
    id: "tt_8",
    subject: "Computer Networks",
    code: "CS304",
    type: "tutorial",
    professor: "Dr. Vikram Singh",
    room: "TR-201",
    building: "Academic Block A",
    dayOfWeek: 3,
    startTime: "10:15",
    endTime: "11:15",
    color: "hsl(280, 65%, 55%)",
  },
  {
    id: "tt_9",
    subject: "Soft Skills & Communication",
    code: "HS201",
    type: "seminar",
    professor: "Prof. Meera Joshi",
    room: "Seminar Hall 1",
    building: "Humanities Block",
    dayOfWeek: 3,
    startTime: "14:00",
    endTime: "15:00",
    color: "hsl(152, 60%, 48%)",
  },
  {
    id: "tt_10",
    subject: "Data Structures & Algorithms",
    code: "CS301",
    type: "lecture",
    professor: "Dr. Priya Sharma",
    room: "LH-201",
    building: "Academic Block A",
    dayOfWeek: 4,
    startTime: "09:00",
    endTime: "10:00",
    color: "hsl(166, 62%, 48%)",
  },
  {
    id: "tt_11",
    subject: "Operating Systems",
    code: "CS302",
    type: "lecture",
    professor: "Dr. Rajesh Kumar",
    room: "LH-105",
    building: "Academic Block B",
    dayOfWeek: 4,
    startTime: "10:15",
    endTime: "11:15",
    color: "hsl(200, 70%, 55%)",
  },
  {
    id: "tt_12",
    subject: "Computer Networks",
    code: "CS304",
    type: "lecture",
    professor: "Dr. Vikram Singh",
    room: "LH-301",
    building: "Academic Block A",
    dayOfWeek: 5,
    startTime: "09:00",
    endTime: "10:00",
    color: "hsl(280, 65%, 55%)",
  },
  {
    id: "tt_13",
    subject: "Database Management",
    code: "CS303",
    type: "lecture",
    professor: "Prof. Anita Desai",
    room: "LH-105",
    building: "Academic Block B",
    dayOfWeek: 5,
    startTime: "10:15",
    endTime: "11:15",
    color: "hsl(38, 92%, 55%)",
  },
]

// --- EMAILS ---
const now = new Date()
export const emails: Email[] = [
  {
    id: "em_1",
    from: "registrar@university.edu",
    fromName: "Office of the Registrar",
    subject: "IMPORTANT: Mid-Semester Examination Schedule Released - Action Required",
    body: `Dear Students,

This is to inform you that the Mid-Semester Examination Schedule for Semester 5 (2025-26) has been released. Examinations will commence from February 24, 2026 and continue until March 7, 2026.

Key dates:
- CS301 (Data Structures & Algorithms): Feb 25, 2026, 10:00 AM
- CS302 (Operating Systems): Feb 27, 2026, 2:00 PM
- CS303 (Database Management): Mar 2, 2026, 10:00 AM
- CS304 (Computer Networks): Mar 4, 2026, 2:00 PM

Students must carry their ID cards. Seating arrangement will be shared 24 hours prior.

Please report any conflicts to the examination cell by February 15, 2026.

Regards,
Office of the Registrar`,
    receivedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
    isRead: false,
    category: "academic",
    priorityScore: 95,
    extractedDeadline: new Date(2026, 1, 15),
    extractedAction: "Report exam conflicts by Feb 15",
    isRelevantToday: true,
  },
  {
    id: "em_2",
    from: "cse.hod@university.edu",
    fromName: "Dr. Arun Patel, HOD CSE",
    subject: "Guest Lecture: AI in Healthcare by Dr. Fei-Fei Li - Tomorrow 3 PM",
    body: `Dear CS Students,

We are honored to host a virtual guest lecture by Dr. Fei-Fei Li (Stanford University) on "AI in Healthcare: Challenges and Opportunities" tomorrow at 3:00 PM in the Main Auditorium.

Attendance is mandatory for 3rd year students. This will count towards your seminar credits.

Please be seated by 2:45 PM.

Best,
Dr. Arun Patel
Head of Department, CSE`,
    receivedAt: new Date(now.getTime() - 5 * 60 * 60 * 1000),
    isRead: false,
    category: "academic",
    priorityScore: 82,
    extractedDeadline: new Date(now.getTime() + 24 * 60 * 60 * 1000),
    extractedAction: "Attend guest lecture tomorrow at 3 PM",
    isRelevantToday: true,
  },
  {
    id: "em_3",
    from: "events@university.edu",
    fromName: "Cultural Committee",
    subject: "TechFest 2026 Registration Open - Early Bird Discount Ending Soon!",
    body: `Hey there!

TechFest 2026 is happening March 15-17! Register now for hackathons, coding competitions, robotics challenges, and more.

Early bird registration ends February 10th. Don't miss out on the 30% discount!

Register at: techfest.university.edu

Cheers,
Cultural Committee`,
    receivedAt: new Date(now.getTime() - 8 * 60 * 60 * 1000),
    isRead: true,
    category: "event",
    priorityScore: 55,
    extractedDeadline: new Date(2026, 1, 10),
    extractedAction: "Register for TechFest by Feb 10",
    isRelevantToday: false,
  },
  {
    id: "em_4",
    from: "library@university.edu",
    fromName: "Central Library",
    subject: "Overdue Book Notice - 'Introduction to Algorithms' by Cormen",
    body: `Dear Arjun Mehta,

This is a reminder that the following book is overdue:

Title: Introduction to Algorithms (4th Edition)
Author: Cormen, Leiserson, Rivest, Stein
Due Date: January 28, 2026
Fine accrued: Rs. 50

Please return the book at your earliest convenience to avoid further fines.

Central Library`,
    receivedAt: new Date(now.getTime() - 24 * 60 * 60 * 1000),
    isRead: true,
    category: "administrative",
    priorityScore: 68,
    extractedAction: "Return overdue library book",
    isRelevantToday: true,
  },
  {
    id: "em_5",
    from: "placement@university.edu",
    fromName: "Training & Placement Cell",
    subject: "Internship Opportunity: Google Summer Internship 2026 - Apply by Feb 20",
    body: `Dear Students,

Google is recruiting for Summer 2026 internships. Eligible candidates: 3rd year B.Tech/B.E. students with CGPA >= 7.5.

Roles: Software Engineering Intern, ML Research Intern, Cloud Engineering Intern

Application deadline: February 20, 2026
Online test: February 28, 2026

Apply through the placement portal.

Best,
T&P Cell`,
    receivedAt: new Date(now.getTime() - 3 * 60 * 60 * 1000),
    isRead: false,
    category: "urgent",
    priorityScore: 91,
    extractedDeadline: new Date(2026, 1, 20),
    extractedAction: "Apply for Google internship by Feb 20",
    isRelevantToday: true,
  },
  {
    id: "em_6",
    from: "hostel.warden@university.edu",
    fromName: "Hostel Administration",
    subject: "Water Supply Interruption - February 7, 6 AM to 12 PM",
    body: `Dear Hostel Residents,

Due to maintenance work on the main water pipeline, water supply to Hostels A, B, and C will be interrupted on February 7, 2026 from 6:00 AM to 12:00 PM.

Please store sufficient water beforehand. We apologize for the inconvenience.

Hostel Administration`,
    receivedAt: new Date(now.getTime() - 6 * 60 * 60 * 1000),
    isRead: true,
    category: "administrative",
    priorityScore: 45,
    isRelevantToday: true,
  },
]

// --- MESS MENU ---
export const dailyMenu: DailyMenu = {
  date: new Date().toISOString().split("T")[0],
  meals: [
    {
      type: "breakfast",
      startTime: "07:30",
      endTime: "09:30",
      items: [
        { name: "Masala Dosa", isVeg: true, nutritionTag: "carb", calories: 250 },
        { name: "Sambar", isVeg: true, nutritionTag: "protein", calories: 120 },
        { name: "Coconut Chutney", isVeg: true, nutritionTag: "light", calories: 80 },
        { name: "Boiled Eggs", isVeg: false, nutritionTag: "protein", calories: 155 },
        { name: "Toast & Butter", isVeg: true, nutritionTag: "carb", calories: 180 },
        { name: "Banana", isVeg: true, nutritionTag: "fiber", calories: 105 },
      ],
      crowdLevel: "medium",
      aiRecommendation: "High protein recommended before morning lectures. Try the dosa with extra sambar and eggs.",
    },
    {
      type: "lunch",
      startTime: "12:00",
      endTime: "14:00",
      items: [
        { name: "Jeera Rice", isVeg: true, nutritionTag: "carb", calories: 210 },
        { name: "Dal Tadka", isVeg: true, nutritionTag: "protein", calories: 180 },
        { name: "Paneer Butter Masala", isVeg: true, nutritionTag: "protein", calories: 320 },
        { name: "Chicken Curry", isVeg: false, nutritionTag: "protein", calories: 290 },
        { name: "Roti (2)", isVeg: true, nutritionTag: "carb", calories: 200 },
        { name: "Salad", isVeg: true, nutritionTag: "fiber", calories: 45 },
        { name: "Curd", isVeg: true, nutritionTag: "light", calories: 98 },
      ],
      crowdLevel: "high",
      aiRecommendation: "You have a 2-hour lab after lunch. Go light on carbs -- dal + roti + salad is ideal.",
    },
    {
      type: "snacks",
      startTime: "16:30",
      endTime: "18:00",
      items: [
        { name: "Samosa (2)", isVeg: true, nutritionTag: "carb", calories: 260 },
        { name: "Tea / Coffee", isVeg: true, nutritionTag: "light", calories: 40 },
        { name: "Bread Pakora", isVeg: true, nutritionTag: "carb", calories: 200 },
        { name: "Fruit Juice", isVeg: true, nutritionTag: "fiber", calories: 120 },
      ],
      crowdLevel: "low",
    },
    {
      type: "dinner",
      startTime: "19:30",
      endTime: "21:30",
      items: [
        { name: "Fried Rice", isVeg: true, nutritionTag: "carb", calories: 280 },
        { name: "Manchurian", isVeg: true, nutritionTag: "carb", calories: 250 },
        { name: "Egg Curry", isVeg: false, nutritionTag: "protein", calories: 220 },
        { name: "Chapati (2)", isVeg: true, nutritionTag: "carb", calories: 200 },
        { name: "Mixed Veg", isVeg: true, nutritionTag: "fiber", calories: 140 },
        { name: "Ice Cream", isVeg: true, nutritionTag: "light", calories: 200 },
      ],
      crowdLevel: "medium",
      aiRecommendation: "Exam prep tonight? Skip heavy carbs. Egg curry + chapati + mixed veg keeps you alert.",
    },
  ],
}

// --- ASSIGNMENTS ---
export const assignments: Assignment[] = [
  {
    id: "as_1",
    title: "Implement AVL Tree with Balancing",
    subject: "Data Structures & Algorithms",
    subjectCode: "CS301",
    dueDate: new Date(2026, 1, 9, 23, 59),
    status: "in_progress",
    maxMarks: 30,
    weight: 10,
    description: "Implement AVL tree insertion, deletion, and rotation operations. Include time complexity analysis.",
  },
  {
    id: "as_2",
    title: "Process Scheduling Simulator",
    subject: "Operating Systems",
    subjectCode: "CS302",
    dueDate: new Date(2026, 1, 12, 23, 59),
    status: "pending",
    maxMarks: 40,
    weight: 15,
    description: "Build a simulator for FCFS, SJF, Round Robin, and Priority scheduling algorithms.",
  },
  {
    id: "as_3",
    title: "ER Diagram + Normalization",
    subject: "Database Management",
    subjectCode: "CS303",
    dueDate: new Date(2026, 1, 8, 23, 59),
    status: "in_progress",
    maxMarks: 25,
    weight: 8,
    description: "Design ER diagram for a library system and normalize to 3NF.",
  },
  {
    id: "as_4",
    title: "TCP/UDP Socket Programming",
    subject: "Computer Networks",
    subjectCode: "CS304",
    dueDate: new Date(2026, 1, 15, 23, 59),
    status: "pending",
    maxMarks: 35,
    weight: 12,
    description: "Implement a chat application using TCP and UDP sockets in Python/Java.",
  },
  {
    id: "as_5",
    title: "Graph Algorithms Worksheet",
    subject: "Data Structures & Algorithms",
    subjectCode: "CS301",
    dueDate: new Date(2026, 1, 5, 23, 59),
    status: "submitted",
    grade: "A",
    maxMarks: 20,
    weight: 5,
    description: "Solve 15 problems on BFS, DFS, Dijkstra, and Kruskal's algorithms.",
  },
]

// --- GRADES ---
export const grades: SubjectGrade[] = [
  {
    subjectCode: "CS301",
    subject: "Data Structures & Algorithms",
    assignments: 85,
    quizzes: 78,
    midterm: null,
    final: null,
    currentGrade: "A-",
    percentage: 82,
    trend: "up",
  },
  {
    subjectCode: "CS302",
    subject: "Operating Systems",
    assignments: 72,
    quizzes: 68,
    midterm: null,
    final: null,
    currentGrade: "B+",
    percentage: 70,
    trend: "stable",
  },
  {
    subjectCode: "CS303",
    subject: "Database Management",
    assignments: 90,
    quizzes: 85,
    midterm: null,
    final: null,
    currentGrade: "A",
    percentage: 88,
    trend: "up",
  },
  {
    subjectCode: "CS304",
    subject: "Computer Networks",
    assignments: 65,
    quizzes: 60,
    midterm: null,
    final: null,
    currentGrade: "B",
    percentage: 63,
    trend: "down",
  },
]

// --- MARKETPLACE ---
export const marketplaceListings: MarketplaceListing[] = [
  {
    id: "ml_1",
    title: "TI-84 Plus Calculator",
    description: "Barely used, works perfectly. Comes with cover.",
    price: 2500,
    suggestedPrice: 2800,
    condition: "like_new",
    category: "Electronics",
    imageUrl: "/images/products/ti-calculator.jpg",
    sellerId: "usr_012",
    sellerName: "Sneha Patel",
    sellerTrustScore: 92,
    createdAt: new Date(now.getTime() - 48 * 60 * 60 * 1000),
    status: "active",
  },
  {
    id: "ml_2",
    title: "Introduction to Algorithms - Cormen (4th Ed)",
    description: "Some highlighting, good condition overall.",
    price: 400,
    suggestedPrice: 500,
    condition: "good",
    category: "Books",
    imageUrl: "/images/products/algorithms-textbook.jpg",
    sellerId: "usr_024",
    sellerName: "Rahul Verma",
    sellerTrustScore: 78,
    createdAt: new Date(now.getTime() - 24 * 60 * 60 * 1000),
    status: "active",
  },
  {
    id: "ml_3",
    title: "Desk Lamp (LED, Adjustable)",
    description: "3 brightness modes, USB powered. 6 months old.",
    price: 600,
    suggestedPrice: 700,
    condition: "good",
    category: "Room Essentials",
    imageUrl: "/images/products/desk-lamp.jpg",
    sellerId: "usr_008",
    sellerName: "Kavya Iyer",
    sellerTrustScore: 95,
    createdAt: new Date(now.getTime() - 72 * 60 * 60 * 1000),
    status: "active",
  },
]

// --- LOST & FOUND ---
export const lostFoundItems: LostFoundItem[] = [
  {
    id: "lf_1",
    type: "lost",
    title: "Blue JBL Earbuds (Left Ear)",
    description: "Lost one earbud near the basketball court area.",
    category: "Electronics",
    location: "Sports Complex",
    building: "Sports Block",
    dateReported: new Date(now.getTime() - 12 * 60 * 60 * 1000),
    dateOccurred: new Date(now.getTime() - 18 * 60 * 60 * 1000),
    imageUrl: "/images/products/earbuds-blue.jpg",
    status: "open",
    reportedBy: "Arjun Mehta",
    contactInfo: "arjun.mehta@university.edu",
  },
  {
    id: "lf_2",
    type: "found",
    title: "Black Umbrella with Silver Handle",
    description: "Found in LH-201 after the DSA lecture.",
    category: "Personal Items",
    location: "Lecture Hall 201",
    building: "Academic Block A",
    dateReported: new Date(now.getTime() - 6 * 60 * 60 * 1000),
    dateOccurred: new Date(now.getTime() - 7 * 60 * 60 * 1000),
    imageUrl: "/images/products/umbrella-black.jpg",
    status: "open",
    reportedBy: "Priya Nair",
    contactInfo: "priya.nair@university.edu",
  },
]

// --- TRAVEL GROUPS ---
export const travelGroups: TravelGroup[] = [
  {
    id: "tg_1",
    destination: "City Mall",
    departureLocation: "Main Gate",
    departureTime: new Date(now.getTime() + 3 * 60 * 60 * 1000),
    seats: 4,
    seatsAvailable: 2,
    estimatedCost: 320,
    costPerPerson: 80,
    organizer: "Aditya Rao",
    organizerTrustScore: 88,
    safetyScore: 94,
    members: ["Aditya Rao", "Nisha Kumar"],
  },
  {
    id: "tg_2",
    destination: "Railway Station",
    departureLocation: "Hostel C Gate",
    departureTime: new Date(now.getTime() + 5 * 60 * 60 * 1000),
    seats: 3,
    seatsAvailable: 1,
    estimatedCost: 450,
    costPerPerson: 150,
    organizer: "Rohan Das",
    organizerTrustScore: 81,
    safetyScore: 90,
    members: ["Rohan Das", "Vikash Singh"],
  },
]

// --- PLACES ---
export const places: Place[] = [
  {
    id: "pl_1",
    name: "The Quiet Bean",
    type: "Cafe",
    vibeTags: ["study", "chill"],
    distance: "0.5 km",
    crowdLevel: "low",
    rating: 4.5,
    priceLevel: 2,
    openNow: true,
    imageUrl: "",
    description: "Cozy cafe with great Wi-Fi and quiet ambiance. Perfect for study sessions.",
  },
  {
    id: "pl_2",
    name: "Campus Dhaba",
    type: "Restaurant",
    vibeTags: ["food", "budget", "social"],
    distance: "0.2 km",
    crowdLevel: "high",
    rating: 4.2,
    priceLevel: 1,
    openNow: true,
    imageUrl: "",
    description: "The go-to spot for quick, affordable meals and late-night snacks.",
  },
  {
    id: "pl_3",
    name: "Central Library Garden",
    type: "Outdoor",
    vibeTags: ["study", "chill"],
    distance: "0.3 km",
    crowdLevel: "low",
    rating: 4.7,
    priceLevel: 1,
    openNow: true,
    imageUrl: "",
    description: "Peaceful garden behind the library. Great for reading and group discussions.",
  },
  {
    id: "pl_4",
    name: "GameZone Arena",
    type: "Entertainment",
    vibeTags: ["social", "chill", "adventure"],
    distance: "1.2 km",
    crowdLevel: "medium",
    rating: 4.0,
    priceLevel: 2,
    openNow: true,
    imageUrl: "",
    description: "Gaming lounge with PCs, consoles, and board games. Student discount available.",
  },
]
