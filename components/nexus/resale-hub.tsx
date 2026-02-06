"use client"

import React, { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { marketplaceListings } from "@/lib/nexus/mock-data"
import type { MarketplaceListing } from "@/lib/nexus/types"
import {
  Package,
  Search,
  IndianRupee,
  Shield,
  Star,
  SlidersHorizontal,
  Plus,
  TrendingDown,
  BookOpen,
  Wrench,
  Cpu,
  Calculator,
  ImageIcon,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// Image map for resale items
const resaleImages: Record<string, string> = {
  "ml_1": "/images/products/ti-calculator.jpg",
  "ml_2": "/images/products/algorithms-textbook.jpg",
  "ml_3": "/images/products/desk-lamp.jpg",
  "ml_4": "/images/products/arduino-kit.jpg",
  "ml_5": "/images/products/engineering-textbook.jpg",
  "ml_6": "/images/products/calculator.jpg",
  "ml_7": "/images/products/soldering-kit.jpg",
  "ml_8": "/images/products/raspberry-pi.jpg",
}

// Extended resale items focused on student needs
const resaleItems: MarketplaceListing[] = [
  ...marketplaceListings,
  {
    id: "ml_4",
    title: "Arduino Uno R3 Starter Kit",
    description: "Complete kit with breadboard, LEDs, resistors, sensors. Used for one semester project.",
    price: 1200,
    suggestedPrice: 1600,
    condition: "good",
    category: "Lab Kits",
    imageUrl: "/images/products/arduino-kit.jpg",
    sellerId: "usr_015",
    sellerName: "Vikash Singh",
    sellerTrustScore: 85,
    createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000),
    status: "active",
  },
  {
    id: "ml_5",
    title: "Engineering Mathematics - Kreyszig (10th Ed)",
    description: "Paperback, very good condition. Minimal highlights.",
    price: 350,
    suggestedPrice: 450,
    condition: "like_new",
    category: "Books",
    imageUrl: "/images/products/engineering-textbook.jpg",
    sellerId: "usr_018",
    sellerName: "Divya Krishnan",
    sellerTrustScore: 93,
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    status: "active",
  },
  {
    id: "ml_6",
    title: "Casio FX-991EX Calculator",
    description: "Scientific calculator, perfect working condition. All functions intact.",
    price: 800,
    suggestedPrice: 1100,
    condition: "good",
    category: "Calculators",
    imageUrl: "/images/products/calculator.jpg",
    sellerId: "usr_022",
    sellerName: "Arun Kumar",
    sellerTrustScore: 79,
    createdAt: new Date(Date.now() - 60 * 60 * 60 * 1000),
    status: "active",
  },
  {
    id: "ml_7",
    title: "Soldering Iron Kit + Components",
    description: "60W soldering iron with solder wire, flux, desoldering pump. ECE lab ready.",
    price: 550,
    suggestedPrice: 800,
    condition: "fair",
    category: "ECE Tools",
    imageUrl: "/images/products/soldering-kit.jpg",
    sellerId: "usr_030",
    sellerName: "Sanjay Reddy",
    sellerTrustScore: 76,
    createdAt: new Date(Date.now() - 96 * 60 * 60 * 1000),
    status: "active",
  },
  {
    id: "ml_8",
    title: "Raspberry Pi 4 (4GB RAM)",
    description: "With case, power supply, and 32GB SD card. Used for IoT project.",
    price: 2800,
    suggestedPrice: 3500,
    condition: "like_new",
    category: "Project Components",
    imageUrl: "/images/products/raspberry-pi.jpg",
    sellerId: "usr_005",
    sellerName: "Neha Sharma",
    sellerTrustScore: 91,
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
    status: "active",
  },
]

const resaleCategories = [
  { name: "All", icon: Package },
  { name: "Books", icon: BookOpen },
  { name: "ECE Tools", icon: Wrench },
  { name: "Lab Kits", icon: Cpu },
  { name: "Calculators", icon: Calculator },
  { name: "Electronics", icon: Zap },
  { name: "Project Components", icon: Cpu },
  { name: "Room Essentials", icon: Package },
]

const conditionConfig: Record<string, { label: string; color: string }> = {
  new: { label: "New", color: "text-nexus-success" },
  like_new: { label: "Like New", color: "text-nexus-success" },
  good: { label: "Good", color: "text-nexus-info" },
  fair: { label: "Fair", color: "text-nexus-warn" },
  poor: { label: "Poor", color: "text-nexus-urgent" },
}

function TrustBadge({ score }: { score: number }) {
  const color = score >= 85 ? "text-nexus-success" : score >= 70 ? "text-nexus-info" : "text-nexus-warn"
  return (
    <span className={cn("flex items-center gap-1 text-[10px] font-medium", color)}>
      <Shield className="h-3 w-3" />
      {score}
    </span>
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

function ResaleCard({ item }: { item: MarketplaceListing }) {
  const cond = conditionConfig[item.condition] || { label: item.condition, color: "text-muted-foreground" }
  const savings = item.suggestedPrice ? item.suggestedPrice - item.price : 0
  const savingsPercent = item.suggestedPrice ? Math.round((savings / item.suggestedPrice) * 100) : 0

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-nexus-gold/20 hover:shadow-[0_0_20px_-6px_hsl(var(--nexus-gold)/0.15)]">
      {/* Image -- real product photo */}
      <div className="relative h-40 overflow-hidden bg-secondary/50">
        {(item.imageUrl || resaleImages[item.id]) ? (
          <img
            src={item.imageUrl || resaleImages[item.id]}
            alt={item.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ImageIcon className="h-10 w-10 text-muted-foreground/20" />
          </div>
        )}
        {/* Condition badge */}
        <span className={cn("absolute left-2 top-2 rounded-full bg-background/80 px-2 py-0.5 text-[9px] font-semibold backdrop-blur-sm", cond.color)}>
          {cond.label}
        </span>
        {/* AI price badge */}
        {savingsPercent > 0 && (
          <span className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-nexus-gold/15 px-2 py-0.5 text-[9px] font-semibold text-nexus-gold">
            <TrendingDown className="h-2.5 w-2.5" />
            {savingsPercent}% below AI price
          </span>
        )}
        <span className="absolute bottom-2 right-2 rounded-full bg-background/80 px-2 py-0.5 text-[10px] text-muted-foreground backdrop-blur-sm">
          {getTimeAgo(item.createdAt)}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-3">
        <h3 className="text-sm font-semibold text-foreground line-clamp-1">{item.title}</h3>
        <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{item.description}</p>

        {/* Price */}
        <div className="mt-3 flex items-center gap-2">
          <div className="flex items-center gap-0.5 text-lg font-bold text-foreground">
            <IndianRupee className="h-3.5 w-3.5" />
            {item.price.toLocaleString()}
          </div>
          {item.suggestedPrice && (
            <span className="text-xs text-muted-foreground line-through">
              {item.suggestedPrice.toLocaleString()}
            </span>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-border pt-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-muted-foreground">{item.sellerName}</span>
            <TrustBadge score={item.sellerTrustScore} />
          </div>
          <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">{item.category}</span>
        </div>
      </div>
    </div>
  )
}

export function ResaleHub() {
  const [mounted, setMounted] = useState(false)
  const [category, setCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"recent" | "price_low" | "price_high">("recent")

  useEffect(() => { setMounted(true) }, [])

  const filteredItems = resaleItems
    .filter((item) => {
      if (category !== "All" && item.category !== category) return false
      if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) return false
      return item.status === "active"
    })
    .sort((a, b) => {
      if (sortBy === "price_low") return a.price - b.price
      if (sortBy === "price_high") return b.price - a.price
      return b.createdAt.getTime() - a.createdAt.getTime()
    })

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 lg:px-6 nexus-fade-in">
      {/* Header */}
      <header className="mb-6">
        <h1 className="flex items-center gap-2 text-xl font-semibold text-foreground">
          <Package className="h-5 w-5 text-nexus-gold" />
          Student Resale Hub
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Buy and sell books, tools, lab kits, and project components
        </p>
      </header>

      {/* AI suggestion banner */}
      <div className="mb-4 flex items-center gap-3 rounded-lg border border-nexus-gold/15 bg-nexus-gold/[0.03] p-3 nexus-shimmer">
        <Zap className="h-4 w-4 shrink-0 text-nexus-gold" />
        <p className="text-xs text-muted-foreground">
          <span className="font-medium text-foreground">AI Suggestion:</span> Based on your courses (CS301, CS302), you might need a scientific calculator and algorithm textbooks.
        </p>
      </div>

      {/* Search + Controls */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search books, tools, kits..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground"
          >
            <option value="recent">Most Recent</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
          </select>
          <Button variant="outline" size="sm" className="h-9 gap-1.5 bg-transparent text-xs">
            <Plus className="h-3.5 w-3.5" />
            Sell Item
          </Button>
        </div>
      </div>

      {/* Category chips */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
        {resaleCategories.map(({ name, icon: Icon }) => (
          <button
            key={name}
            type="button"
            onClick={() => setCategory(name)}
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-all",
              category === name
                ? "border-nexus-gold/30 bg-nexus-gold/10 text-nexus-gold"
                : "border-border text-muted-foreground hover:border-nexus-gold/15 hover:text-foreground"
            )}
          >
            <Icon className="h-3 w-3" />
            {name}
          </button>
        ))}
      </div>

      {/* Items Grid */}
      {mounted ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => (
            <ResaleCard key={item.id} item={item} />
          ))}
          {filteredItems.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-12 text-center">
              <Package className="h-8 w-8 text-muted-foreground/30" />
              <p className="mt-2 text-sm text-muted-foreground">No items found in this category</p>
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
