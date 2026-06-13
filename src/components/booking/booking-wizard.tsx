'use client'

import { useState, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import { StepServiceSelection } from './steps/step-service'
import { StepPropertyDetails } from './steps/step-property'
import { StepDateTime } from './steps/step-datetime'
import { StepRequirements } from './steps/step-requirements'
import { StepYourDetails } from './steps/step-details'
import { StepReviewPay } from './steps/step-review'

export interface BookingData {
  serviceSlug: string
  serviceName: string
  address: string
  district: string
  propertyType: string
  bedrooms: number
  bathrooms: number
  date: string
  time: string
  isRecurring: boolean
  recurringFrequency: string
  useNaturalProducts: boolean
  specialRequirements: string[]
  specialInstructions: string
  fullName: string
  email: string
  phone: string
  promoCode: string
  paymentMethod: string
}

const initialData: BookingData = {
  serviceSlug: '',
  serviceName: '',
  address: '',
  district: '',
  propertyType: 'house',
  bedrooms: 2,
  bathrooms: 1,
  date: '',
  time: '',
  isRecurring: false,
  recurringFrequency: '',
  useNaturalProducts: false,
  specialRequirements: [],
  specialInstructions: '',
  fullName: '',
  email: '',
  phone: '',
  promoCode: '',
  paymentMethod: '',
}

const TOTAL_STEPS = 6

export function BookingWizard() {
  const t = useTranslations('booking')
  const searchParams = useSearchParams()
  const preselectedService = searchParams.get('service') || ''

  const [step, setStep] = useState(1)
  const [data, setData] = useState<BookingData>({
    ...initialData,
    serviceSlug: preselectedService,
  })

  const stepTitles = [
    t('step1Title'),
    t('step2Title'),
    t('step3Title'),
    t('step4Title'),
    t('step5Title'),
    t('step6Title'),
  ]

  const updateData = useCallback((updates: Partial<BookingData>) => {
    setData((prev) => ({ ...prev, ...updates }))
  }, [])

  const nextStep = useCallback(() => {
    setStep((s) => Math.min(s + 1, TOTAL_STEPS))
  }, [])

  const prevStep = useCallback(() => {
    setStep((s) => Math.max(s - 1, 1))
  }, [])

  const goToStep = useCallback((target: number) => {
    if (target < step) setStep(target)
  }, [step])

  return (
    <div>
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-primary font-[family-name:var(--font-display)]">
            {t('title')}
          </h1>
          <span className="text-sm text-muted">
            Step {step} of {TOTAL_STEPS}
          </span>
        </div>
        <div className="flex gap-1.5">
          {stepTitles.map((title, i) => (
            <button
              key={title}
              onClick={() => goToStep(i + 1)}
              className={`
                h-1.5 flex-1 rounded-full transition-colors
                ${i + 1 <= step ? 'bg-primary' : 'bg-gray-200'}
                ${i + 1 < step ? 'cursor-pointer hover:bg-primary-light' : 'cursor-default'}
              `}
              aria-label={`Step ${i + 1}: ${title}`}
            />
          ))}
        </div>
        <p className="mt-2 text-sm font-medium text-muted">{stepTitles[step - 1]}</p>
      </div>

      {/* Steps */}
      {step === 1 && (
        <StepServiceSelection data={data} updateData={updateData} onNext={nextStep} />
      )}
      {step === 2 && (
        <StepPropertyDetails data={data} updateData={updateData} onNext={nextStep} onBack={prevStep} />
      )}
      {step === 3 && (
        <StepDateTime data={data} updateData={updateData} onNext={nextStep} onBack={prevStep} />
      )}
      {step === 4 && (
        <StepRequirements data={data} updateData={updateData} onNext={nextStep} onBack={prevStep} />
      )}
      {step === 5 && (
        <StepYourDetails data={data} updateData={updateData} onNext={nextStep} onBack={prevStep} />
      )}
      {step === 6 && (
        <StepReviewPay data={data} updateData={updateData} onBack={prevStep} />
      )}
    </div>
  )
}
