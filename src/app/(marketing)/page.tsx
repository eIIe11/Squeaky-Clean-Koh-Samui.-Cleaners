import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Sparkles,
  Shield,
  Leaf,
  Clock,
  Star,
  ArrowRight,
  CheckCircle,
} from 'lucide-react'

function HeroSection() {
  const t = useTranslations('home')

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/images/hero-villa.jpg')] bg-cover bg-center" />
      <div className="absolute inset-0 bg-primary/80" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
        <div className="max-w-3xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white font-[family-name:var(--font-display)] leading-tight">
            {t('heroTitle')}
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-white/80 leading-relaxed max-w-2xl">
            {t('heroSubtitle')}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link href="/book">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                {t('heroCta')}
                <ArrowRight size={20} className="ml-2" />
              </Button>
            </Link>
            <Link href="/services">
              <Button variant="outline" size="lg" className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 hover:text-white">
                View Services
              </Button>
            </Link>
          </div>
          <div className="mt-12 flex items-center gap-4">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-accent border-2 border-white/20 flex items-center justify-center">
                  <Star size={12} className="text-white" fill="currentColor" />
                </div>
              ))}
            </div>
            <p className="text-sm text-white/70">
              <span className="text-white font-semibold">4.9/5</span> from 200+ happy customers
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

function TrustBadges() {
  const t = useTranslations('home')

  const badges = [
    { icon: Shield, label: t('trustBadge1') },
    { icon: Leaf, label: t('trustBadge2') },
    { icon: CheckCircle, label: t('trustBadge3') },
    { icon: Clock, label: t('trustBadge4') },
  ]

  return (
    <section className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {badges.map((badge) => (
            <div key={badge.label} className="flex items-center gap-3">
              <badge.icon size={20} className="text-accent flex-shrink-0" />
              <span className="text-sm font-medium text-muted">{badge.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ServicesSection() {
  const t = useTranslations('home')

  const services = [
    {
      title: 'Regular Cleaning',
      description: 'Comprehensive routine cleaning for homes and apartments.',
      price: '1,500',
      slug: 'regular-cleaning',
      icon: Sparkles,
    },
    {
      title: 'Deep Cleaning',
      description: 'Intensive top-to-bottom cleaning with detailed attention.',
      price: '3,500',
      slug: 'deep-cleaning',
      icon: Sparkles,
    },
    {
      title: 'Villa Cleaning',
      description: 'Premium service for villas and pool areas.',
      price: '4,000',
      slug: 'villa-cleaning',
      icon: Sparkles,
    },
    {
      title: 'Airbnb Turnover',
      description: 'Fast, thorough between-guest cleaning with linen change.',
      price: '2,500',
      slug: 'airbnb-turnover',
      icon: Sparkles,
    },
  ]

  return (
    <section className="py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary font-[family-name:var(--font-display)]">
            {t('servicesTitle')}
          </h2>
          <p className="mt-4 text-lg text-muted">
            {t('servicesSubtitle')}
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <Link key={service.slug} href={`/book?service=${service.slug}`}>
              <Card hover className="h-full">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                    <service.icon size={24} className="text-accent" />
                  </div>
                  <h3 className="text-lg font-semibold text-primary">{service.title}</h3>
                  <p className="mt-2 text-sm text-muted flex-1">{service.description}</p>
                  <p className="mt-4 text-lg font-bold text-primary">
                    From {service.price} <span className="text-sm font-normal text-muted">THB</span>
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link href="/services">
            <Button variant="outline" size="md">
              View All Services
              <ArrowRight size={16} className="ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

function WhySection() {
  const t = useTranslations('home')

  const reasons = [
    {
      title: 'Professional Teams',
      description: 'Trained, background-checked cleaning professionals who take pride in their work.',
    },
    {
      title: 'Transparent Pricing',
      description: 'No hidden fees. See your exact price before booking, with travel fees clearly shown.',
    },
    {
      title: 'Real-Time Updates',
      description: 'Track your cleaner in real time. Know exactly when they arrive and when they finish.',
    },
    {
      title: 'Photo Reports',
      description: 'Receive before/after photos and a detailed checklist report after every clean.',
    },
    {
      title: 'Flexible Booking',
      description: 'Book in 90 seconds. Reschedule or cancel with no fees up to 24 hours before.',
    },
    {
      title: 'Save with Recurring',
      description: 'Set up weekly or fortnightly cleaning and save up to 15% automatically.',
    },
  ]

  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary font-[family-name:var(--font-display)]">
            {t('whyTitle')}
          </h2>
          <p className="mt-4 text-lg text-muted">
            {t('whySubtitle')}
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((reason) => (
            <div key={reason.title} className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center mt-0.5">
                <CheckCircle size={16} className="text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-primary">{reason.title}</h3>
                <p className="mt-1 text-sm text-muted leading-relaxed">{reason.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTASection() {
  const t = useTranslations('home')

  return (
    <section className="py-16 sm:py-24 bg-accent/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-primary font-[family-name:var(--font-display)]">
          {t('ctaTitle')}
        </h2>
        <p className="mt-4 text-lg text-muted">
          {t('ctaSubtitle')}
        </p>
        <div className="mt-8">
          <Link href="/book">
            <Button size="lg">
              {t('ctaCta')}
              <ArrowRight size={20} className="ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustBadges />
      <ServicesSection />
      <WhySection />
      <CTASection />
    </>
  )
}
