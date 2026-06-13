'use client'

import { useEffect, useState, useCallback } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Filter, ChevronDown, MapPin, Phone, Mail, Clock } from 'lucide-react'
import { getBookings, updateBookingStatus } from '@/lib/actions/admin'

const statusOptions = [
  { value: 'all', label: 'All Statuses' },
  { value: 'new', label: 'New' },
  { value: 'pending_payment', label: 'Pending Payment' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'assigned', label: 'Assigned' },
  { value: 'en_route', label: 'En Route' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
]

const nextStatusMap: Record<string, string[]> = {
  new: ['confirmed', 'cancelled'],
  pending_payment: ['confirmed', 'cancelled'],
  confirmed: ['assigned', 'cancelled'],
  assigned: ['en_route', 'cancelled'],
  en_route: ['in_progress'],
  in_progress: ['completed'],
  completed: [],
  cancelled: [],
}

interface Booking {
  id: number
  reference: string
  customer: string
  email: string
  phone: string
  service: string
  address: string
  date: string
  timeStart: string
  timeEnd: string
  dateFormatted: string
  status: string
  statusLabel: string
  statusColor: string
  paymentStatus: string
  total: number
  bedrooms: number
  bathrooms: number
  instructions: string | null
  createdAt: string
}

export function BookingsManager() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [count, setCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [updating, setUpdating] = useState<number | null>(null)

  const loadBookings = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await getBookings({
        status: statusFilter,
        search: search || undefined,
      })
      setBookings(data.bookings)
      setCount(data.count)
    } catch {
      setBookings([])
      setCount(0)
    } finally {
      setIsLoading(false)
    }
  }, [statusFilter, search])

  useEffect(() => {
    loadBookings()
  }, [loadBookings])

  const handleStatusUpdate = async (bookingId: number, newStatus: string) => {
    setUpdating(bookingId)
    const result = await updateBookingStatus(bookingId, newStatus)
    if (result.success) {
      await loadBookings()
    }
    setUpdating(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary font-[family-name:var(--font-display)]">
            Bookings
          </h1>
          <p className="text-sm text-muted mt-1">{count} total bookings</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <Input
            placeholder="Search by reference or customer name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="relative">
          <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-9 pr-8 py-3 rounded-lg border border-gray-200 bg-white text-sm text-text appearance-none cursor-pointer min-h-[44px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
        </div>
      </div>

      {/* Bookings List */}
      {isLoading ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted">Loading bookings...</p>
          </CardContent>
        </Card>
      ) : bookings.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted">No bookings found.</p>
            <p className="text-sm text-muted mt-1">
              {statusFilter !== 'all' ? 'Try changing the filter.' : 'Bookings will appear here when customers book through the website.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {bookings.map((booking) => (
            <Card key={booking.id} className="overflow-hidden">
              {/* Summary row */}
              <button
                type="button"
                onClick={() => setExpandedId(expandedId === booking.id ? null : booking.id)}
                className="w-full px-6 py-4 flex items-center gap-4 hover:bg-gray-50/50 transition-colors text-left"
              >
                <div className="flex-1 grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-4 items-center">
                  <div>
                    <p className="text-sm font-mono text-primary font-medium">{booking.reference}</p>
                    <p className="text-xs text-muted">{booking.dateFormatted}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text">{booking.customer}</p>
                    <p className="text-xs text-muted">{booking.service}</p>
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm text-text">{booking.bedrooms}BR / {booking.bathrooms}BA</p>
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-semibold text-text">฿{booking.total.toLocaleString()}</p>
                    <p className="text-xs text-muted capitalize">{booking.paymentStatus}</p>
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${booking.statusColor}`}>
                      {booking.statusLabel}
                    </span>
                    <ChevronDown size={16} className={`text-muted transition-transform ${expandedId === booking.id ? 'rotate-180' : ''}`} />
                  </div>
                </div>
              </button>

              {/* Expanded details */}
              {expandedId === booking.id && (
                <div className="px-6 pb-5 pt-2 border-t border-gray-100 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-start gap-2">
                      <MapPin size={16} className="text-muted mt-0.5 shrink-0" />
                      <span className="text-text">{booking.address || 'No address provided'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={16} className="text-muted shrink-0" />
                      <span className="text-text">{booking.phone || 'No phone'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail size={16} className="text-muted shrink-0" />
                      <span className="text-text">{booking.email || 'No email'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Clock size={16} className="text-muted" />
                    <span className="text-text">
                      {booking.date} &middot; {booking.timeStart?.substring(0, 5)} – {booking.timeEnd?.substring(0, 5)}
                    </span>
                  </div>

                  {booking.instructions && (
                    <div className="bg-yellow-50 rounded-lg p-3 text-sm">
                      <p className="font-medium text-yellow-800 text-xs uppercase tracking-wider mb-1">Special Instructions</p>
                      <p className="text-yellow-900">{booking.instructions}</p>
                    </div>
                  )}

                  {/* Status Actions */}
                  {nextStatusMap[booking.status]?.length > 0 && (
                    <div className="flex items-center gap-2 pt-2">
                      <span className="text-xs text-muted mr-1">Update status:</span>
                      {nextStatusMap[booking.status].map((nextStatus) => (
                        <Button
                          key={nextStatus}
                          size="sm"
                          variant={nextStatus === 'cancelled' ? 'outline' : 'primary'}
                          onClick={() => handleStatusUpdate(booking.id, nextStatus)}
                          disabled={updating === booking.id}
                          className={nextStatus === 'cancelled' ? 'text-red-600 border-red-200 hover:bg-red-50' : ''}
                        >
                          {updating === booking.id ? '...' : statusOptions.find(o => o.value === nextStatus)?.label || nextStatus}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
