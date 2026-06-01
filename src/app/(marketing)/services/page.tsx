import type { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowRight, Sparkles, Zap, Home, Repeat, Truck, HardHat, Building, UtensilsCrossed, Key, Wind } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Our Services',
  description: 'Professional cleaning services in Koh Samui: regular cleaning, deep cleaning, villa cleaning, Airbnb turnover, move-in/out, post-construction, and more.',
}

const services = [
  { slug: 'regular-cleaning', name: 'Regular Cleaning', price: '1,500', duration: '2 hrs', icon: Sparkles, group: 'Residential', description: 'Comprehensive routine cleaning for homes and apartments. Includes all rooms, kitchen, and bathrooms.' },
  { slug: 'deep-cleaning', name: 'Deep Cleaning', price: '3,500', duration: '4 hrs', icon: Zap, group: 'Residential', description: 'Intensive top-to-bottom cleaning. Behind furniture, inside appliances, grout scrubbing, and detailed attention to every surface.' },
  { slug: 'villa-cleaning', name: 'Villa Cleaning', price: '4,000', duration: '3 hrs', icon: Home, group: 'Villa', description: 'Premium cleaning service for Koh Samui villas. Pool area tidying, outdoor spaces, and multi-level properties.' },
  { slug: 'airbnb-turnover', name: 'Airbnb Turnover', price: '2,500', duration: '2 hrs', icon: Repeat, group: 'Villa', description: 'Fast, thorough turnover cleaning between guests. Linen change, restocking, and property inspection included.' },
  { slug: 'move-in-out-cleaning', name: 'Move-In / Move-Out', price: '5,000', duration: '5 hrs', icon: Truck, group: 'Move', description: 'Complete cleaning for property transitions. Inside cabinets, appliance cleaning, wall washing, and window tracks.' },
  { slug: 'post-construction-cleaning', name: 'Post-Construction', price: '6,000', duration: '6 hrs', icon: HardHat, group: 'Specialised', description: 'Specialist cleaning after renovation. Dust removal, debris clearing, cement residue cleaning.' },
  { slug: 'office-cleaning', name: 'Office Cleaning', price: '2,000', duration: '2 hrs', icon: Building, group: 'Commercial', description: 'Professional cleaning for offices and co-working spaces. Desks, meeting rooms, restrooms.' },
  { slug: 'restaurant-cleaning', name: 'Restaurant Cleaning', price: '4,500', duration: '3 hrs', icon: UtensilsCrossed, group: 'Commercial', description: 'Kitchen deep clean, dining area, restrooms. Food-safe products and grease removal.' },
  { slug: 'end-of-lease-cleaning', name: 'End of Lease', price: '4,500', duration: '4 hrs', icon: Key, group: 'Move', description: 'Bond-back guarantee. Meets landlord inspection standards. Includes oven, windows, and carpet.' },
  { slug: 'window-cleaning', name: 'Window Cleaning', price: '2,000', duration: '2 hrs', icon: Wind, group: 'Specialised', description: 'Interior and exterior window cleaning. Includes frames, tracks, and screens.' },
]

export default function ServicesPage() {
  return (
    <div className="py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-primary font-[family-name:var(--font-display)]">
            Our Cleaning Services
          </h1>
          <p className="mt-4 text-lg text-muted">
            Professional cleaning solutions for every space on Koh Samui. From routine maintenance to specialist deep cleans.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service) => {
            const Icon = service.icon
            return (
              <Link key={service.slug} href={`/book?service=${service.slug}`} className="block">
                <Card hover className="overflow-hidden h-full">
                  <CardContent className="p-6 flex gap-5">
                    <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <Icon size={28} className="text-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-xs font-medium text-accent uppercase tracking-wide">{service.group}</span>
                          <h2 className="text-lg font-semibold text-primary mt-0.5">{service.name}</h2>
                        </div>
                      </div>
                      <p className="mt-1 text-sm text-muted line-clamp-2">{service.description}</p>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-primary">From {service.price} THB</span>
                          <span className="text-xs text-muted bg-gray-100 px-2 py-0.5 rounded">{service.duration}</span>
                        </div>
                        <span className="text-accent font-medium text-sm flex items-center">
                          Book
                          <ArrowRight size={14} className="ml-1" />
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
