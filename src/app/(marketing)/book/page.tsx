import type { Metadata } from 'next'
import { Suspense } from 'react'
import { BookingWizard } from '@/components/booking/booking-wizard'

export const metadata: Metadata = {
  title: 'Book a Clean',
  description: 'Book your cleaning service in under 90 seconds. Choose your service, pick a date, and confirm online.',
}

export default function BookPage() {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-surface">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <Suspense fallback={<div className="animate-pulse h-96 bg-white/50 rounded-xl" />}>
          <BookingWizard />
        </Suspense>
      </div>
    </div>
  )
}
