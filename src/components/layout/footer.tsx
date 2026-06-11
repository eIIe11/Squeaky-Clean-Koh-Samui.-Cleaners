import Link from 'next/link'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Mail, MapPin } from 'lucide-react'

export function Footer() {
  const t = useTranslations('footer')
  const year = new Date().getFullYear()

  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/images/logo-icon.png"
                alt="Squeaky Clean"
                width={32}
                height={32}
                className="brightness-0 invert"
              />
              <span className="text-lg font-bold font-[family-name:var(--font-display)]">
                Squeaky Clean
              </span>
            </Link>
            <p className="text-sm text-white/70 leading-relaxed">
              {t('description')}
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4">{t('services')}</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link href="/services/regular-cleaning" className="hover:text-accent transition-colors">Regular Cleaning</Link></li>
              <li><Link href="/services/deep-cleaning" className="hover:text-accent transition-colors">Deep Cleaning</Link></li>
              <li><Link href="/services/villa-cleaning" className="hover:text-accent transition-colors">Villa Cleaning</Link></li>
              <li><Link href="/services/airbnb-turnover" className="hover:text-accent transition-colors">Airbnb Turnover</Link></li>
              <li><Link href="/services/office-cleaning" className="hover:text-accent transition-colors">Office Cleaning</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">{t('company')}</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link href="/about" className="hover:text-accent transition-colors">About Us</Link></li>
              <li><Link href="/pricing" className="hover:text-accent transition-colors">Pricing</Link></li>
              <li><Link href="/contact" className="hover:text-accent transition-colors">Contact</Link></li>
              <li><Link href="/book" className="hover:text-accent transition-colors">Book a Clean</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-accent flex-shrink-0" />
                <a href="mailto:squakycleanthailand@gmail.com" className="hover:text-accent transition-colors">
                  squakycleanthailand@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={16} className="text-accent flex-shrink-0" />
                <span>Serving all of Thailand</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-white/50">
            {t('copyright', { year: year.toString() })}
          </p>
          <div className="flex gap-6 text-sm text-white/50">
            <Link href="/privacy" className="hover:text-accent transition-colors">{t('privacy')}</Link>
            <Link href="/terms" className="hover:text-accent transition-colors">{t('terms')}</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
