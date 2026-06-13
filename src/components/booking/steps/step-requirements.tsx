'use client'

import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { PawPrint, Key, Lock, AlertTriangle, Car, Leaf, Droplets, Check } from 'lucide-react'
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
  { id: 'fragile_items', label: 'Fragile Items', icon: AlertTriangle },
  { id: 'parking', label: 'Parking Needed', icon: Car },
]

const naturalProductsBenefits = [
  'Essential oil-based cleaning solutions',
  'No harsh chemicals or toxic fumes',
  'Safe for children, pets & sensitive skin',
  'Eco-friendly & biodegradable products',
  'Lavender, tea tree & citrus formulas',
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
      {/* Natural Products Upgrade */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Leaf size={20} className="text-green-600" />
          <h3 className="text-lg font-semibold text-primary">Natural Products Upgrade</h3>
        </div>
        <Card
          className={`cursor-pointer transition-all ${
            data.useNaturalProducts
              ? 'ring-2 ring-green-500 bg-green-50/50'
              : 'hover:border-green-300'
          }`}
        >
          <CardContent className="p-5">
            <button
              type="button"
              onClick={() => updateData({ useNaturalProducts: !data.useNaturalProducts })}
              className="w-full text-left"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Droplets size={18} className="text-green-600" />
                    <span className="font-semibold text-primary">
                      100% Natural & Essential Oil Products
                    </span>
                  </div>
                  <p className="text-sm text-muted mb-3">
                    Upgrade to our all-natural cleaning products made with essential oils.
                    Better for your health, your family, and the environment.
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {naturalProductsBenefits.map((benefit) => (
                      <li key={benefit} className="flex items-center gap-1.5 text-xs text-muted">
                        <Check size={12} className="text-green-600 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-lg font-bold text-green-700">+฿500</div>
                  <div className="text-xs text-muted">per booking</div>
                  <div className={`mt-2 w-6 h-6 rounded-full border-2 flex items-center justify-center mx-auto ${
                    data.useNaturalProducts
                      ? 'bg-green-500 border-green-500'
                      : 'border-gray-300'
                  }`}>
                    {data.useNaturalProducts && <Check size={14} className="text-white" />}
                  </div>
                </div>
              </div>
            </button>
          </CardContent>
        </Card>
      </div>

      {/* Other Requirements */}
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
