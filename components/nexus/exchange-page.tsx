"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { lostFoundItems } from "@/lib/nexus/mock-data"
import {
  Search,
  MapPin,
  Clock,
  Shield,
  Eye,
  CheckCircle2,
  Plus,
  SlidersHorizontal,
  Zap,
  ImageIcon,
  AlertTriangle,
  PartyPopper,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { LostFoundItem } from "@/lib/nexus/types"

// Image map for lost & found items
const itemImages: Record<string, string> = {
  "lf_1": "/images/products/earbuds-blue.jpg",
  "lf_2": "/images/products/umbrella-black.jpg",
  "lf_3": "/images/products/calculator.jpg",
  "lf_4": "/images/products/red-backpack.jpg",
  "lf_5": "/images/products/silver-watch.jpg",
  "lf_6": "/images/products/reading-glasses.jpg",
}

// Extended mock data for OLX-style display
const extendedItems: LostFoundItem[] = [
  ...lostFoundItems,
  {
    id: "lf_3",
    type: "lost",
    title: "HP Scientific Calculator",
    description: "Black HP 35s scientific calculator. Has a small scratch on the back. Lost after exam.",
    category: "Electronics",
    location: "Exam Hall 3",
    building: "Academic Block C",
    dateReported: new Date(Date.now() - 24 * 60 * 60 * 1000),
    dateOccurred: new Date(Date.now() - 26 * 60 * 60 * 1000),
    status: "open",
    reportedBy: "Rahul Verma",
    contactInfo: "rahul.v@university.edu",
    imageUrl: "/images/products/calculator.jpg",
  },
  {
    id: "lf_4",
    type: "found",
    title: "Red Backpack with Books",
    description: "Red Wildcraft backpack with CS textbooks inside. Found near library entrance.",
    category: "Bags",
    location: "Library Entrance",
    building: "Central Library",
    dateReported: new Date(Date.now() - 4 * 60 * 60 * 1000),
    dateOccurred: new Date(Date.now() - 5 * 60 * 60 * 1000),
    status: "open",
    reportedBy: "Ananya Gupta",
    contactInfo: "ananya.g@university.edu",
    imageUrl: "/images/products/red-backpack.jpg",
  },
  {
    id: "lf_5",
    type: "lost",
    title: "Silver Watch - Titan Brand",
    description: "Analog silver Titan watch with leather strap. Sentimental value.",
    category: "Accessories",
    location: "Sports Ground",
    building: "Sports Complex",
    dateReported: new Date(Date.now() - 48 * 60 * 60 * 1000),
    dateOccurred: new Date(Date.now() - 50 * 60 * 60 * 1000),
    status: "matched",
    matchConfidence: 78,
    reportedBy: "Karthik S",
    contactInfo: "karthik.s@university.edu",
    imageUrl: "/images/products/silver-watch.jpg",
  },
  {
    id: "lf_6",
    type: "found",
    title: "Pair of Reading Glasses",
    description: "Black frame reading glasses in a brown case. Found in canteen.",
    category: "Accessories",
    location: "Main Canteen",
    building: "Student Center",
    dateReported: new Date(Date.now() - 2 * 60 * 60 * 1000),
    dateOccurred: new Date(Date.now() - 3 * 60 * 60 * 1000),
    status: "open",
    reportedBy: "Meera Joshi",
    contactInfo: "meera.j@university.edu",
    imageUrl: "/images/products/reading-glasses.jpg",
  },
]

const categories = ["All", "Electronics", "Personal Items", "Bags", "Accessories", "Books", "ID Cards"]

type FilterType = "all" | "lost" | "found"

function ItemCard({ item }: { item: LostFoundItem }) {
  const isLost = item.type === "lost"
  const timeAgo = getTimeAgo(item.dateReported)

  return (
    <div className={cn(
      "group flex flex-col overflow-hidden rounded-xl border transition-all hover:shadow-[0_0_20px_-6px_hsl(var(--nexus-gold)/0.15)]",
      isLost ? "border-nexus-urgent/15" : "border-nexus-success/15",
      "bg-card"
    )}>
      {/* Image area -- OLX style large image with real product photo */}
      <div className={cn(
        "relative h-40 overflow-hidden",
        isLost ? "bg-nexus-urgent/[0.04]" : "bg-nexus-success/[0.04]"
      )}>
        {(item.imageUrl || itemImages[item.id]) ? (
          <img
            src={item.imageUrl || itemImages[item.id]}
            alt={item.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ImageIcon className="h-10 w-10 text-muted-foreground/20" />
          </div>
        )}
        {/* Type badge overlaid */}
        <span className={cn(
          "absolute left-2 top-2 rounded-full px-2 py-0.5 font-display text-[9px] font-bold uppercase tracking-wider",
          isLost ? "bg-nexus-urgent/15 text-nexus-urgent" : "bg-nexus-success/15 text-nexus-success"
        )}>
          {isLost ? "LOST" : "FOUND"}
        </span>
        {/* Match badge */}
        {item.matchConfidence && (
          <span className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-nexus-gold/15 px-2 py-0.5 text-[9px] font-semibold text-nexus-gold">
            <Zap className="h-2.5 w-2.5" />
            {item.matchConfidence}% match
          </span>
        )}
        {/* Time badge */}
        <span className="absolute bottom-2 right-2 rounded-full bg-background/80 px-2 py-0.5 text-[10px] text-muted-foreground backdrop-blur-sm">
          {timeAgo}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-3">
        <h3 className="text-sm font-semibold text-foreground line-clamp-1">{item.title}</h3>
        <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{item.description}</p>

        <div className="mt-auto flex flex-col gap-1.5 pt-3">
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="truncate">{item.location}, {item.building}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <span className="rounded bg-secondary px-1.5 py-0.5 font-medium">{item.category}</span>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
          <span className="text-[10px] text-muted-foreground">{item.reportedBy}</span>
          <Button variant="outline" size="sm" className="h-6 gap-1 bg-transparent text-[10px]">
            <Eye className="h-3 w-3" />
            Contact
          </Button>
        </div>
      </div>
    </div>
  )
}

function getTimeAgo(date: Date): string {
  const diff = Date.now() - date.getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  if (hours < 1) return "Just now"
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export function ExchangePage() {
  const [mounted, setMounted] = useState(false)
  const [filter, setFilter] = useState<FilterType>("all")
  const [category, setCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => { setMounted(true) }, [])

  const filteredItems = extendedItems.filter((item) => {
    if (filter !== "all" && item.type !== filter) return false
    if (category !== "All" && item.category !== category) return false
    if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase()) && !item.description.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const lostCount = extendedItems.filter(i => i.type === "lost").length
  const foundCount = extendedItems.filter(i => i.type === "found").length

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 lg:px-6 nexus-fade-in">
      {/* Header */}
      <header className="mb-6">
        <h1 className="flex items-center gap-2 text-xl font-semibold text-foreground">
          <Search className="h-5 w-5 text-nexus-gold" />
          Lost & Found
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          AI-powered item matching with visual search
        </p>
      </header>

      {/* Stats bar */}
      <div className="mb-4 flex items-center gap-3">
        <div className="flex items-center gap-1.5 rounded-full bg-nexus-urgent/10 px-3 py-1 text-xs font-medium text-nexus-urgent">
          <AlertTriangle className="h-3 w-3" />
          {lostCount} lost
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-nexus-success/10 px-3 py-1 text-xs font-medium text-nexus-success">
          <PartyPopper className="h-3 w-3" />
          {foundCount} found
        </div>
        <Button variant="outline" size="sm" className="ml-auto h-8 gap-1.5 bg-transparent text-xs">
          <Plus className="h-3.5 w-3.5" />
          Report Item
        </Button>
      </div>

      {/* Search & Filters */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1">
          {(["all", "lost", "found"] as FilterType[]).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-all",
                filter === f ? "bg-nexus-gold/10 text-nexus-gold" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Category pills */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategory(cat)}
            className={cn(
              "shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-all",
              category === cat
                ? "border-nexus-gold/30 bg-nexus-gold/10 text-nexus-gold"
                : "border-border text-muted-foreground hover:border-nexus-gold/15 hover:text-foreground"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Item Grid -- OLX style */}
      {mounted ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
          {filteredItems.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-12 text-center">
              <Search className="h-8 w-8 text-muted-foreground/30" />
              <p className="mt-2 text-sm text-muted-foreground">No items match your search</p>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 animate-pulse rounded-xl bg-secondary" />
          ))}
        </div>
      )}
    </div>
  )
}
