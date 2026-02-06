"use client"

import React, { useState, useMemo, useRef, useEffect, useCallback } from "react"
import { cn } from "@/lib/utils"
import { places } from "@/lib/nexus/mock-data"
import { buildContext } from "@/lib/nexus/intelligence-engine"
import type { VibeTag } from "@/lib/nexus/types"
import {
  Compass,
  MapPin,
  Star,
  Users,
  Coffee,
  BookOpen,
  Sparkles,
  Zap,
  Utensils,
  Mountain,
  IndianRupee,
  Brain,
  Camera,
  Map,
  Navigation,
  Building,
  X,
  Maximize2,
  Minimize2,
} from "lucide-react"
import { Button } from "@/components/ui/button"

// ============ CAMPUS MAP DATA ============

interface CampusBuilding {
  id: string
  name: string
  type: "academic" | "hostel" | "mess" | "lab" | "admin" | "sports" | "library" | "other"
  shortName: string
  x: number // percentage position
  y: number // percentage position
  width: number
  height: number
  color: string
  floors?: number
  rooms?: string
}

const campusBuildings: CampusBuilding[] = [
  { id: "b1", name: "Academic Block A", type: "academic", shortName: "AB-A", x: 20, y: 15, width: 18, height: 12, color: "hsl(42, 92%, 56%)", floors: 4, rooms: "LH-101 to LH-401" },
  { id: "b2", name: "Academic Block B", type: "academic", shortName: "AB-B", x: 45, y: 15, width: 18, height: 12, color: "hsl(42, 92%, 50%)", floors: 3, rooms: "LH-102 to LH-305" },
  { id: "b3", name: "Academic Block C", type: "academic", shortName: "AB-C", x: 70, y: 15, width: 14, height: 10, color: "hsl(42, 80%, 45%)", floors: 3, rooms: "Exam Hall 1-5" },
  { id: "b4", name: "CS Building", type: "lab", shortName: "CS", x: 15, y: 35, width: 14, height: 10, color: "hsl(200, 70%, 55%)", floors: 3, rooms: "Lab 201-302" },
  { id: "b5", name: "ECE Building", type: "lab", shortName: "ECE", x: 35, y: 35, width: 14, height: 10, color: "hsl(200, 60%, 50%)", floors: 2, rooms: "Lab 101-205" },
  { id: "b6", name: "Central Library", type: "library", shortName: "LIB", x: 58, y: 35, width: 16, height: 12, color: "hsl(166, 62%, 48%)", floors: 3 },
  { id: "b7", name: "Hostel A (Boys)", type: "hostel", shortName: "H-A", x: 10, y: 60, width: 10, height: 14, color: "hsl(220, 30%, 40%)", floors: 5 },
  { id: "b8", name: "Hostel B (Boys)", type: "hostel", shortName: "H-B", x: 24, y: 60, width: 10, height: 14, color: "hsl(220, 30%, 38%)", floors: 5 },
  { id: "b9", name: "Hostel C (Girls)", type: "hostel", shortName: "H-C", x: 38, y: 60, width: 10, height: 14, color: "hsl(220, 30%, 36%)", floors: 5 },
  { id: "b10", name: "Main Mess", type: "mess", shortName: "MESS", x: 55, y: 60, width: 14, height: 10, color: "hsl(25, 95%, 53%)", floors: 1 },
  { id: "b11", name: "Sports Complex", type: "sports", shortName: "SPORT", x: 75, y: 55, width: 16, height: 16, color: "hsl(152, 60%, 48%)" },
  { id: "b12", name: "Admin Block", type: "admin", shortName: "ADMIN", x: 45, y: 82, width: 18, height: 10, color: "hsl(0, 0%, 50%)", floors: 2 },
  { id: "b13", name: "Student Center", type: "other", shortName: "SC", x: 70, y: 82, width: 12, height: 8, color: "hsl(280, 50%, 50%)" },
  { id: "b14", name: "Humanities Block", type: "academic", shortName: "HUM", x: 82, y: 32, width: 12, height: 10, color: "hsl(42, 70%, 45%)", floors: 2 },
  { id: "b15", name: "Main Gate", type: "other", shortName: "GATE", x: 48, y: 96, width: 8, height: 4, color: "hsl(42, 92%, 56%)" },
]

