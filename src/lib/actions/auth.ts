'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function signInWithMagicLink(formData: FormData) {
  const email = formData.get('email') as string
  if (!email) throw new Error('Email is required')

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error('Authentication is not configured yet.')
  }

  const supabase = await createServerSupabaseClient()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${siteUrl}/auth/callback`,
    },
  })

  if (error) throw new Error(error.message)
  return { success: true }
}

export async function signInWithPassword(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  if (!email || !password) throw new Error('Email and password are required')

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error('Authentication is not configured yet.')
  }

  const supabase = await createServerSupabaseClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw new Error(error.message)
  return { success: true }
}

export async function signInWithGoogle(redirectTo?: string) {
  const supabase = await createServerSupabaseClient()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const next = redirectTo || '/portal'

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${siteUrl}/auth/callback?next=${encodeURIComponent(next)}`,
    },
  })

  if (error) throw new Error(error.message)
  if (data.url) redirect(data.url)
}

export async function signOut() {
  const supabase = await createServerSupabaseClient()
  await supabase.auth.signOut()
  redirect('/login')
}

export async function getSession() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}
