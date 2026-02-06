"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Star, Users, Clock, Filter, ArrowRight } from "lucide-react"

interface Course {
  id: string
  title: string
  instructor: string
  category: string
  level: "Beginner" | "Intermediate" | "Advanced"
  rating: number
  students: number
  duration: string
  price: string
  image: string
  description: string
}

export default function CourseCatalog() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState("all")

  const categories = ["all", "Web Development", "Design", "Data Science", "Business"]
  const difficulties = ["all", "Beginner", "Intermediate", "Advanced"]

  const courses: Course[] = [
    {
      id: "1",
      title: "React Fundamentals",
      instructor: "Sarah Chen",
      category: "Web Development",
      level: "Beginner",
      rating: 4.8,
      students: 12400,
      duration: "8 weeks",
      price: "Free",
      image: "⚛️",
      description: "Learn React from scratch with interactive lessons and real-world projects.",
    },
    {
      id: "2",
      title: "Advanced JavaScript",
      instructor: "Mike Johnson",
      category: "Web Development",
      level: "Advanced",
      rating: 4.9,
      students: 8900,
      duration: "10 weeks",
      price: "Free",
      image: "✨",
      description: "Master async programming, closures, and advanced JavaScript patterns.",
    },
    {
      id: "3",
      title: "UI/UX Design Principles",
      instructor: "Emma Wilson",
      category: "Design",
      level: "Beginner",
      rating: 4.7,
      students: 15600,
      duration: "6 weeks",
      price: "Free",
      image: "🎨",
      description: "Create beautiful user interfaces with modern design principles and tools.",
    },
    {
      id: "4",
      title: "Python for Data Science",
      instructor: "Dr. Alex Kim",
      category: "Data Science",
      level: "Intermediate",
      rating: 4.8,
      students: 10200,
      duration: "12 weeks",
      price: "Free",
      image: "📊",
      description: "Analyze data and create visualizations using Python and popular libraries.",
    },
    {
      id: "5",
      title: "Business Strategy 101",
      instructor: "Lisa Garcia",
      category: "Business",
      level: "Beginner",
      rating: 4.6,
      students: 7800,
      duration: "4 weeks",
      price: "Free",
      image: "💼",
      description: "Learn fundamental business strategies and entrepreneurship principles.",
    },
    {
      id: "6",
      title: "Web Design Masterclass",
      instructor: "Emma Wilson",
      category: "Design",
      level: "Advanced",
      rating: 4.9,
      students: 6500,
      duration: "14 weeks",
      price: "Free",
      image: "🎯",
      description: "Create responsive, beautiful websites that users love.",
    },
  ]

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || course.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === "all" || course.level === selectedDifficulty
    return matchesSearch && matchesCategory && matchesDifficulty
  })

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-green-100 text-green-800"
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800"
      case "Advanced":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-indigo-50 to-pink-50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-indigo-100 to-transparent rounded-full opacity-40 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-pink-100 to-transparent rounded-full opacity-40 blur-3xl" />
      
      {/* Header */}
      <div className="px-4 sm:px-6 lg:px-8 py-8 border-b border-gray-200/50 relative z-10">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent mb-2">Browse Courses</h1>
          <p className="text-gray-600 mb-6 text-lg">
            Explore {filteredCourses.length} courses and expand your skills
          </p>

          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 rounded-lg border-slate-300 text-base"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Filters */}
            <div className="lg:col-span-1">
              <Card className="border-0 rounded-2xl bg-white shadow-lg p-6 sticky top-6">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Filter className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg">Filter</h3>
                </div>

                {/* Category Filter */}
                <div className="mb-6">
                  <p className="text-sm font-semibold text-gray-900 mb-3">Category</p>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`w-full text-left px-4 py-3 rounded-xl transition-all text-sm font-medium ${
                          selectedCategory === category
                            ? "bg-gradient-to-r from-indigo-100 to-pink-100 text-indigo-700 shadow-md border border-indigo-200"
                            : "text-gray-700 hover:bg-gray-100 border border-transparent"
                        }`}
                      >
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Difficulty Filter */}
                <div className="mb-6 pt-6 border-t border-gray-200">
                  <p className="text-sm font-semibold text-gray-900 mb-3">Difficulty</p>
                  <div className="space-y-2">
                    {difficulties.map((difficulty) => (
                      <button
                        key={difficulty}
                        onClick={() => setSelectedDifficulty(difficulty)}
                        className={`w-full text-left px-4 py-3 rounded-xl transition-all text-sm font-medium ${
                          selectedDifficulty === difficulty
                            ? "bg-gradient-to-r from-indigo-100 to-pink-100 text-indigo-700 shadow-md border border-indigo-200"
                            : "text-gray-700 hover:bg-gray-100 border border-transparent"
                        }`}
                      >
                        {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </Card>
            </div>

            {/* Course Grid */}
            <div className="lg:col-span-3">
              {filteredCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredCourses.map((course, idx) => (
                    <Card
                      key={course.id}
                      className="border-0 rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 course-card overflow-hidden fade-in"
                      style={{ animationDelay: `${idx * 0.1}s` }}
                    >
                      {/* Course Header with gradient */}
                      <div className="bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 p-8 flex items-center justify-center relative overflow-hidden h-40">
                        <div className="absolute inset-0 opacity-10">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-3xl" />
                          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full blur-3xl" />
                        </div>
                        <div className="text-7xl drop-shadow-lg relative z-10">{course.image}</div>
                      </div>

                      {/* Course Content */}
                      <div className="p-6">
                        <div className="mb-4">
                          <Badge className={`${getLevelColor(course.level)} font-bold px-3 py-1 shadow-md`}>
                            {course.level}
                          </Badge>
                        </div>

                        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 leading-snug">
                          {course.title}
                        </h3>

                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                          {course.description}
                        </p>

                        {/* Instructor */}
                        <p className="text-xs text-gray-600 mb-4 font-medium">
                          By <span className="font-bold text-indigo-600">{course.instructor}</span>
                        </p>

                        {/* Stats */}
                        <div className="flex flex-wrap gap-4 mb-5 pb-5 border-t border-gray-200 pt-5">
                          <div className="flex items-center gap-1.5 text-xs">
                            <div className="p-1 bg-yellow-100 rounded-lg">
                              <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                            </div>
                            <span className="text-gray-800 font-bold">{course.rating}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
                            <Users className="w-3.5 h-3.5" />
                            {course.students.toLocaleString()}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
                            <Clock className="w-3.5 h-3.5" />
                            {course.duration}
                          </div>
                        </div>

                        {/* Enroll Button */}
                        <Button className="w-full bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 text-white rounded-xl h-11 font-bold shadow-lg hover:shadow-xl transition-all">
                          Enroll Now
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="border-0 rounded-2xl bg-white shadow-lg p-16 text-center">
                  <p className="text-gray-600 text-lg font-medium">No courses found matching your filters.</p>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
