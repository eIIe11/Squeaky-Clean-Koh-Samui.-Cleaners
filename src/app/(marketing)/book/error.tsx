'use client'

import { Button } from '@/components/ui/button'

export default function BookingError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-surface flex items-center justify-center">
      <div className="max-w-md mx-auto px-4 text-center">
        <h2 className="text-2xl font-bold text-primary font-[family-name:var(--font-display)]">
          Something went wrong
        </h2>
        <p className="mt-4 text-muted">
          We&apos;re having trouble loading the booking page. Please try again.
        </p>
        <div className="mt-6 flex gap-3 justify-center">
          <Button onClick={reset}>Try again</Button>
          <Button variant="secondary" onClick={() => window.location.href = '/'}>
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  )
}
