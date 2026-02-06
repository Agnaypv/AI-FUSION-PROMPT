import React from "react"
import { AppShell } from "@/components/nexus/app-shell"
import { ChatbotWidget } from "@/components/nexus/chatbot-widget"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AppShell>
      {children}
      <ChatbotWidget />
    </AppShell>
  )
}
