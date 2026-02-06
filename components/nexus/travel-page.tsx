"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { travelGroups } from "@/lib/nexus/mock-data"
import { format } from "date-fns"
import {
  Car,
  Users,
  Shield,
  IndianRupee,
  ArrowRight,
  Clock,
  MapPin,
  Plus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

function TrustBadge({ score }: { score: number }) {
  const color =
    score >= 85
      ? "text-nexus-success"
      : score >= 70
        ? "text-nexus-info"
        : "text-nexus-warn"

  return (
    <span className={cn("flex items-center gap-1 text-[10px] font-medium", color)}>
      <Shield className="h-3 w-3" />
      Trust {score}
    </span>
  )
}

export function TravelPage() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 lg:px-6">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">
            Travel Sharing
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Find or create shared rides with trusted students
          </p>
        </div>
        <Button size="sm" className="gap-1.5">
          <Plus className="h-4 w-4" />
          New Ride
        </Button>
      </header>

      {!mounted ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-36 animate-pulse rounded-lg bg-secondary" />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {travelGroups.map((group) => {
            const spotsLeft = group.seatsAvailable
            const isAlmostFull = spotsLeft <= 1
            const fillPercent =
              ((group.seats - group.seatsAvailable) / group.seats) * 100

            return (
              <div key={group.id} className="nexus-card-elevated">
                {/* Route */}
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Car className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex flex-1 items-center gap-2">
                    <div>
                      <p className="text-xs text-muted-foreground">From</p>
                      <p className="text-sm font-medium text-foreground">
                        {group.departureLocation}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">To</p>
                      <p className="text-sm font-medium text-primary">
                        {group.destination}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-0.5 text-xl font-bold text-foreground">
                      <IndianRupee className="h-4 w-4" />
                      {group.costPerPerson}
                    </div>
                    <p className="text-[10px] text-muted-foreground">per person</p>
                  </div>
                </div>

                {/* Details */}
                <div className="mt-4 grid grid-cols-3 gap-3">
                  <div className="rounded-md bg-secondary p-2.5 text-center">
                    <Clock className="mx-auto h-3.5 w-3.5 text-muted-foreground" />
                    <p className="mt-1 text-xs font-medium text-foreground">
                      {format(group.departureTime, "h:mm a")}
                    </p>
                    <p className="text-[10px] text-muted-foreground">Departure</p>
                  </div>
                  <div className="rounded-md bg-secondary p-2.5 text-center">
                    <Users className="mx-auto h-3.5 w-3.5 text-muted-foreground" />
                    <p
                      className={cn(
                        "mt-1 text-xs font-medium",
                        isAlmostFull ? "text-nexus-warn" : "text-foreground"
                      )}
                    >
                      {spotsLeft} left
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      of {group.seats}
                    </p>
                  </div>
                  <div className="rounded-md bg-secondary p-2.5 text-center">
                    <Shield className="mx-auto h-3.5 w-3.5 text-muted-foreground" />
                    <p className="mt-1 text-xs font-medium text-nexus-success">
                      {group.safetyScore}%
                    </p>
                    <p className="text-[10px] text-muted-foreground">Safety</p>
                  </div>
                </div>

                {/* Fill bar */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                    <span>Seats filled</span>
                    <span>
                      {group.seats - group.seatsAvailable}/{group.seats}
                    </span>
                  </div>
                  <Progress value={fillPercent} className="mt-1 h-1.5" />
                </div>

                {/* Members & Actions */}
                <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-1.5">
                      {group.members.map((m) => (
                        <div
                          key={m}
                          className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-card bg-secondary text-xs font-medium text-foreground"
                          title={m}
                        >
                          {m.charAt(0)}
                        </div>
                      ))}
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        by {group.organizer}
                      </p>
                      <TrustBadge score={group.organizerTrustScore} />
                    </div>
                  </div>
                  <Button size="sm" className="gap-1.5">
                    <span>Join Ride</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
