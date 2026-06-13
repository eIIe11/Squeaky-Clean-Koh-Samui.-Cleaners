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

function getAdminClient() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return null
  }
  try {
    return createAdminClient()
  } catch {
    return null
  }
}

// ─── Dashboard ───

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
  const supabase = getAdminClient()
  if (!supabase) {
    return {
      stats: { todayBookings: 0, monthRevenue: 0, activeCustomers: 0, totalStaff: 0 },
      bookings: [],
    }
  }

  const today = new Date().toISOString().split('T')[0]
  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]

  const [todayBookingsResult, monthRevenueResult, activeCustomersResult, recentBookingsResult, staffResult] = await Promise.all([
    supabase.from('bookings').select('id', { count: 'exact', head: true }).eq('scheduled_date', today),
    supabase.from('bookings').select('total_thb').gte('scheduled_date', monthStart).in('status', ['confirmed', 'assigned', 'en_route', 'in_progress', 'completed']),
    supabase.from('customers').select('id', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('bookings').select('booking_reference, customer_id, scheduled_date, scheduled_time_start, status, total_thb, customers(full_name), service_categories(name)').gte('scheduled_date', today).order('scheduled_date', { ascending: true }).order('scheduled_time_start', { ascending: true }).limit(10),
    supabase.from('staff').select('id', { count: 'exact', head: true }).eq('is_active', true),
  ])

  const todayCount = todayBookingsResult.count || 0
  const monthRevenue = ((monthRevenueResult.data || []) as Array<{ total_thb: number }>).reduce((sum, b) => sum + Number(b.total_thb || 0), 0)
  const activeCustomers = activeCustomersResult.count || 0
  const totalStaff = staffResult.count || 0

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
    stats: { todayBookings: todayCount, monthRevenue, activeCustomers, totalStaff },
    bookings,
  }
}

// ─── Bookings ───

export async function getBookings(filters?: { status?: string; search?: string; dateFrom?: string; dateTo?: string }) {
  const supabase = getAdminClient()
  if (!supabase) return { bookings: [], count: 0 }

  let query = supabase
    .from('bookings')
    .select('id, booking_reference, customer_id, scheduled_date, scheduled_time_start, scheduled_time_end, status, total_thb, payment_status, num_bedrooms, num_bathrooms, special_instructions, created_at, customers(full_name, email, phone), service_categories(name), properties(address_line1)', { count: 'exact' })
    .order('scheduled_date', { ascending: false })
    .order('scheduled_time_start', { ascending: false })
    .limit(50)

  if (filters?.status && filters.status !== 'all') {
    query = query.eq('status', filters.status as 'new' | 'pending_payment' | 'confirmed' | 'assigned' | 'en_route' | 'in_progress' | 'completed' | 'cancelled')
  }
  if (filters?.dateFrom) {
    query = query.gte('scheduled_date', filters.dateFrom)
  }
  if (filters?.dateTo) {
    query = query.lte('scheduled_date', filters.dateTo)
  }
  if (filters?.search) {
    query = query.or(`booking_reference.ilike.%${filters.search}%,customers.full_name.ilike.%${filters.search}%`)
  }

  const { data, count, error } = await query

  if (error) return { bookings: [], count: 0 }

  interface BookingQueryRow {
    id: number
    booking_reference: string
    scheduled_date: string
    scheduled_time_start: string
    scheduled_time_end: string
    status: string
    total_thb: number
    payment_status: string
    num_bedrooms: number
    num_bathrooms: number
    special_instructions: string | null
    created_at: string
    customers: { full_name: string; email: string; phone: string | null } | null
    service_categories: { name: string } | null
    properties: { address_line1: string } | null
  }

  const bookings = ((data || []) as unknown as BookingQueryRow[]).map((b) => ({
    id: b.id,
    reference: b.booking_reference,
    customer: b.customers?.full_name || 'Unknown',
    email: b.customers?.email || '',
    phone: b.customers?.phone || '',
    service: b.service_categories?.name || 'Unknown',
    address: b.properties?.address_line1 || '',
    date: b.scheduled_date,
    timeStart: b.scheduled_time_start,
    timeEnd: b.scheduled_time_end,
    dateFormatted: formatBookingDate(b.scheduled_date, b.scheduled_time_start),
    status: b.status,
    statusLabel: statusLabels[b.status] || b.status,
    statusColor: statusColors[b.status] || 'bg-gray-100 text-gray-700',
    paymentStatus: b.payment_status,
    total: Number(b.total_thb || 0),
    bedrooms: b.num_bedrooms,
    bathrooms: b.num_bathrooms,
    instructions: b.special_instructions,
    createdAt: b.created_at,
  }))

  return { bookings, count: count || 0 }
}