const buildingTypeColors: Record<string, string> = {
  academic: "bg-nexus-gold/20 text-nexus-gold",
  hostel: "bg-nexus-info/20 text-nexus-info",
  mess: "bg-nexus-warn/20 text-nexus-warn",
  lab: "bg-nexus-info/20 text-nexus-info",
  admin: "bg-muted text-muted-foreground",
  sports: "bg-nexus-success/20 text-nexus-success",
  library: "bg-nexus-success/20 text-nexus-success",
  other: "bg-secondary text-muted-foreground",
}

// ============ VIBE CONFIG ============

const vibeIcons: Record<VibeTag, typeof Coffee> = {
  study: BookOpen,
  chill: Coffee,
  budget: IndianRupee,
  social: Users,
  food: Utensils,
  adventure: Mountain,
}

const vibeColors: Record<VibeTag, string> = {
  study: "bg-nexus-info/10 text-nexus-info",
  chill: "bg-nexus-gold/10 text-nexus-gold",
  budget: "bg-nexus-success/10 text-nexus-success",
  social: "bg-nexus-warn/10 text-nexus-warn",
  food: "bg-nexus-urgent/10 text-nexus-urgent",
  adventure: "bg-muted text-muted-foreground",
}

const crowdColors = {
  low: "text-nexus-success",
  medium: "text-nexus-warn",
  high: "text-nexus-urgent",
}

// ============ CAMPUS MAP COMPONENT ============

