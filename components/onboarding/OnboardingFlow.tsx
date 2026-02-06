"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { ChevronRight, Sparkles, BookOpen, BarChart3, Clock } from "lucide-react"

interface OnboardingFlowProps {
  onComplete: (userData: { name: string; level: string; interests: string[] }) => void
}

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(0)
  const [formData, setFormData] = useState({
    name: "",
    level: "beginner",
    interests: [] as string[],
  })

  const steps = [
    {
      title: "Welcome to Quest-Ed",
      description: "Your personalized learning journey starts here",
      icon: Sparkles,
    },
    {
      title: "What's your name?",
      description: "Help us personalize your learning experience",
      icon: BookOpen,
    },
    {
      title: "Choose your level",
      description: "Select what fits your current knowledge",
      icon: BarChart3,
    },
    {
      title: "Pick your interests",
      description: "Let us suggest the best courses for you",
      icon: Clock,
    },
  ]

  const interests = [
    "Web Development",
    "Data Science",
    "Mobile Apps",
    "Design",
    "Business",
    "Languages",
    "Science",
    "Arts",
  ]

  const levels = ["Beginner", "Intermediate", "Advanced"]

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1)
    } else {
      onComplete(formData)
    }
  }

  const handleInterestToggle = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }))
  }

  const CurrentIcon = steps[step].icon

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg border-0">
        {/* Header */}
        <div className="p-8 text-center border-b border-slate-200">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <CurrentIcon className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">{steps[step].title}</h1>
          <p className="text-slate-600">{steps[step].description}</p>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Step 0: Welcome */}
          {step === 0 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-purple-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-1">
                    ✓
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Personalized Learning</p>
                    <p className="text-sm text-slate-600">Courses tailored to your pace</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-purple-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-1">
                    ✓
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Smart Study Plans</p>
                    <p className="text-sm text-slate-600">Optimized schedules based on your goals</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-purple-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-1">
                    ✓
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Progress Tracking</p>
                    <p className="text-sm text-slate-600">Visualize your learning journey</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Name */}
          {step === 1 && (
            <div className="space-y-4">
              <Input
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="h-12 rounded-lg border-slate-200 text-base"
              />
              <p className="text-sm text-slate-600">We'll use this to personalize your experience</p>
            </div>
          )}

          {/* Step 2: Level */}
          {step === 2 && (
            <div className="space-y-3">
              {levels.map((level) => (
                <button
                  key={level}
                  onClick={() => setFormData((prev) => ({ ...prev, level: level.toLowerCase() }))}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left font-medium ${
                    formData.level === level.toLowerCase()
                      ? "bg-purple-50 border-purple-500 text-purple-900"
                      : "bg-white border-slate-200 text-slate-700 hover:border-purple-300"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          )}

          {/* Step 3: Interests */}
          {step === 3 && (
            <div className="grid grid-cols-2 gap-3">
              {interests.map((interest) => (
                <button
                  key={interest}
                  onClick={() => handleInterestToggle(interest)}
                  className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                    formData.interests.includes(interest)
                      ? "bg-purple-50 border-purple-500 text-purple-900"
                      : "bg-white border-slate-200 text-slate-700 hover:border-purple-300"
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Progress and Actions */}
        <div className="px-8 pb-8 space-y-4">
          {/* Progress bar */}
          <div className="flex gap-1">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`flex-1 h-1 rounded-full transition-colors ${
                  index <= step ? "bg-purple-500" : "bg-slate-200"
                }`}
              />
            ))}
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            {step > 0 && (
              <Button
                variant="outline"
                onClick={() => setStep(step - 1)}
                className="flex-1 h-11 rounded-lg border-slate-300"
              >
                Back
              </Button>
            )}
            <Button
              onClick={handleNext}
              disabled={step === 1 && !formData.name}
              className="flex-1 h-11 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium"
            >
              {step === steps.length - 1 ? "Start Learning" : "Next"}
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
