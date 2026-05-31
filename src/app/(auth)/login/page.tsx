import type { Metadata } from 'next'
import { LoginForm } from '@/components/auth/login-form'

export const metadata: Metadata = {
  title: 'Login',
  description: 'Sign in to your Squeaky Clean account.',
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary font-[family-name:var(--font-display)]">
            Welcome Back
          </h1>
          <p className="mt-2 text-muted">
            Sign in to manage your bookings
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
