'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Leaf, X } from 'lucide-react'

export function NaturalProductsBanner() {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex items-center justify-center gap-2 text-sm sm:text-base pr-8">
          <Leaf size={16} className="flex-shrink-0" />
          <p>
            <span className="font-semibold">All-natural cleaning available!</span>
            {' '}We offer 100% natural, essential oil-based products.{' '}
            <Link
              href="/book"
              className="underline font-semibold hover:text-green-100 transition-colors"
            >
              Choose this option when booking →
            </Link>
          </p>
        </div>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/20 transition-colors"
        aria-label="Dismiss banner"
      >
        <X size={16} />
      </button>
    </div>
  )
}
