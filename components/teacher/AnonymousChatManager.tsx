"use client"

import AnonymousChatSystem from "@/components/chat/AnonymousChatSystem"

export default function AnonymousChatManager() {
  return (
    <div className="space-y-6">
      <AnonymousChatSystem userRole="teacher" />
    </div>
  )
}