function CampusMap() {
  const [selectedBuilding, setSelectedBuilding] = useState<CampusBuilding | null>(null)
  const [filterType, setFilterType] = useState<string>("all")

  const typeFilters = ["all", "academic", "hostel", "mess", "lab", "admin", "sports", "library"]

  const filteredBuildings = filterType === "all"
    ? campusBuildings
    : campusBuildings.filter((b) => b.type === filterType)

  return (
    <div className="flex flex-col gap-4">
      {/* Type filters */}
      <div className="flex flex-wrap gap-1.5">
        {typeFilters.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setFilterType(type)}
            className={cn(
              "rounded-full border px-2.5 py-1 text-[10px] font-medium capitalize transition-all",
              filterType === type
                ? "border-nexus-gold/30 bg-nexus-gold/10 text-nexus-gold"
                : "border-border text-muted-foreground hover:text-foreground"
            )}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Map canvas with real campus aerial image */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-card">
        {/* Real campus aerial photograph as background */}
        <img
          src="/images/campus-aerial.png"
          alt="IIT Ropar campus aerial view"
          className="absolute inset-0 h-full w-full object-cover"
          crossOrigin="anonymous"
        />
        {/* Semi-transparent overlay for readability of building labels */}
        <div className="absolute inset-0 bg-background/40 backdrop-blur-[1px]" />

        {/* Buildings */}
        {filteredBuildings.map((building) => {
          const isSelected = selectedBuilding?.id === building.id
          return (
            <button
              key={building.id}
              type="button"
              onClick={() => setSelectedBuilding(isSelected ? null : building)}
              className={cn(
                "absolute flex items-center justify-center rounded-md border text-[8px] font-bold tracking-wider transition-all",
                isSelected
                  ? "z-20 border-nexus-gold shadow-[0_0_16px_-4px_hsl(var(--nexus-gold)/0.5)]"
                  : "z-10 border-border/50 hover:z-20 hover:border-nexus-gold/40 hover:shadow-[0_0_12px_-4px_hsl(var(--nexus-gold)/0.3)]"
              )}
              style={{
                left: `${building.x}%`,
                top: `${building.y}%`,
                width: `${building.width}%`,
                height: `${building.height}%`,
                backgroundColor: `${building.color}22`,
                color: building.color,
                borderColor: isSelected ? building.color : undefined,
              }}
            >
              <span className="font-display text-[8px] sm:text-[9px]">{building.shortName}</span>
            </button>
          )
        })}

        {/* Compass */}
        <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-card/80 backdrop-blur-sm">
          <Navigation className="h-4 w-4 text-nexus-gold" />
        </div>
      </div>

      {/* Selected building details */}
      {selectedBuilding && (
        <div className="nexus-card nexus-fade-in nexus-border-glow">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-nexus-gold" />
                <h3 className="text-sm font-semibold text-foreground">{selectedBuilding.name}</h3>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <span className={cn("rounded-full px-2 py-0.5 text-[9px] font-medium capitalize", buildingTypeColors[selectedBuilding.type])}>
                  {selectedBuilding.type}
                </span>
                {selectedBuilding.floors && (
                  <span className="text-[10px] text-muted-foreground">{selectedBuilding.floors} floors</span>
                )}
                {selectedBuilding.rooms && (
                  <span className="text-[10px] text-muted-foreground">{selectedBuilding.rooms}</span>
                )}
              </div>
            </div>
            <button type="button" onClick={() => setSelectedBuilding(null)} className="text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ============ CAMERA/AR MODE ============

function ImmersiveMode({ onExit }: { onExit: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [cameraActive, setCameraActive] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)

  useEffect(() => {
    let stream: MediaStream | null = null

    async function startCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          setCameraActive(true)
        }
      } catch (err) {
        setCameraError("Camera access denied or unavailable. Using map mode instead.")
      }
    }

    startCamera()

    return () => {
      if (stream) {
        for (const track of stream.getTracks()) {
          track.stop()
        }
      }
    }
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      {/* Camera / Fallback */}
      <div className="relative flex-1 overflow-hidden bg-card">
        {cameraActive ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="h-full w-full object-cover"
            />
            {/* AR Overlay */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Direction indicators */}
              <div className="absolute left-1/2 top-8 flex -translate-x-1/2 items-center gap-2 rounded-full bg-background/80 px-4 py-2 backdrop-blur-md">
                <Navigation className="h-4 w-4 text-nexus-gold" />
                <span className="font-display text-xs font-semibold tracking-wider text-foreground">CAMPUS AR MODE</span>
              </div>

              {/* Overlay building markers */}
              <div className="absolute left-[20%] top-[40%] flex flex-col items-center pointer-events-auto">
                <div className="rounded-lg border border-nexus-gold/40 bg-background/80 px-2 py-1 backdrop-blur-sm">
                  <span className="font-display text-[9px] font-bold text-nexus-gold">AB-A</span>
                </div>
                <div className="mt-1 h-6 w-px bg-nexus-gold/40" />
                <div className="h-2 w-2 rounded-full bg-nexus-gold/60" />
              </div>

              <div className="absolute left-[55%] top-[35%] flex flex-col items-center pointer-events-auto">
                <div className="rounded-lg border border-nexus-info/40 bg-background/80 px-2 py-1 backdrop-blur-sm">
                  <span className="font-display text-[9px] font-bold text-nexus-info">LIB</span>
                </div>
                <div className="mt-1 h-4 w-px bg-nexus-info/40" />
                <div className="h-2 w-2 rounded-full bg-nexus-info/60" />
              </div>

              <div className="absolute left-[75%] top-[50%] flex flex-col items-center pointer-events-auto">
                <div className="rounded-lg border border-nexus-warn/40 bg-background/80 px-2 py-1 backdrop-blur-sm">
                  <span className="font-display text-[9px] font-bold text-nexus-warn">MESS</span>
                </div>
                <div className="mt-1 h-8 w-px bg-nexus-warn/40" />
                <div className="h-2 w-2 rounded-full bg-nexus-warn/60" />
              </div>

              {/* Distance indicator */}
              <div className="absolute bottom-20 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-full bg-background/80 px-4 py-2 backdrop-blur-md">
                <MapPin className="h-3.5 w-3.5 text-nexus-gold" />
                <span className="text-xs text-foreground">Academic Block A - <span className="font-semibold text-nexus-gold">120m</span></span>
              </div>
            </div>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
            {cameraError ? (
              <>
                <Camera className="h-12 w-12 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">{cameraError}</p>
                <p className="text-xs text-muted-foreground">Tap below to use the interactive map instead.</p>
              </>
            ) : (
              <>
                <div className="h-12 w-12 animate-pulse rounded-full bg-nexus-gold/20" />
                <p className="text-sm text-muted-foreground">Activating camera...</p>
              </>
            )}
          </div>
        )}
      </div>

      {/* Bottom controls */}
      <div className="flex items-center justify-between border-t border-border bg-card p-4">
        <Button variant="outline" onClick={onExit} className="gap-2 bg-transparent">
          <X className="h-4 w-4" />
          Exit AR Mode
        </Button>
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-nexus-gold nexus-pulse" />
          <span className="text-xs text-muted-foreground">Live</span>
        </div>
      </div>
    </div>
  )
}

// ============ PLACES LIST ============

function PlacesList() {
  const [activeVibe, setActiveVibe] = useState<VibeTag | "all">("all")
  const allVibes: VibeTag[] = ["study", "chill", "budget", "social", "food", "adventure"]

  const filteredPlaces = activeVibe === "all"
    ? places
    : places.filter((p) => p.vibeTags.includes(activeVibe))

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setActiveVibe("all")}
          className={cn(
            "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
            activeVibe === "all"
              ? "bg-nexus-gold/10 text-nexus-gold"
              : "bg-secondary text-muted-foreground hover:text-foreground"
          )}
        >
          <Compass className="h-3 w-3" />
          All
        </button>
        {allVibes.map((vibe) => {
          const Icon = vibeIcons[vibe]
          return (
            <button
              key={vibe}
              type="button"
              onClick={() => setActiveVibe(vibe)}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium capitalize transition-colors",
                activeVibe === vibe
                  ? "bg-nexus-gold/10 text-nexus-gold"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-3 w-3" />
              {vibe}
            </button>
          )
        })}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {filteredPlaces.map((place) => (
          <div key={place.id} className="nexus-card-elevated">
            <div className="mb-3 flex h-28 items-center justify-center rounded-lg bg-secondary">
              <MapPin className="h-8 w-8 text-muted-foreground/20" />
            </div>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">{place.name}</p>
                <p className="mt-0.5 text-[10px] text-muted-foreground">{place.type} -- {place.distance}</p>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-nexus-gold text-nexus-gold" />
                <span className="text-sm font-semibold text-foreground">{place.rating}</span>
              </div>
            </div>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed line-clamp-2">{place.description}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {place.vibeTags.map((vibe) => {
                const Icon = vibeIcons[vibe]
                return (
                  <span key={vibe} className={cn("flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium capitalize", vibeColors[vibe])}>
                    <Icon className="h-2.5 w-2.5" />
                    {vibe}
                  </span>
                )
              })}
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
              <span className={cn("flex items-center gap-1 text-[10px] font-medium", crowdColors[place.crowdLevel])}>
                <Users className="h-3 w-3" />
                {place.crowdLevel} crowd
              </span>
              {place.openNow && <span className="text-[10px] font-medium text-nexus-success">Open now</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ============ MAIN EXPLORER ============

type ExplorerTab = "map" | "discover"

export function ExplorePage() {
  const [activeTab, setActiveTab] = useState<ExplorerTab>("map")
  const [immersiveMode, setImmersiveMode] = useState(false)

  if (immersiveMode) {
    return <ImmersiveMode onExit={() => setImmersiveMode(false)} />
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 lg:px-6 nexus-fade-in">
      <header className="mb-6">
        <h1 className="flex items-center gap-2 text-xl font-semibold text-foreground">
          <Compass className="h-5 w-5 text-nexus-gold" />
          Campus Explorer
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Navigate campus with the interactive map or AR mode
        </p>
      </header>

      {/* AR Launch button */}
      <button
        type="button"
        onClick={() => setImmersiveMode(true)}
        className="mb-6 flex w-full items-center gap-4 rounded-xl border border-nexus-gold/20 bg-nexus-gold/[0.04] p-4 text-left transition-all hover:border-nexus-gold/30 hover:bg-nexus-gold/[0.06] nexus-border-glow"
      >
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-nexus-gold/10 nexus-glow">
          <Camera className="h-6 w-6 text-nexus-gold" />
        </div>
        <div>
          <p className="font-display text-sm font-bold tracking-wider text-foreground">IMMERSIVE MODE</p>
          <p className="text-xs text-muted-foreground">Activate camera for AR campus navigation with building markers</p>
        </div>
        <Zap className="ml-auto h-5 w-5 text-nexus-gold/50" />
      </button>

      {/* Tab switcher */}
      <div className="mb-6 flex items-center gap-1 rounded-lg border border-border bg-card p-1">
        <button
          type="button"
          onClick={() => setActiveTab("map")}
          className={cn(
            "flex items-center gap-1.5 rounded-md px-4 py-2 text-xs font-medium transition-all",
            activeTab === "map" ? "bg-nexus-gold/10 text-nexus-gold" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Map className="h-3.5 w-3.5" />
          Campus Map
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("discover")}
          className={cn(
            "flex items-center gap-1.5 rounded-md px-4 py-2 text-xs font-medium transition-all",
            activeTab === "discover" ? "bg-nexus-gold/10 text-nexus-gold" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Sparkles className="h-3.5 w-3.5" />
          Discover Places
        </button>
      </div>

      {activeTab === "map" && <CampusMap />}
      {activeTab === "discover" && <PlacesList />}
    </div>
  )
}