export async function updateBookingStatus(bookingId: number, status: string) {
  const supabase = getAdminClient()
  if (!supabase) return { success: false, error: 'Database not configured' }

  type BookingStatus = 'new' | 'pending_payment' | 'confirmed' | 'assigned' | 'en_route' | 'in_progress' | 'completed' | 'cancelled'
  const typedStatus = status as BookingStatus

  const { error: err1 } = await supabase.from('bookings').update({ status: typedStatus }).eq('id', bookingId)
  if (err1) return { success: false, error: err1.message }

  if (status === 'cancelled') {
    await supabase.from('bookings').update({ cancelled_at: new Date().toISOString() }).eq('id', bookingId)
  }
  if (status === 'completed') {
    await supabase.from('bookings').update({ job_completed_at: new Date().toISOString() }).eq('id', bookingId)
  }

  return { success: true }
}

// ─── Staff ───

export async function getStaff() {
  const supabase = getAdminClient()
  if (!supabase) return { staff: [] }

  const { data, error } = await supabase
    .from('staff')
    .select('*')
    .order('full_name', { ascending: true })

  if (error) return { staff: [] }

  return {
    staff: (data || []).map((s) => ({
      id: s.id,
      name: s.full_name,
      phone: s.phone || '',
      email: s.email || '',
      whatsapp: s.whatsapp_number || '',
      employmentType: s.employment_type,
      workingDays: s.working_days,
      workingHoursStart: s.working_hours_start,
      workingHoursEnd: s.working_hours_end,
      isActive: s.is_active,
      isAvailable: s.is_available,
      createdAt: s.created_at,
    })),
  }
}

export async function createStaffMember(input: { name: string; phone?: string; email?: string; whatsapp?: string; employmentType?: string }) {
  const supabase = getAdminClient()
  if (!supabase) return { success: false, error: 'Database not configured' }

  const { data: location } = await supabase.from('locations').select('id').limit(1).single()
  const locationId = location?.id || 1

  const { error } = await supabase.from('staff').insert({
    full_name: input.name,
    phone: input.phone || null,
    email: input.email || null,
    whatsapp_number: input.whatsapp || null,
    employment_type: (input.employmentType as 'employed' | 'contractor') || 'employed',
    location_id: locationId,
  })

  if (error) return { success: false, error: error.message }
  return { success: true }
}

export async function updateStaffMember(id: number, input: { name?: string; phone?: string; email?: string; whatsapp?: string; isActive?: boolean; isAvailable?: boolean }) {
  const supabase = getAdminClient()
  if (!supabase) return { success: false, error: 'Database not configured' }

  const updates: {
    full_name?: string
    phone?: string
    email?: string
    whatsapp_number?: string
    is_active?: boolean
    is_available?: boolean
  } = {}
  if (input.name !== undefined) updates.full_name = input.name
  if (input.phone !== undefined) updates.phone = input.phone
  if (input.email !== undefined) updates.email = input.email
  if (input.whatsapp !== undefined) updates.whatsapp_number = input.whatsapp
  if (input.isActive !== undefined) updates.is_active = input.isActive
  if (input.isAvailable !== undefined) updates.is_available = input.isAvailable

  const { error } = await supabase.from('staff').update(updates).eq('id', id)
  if (error) return { success: false, error: error.message }
  return { success: true }
}

export async function deleteStaffMember(id: number) {
  const supabase = getAdminClient()
  if (!supabase) return { success: false, error: 'Database not configured' }

  const { error } = await supabase.from('staff').update({ is_active: false }).eq('id', id)
  if (error) return { success: false, error: error.message }
  return { success: true }
}

// ─── Customers ───

export async function getCustomers(search?: string) {
  const supabase = getAdminClient()
  if (!supabase) return { customers: [] }

  let query = supabase
    .from('customers')
    .select('id, full_name, email, phone, tags, referral_code, is_active, created_at')
    .order('created_at', { ascending: false })
    .limit(50)

  if (search) {
    query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`)
  }

  const { data, error } = await query
  if (error) return { customers: [] }

  return {
    customers: (data || []).map((c) => ({
      id: c.id,
      name: c.full_name,
      email: c.email,
      phone: c.phone || '',
      tags: c.tags || [],
      referralCode: c.referral_code,
      isActive: c.is_active,
      createdAt: c.created_at,
    })),
  }
}

// ─── Settings ───

export async function getBusinessSettings() {
  const supabase = getAdminClient()
  if (!supabase) return { settings: [] }

  const { data, error } = await supabase
    .from('business_settings')
    .select('*')
    .order('key', { ascending: true })

  if (error) return { settings: [] }

  return {
    settings: (data || []).map((s) => ({
      key: s.key,
      value: s.value,
      label: s.label,
      type: s.type,
    })),
  }
}

export async function updateBusinessSetting(key: string, value: string) {
  const supabase = getAdminClient()
  if (!supabase) return { success: false, error: 'Database not configured' }

  const { error } = await supabase
    .from('business_settings')
    .update({ value, updated_at: new Date().toISOString() })
    .eq('key', key)

  if (error) return { success: false, error: error.message }
  return { success: true }
}

// ─── Helpers ───

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

export { statusLabels, statusColors }
