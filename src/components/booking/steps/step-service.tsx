'use client'

import { useTranslations } from 'next-intl'
import { Card, CardContent } from '@/components/ui/card'
import { Sparkles, Zap, Home, Repeat, Truck, HardHat, Building, UtensilsCrossed, Key, Wind } from 'lucide-react'
import type { BookingData } from '../booking-wizard'

interface Props {
  data: BookingData
  updateData: (updates: Partial<BookingData>) => void
  onNext: () => void
}

const services = [
  { slug: 'regular-cleaning', name: 'Regular Cleaning', price: '1,500', duration: '2 hrs', icon: Sparkles, description: 'Routine cleaning for homes and apartments' },
  { slug: 'deep-cleaning', name: 'Deep Cleaning', price: '3,500', duration: '4 hrs', icon: Zap, description: 'Intensive top-to-bottom cleaning' },
  { slug: 'villa-cleaning', name: 'Villa Cleaning', price: '4,000', duration: '3 hrs', icon: Home, description: 'Premium service for villas and pool areas' },
  { slug: 'airbnb-turnover', name: 'Airbnb Turnover', price: '2,500', duration: '2 hrs', icon: Repeat, description: 'Fast turnover between guests' },
  { slug: 'move-in-out-cleaning', name: 'Move-In / Move-Out', price: '5,000', duration: '5 hrs', icon: Truck, description: 'Complete cleaning for property transitions' },
  { slug: 'post-construction-cleaning', name: 'Post-Construction', price: '6,000', duration: '6 hrs', icon: HardHat, description: 'Specialist cleaning after renovation' },
  { slug: 'office-cleaning', name: 'Office Cleaning', price: '2,000', duration: '2 hrs', icon: Building, description: 'Professional office and workspace cleaning' },
  { slug: 'restaurant-cleaning', name: 'Restaurant Cleaning', price: '4,500', duration: '3 hrs', icon: UtensilsCrossed, description: 'Kitchen deep clean and dining areas' },
  { slug: 'end-of-lease-cleaning', name: 'End of Lease', price: '4,500', duration: '4 hrs', icon: Key, description: 'Bond-back guarantee cleaning' },
  { slug: 'window-cleaning', name: 'Window Cleaning', price: '2,000', duration: '2 hrs', icon: Wind, description: 'Interior and exterior windows' },
]

export function StepServiceSelection({ data, updateData, onNext }: Props) {
  const t = useTranslations('booking')

  const handleSelect = (service: typeof services[0]) => {
    updateData({ serviceSlug: service.slug, serviceName: service.name })
    onNext()
  }

  return (
    <div>
      <p className="text-lg text-muted mb-6">{t('selectService')}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {services.map((service) => {
          const Icon = service.icon
          const isSelected = data.serviceSlug === service.slug
          return (
            <button
              key={service.slug}
              onClick={() => handleSelect(service)}
              className="text-left"
            >
              <Card
                hover
                className={`h-full transition-all ${isSelected ? 'ring-2 ring-primary border-primary' : ''}`}
              >
                <CardContent className="p-5 flex gap-4">
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Icon size={24} className="text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-primary">{service.name}</h3>
                    <p className="text-sm text-muted mt-0.5">{service.description}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-sm font-bold text-primary">From {service.price} THB</span>
                      <span className="text-xs text-muted">{service.duration}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </button>
          )
        })}
      </div>
    </div>
  )
}
