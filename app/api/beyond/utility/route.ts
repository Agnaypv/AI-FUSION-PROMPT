// NEXUS Utility & Safety API
// Laundry, maintenance, night canteen, SOS, safe-walk, anonymous reporting
// Real-time capable, safety-first design

import { laundryMachines, maintenanceRequests } from "@/lib/nexus/beyond-data"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const module = searchParams.get("module")
  const userId = searchParams.get("userId") || "STU2026001"

  switch (module) {
    case "laundry":
      return Response.json({
        machines: laundryMachines.map((m) => ({
          ...m,
          waitTime: m.estimatedFreeAt
            ? Math.max(0, Math.round((m.estimatedFreeAt.getTime() - Date.now()) / 60000))
            : 0,
        })),
        summary: {
          available: laundryMachines.filter((m) => m.status === "available").length,
          inUse: laundryMachines.filter((m) => m.status === "in_use").length,
          outOfOrder: laundryMachines.filter((m) => m.status === "out_of_order").length,
        },
      })

    case "maintenance":
      return Response.json({
        requests: maintenanceRequests.filter((m) => m.userId === userId),
        stats: {
          open: maintenanceRequests.filter((m) => m.status !== "resolved").length,
          resolved: maintenanceRequests.filter((m) => m.status === "resolved").length,
        },
      })

    case "night-canteen":
      return Response.json({
        menu: [
          { id: "nc_1", name: "Maggi", price: 30, available: true, prepTime: 8 },
          { id: "nc_2", name: "Bread Omelette", price: 40, available: true, prepTime: 10 },
          { id: "nc_3", name: "Tea", price: 15, available: true, prepTime: 3 },
          { id: "nc_4", name: "Coffee", price: 20, available: true, prepTime: 3 },
          { id: "nc_5", name: "Sandwich", price: 35, available: true, prepTime: 7 },
          { id: "nc_6", name: "Paratha Roll", price: 50, available: false, prepTime: 12 },
        ],
        isOpen: (() => {
          const h = new Date().getHours()
          return h >= 22 || h <= 2
        })(),
        hours: "10:00 PM - 2:00 AM",
      })

    case "safe-walk":
      return Response.json({
        companions: [
          { id: "sw_1", name: "Campus Security A", available: true, location: "Main Gate" },
          { id: "sw_2", name: "Campus Security B", available: true, location: "Hostel Zone" },
          { id: "sw_3", name: "NSS Volunteer", available: false, location: "Library" },
        ],
        safeRoutes: [
          { from: "Library", to: "Hostel A", distance: "400m", litPath: true, cctv: true },
          { from: "Lab Complex", to: "Hostel B", distance: "600m", litPath: true, cctv: true },
          { from: "Main Gate", to: "Academic Block", distance: "300m", litPath: true, cctv: false },
        ],
      })

    default:
      return Response.json({
        overview: {
          laundry: {
            available: laundryMachines.filter((m) => m.status === "available").length,
            total: laundryMachines.length,
          },
          maintenance: {
            openRequests: maintenanceRequests.filter((m) => m.status !== "resolved").length,
          },
          nightCanteen: {
            isOpen: (() => { const h = new Date().getHours(); return h >= 22 || h <= 2 })(),
          },
          safety: {
            companionsAvailable: 2,
            safeRoutes: 3,
          },
        },
      })
  }
}

// POST: create maintenance request, place canteen order, trigger SOS, request safe-walk, submit anonymous report
export async function POST(req: Request) {
  const { action, ...data } = await req.json()

  switch (action) {
    case "maintenance_request":
      return Response.json({
        success: true,
        request: {
          id: `mr_${Date.now()}`,
          ...data,
          status: "submitted",
          createdAt: new Date(),
          resolvedAt: null,
        },
        message: "Maintenance request submitted. Expected response within 24 hours.",
      })

    case "canteen_order":
      return Response.json({
        success: true,
        order: {
          id: `nc_ord_${Date.now()}`,
          items: data.items,
          totalAmount: data.items?.reduce((s: number, i: { price: number; qty: number }) => s + i.price * i.qty, 0) || 0,
          status: "placed",
          placedAt: new Date(),
          estimatedReady: new Date(Date.now() + 10 * 60 * 1000),
        },
        message: "Order placed! Estimated ready in 10 minutes.",
      })

    case "sos":
      return Response.json({
        success: true,
        alert: {
          id: `sos_${Date.now()}`,
          ...data,
          status: "active",
          timestamp: new Date(),
          message: "EMERGENCY ALERT TRIGGERED. Campus security has been notified immediately.",
        },
        emergencyContacts: [
          { name: "Campus Security", phone: "+91-XXX-XXX-1100" },
          { name: "Medical Emergency", phone: "+91-XXX-XXX-1200" },
          { name: "Police", phone: "100" },
        ],
      })

    case "safe_walk":
      return Response.json({
        success: true,
        request: {
          id: `sw_${Date.now()}`,
          ...data,
          status: "waiting",
          requestedAt: new Date(),
          estimatedWait: "5-10 minutes",
        },
        message: "Safe-walk companion request submitted. A companion will be assigned shortly.",
      })

    case "anonymous_report":
      return Response.json({
        success: true,
        report: {
          id: `ar_${Date.now()}`,
          ...data,
          status: "submitted",
          timestamp: new Date(),
        },
        message: "Anonymous report submitted. Your identity is protected. The administration will review this.",
      })

    default:
      return Response.json({ error: "Unknown action" }, { status: 400 })
  }
}
