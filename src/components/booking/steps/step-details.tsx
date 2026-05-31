'use client'

import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { BookingData } from '../booking-wizard'

interface Props {
  data: BookingData
  updateData: (updates: Partial<BookingData>) => void
  onNext: () => void
  onBack: () => void
}

export function StepYourDetails({ data, updateData, onNext, onBack }: Props) {
  const t = useTranslations('booking')

  const canProceed =
    data.fullName.trim().length > 0 &&
    data.email.trim().length > 0 &&
    data.phone.trim().length > 0

  return (
    <div className="space-y-8">
      <p className="text-lg text-muted">{t('yourDetails')}</p>

      <div className="space-y-5 bg-white rounded-xl border border-gray-100 p-6">
        <Input
          label={t('fullName')}
          placeholder="John Smith"
          value={data.fullName}
          onChange={(e) => updateData({ fullName: e.target.value })}
        />
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={data.email}
          onChange={(e) => updateData({ email: e.target.value })}
        />
        <Input
          label="Phone"
          type="tel"
          placeholder="+66 XX XXX XXXX"
          value={data.phone}
          onChange={(e) => updateData({ phone: e.target.value })}
          helperText="We'll send booking confirmations to this number"
        />
      </div>

      <p className="text-xs text-muted">
        By continuing, you agree to our Terms of Service and Privacy Policy.
        No account creation required — we&apos;ll create one automatically on booking confirmation.
      </p>

      {/* Navigation */}
      <div className="flex gap-3 pt-4">
        <Button variant="outline" onClick={onBack} className="flex-1 sm:flex-none">
          Back
        </Button>
        <Button onClick={onNext} disabled={!canProceed} className="flex-1 sm:flex-none">
          Review Booking
        </Button>
      </div>
    </div>
  )
}
