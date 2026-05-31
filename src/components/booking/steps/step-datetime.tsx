'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { format, isBefore, startOfDay } from 'date-fns'
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react'
import type { BookingData } from '../booking-wizard'

interface Props {
  data: BookingData
  updateData: (updates: Partial<BookingData>) => void
  onNext: () => void
  onBack: () => void
}

const timeSlots = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30', '16:00',
]

export function StepDateTime({ data, updateData, onNext, onBack }: Props) {
  const t = useTranslations('booking')
  const today = startOfDay(new Date())
  const [viewMonth, setViewMonth] = useState(today)

  const canProceed = data.date && data.time

  // Generate calendar days for the current view month
  const year = viewMonth.getFullYear()
  const month = viewMonth.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startPadding = firstDay.getDay()

  const days: (Date | null)[] = []
  for (let i = 0; i < startPadding; i++) days.push(null)
  for (let d = 1; d <= lastDay.getDate(); d++) {
    days.push(new Date(year, month, d))
  }

  const prevMonth = () => setViewMonth(new Date(year, month - 1, 1))
  const nextMonth = () => setViewMonth(new Date(year, month + 1, 1))

  return (
    <div className="space-y-8">
      {/* Date Picker */}
      <div>
        <label className="block text-sm font-medium text-text mb-3">{t('selectDate')}</label>
        <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={prevMonth}
              className="p-2 rounded-lg hover:bg-gray-100 min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="font-semibold text-primary">
              {format(viewMonth, 'MMMM yyyy')}
            </span>
            <button
              type="button"
              onClick={nextMonth}
              className="p-2 rounded-lg hover:bg-gray-100 min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <div key={d} className="text-xs font-medium text-muted py-2">{d}</div>
            ))}
            {days.map((day, i) => {
              if (!day) return <div key={`empty-${i}`} />
              const dateStr = format(day, 'yyyy-MM-dd')
              const isPast = isBefore(day, today)
              const isSelected = data.date === dateStr
              const isToday = dateStr === format(today, 'yyyy-MM-dd')

              return (
                <button
                  key={dateStr}
                  type="button"
                  onClick={() => !isPast && updateData({ date: dateStr })}
                  disabled={isPast}
                  className={`
                    w-full aspect-square rounded-lg flex items-center justify-center text-sm font-medium
                    min-h-[40px] transition-colors
                    ${isPast ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-accent/10 cursor-pointer'}
                    ${isSelected ? 'bg-primary text-white hover:bg-primary-light' : ''}
                    ${isToday && !isSelected ? 'ring-1 ring-primary' : ''}
                  `}
                >
                  {day.getDate()}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Time Slots */}
      <div>
        <label className="block text-sm font-medium text-text mb-3">
          <Clock size={16} className="inline mr-1.5" />
          {t('selectTime')}
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {timeSlots.map((slot) => {
            const isSelected = data.time === slot
            return (
              <button
                key={slot}
                type="button"
                onClick={() => updateData({ time: slot })}
                className={`
                  py-3 px-4 rounded-lg text-sm font-medium transition-all min-h-[44px]
                  ${isSelected
                    ? 'bg-primary text-white'
                    : 'bg-white border border-gray-200 text-text hover:border-primary hover:text-primary'
                  }
                `}
              >
                {slot}
              </button>
            )
          })}
        </div>
      </div>

      {/* Recurring offer */}
      <div className="bg-accent/5 border border-accent/20 rounded-xl p-4 flex items-start gap-3">
        <input
          type="checkbox"
          id="recurring"
          checked={data.isRecurring}
          onChange={(e) => updateData({ isRecurring: e.target.checked })}
          className="mt-1 w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
        />
        <label htmlFor="recurring" className="cursor-pointer">
          <span className="font-semibold text-primary block">Save 15% with weekly cleaning</span>
          <span className="text-sm text-muted">Set up a recurring plan and we&apos;ll automatically schedule your cleans.</span>
        </label>
      </div>

      {/* Navigation */}
      <div className="flex gap-3 pt-4">
        <Button variant="outline" onClick={onBack} className="flex-1 sm:flex-none">
          Back
        </Button>
        <Button onClick={onNext} disabled={!canProceed} className="flex-1 sm:flex-none">
          Next
        </Button>
      </div>
    </div>
  )
}
