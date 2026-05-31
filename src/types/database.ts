export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type BookingStatus =
  | 'new'
  | 'pending_payment'
  | 'confirmed'
  | 'assigned'
  | 'en_route'
  | 'in_progress'
  | 'completed'
  | 'cancelled'

export type PaymentMethod = 'qr' | 'bank_transfer' | 'credit_card'
export type PaymentStatus = 'unpaid' | 'partial' | 'paid'
export type PropertyType = 'apartment' | 'house' | 'villa' | 'townhouse' | 'office' | 'restaurant' | 'retail' | 'other'
export type CategoryGroup = 'residential' | 'villa' | 'move' | 'specialised' | 'commercial'
export type RecurringFrequency = 'weekly' | 'fortnightly' | 'monthly'
export type LeadSource = 'newsletter' | 'save_quote' | 'callback' | 'booking_abandoned'
export type NotificationChannel = 'email' | 'whatsapp' | 'sms'

export interface Database {
  public: {
    Tables: {
      locations: {
        Row: {
          id: number
          name: string
          slug: string
          timezone: string
          is_active: boolean
          launch_date: string | null
          seo_title: string | null
          seo_description: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['locations']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['locations']['Insert']>
      }
      customers: {
        Row: {
          id: number
          created_at: string
          updated_at: string
          email: string
          phone: string | null
          full_name: string
          preferred_language: 'en' | 'th'
          tags: string[]
          referral_code: string
          referred_by: number | null
          omise_customer_id: string | null
          notes_internal: string | null
          is_active: boolean
          auth_user_id: string | null
        }
        Insert: Omit<Database['public']['Tables']['customers']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['customers']['Insert']>
      }
      properties: {
        Row: {
          id: number
          customer_id: number
          address_line1: string
          address_line2: string | null
          district: string | null
          zone_id: number | null
          lat: number | null
          lng: number | null
          property_type: PropertyType
          bedrooms: number
          bathrooms: number
          access_code: string | null
          key_location: string | null
          parking_notes: string | null
          gate_code: string | null
          pet_info: string | null
          preferred_cleaner_id: number | null
          notes: string | null
          location_id: number
        }
        Insert: Omit<Database['public']['Tables']['properties']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['properties']['Insert']>
      }
      service_categories: {
        Row: {
          id: number
          name: string
          name_th: string | null
          slug: string
          description: string | null
          description_th: string | null
          category_group: CategoryGroup
          base_duration_minutes: number
          base_price_thb: number
          price_per_bedroom_thb: number
          price_per_bathroom_thb: number
          is_active: boolean
          sort_order: number
          icon: string | null
          location_id: number
        }
        Insert: Omit<Database['public']['Tables']['service_categories']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['service_categories']['Insert']>
      }
      zones: {
        Row: {
          id: number
          name: string
          slug: string
          travel_fee_thb: number
          is_active: boolean
          polygon_coords: Json | null
          location_id: number
        }
        Insert: Omit<Database['public']['Tables']['zones']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['zones']['Insert']>
      }
      staff: {
        Row: {
          id: number
          created_at: string
          full_name: string
          phone: string | null
          email: string | null
          google_calendar_id: string | null
          whatsapp_number: string | null
          employment_type: 'employed' | 'contractor'
          working_days: number[]
          working_hours_start: string
          working_hours_end: string
          zone_ids: number[]
          is_active: boolean
          is_available: boolean
          notes_internal: string | null
          location_id: number
        }
        Insert: Omit<Database['public']['Tables']['staff']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['staff']['Insert']>
      }
      bookings: {
        Row: {
          id: number
          created_at: string
          updated_at: string
          booking_reference: string
          customer_id: number
          property_id: number
          service_category_id: number
          status: BookingStatus
          scheduled_date: string
          scheduled_time_start: string
          scheduled_time_end: string
          duration_minutes: number
          num_bedrooms: number
          num_bathrooms: number
          special_requirements: Json | null
          special_instructions: string | null
          is_recurring: boolean
          recurring_plan_id: number | null
          assigned_cleaners: number[]
          subtotal_thb: number
          discount_thb: number
          travel_fee_thb: number
          total_thb: number
          promo_code_id: number | null
          payment_method: PaymentMethod | null
          payment_status: PaymentStatus
          payment_slip_url: string | null
          cancellation_reason: string | null
          cancelled_at: string | null
          cancelled_by: string | null
          notes_internal: string | null
          metadata: Json | null
          arrived_at: string | null
          arrival_lat: number | null
          arrival_lng: number | null
          arrival_distance_metres: number | null
          arrival_verified: boolean | null
          arrival_override_reason: string | null
          job_started_at: string | null
          job_completed_at: string | null
          location_id: number
        }
        Insert: Omit<Database['public']['Tables']['bookings']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['bookings']['Insert']>
      }
      payments: {
        Row: {
          id: number
          booking_id: number
          payment_method: PaymentMethod
          amount_thb: number
          omise_charge_id: string | null
          slip_url: string | null
          status: 'pending' | 'approved' | 'rejected' | 'refunded'
          processed_at: string | null
          processed_by: string | null
          notes: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['payments']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['payments']['Insert']>
      }
      reviews: {
        Row: {
          id: number
          booking_id: number
          customer_id: number
          rating: number
          comment: string | null
          photos: string[]
          is_published: boolean
          published_at: string | null
          google_review_requested_at: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['reviews']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['reviews']['Insert']>
      }
      business_settings: {
        Row: {
          key: string
          value: string
          label: string
          type: 'text' | 'number' | 'boolean' | 'percent'
          updated_at: string
          updated_by: string | null
        }
        Insert: Database['public']['Tables']['business_settings']['Row']
        Update: Partial<Database['public']['Tables']['business_settings']['Row']>
      }
      leads: {
        Row: {
          id: number
          created_at: string
          source: LeadSource
          email: string | null
          phone: string | null
          name: string | null
          quote_data: Json | null
          followed_up_at: string | null
          follow_up_notes: string | null
          status: 'new' | 'contacted' | 'converted' | 'lost'
        }
        Insert: Omit<Database['public']['Tables']['leads']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['leads']['Insert']>
      }
      promo_codes: {
        Row: {
          id: number
          code: string
          description: string | null
          discount_type: 'fixed' | 'percent'
          discount_value: number
          max_uses: number | null
          uses_count: number
          valid_from: string | null
          valid_until: string | null
          service_category_ids: number[] | null
          is_active: boolean
          location_id: number
        }
        Insert: Omit<Database['public']['Tables']['promo_codes']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['promo_codes']['Insert']>
      }
      notifications_log: {
        Row: {
          id: number
          created_at: string
          recipient_type: 'customer' | 'staff'
          recipient_id: number
          channel: NotificationChannel
          event_type: string
          status: 'sent' | 'failed' | 'skipped'
          error_message: string | null
        }
        Insert: Omit<Database['public']['Tables']['notifications_log']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['notifications_log']['Insert']>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
