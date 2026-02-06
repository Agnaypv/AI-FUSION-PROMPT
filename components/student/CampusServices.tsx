"use client"

import React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  MapPin,
  Phone,
  Clock,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Building2,
  Utensils,
  Heart,
  BookOpen,
  DollarSign,
  Users,
  Mail,
  Calendar,
} from "lucide-react"

interface Service {
  id: string
  name: string
  category: string
  location: string
  hours: string
  phone: string
  email: string
  description: string
  website?: string
  status: "Open" | "Closed" | "Limited"
  icon: React.ReactNode
}

const services: Service[] = [
  {
    id: "health",
    name: "Health & Wellness Center",
    category: "Health Services",
    location: "Medical Building, Room 101",
    hours: "Monday-Friday: 8:00 AM - 5:00 PM",
    phone: "(555) 123-4567",
    email: "health@university.edu",
    description: "Medical care, counseling, and wellness programs for all students",
    website: "www.university.edu/health",
    status: "Open",
    icon: <Heart className="w-6 h-6 text-red-600" />,
  },
  {
    id: "library",
    name: "Central Library",
    category: "Academic Resources",
    location: "Library Building, Main Floor",
    hours: "Monday-Thursday: 7:00 AM - 11:00 PM, Friday-Sunday: 9:00 AM - 9:00 PM",
    phone: "(555) 123-4568",
    email: "library@university.edu",
    description: "2 million books, research databases, study spaces, and computer labs",
    website: "www.university.edu/library",
    status: "Open",
    icon: <BookOpen className="w-6 h-6 text-blue-600" />,
  },
  {
    id: "dining",
    name: "Dining Services",
    category: "Food & Nutrition",
    location: "Student Center & Multiple Locations",
    hours: "Breakfast: 7:00 AM - 10:00 AM, Lunch: 11:00 AM - 2:00 PM, Dinner: 5:00 PM - 8:00 PM",
    phone: "(555) 123-4569",
    email: "dining@university.edu",
    description: "Multiple dining options including cafeteria, food court, and specialty restaurants",
    website: "www.university.edu/dining",
    status: "Open",
    icon: <Utensils className="w-6 h-6 text-green-600" />,
  },
  {
    id: "housing",
    name: "Residential Life",
    category: "Housing Services",
    location: "Housing Office, Student Center 201",
    hours: "Monday-Friday: 9:00 AM - 5:00 PM",
    phone: "(555) 123-4570",
    email: "housing@university.edu",
    description: "On-campus housing, room selection, and residential programming",
    website: "www.university.edu/housing",
    status: "Open",
    icon: <Building2 className="w-6 h-6 text-purple-600" />,
  },
  {
    id: "finance",
    name: "Student Financial Services",
    category: "Financial Aid",
    location: "Finance Building, Room 305",
    hours: "Monday-Friday: 8:30 AM - 4:30 PM",
    phone: "(555) 123-4571",
    email: "finaid@university.edu",
    description: "Financial aid, scholarships, loans, and billing assistance",
    website: "www.university.edu/finaid",
    status: "Open",
    icon: <DollarSign className="w-6 h-6 text-amber-600" />,
  },
  {
    id: "career",
    name: "Career Development Center",
    category: "Career Services",
    location: "Student Center, Room 150",
    hours: "Monday-Friday: 9:00 AM - 5:00 PM",
    phone: "(555) 123-4572",
    email: "careers@university.edu",
    description: "Resume writing, interview prep, job fairs, and career counseling",
    website: "www.university.edu/careers",
    status: "Open",
    icon: <Users className="w-6 h-6 text-indigo-600" />,
  },
]

export default function CampusServices() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const categories = Array.from(new Set(services.map((s) => s.category)))
  const filteredServices = services.filter(
    (service) =>
      (!selectedCategory || service.category === selectedCategory) &&
      (searchQuery === "" ||
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Campus Services</h2>
        <p className="text-slate-600">Find resources and support services across campus</p>
      </div>

      {/* Search and Filter */}
      <Card className="border-slate-200">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-900 mb-3">Filter by Category</p>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant={!selectedCategory ? "default" : "outline"}
                  onClick={() => setSelectedCategory(null)}
                  className={
                    !selectedCategory
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "text-slate-700 border-slate-300 hover:bg-slate-50"
                  }
                >
                  All Services
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category}
                    size="sm"
                    variant={selectedCategory === category ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category)}
                    className={
                      selectedCategory === category
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "text-slate-700 border-slate-300 hover:bg-slate-50"
                    }
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredServices.map((service) => (
          <Card key={service.id} className="border-slate-200 hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  {service.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-900 text-lg">{service.name}</h3>
                  <Badge className="mt-1 bg-blue-100 text-blue-700 border-blue-300">{service.category}</Badge>
                </div>
                <Badge
                  className={
                    service.status === "Open"
                      ? "bg-green-100 text-green-700 border-green-300 flex-shrink-0"
                      : "bg-orange-100 text-orange-700 border-orange-300 flex-shrink-0"
                  }
                >
                  {service.status}
                </Badge>
              </div>

              <p className="text-sm text-slate-600 mb-4 line-clamp-2">{service.description}</p>

              <div className="space-y-2 py-4 border-t border-b border-slate-200">
                <div className="flex items-start gap-2 text-sm text-slate-700">
                  <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                  <span>{service.location}</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-slate-700">
                  <Clock className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                  <span>{service.hours}</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-slate-700">
                  <Phone className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                  <span>{service.phone}</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-slate-700">
                  <Mail className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                  <span>{service.email}</span>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" className="flex-1 text-slate-700 border-slate-300 hover:bg-slate-50 bg-transparent">
                  <MapPin className="w-4 h-4 mr-2" />
                  Map
                </Button>
                <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                  Learn More
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <Card className="border-slate-200">
          <CardContent className="pt-12 text-center">
            <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600">No services found matching your search</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
