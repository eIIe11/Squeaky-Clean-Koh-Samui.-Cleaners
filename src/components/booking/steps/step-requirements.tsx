'use client'

import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { PawPrint, Key, Lock, Leaf, AlertTriangle, Car } from 'lucide-react'
import type { BookingData } from '../booking-wizard'

interface Props {
  data: BookingData
  updateData: (updates: Partial<BookingData>) => void
  onNext: () => void
  onBack: () => void
}

const requirements = [
  { id: 'pets', label: 'Pets Present', icon: PawPrint },
  { id: 'key_collection', label: 'Key Collection', icon: Key },
  { id: 'access_code', label: 'Access Code Required', icon: Lock },
  { id: 'eco_products', label: 'Eco Products Only', icon: Leaf },
  { id: 'fragile_items', label: 'Fragile Items', icon: AlertTriangle },
  { id: 'parking', label: 'Parking Needed', icon: Car },
]

export function StepRequirements({ data, updateData, onNext, onBack }: Props) {
  const t = useTranslations('booking')

  const toggleRequirement = (id: string) => {
    const current = data.specialRequirements
    const updated = current.includes(id)
      ? current.filter((r) => r !== id)
      : [...current, id]
    updateData({ specialRequirements: updated })
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-lg text-muted mb-4">{t('specialReqs')}</p>
        <p className="text-sm text-muted mb-6">Select all that apply (optional)</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {requirements.map((req) => {
            const Icon = req.icon
            const isSelected = data.specialRequirements.includes(req.id)
            return (
              <button
                key={req.id}
                type="button"
                onClick={() => toggleRequirement(req.id)}
                className={`
                  p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all
                  min-h-[90px] text-center
                  ${isSelected
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-gray-200 text-muted hover:border-gray-300'
                  }
                `}
              >
                <Icon size={24} />
                <span className="text-xs font-medium leading-tight">{req.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Special Instructions */}
      <div>
        <label className="block text-sm font-medium text-text mb-2">
          Additional notes (optional)
        </label>
        <textarea
          value={data.specialInstructions}
          onChange={(e) => updateData({ specialInstructions: e.target.value })}
          placeholder="Any specific instructions for the cleaning team..."
          rows={3}
          className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
        />
      </div>

      {/* Navigation */}
      <div className="flex gap-3 pt-4">
        <Button variant="outline" onClick={onBack} className="flex-1 sm:flex-none">
          Back
        </Button>
        <Button onClick={onNext} className="flex-1 sm:flex-none">
          Next
        </Button>
      </div>
    </div>
  )
}
