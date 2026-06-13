import type { Metadata } from 'next'
import { BookingsManager } from '@/components/admin/bookings-manager'

export const metadata: Metadata = {
  title: 'Bookings | Admin',
  description: 'Manage all bookings.',
}

export default function BookingsPage() {
  return <BookingsManager />
}
