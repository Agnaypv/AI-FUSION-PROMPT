"use client"

import { useMemo } from "react"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { getCurrentMeal } from "@/lib/nexus/intelligence-engine"
import type { MealSlot } from "@/lib/nexus/types"
import {
  Utensils,
  Users,
  Leaf,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Flame,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const crowdColors = {
  low: "bg-nexus-success/10 text-nexus-success",
  medium: "bg-nexus-warn/10 text-nexus-warn",
  high: "bg-nexus-urgent/10 text-nexus-urgent",
}

function MealCard({
  meal,
  isCurrent,
  isExpanded,
  onToggle,
}: {
  meal: MealSlot
  isCurrent: boolean
  isExpanded: boolean
  onToggle: () => void
}) {
  const mealLabel = meal.type.charAt(0).toUpperCase() + meal.type.slice(1)

  return (
    <div
      className={cn(
        "rounded-lg border transition-all",
        isCurrent
          ? "border-primary/30 bg-primary/5"
          : "border-border bg-card"
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between p-3"
      >
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-lg",
              isCurrent ? "bg-primary/10" : "bg-secondary"
            )}
          >
            <Utensils
              className={cn(
                "h-4 w-4",
                isCurrent ? "text-primary" : "text-muted-foreground"
              )}
            />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">
                {mealLabel}
              </span>
              {isCurrent && (
                <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-primary">
                  Now serving
                </span>
              )}
            </div>
            <span className="text-xs text-muted-foreground">
              {meal.startTime} - {meal.endTime}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium",
              crowdColors[meal.crowdLevel]
            )}
          >
            <Users className="h-3 w-3" />
            {meal.crowdLevel}
          </span>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </button>

      {isExpanded && (
        <div className="border-t border-border px-3 pb-3 pt-2">
          {meal.aiRecommendation && (
            <div className="mb-3 flex items-start gap-2 rounded-md bg-primary/5 p-2">
              <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
              <p className="text-xs text-primary leading-relaxed">
                {meal.aiRecommendation}
              </p>
            </div>
          )}
          <div className="flex flex-wrap gap-1.5">
            {meal.items.map((item) => (
              <div
                key={item.name}
                className="flex items-center gap-1.5 rounded-md bg-secondary px-2 py-1"
              >
                {item.isVeg ? (
                  <Leaf className="h-3 w-3 text-nexus-success" />
                ) : (
                  <Flame className="h-3 w-3 text-nexus-urgent" />
                )}
                <span className="text-xs text-foreground">{item.name}</span>
                {item.calories && (
                  <span className="text-[10px] text-muted-foreground">
                    {item.calories}cal
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export function MessWidget() {
  const [mealData, setMealData] = useState<ReturnType<typeof getCurrentMeal> | null>(null)
  const [expandedMeal, setExpandedMeal] = useState<string | null>(null)

  useEffect(() => {
    const data = getCurrentMeal()
    setMealData(data)
    setExpandedMeal(data.currentMeal?.type || data.nextMeal?.type || null)
  }, [])

  if (!mealData) {
    return (
      <div className="flex flex-col gap-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-14 animate-pulse rounded-lg bg-secondary" />
        ))}
      </div>
    )
  }

  const { currentMeal, allMeals } = mealData

  return (
    <div className="flex flex-col gap-2">
      {allMeals.map((meal) => {
        const isCurrent = currentMeal?.type === meal.type
        return (
          <MealCard
            key={meal.type}
            meal={meal}
            isCurrent={isCurrent}
            isExpanded={expandedMeal === meal.type}
            onToggle={() =>
              setExpandedMeal(
                expandedMeal === meal.type ? null : meal.type
              )
            }
          />
        )
      })}
    </div>
  )
}
