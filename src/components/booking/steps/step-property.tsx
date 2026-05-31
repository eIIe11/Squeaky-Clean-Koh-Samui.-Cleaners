'use client'

import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Home, Building, Castle, Store, Minus, Plus } from 'lucide-react'
import type { BookingData } from '../booking-wizard'

interface Props {
  data: BookingData
  updateData: (updates: Partial<BookingData>) => void
  onNext: () => void
  onBack: () => void
}

const propertyTypes = [
  { value: 'apartment', label: 'Apartment', icon: Building },
  { value: 'house', label: 'House', icon: Home },
  { value: 'villa', label: 'Villa', icon: Castle },
  { value: 'office', label: 'Office', icon: Store },
]

function Counter({ value, onChange, min = 1, max = 10, label }: {
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
  label: string
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-text">{label}</span>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
          disabled={value <= min}
        >
          <Minus size={16} />
        </button>
        <span className="w-8 text-center font-semibold text-lg">{value}</span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
          disabled={value >= max}
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  )
}

export function StepPropertyDetails({ data, updateData, onNext, onBack }: Props) {
  const t = useTranslations('booking')

  const canProceed = data.address.trim().length > 0

  return (
    <div className="space-y-8">
      {/* Address */}
      <div>
        <Input
          label={t('propertyAddress')}
          placeholder="Start typing your address..."
          value={data.address}
          onChange={(e) => updateData({ address: e.target.value })}
          helperText="We'll detect your zone and travel fee automatically"
        />
      </div>

      {/* Property Type */}
      <div>
        <label className="block text-sm font-medium text-text mb-3">{t('propertyType')}</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {propertyTypes.map((type) => {
            const Icon = type.icon
            const isSelected = data.propertyType === type.value
            return (
              <button
                key={type.value}
                type="button"
                onClick={() => updateData({ propertyType: type.value })}
                className={`
                  p-4 rounded-lg border-2 flex flex-col items-center gap-2 transition-all
                  min-h-[80px]
                  ${isSelected ? 'border-primary bg-primary/5 text-primary' : 'border-gray-200 text-muted hover:border-gray-300'}
                `}
              >
                <Icon size={24} />
                <span className="text-sm font-medium">{type.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Bedrooms & Bathrooms */}
      <div className="space-y-4 bg-white rounded-xl border border-gray-100 p-6">
        <Counter
          label={t('bedrooms')}
          value={data.bedrooms}
          onChange={(v) => updateData({ bedrooms: v })}
          min={0}
          max={10}
        />
        <div className="border-t border-gray-100" />
        <Counter
          label={t('bathrooms')}
          value={data.bathrooms}
          onChange={(v) => updateData({ bathrooms: v })}
          min={1}
          max={10}
        />
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
