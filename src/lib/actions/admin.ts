'use server'

import { createAdminClient } from '@/lib/supabase/server'

const statusColors: Record<string, string> = {
  new: 'bg-gray-100 text-gray-700',
  pending_payment: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-green-100 text-green-700',
  assigned: 'bg-purple-100 text-purple-700',
  en_route: 'bg-indigo-100 text-indigo-700',
  in_progress: 'bg-blue-100 text-blue-700',
  completed: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-red-100 text-red-700',
}

const statusLabels: Record<string, string> = {
  new: 'New',
  pending_payment: 'Pending Payment',
  confirmed: 'Confirmed',
  assigned: 'Assigned',
  en_route: 'En Route',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

interface BookingRow {
  booking_reference: string
  customer_id: number
  scheduled_date: string
  scheduled_time_start: string
  status: string
  total_thb: number
  customers: { full_name: string } | null
  service_categories: { name: string } | null
}

export async function getDashboardData() {
  const supabase = createAdminClient()

  const today = new Date().toISOString().split('T')[0]
  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]

  const [
    todayBookingsResult,
    monthRevenueResult,
    activeCustomersResult,
    recentBookingsResult,
  ] = await Promise.all([
    supabase
      .from('bookings')
      .select('id', { count: 'exact', head: true })
      .eq('scheduled_date', today),
    supabase
      .from('bookings')
      .select('total_thb')
      .gte('scheduled_date', monthStart)
      .in('status', ['confirmed', 'assigned', 'en_route', 'in_progress', 'completed']),
    supabase
      .from('customers')
      .select('id', { count: 'exact', head: true })
      .eq('is_active', true),
    supabase
      .from('bookings')
      .select('booking_reference, customer_id, scheduled_date, scheduled_time_start, status, total_thb, customers(full_name), service_categories(name)')
      .gte('scheduled_date', today)
      .order('scheduled_date', { ascending: true })
      .order('scheduled_time_start', { ascending: true })
      .limit(10),
  ])

  const todayCount = todayBookingsResult.count || 0
  const monthRevenue = ((monthRevenueResult.data || []) as Array<{ total_thb: number }>).reduce(
    (sum, b) => sum + Number(b.total_thb || 0), 0
  )
  const activeCustomers = activeCustomersResult.count || 0

  const rawBookings = (recentBookingsResult.data || []) as unknown as BookingRow[]
  const bookings = rawBookings.map((b) => ({
    id: b.booking_reference,
    customer: b.customers?.full_name || 'Unknown',
    service: b.service_categories?.name || 'Unknown',
    date: formatBookingDate(b.scheduled_date, b.scheduled_time_start),
    status: b.status,
    statusLabel: statusLabels[b.status] || b.status,
    statusColor: statusColors[b.status] || 'bg-gray-100 text-gray-700',
    total: Number(b.total_thb || 0),
  }))

  return {
    stats: {
      todayBookings: todayCount,
      monthRevenue,
      activeCustomers,
    },
    bookings,
  }
}

function formatBookingDate(date: string, time: string): string {
  const bookingDate = new Date(date)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const timeStr = time ? time.substring(0, 5) : ''

  if (bookingDate.toDateString() === today.toDateString()) {
    return `Today, ${timeStr}`
  }
  if (bookingDate.toDateString() === tomorrow.toDateString()) {
    return `Tomorrow, ${timeStr}`
  }
  return `${bookingDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${timeStr}`
}

export async function updateBookingStatus(bookingId: number, status: string) {
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('bookings')
    .update({ status: status as 'new' | 'pending_payment' | 'confirmed' | 'assigned' | 'en_route' | 'in_progress' | 'completed' | 'cancelled' })
    .eq('id', bookingId)

  if (error) return { success: false, error: error.message }
  return { success: true }
}
