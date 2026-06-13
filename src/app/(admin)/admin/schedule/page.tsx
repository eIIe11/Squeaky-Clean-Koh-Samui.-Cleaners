import type { Metadata } from 'next'
import { Card, CardContent } from '@/components/ui/card'
import { Calendar } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Schedule | Admin',
  description: 'View cleaning schedule.',
}

export default function SchedulePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary font-[family-name:var(--font-display)]">
          Schedule
        </h1>
        <p className="text-sm text-muted mt-1">View and manage cleaning schedules</p>
      </div>

      <Card>
        <CardContent className="py-16 text-center">
          <Calendar size={48} className="mx-auto text-muted mb-4" />
          <h2 className="text-lg font-semibold text-text">Calendar View Coming Soon</h2>
          <p className="text-sm text-muted mt-2 max-w-md mx-auto">
            The drag-and-drop calendar scheduler will show all bookings, staff assignments,
            and availability in a visual calendar. For now, manage bookings from the Bookings page.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
