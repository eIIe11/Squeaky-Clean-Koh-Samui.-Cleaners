import type { Metadata } from 'next'
import { Shield, Award, Heart, Users } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Squeaky Clean — premium cleaning services trusted by villa owners and residents across Koh Samui.',
}

export default function AboutPage() {
  return (
    <div className="py-16 sm:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-primary font-[family-name:var(--font-display)]">
            About Squeaky Clean
          </h1>
          <p className="mt-4 text-lg text-muted max-w-2xl mx-auto">
            Professional cleaning services designed for Koh Samui&apos;s villas, homes, and businesses.
          </p>
        </div>

        <div className="prose prose-lg max-w-none text-muted">
          <p>
            Squeaky Clean was founded with a simple mission: deliver consistently exceptional cleaning
            services to Koh Samui&apos;s homes, villas, and businesses — without the operational headaches
            that typically come with booking and managing cleaners.
          </p>
          <p>
            We believe that booking a professional clean should be as easy as ordering food delivery.
            That&apos;s why we built a platform that lets you book, pay, and track your clean in under 90
            seconds — no phone calls, no back-and-forth messaging.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-16">
          {[
            { icon: Shield, title: 'Insured & Bonded', description: 'Full liability coverage for your property and belongings.' },
            { icon: Award, title: 'Trained Professionals', description: 'Background-checked staff with regular quality audits.' },
            { icon: Heart, title: 'Eco-Friendly', description: 'Non-toxic, biodegradable products safe for families and pets.' },
            { icon: Users, title: 'Local Team', description: 'Koh Samui-based team who know the island inside and out.' },
          ].map((item) => {
            const Icon = item.icon
            return (
              <div key={item.title} className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Icon size={24} className="text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-primary">{item.title}</h3>
                  <p className="mt-1 text-sm text-muted">{item.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
