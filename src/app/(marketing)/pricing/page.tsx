import type { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight, Check } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Transparent pricing for all cleaning services in Koh Samui. No hidden fees. See your exact price before booking.',
}

const pricingTiers = [
  {
    name: 'Regular Cleaning',
    basePrice: '1,500',
    perBedroom: '300',
    perBathroom: '200',
    duration: '~2 hours',
    includes: ['All rooms vacuumed & mopped', 'Kitchen surfaces & sink', 'Bathroom sanitised', 'Beds made', 'Bins emptied'],
    slug: 'regular-cleaning',
  },
  {
    name: 'Deep Cleaning',
    basePrice: '3,500',
    perBedroom: '500',
    perBathroom: '400',
    duration: '~4 hours',
    includes: ['Everything in Regular', 'Behind & under furniture', 'Inside appliances', 'Grout scrubbing', 'Window tracks', 'Light fixtures'],
    slug: 'deep-cleaning',
    popular: true,
  },
  {
    name: 'Villa Cleaning',
    basePrice: '4,000',
    perBedroom: '600',
    perBathroom: '400',
    duration: '~3 hours',
    includes: ['Full interior clean', 'Pool area tidying', 'Outdoor furniture', 'Multi-level properties', 'Garden debris cleared'],
    slug: 'villa-cleaning',
  },
]

export default function PricingPage() {
  return (
    <div className="py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-primary font-[family-name:var(--font-display)]">
            Transparent Pricing
          </h1>
          <p className="mt-4 text-lg text-muted">
            No hidden fees. Your price is calculated based on property size and service type.
            Travel fees apply for zones outside central Koh Samui.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {pricingTiers.map((tier) => (
            <Card key={tier.slug} className={`relative ${tier.popular ? 'ring-2 ring-accent' : ''}`}>
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-primary text-xs font-bold px-3 py-1 rounded-full">
                  Most Popular
                </div>
              )}
              <CardContent className="p-6 flex flex-col h-full">
                <h3 className="text-xl font-semibold text-primary">{tier.name}</h3>
                <div className="mt-4">
                  <span className="text-3xl font-bold text-primary">฿{tier.basePrice}</span>
                  <span className="text-sm text-muted ml-1">base price</span>
                </div>
                <div className="mt-2 space-y-1 text-sm text-muted">
                  <p>+ ฿{tier.perBedroom} per bedroom</p>
                  <p>+ ฿{tier.perBathroom} per bathroom</p>
                  <p className="text-xs">Duration: {tier.duration}</p>
                </div>
                <ul className="mt-6 space-y-2.5 flex-1">
                  {tier.includes.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm">
                      <Check size={16} className="text-success flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link href={`/book?service=${tier.slug}`} className="mt-6 block">
                  <Button variant={tier.popular ? 'primary' : 'outline'} className="w-full">
                    Book Now <ArrowRight size={16} className="ml-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recurring discount callout */}
        <div className="bg-accent/5 border border-accent/20 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-primary font-[family-name:var(--font-display)]">
            Save with Recurring Cleaning
          </h2>
          <div className="mt-4 flex flex-col sm:flex-row justify-center gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-accent">15%</p>
              <p className="text-sm text-muted">Weekly</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-accent">10%</p>
              <p className="text-sm text-muted">Fortnightly</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-accent">5%</p>
              <p className="text-sm text-muted">Monthly</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-muted max-w-md mx-auto">
            Set up a recurring plan during booking and the discount applies automatically to every clean.
          </p>
        </div>

        {/* Travel fees */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-primary font-[family-name:var(--font-display)] text-center mb-6">
            Travel Fees by Zone
          </h2>
          <div className="max-w-md mx-auto">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {[
                    { zone: 'Chaweng / Bophut / Fisherman\'s Village', fee: 'Free' },
                    { zone: 'Lamai / Bang Rak / Choeng Mon / Plai Laem', fee: '฿100' },
                    { zone: 'Maenam', fee: '฿150' },
                    { zone: 'Lipa Noi / Nathon', fee: '฿200' },
                    { zone: 'Taling Ngam', fee: '฿250' },
                  ].map((item) => (
                    <div key={item.zone} className="flex justify-between items-center text-sm">
                      <span className="text-muted">{item.zone}</span>
                      <span className="font-medium text-primary">{item.fee}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
