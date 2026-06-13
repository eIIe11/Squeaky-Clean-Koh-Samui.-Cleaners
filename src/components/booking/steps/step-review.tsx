'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle, CreditCard, QrCode, Building } from 'lucide-react'
import { format } from 'date-fns'
import { createBooking } from '@/lib/actions/booking'
import type { BookingData } from '../booking-wizard'

interface Props {
  data: BookingData
  updateData: (updates: Partial<BookingData>) => void
  onBack: () => void
}

const paymentMethods = [
  { id: 'qr', label: 'PromptPay QR', icon: QrCode, description: 'Scan with any Thai banking app' },
  { id: 'bank_transfer', label: 'Bank Transfer', icon: Building, description: 'Upload payment slip' },
  { id: 'credit_card', label: 'Credit Card', icon: CreditCard, description: 'Visa, Mastercard, JCB' },
]

export function StepReviewPay({ data, updateData, onBack }: Props) {
  const t = useTranslations('booking')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [bookingRef, setBookingRef] = useState('')
  const [totalPrice, setTotalPrice] = useState(0)
  const [error, setError] = useState('')

  // Price calculation
  const basePrice = 2500
  const bedroomFee = data.bedrooms * 300
  const bathroomFee = data.bathrooms * 200
  const travelFee = 0
  const subtotal = basePrice + bedroomFee + bathroomFee
  const discountPercent = data.isRecurring
    ? (data.recurringFrequency === 'weekly' ? 15 : data.recurringFrequency === 'fortnightly' ? 10 : 5)
    : 0
  const discount = data.isRecurring ? Math.round(subtotal * discountPercent / 100) : 0
  const total = subtotal + travelFee - discount

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setError('')

    try {
      const result = await createBooking(data)
      if (result.success && result.bookingReference) {
        setBookingRef(result.bookingReference)
        setTotalPrice(result.total || total)
        setIsConfirmed(true)
      } else {
        setError(result.error || 'Something went wrong. Please try again.')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isConfirmed) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={32} className="text-success" />
        </div>
        <h2 className="text-2xl font-bold text-primary font-[family-name:var(--font-display)]">
          {t('bookingConfirmed')}
        </h2>
        <p className="mt-2 text-muted">
          {t('bookingReference', { reference: bookingRef })}
        </p>
        <p className="mt-1 text-lg font-semibold text-primary">
          Total: {totalPrice.toLocaleString()} THB
        </p>
        <p className="mt-4 text-sm text-muted">
          We&apos;ve sent a confirmation to <strong>{data.email}</strong>. You can track your booking in the customer portal.
        </p>
        <Button variant="secondary" className="mt-8" onClick={() => window.location.href = '/'}>
          Back to Home
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <p className="text-lg text-muted">{t('reviewBooking')}</p>

      {error && (
        <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* Booking Summary */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex justify-between">
            <span className="text-sm text-muted">Service</span>
            <span className="text-sm font-medium">{data.serviceName || 'Regular Cleaning'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted">Property</span>
            <span className="text-sm font-medium">{data.bedrooms} bed, {data.bathrooms} bath {data.propertyType}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted">Date & Time</span>
            <span className="text-sm font-medium">
              {data.date ? format(new Date(data.date), 'EEE, MMM d') : '—'} at {data.time || '—'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted">Address</span>
            <span className="text-sm font-medium text-right max-w-[200px]">{data.address || '—'}</span>
          </div>
          {data.isRecurring && (
            <div className="flex justify-between">
              <span className="text-sm text-muted">Recurring</span>
              <span className="text-sm font-medium text-success">
                {data.recurringFrequency === 'weekly' ? 'Weekly' : data.recurringFrequency === 'fortnightly' ? 'Fortnightly' : 'Monthly'} ({discountPercent}% off)
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Price Breakdown */}
      <Card>
        <CardContent className="p-6 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted">{t('subtotal')}</span>
            <span>{subtotal.toLocaleString()} THB</span>
          </div>
          {travelFee > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted">{t('travelFee')}</span>
              <span>{travelFee.toLocaleString()} THB</span>
            </div>
          )}
          {discount > 0 && (
            <div className="flex justify-between text-sm text-success">
              <span>{t('discount')} ({discountPercent}% recurring)</span>
              <span>-{discount.toLocaleString()} THB</span>
            </div>
          )}
          <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-lg">
            <span>{t('total')}</span>
            <span className="text-primary">{total.toLocaleString()} THB</span>
          </div>
        </CardContent>
      </Card>

      {/* Promo Code */}
      <div className="flex gap-2">
        <Input
          placeholder={t('promoCode')}
          value={data.promoCode}
          onChange={(e) => updateData({ promoCode: e.target.value })}
          className="flex-1"
        />
        <Button variant="outline" size="md">{t('apply')}</Button>
      </div>

      {/* Payment Method */}
      <div>
        <label className="block text-sm font-medium text-text mb-3">{t('paymentMethod')}</label>
        <div className="space-y-3">
          {paymentMethods.map((method) => {
            const Icon = method.icon
            const isSelected = data.paymentMethod === method.id
            return (
              <button
                key={method.id}
                type="button"
                onClick={() => updateData({ paymentMethod: method.id })}
                className={`
                  w-full p-4 rounded-xl border-2 flex items-center gap-4 transition-all text-left
                  min-h-[60px]
                  ${isSelected ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'}
                `}
              >
                <Icon size={24} className={isSelected ? 'text-primary' : 'text-muted'} />
                <div>
                  <span className={`font-medium ${isSelected ? 'text-primary' : 'text-text'}`}>
                    {method.label}
                  </span>
                  <p className="text-xs text-muted">{method.description}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-3 pt-4">
        <Button variant="outline" onClick={onBack} className="flex-1 sm:flex-none">
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          isLoading={isSubmitting}
          disabled={!data.paymentMethod}
          className="flex-1 sm:flex-none"
        >
          {t('confirmBooking')}
        </Button>
      </div>
    </div>
  )
}
