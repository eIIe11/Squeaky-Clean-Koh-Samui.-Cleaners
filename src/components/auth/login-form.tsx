'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Mail, Globe } from 'lucide-react'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // In production, this calls Supabase Auth
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSent(true)
    setIsLoading(false)
  }

  const handleGoogleLogin = async () => {
    // In production, this triggers Supabase Google OAuth
    alert('Google SSO will be configured with Supabase Auth.')
  }

  if (isSent) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
            <Mail size={32} className="text-accent" />
          </div>
          <h2 className="text-xl font-semibold text-primary">Check your email</h2>
          <p className="mt-2 text-sm text-muted">
            We&apos;ve sent a magic link to <strong>{email}</strong>. Click the link to sign in.
          </p>
          <button
            onClick={() => setIsSent(false)}
            className="mt-4 text-sm text-primary hover:underline"
          >
            Use a different email
          </button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-8 space-y-6">
        {/* Google SSO */}
        <Button
          variant="outline"
          size="lg"
          className="w-full"
          onClick={handleGoogleLogin}
        >
          <Globe size={20} className="mr-2" />
          Continue with Google
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-3 text-muted">or</span>
          </div>
        </div>

        {/* Magic Link */}
        <form onSubmit={handleMagicLink} className="space-y-4">
          <Input
            label="Email address"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button
            type="submit"
            size="lg"
            className="w-full"
            isLoading={isLoading}
            disabled={!email.trim()}
          >
            <Mail size={18} className="mr-2" />
            Send Magic Link
          </Button>
        </form>

        <p className="text-xs text-center text-muted">
          No password needed. We&apos;ll email you a secure login link.
        </p>
      </CardContent>
    </Card>
  )
}
