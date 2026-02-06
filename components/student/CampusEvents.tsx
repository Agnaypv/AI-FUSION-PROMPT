"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Calendar,
  MapPin,
  Users,
  Heart,
  Share2,
  ArrowRight,
  Clock,
  Search,
  Filter,
  AlertCircle,
} from "lucide-react"

interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  endTime: string
  location: string
  category: string
  attendees: number
  capacity: number
  image?: string
  organizer: string
  isLiked: boolean
  tags: string[]
}

const events: Event[] = [
  {
    id: 1,
    title: "Spring Carnival",
    description: "Annual spring carnival with games, food, music, and entertainment for the entire campus community.",
    date: "Saturday, March 22",
    time: "10:00 AM",
    endTime: "6:00 PM",
    location: "Main Lawn & Green Spaces",
    category: "Social",
    attendees: 250,
    capacity: 500,
    organizer: "Student Life Office",
    isLiked: false,
    tags: ["fun", "family-friendly", "food", "entertainment"],
  },
  {
    id: 2,
    title: "Career Fair 2024",
    description: "Meet with leading employers and explore internship and full-time job opportunities. Bring your resume!",
    date: "Thursday, March 20",
    time: "10:00 AM",
    endTime: "3:00 PM",
    location: "Main Gymnasium & Meeting Halls",
    category: "Career",
    attendees: 180,
    capacity: 300,
    organizer: "Career Development Center",
    isLiked: false,
    tags: ["career", "internships", "networking"],
  },
  {
    id: 3,
    title: "Science & Engineering Symposium",
    description: "Showcase of student research projects with presentations from undergrad and graduate researchers.",
    date: "Wednesday, March 19",
    time: "2:00 PM",
    endTime: "5:00 PM",
    location: "Science Building, Auditorium",
    category: "Academic",
    attendees: 120,
    capacity: 200,
    organizer: "STEM Office",
    isLiked: false,
    tags: ["science", "research", "stem"],
  },
  {
    id: 4,
    title: "Cultural Night: Around the World",
    description: "Celebrate global cultures with food, music, dance, and performances from international student organizations.",
    date: "Friday, March 28",
    time: "7:00 PM",
    endTime: "10:00 PM",
    location: "Student Center Ballroom",
    category: "Cultural",
    attendees: 300,
    capacity: 400,
    organizer: "International Student Association",
    isLiked: false,
    tags: ["cultural", "international", "celebration"],
  },
  {
    id: 5,
    title: "Tech Club Hackathon",
    description: "24-hour coding competition. Teams of 3-4 compete to build innovative projects. Prizes included!",
    date: "Saturday, April 5",
    time: "9:00 AM",
    endTime: "Sunday, April 6, 9:00 AM",
    location: "Computer Science Building, Lab 1-5",
    category: "Club",
    attendees: 85,
    capacity: 120,
    organizer: "Tech Club",
    isLiked: false,
    tags: ["coding", "hackathon", "competition", "prizes"],
  },
  {
    id: 6,
    title: "Mental Health Awareness Week",
    description: "Week-long series of workshops, panel discussions, and activities promoting mental wellness.",
    date: "Monday-Friday, March 25-29",
    time: "Various Times",
    endTime: "",
    location: "Student Center & Various Locations",
    category: "Wellness",
    attendees: 150,
    capacity: 500,
    organizer: "Health & Wellness Center",
    isLiked: false,
    tags: ["wellness", "mental-health", "workshops"],
  },
]

export default function CampusEvents() {
  const [likedEvents, setLikedEvents] = useState<Set<string>>(new Set())
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const categories = Array.from(new Set(events.map((e) => e.category)))
  const filteredEvents = events.filter(
    (event) =>
      (!selectedCategory || event.category === selectedCategory) &&
      (searchQuery === "" ||
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const toggleLike = (eventId: string) => {
    const newLiked = new Set(likedEvents)
    if (newLiked.has(eventId)) {
      newLiked.delete(eventId)
    } else {
      newLiked.add(eventId)
    }
    setLikedEvents(newLiked)
  }

  const attendancePercentage = (attendees: number, capacity: number) => {
    return Math.round((attendees / capacity) * 100)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Campus Events</h2>
        <p className="text-slate-600">Discover and join events happening around campus</p>
      </div>

      {/* Search and Filter */}
      <Card className="border-slate-200">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  All Events
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

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredEvents.map((event) => (
          <Card
            key={event.id}
            className="border-slate-200 hover:shadow-lg transition-shadow overflow-hidden cursor-pointer"
          >
            {/* Event Header */}
            <div className="bg-gradient-to-r from-blue-500 to-slate-900 h-32 relative">
              <div className="absolute top-4 right-4 flex gap-2">
                <Button
                  size="icon"
                  variant="secondary"
                  onClick={() => toggleLike(event.id)}
                  className="bg-white/90 hover:bg-white text-red-600"
                >
                  <Heart
                    className={`w-5 h-5 ${likedEvents.has(event.id) ? "fill-red-600" : ""}`}
                  />
                </Button>
                <Button size="icon" variant="secondary" className="bg-white/90 hover:bg-white text-slate-700">
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
              <Badge className="absolute bottom-4 left-4 bg-white text-blue-600 border-0">
                {event.category}
              </Badge>
            </div>

            <CardContent className="pt-4">
              {/* Title */}
              <h3 className="text-xl font-semibold text-slate-900 mb-2 line-clamp-2">{event.title}</h3>

              {/* Description */}
              <p className="text-sm text-slate-600 mb-4 line-clamp-2">{event.description}</p>

              {/* Event Details */}
              <div className="space-y-2 py-4 border-t border-b border-slate-200">
                <div className="flex items-center gap-2 text-sm text-slate-700">
                  <Calendar className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-700">
                  <Clock className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span>
                    {event.time} {event.endTime && `- ${event.endTime}`}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-700">
                  <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-700">
                  <Users className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span>
                    {event.attendees} / {event.capacity} attending
                  </span>
                </div>
              </div>

              {/* Attendance Bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-slate-900">Attendance</p>
                  <p className="text-xs text-slate-600">{attendancePercentage(event.attendees, event.capacity)}% full</p>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${attendancePercentage(event.attendees, event.capacity)}%` }}
                  />
                </div>
              </div>

              {/* Tags */}
              <div className="mt-4 flex flex-wrap gap-2">
                {event.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} className="text-xs bg-slate-100 text-slate-700 border-slate-300">
                    {tag}
                  </Badge>
                ))}
                {event.tags.length > 3 && (
                  <Badge className="text-xs bg-slate-100 text-slate-700 border-slate-300">
                    +{event.tags.length - 3} more
                  </Badge>
                )}
              </div>

              {/* Organizer */}
              <p className="text-xs text-slate-600 mt-4">Organized by {event.organizer}</p>

              {/* Action Button */}
              <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white">
                Register to Attend
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <Card className="border-slate-200">
          <CardContent className="pt-12 text-center">
            <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600">No events found matching your search</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
