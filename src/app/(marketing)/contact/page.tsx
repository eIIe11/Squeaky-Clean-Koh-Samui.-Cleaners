import type { Metadata } from 'next'
import { Card, CardContent } from '@/components/ui/card'
import { Mail, MapPin, MessageCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Squeaky Clean Thailand. We respond within 2 hours during business hours.',
}

export default function ContactPage() {
  return (
    <div className="py-16 sm:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-primary font-[family-name:var(--font-display)]">
            Get in Touch
          </h1>
          <p className="mt-4 text-lg text-muted">
            Questions? We&apos;re here to help. Reach out through any channel below.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <Mail size={24} className="text-accent" />
              </div>
              <h3 className="font-semibold text-primary">Email</h3>
              <a href="mailto:squakycleanthailand@gmail.com" className="text-sm text-muted hover:text-primary mt-1 block">
                squakycleanthailand@gmail.com
              </a>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <MessageCircle size={24} className="text-accent" />
              </div>
              <h3 className="font-semibold text-primary">WhatsApp</h3>
              <p className="text-sm text-muted mt-1">Message us for quick responses</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <MapPin size={24} className="text-accent" />
              </div>
              <h3 className="font-semibold text-primary">Location</h3>
              <p className="text-sm text-muted mt-1">Serving all of Thailand</p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted">
            Prefer to just book? <a href="/book" className="text-primary font-medium hover:underline">Book online in 90 seconds →</a>
          </p>
        </div>
      </div>
    </div>
  )
}
