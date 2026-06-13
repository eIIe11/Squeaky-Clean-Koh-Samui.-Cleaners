'use server'

import { createServerSupabaseClient, createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

interface CreateBookingInput {
  serviceSlug: string
  serviceName: string
  address: string
  district: string
  propertyType: string
  bedrooms: number
  bathrooms: number
  date: string
  time: string
  isRecurring: boolean
  recurringFrequency: string
  useNaturalProducts: boolean
  specialRequirements: string[]
  specialInstructions: string
  fullName: string
  email: string
  phone: string
  promoCode: string
  paymentMethod: string
}

export async function createBooking(input: CreateBookingInput) {
  const supabase = createAdminClient()

  // 1. Find or create customer
  let customerId: number
  const { data: existingCustomer } = await supabase
    .from('customers')
    .select('id')
    .eq('email', input.email)
    .single()

  if (existingCustomer) {
    customerId = existingCustomer.id
    // Update phone/name if changed
    await supabase
      .from('customers')
      .update({ phone: input.phone, full_name: input.fullName })
      .eq('id', customerId)
  } else {
    const { data: newCustomer, error: custError } = await supabase
      .from('customers')
      .insert({
        email: input.email,
        phone: input.phone,
        full_name: input.fullName,
        preferred_language: 'en',
        tags: [],
        is_active: true,
      })
      .select('id')
      .single()

    if (custError || !newCustomer) {
      return { success: false, error: 'Failed to create customer record.' }
    }
    customerId = newCustomer.id
  }

  // 2. Create property
  const { data: property, error: propError } = await supabase
    .from('properties')
    .insert({
      customer_id: customerId,
      address_line1: input.address,
      district: input.district || null,
      property_type: input.propertyType as 'apartment' | 'house' | 'villa' | 'townhouse' | 'office' | 'restaurant' | 'retail' | 'other',
      bedrooms: input.bedrooms,
      bathrooms: input.bathrooms,
      location_id: 1, // Koh Samui
    })
    .select('id')
    .single()

  if (propError || !property) {
    return { success: false, error: 'Failed to create property record.' }
  }

  // 3. Find service category
  const { data: service } = await supabase
    .from('service_categories')
    .select('id, base_price_thb, price_per_bedroom_thb, price_per_bathroom_thb, base_duration_minutes')
    .eq('slug', input.serviceSlug)
    .single()

  const serviceId = service?.id || 1
  const basePriceTHB = service?.base_price_thb || 2500
  const bedroomPrice = service?.price_per_bedroom_thb || 300
  const bathroomPrice = service?.price_per_bathroom_thb || 200
  const durationMinutes = service?.base_duration_minutes || 120

  // 4. Calculate pricing
  const naturalProductsFee = input.useNaturalProducts ? 500 : 0
  const subtotal = Number(basePriceTHB) + input.bedrooms * Number(bedroomPrice) + input.bathrooms * Number(bathroomPrice) + naturalProductsFee
  let discountPercent = 0
  if (input.isRecurring) {
    const freq = input.recurringFrequency
    if (freq === 'weekly') discountPercent = 15
    else if (freq === 'fortnightly') discountPercent = 10
    else if (freq === 'monthly') discountPercent = 5
  }
  const discount = Math.round(subtotal * discountPercent / 100)
  const total = subtotal - discount

  // 5. Parse scheduled time
  const timeMap: Record<string, string> = {
    '8:00': '08:00:00',
    '9:00': '09:00:00',
    '10:00': '10:00:00',
    '11:00': '11:00:00',
    '12:00': '12:00:00',
    '13:00': '13:00:00',
    '14:00': '14:00:00',
    '15:00': '15:00:00',
    '16:00': '16:00:00',
  }
  const startTime = timeMap[input.time] || '09:00:00'
  const startHour = parseInt(startTime.split(':')[0])
  const durationHours = Math.ceil(durationMinutes / 60)
  const endHour = Math.min(startHour + durationHours, 20)
  const endTime = `${String(endHour).padStart(2, '0')}:00:00`

  // 6. Generate booking reference
  const year = new Date().getFullYear()
  const seq = String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0')
  const bookingReference = `SC-${year}-${seq}`

  // 7. Create booking
  const { data: booking, error: bookError } = await supabase
    .from('bookings')
    .insert({
      booking_reference: bookingReference,
      customer_id: customerId,
      property_id: property.id,
      service_category_id: serviceId,
      status: 'new',
      scheduled_date: input.date,
      scheduled_time_start: startTime,
      scheduled_time_end: endTime,
      duration_minutes: durationMinutes,
      num_bedrooms: input.bedrooms,
      num_bathrooms: input.bathrooms,
      special_requirements: input.specialRequirements.length > 0 || input.useNaturalProducts
        ? [...input.specialRequirements, ...(input.useNaturalProducts ? ['natural_products'] : [])]
        : null,
      special_instructions: input.specialInstructions || null,
      is_recurring: input.isRecurring,
      assigned_cleaners: [],
      subtotal_thb: subtotal,
      discount_thb: discount,
      travel_fee_thb: 0,
      total_thb: total,
      payment_method: (input.paymentMethod || null) as 'qr' | 'bank_transfer' | 'credit_card' | null,
      payment_status: 'unpaid',
      location_id: 1,
    })
    .select('id, booking_reference')
    .single()

  if (bookError || !booking) {
    return { success: false, error: `Failed to create booking: ${bookError?.message}` }
  }

  // 8. If recurring, create recurring plan
  if (input.isRecurring && input.recurringFrequency) {
    await supabase
      .from('recurring_plans')
      .insert({
        customer_id: customerId,
        property_id: property.id,
        service_category_id: serviceId,
        frequency: input.recurringFrequency as 'weekly' | 'fortnightly' | 'monthly',
        day_of_week: new Date(input.date).getDay(),
        preferred_time: startTime,
        discount_percent: discountPercent,
        status: 'active',
        next_booking_date: input.date,
        last_booking_id: booking.id,
        location_id: 1,
      })
  }

  // 9. Create lead record for follow-up
  await supabase
    .from('leads')
    .insert({
      source: 'booking_abandoned' as const,
      email: input.email,
      phone: input.phone,
      name: input.fullName,
      status: 'converted',
    })

  revalidatePath('/admin')

  return {
    success: true,
    bookingReference: booking.booking_reference,
    bookingId: booking.id,
    total,
  }
}

export async function getServiceCategories() {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('service_categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')

  if (error) return []
  return data || []
}

export async function getBookingByReference(reference: string) {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .from('bookings')
    .select('*, customers(*), properties(*), service_categories(*)')
    .eq('booking_reference', reference)
    .single()

  return data
}
