'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CalendarDays, DollarSign, Users, Clock, ChevronRight, RefreshCw } from 'lucide-react'
import { getDashboardData } from '@/lib/actions/admin'

interface DashboardStats {
  todayBookings: number
  monthRevenue: number
  activeCustomers: number
}

interface DashboardBooking {
  id: string
  customer: string
  service: string
  date: string
  status: string
  statusLabel: string
  statusColor: string
  total: number
}

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [bookings, setBookings] = useState<DashboardBooking[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadData = async () => {
    setIsLoading(true)
    try {
      const data = await getDashboardData()
      setStats(data.stats)
      setBookings(data.bookings)
    } catch {
      // Fallback to empty state
      setStats({ todayBookings: 0, monthRevenue: 0, activeCustomers: 0 })
      setBookings([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const statCards = [
    { label: "Today's Bookings", value: stats?.todayBookings ?? 0, icon: CalendarDays, format: (v: number) => String(v) },
    { label: 'Revenue (Month)', value: stats?.monthRevenue ?? 0, icon: DollarSign, format: (v: number) => `฿${v.toLocaleString()}` },
    { label: 'Active Customers', value: stats?.activeCustomers ?? 0, icon: Users, format: (v: number) => String(v) },
    { label: 'Avg. Job Duration', value: 0, icon: Clock, format: () => '—' },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary font-[family-name:var(--font-display)]">
            Dashboard
          </h1>
          <p className="text-sm text-muted mt-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={loadData} disabled={isLoading}>
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
          </Button>
          <Button size="sm">+ New Booking</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label}>
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Icon size={20} className="text-accent" />
                  </div>
                  <div>
                    <p className="text-xs text-muted">{stat.label}</p>
                    <p className="text-xl font-bold text-primary">
                      {isLoading ? '...' : stat.format(stat.value)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent Bookings */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <h2 className="text-lg font-semibold text-primary">Upcoming Bookings</h2>
          <Button variant="ghost" size="sm">
            View All <ChevronRight size={14} className="ml-1" />
          </Button>
        </CardHeader>
        {bookings.length === 0 && !isLoading ? (
          <CardContent className="py-12 text-center">
            <p className="text-muted">No upcoming bookings yet.</p>
            <p className="text-sm text-muted mt-1">Bookings will appear here when customers book through the website.</p>
          </CardContent>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-6 py-3 text-xs font-medium text-muted uppercase tracking-wider">Reference</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-muted uppercase tracking-wider">Customer</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-muted uppercase tracking-wider">Service</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-muted uppercase tracking-wider">Date</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-muted uppercase tracking-wider">Total</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-muted uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-muted uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono text-primary">{booking.id}</td>
                    <td className="px-6 py-4 text-sm font-medium">{booking.customer}</td>
                    <td className="px-6 py-4 text-sm text-muted">{booking.service}</td>
                    <td className="px-6 py-4 text-sm text-muted">{booking.date}</td>
                    <td className="px-6 py-4 text-sm font-medium">฿{booking.total.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${booking.statusColor}`}>
                        {booking.statusLabel}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Button variant="ghost" size="sm">
                        <ChevronRight size={16} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}
