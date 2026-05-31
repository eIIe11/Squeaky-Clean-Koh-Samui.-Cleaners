'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CalendarDays, DollarSign, Users, Clock, ChevronRight } from 'lucide-react'

const mockStats = [
  { label: "Today's Bookings", value: '3', icon: CalendarDays, trend: '+2 vs yesterday' },
  { label: 'Revenue (Month)', value: '฿45,200', icon: DollarSign, trend: '+12% vs last month' },
  { label: 'Active Customers', value: '28', icon: Users, trend: '3 new this week' },
  { label: 'Avg. Job Duration', value: '2.4 hrs', icon: Clock, trend: 'On target' },
]

const mockBookings = [
  { id: 'KS-2026-0042', customer: 'Sarah Miller', service: 'Villa Cleaning', date: 'Today, 10:00', status: 'in_progress', statusLabel: 'In Progress', statusColor: 'bg-blue-100 text-blue-700' },
  { id: 'KS-2026-0041', customer: 'James Chen', service: 'Regular Cleaning', date: 'Today, 13:00', status: 'confirmed', statusLabel: 'Confirmed', statusColor: 'bg-green-100 text-green-700' },
  { id: 'KS-2026-0040', customer: 'Villa Sunset (Airbnb)', service: 'Airbnb Turnover', date: 'Today, 15:30', status: 'assigned', statusLabel: 'Assigned', statusColor: 'bg-purple-100 text-purple-700' },
  { id: 'KS-2026-0039', customer: 'Tom Richards', service: 'Deep Cleaning', date: 'Tomorrow, 09:00', status: 'pending_payment', statusLabel: 'Pending Payment', statusColor: 'bg-yellow-100 text-yellow-700' },
  { id: 'KS-2026-0038', customer: 'Priya Patel', service: 'End of Lease', date: 'Tomorrow, 11:00', status: 'confirmed', statusLabel: 'Confirmed', statusColor: 'bg-green-100 text-green-700' },
]

export function AdminDashboard() {
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
        <Button size="sm">+ New Booking</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {mockStats.map((stat) => {
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
                    <p className="text-xl font-bold text-primary">{stat.value}</p>
                  </div>
                </div>
                <p className="text-xs text-muted mt-2">{stat.trend}</p>
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
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-6 py-3 text-xs font-medium text-muted uppercase tracking-wider">Reference</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted uppercase tracking-wider">Customer</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted uppercase tracking-wider">Service</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted uppercase tracking-wider">Date</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {mockBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-mono text-primary">{booking.id}</td>
                  <td className="px-6 py-4 text-sm font-medium">{booking.customer}</td>
                  <td className="px-6 py-4 text-sm text-muted">{booking.service}</td>
                  <td className="px-6 py-4 text-sm text-muted">{booking.date}</td>
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
      </Card>
    </div>
  )
}
