import type { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight, Check, Leaf, Droplets } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Transparent pricing for all cleaning services in Thailand. No hidden fees. See your exact price before booking.',
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

        {/* Natural Products Add-on */}
        <div className="bg-green-50 border border-green-200 rounded-2xl p-8 mb-12">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
              <Droplets size={32} className="text-green-600" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl font-bold text-primary font-[family-name:var(--font-display)] flex items-center gap-2 justify-center sm:justify-start">
                <Leaf size={22} className="text-green-600" />
                Natural Products Upgrade
              </h2>
              <p className="mt-2 text-muted">
                Prefer chemical-free cleaning? Add our 100% natural, essential oil-based products to any service.
                Made with lavender, tea tree, and citrus oils — safe for children, pets, and sensitive skin.
              </p>
              <p className="mt-2 text-lg font-bold text-green-700">+฿500 per booking</p>
            </div>
            <Link href="/book" className="flex-shrink-0">
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                Book with Natural Products <ArrowRight size={16} className="ml-1" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Recurring discount callout */}
        <div className="bg-accent/5 border border-accent/20 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-primary font-[family-name:var(--font-display)]">
            Save with Recurring Cleaning
          </h2>
          <div className="mt-4 flex flex-col sm:flex-row justify-center gap-6">
            <Link href="/book?recurring=weekly" className="group text-center px-6 py-4 rounded-xl border border-accent/20 hover:border-accent hover:bg-accent/5 transition-all cursor-pointer">
              <p className="text-3xl font-bold text-accent">15%</p>
              <p className="text-sm text-muted">Weekly</p>
              <p className="mt-2 text-xs font-medium text-accent opacity-0 group-hover:opacity-100 transition-opacity">Set up plan →</p>
            </Link>
            <Link href="/book?recurring=fortnightly" className="group text-center px-6 py-4 rounded-xl border border-accent/20 hover:border-accent hover:bg-accent/5 transition-all cursor-pointer">
              <p className="text-3xl font-bold text-accent">10%</p>
              <p className="text-sm text-muted">Fortnightly</p>
              <p className="mt-2 text-xs font-medium text-accent opacity-0 group-hover:opacity-100 transition-opacity">Set up plan →</p>
            </Link>
            <Link href="/book?recurring=monthly" className="group text-center px-6 py-4 rounded-xl border border-accent/20 hover:border-accent hover:bg-accent/5 transition-all cursor-pointer">
              <p className="text-3xl font-bold text-accent">5%</p>
              <p className="text-sm text-muted">Monthly</p>
              <p className="mt-2 text-xs font-medium text-accent opacity-0 group-hover:opacity-100 transition-opacity">Set up plan →</p>
            </Link>
          </div>
          <p className="mt-4 text-sm text-muted max-w-md mx-auto">
            Click a plan to start booking with the discount applied automatically to every clean.
          </p>
        </div>


      </div>
    </div>
  )
}
