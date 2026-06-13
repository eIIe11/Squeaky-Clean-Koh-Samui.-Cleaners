import { createServerSupabaseClient, createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/portal'

  if (code) {
    const supabase = await createServerSupabaseClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // Sync auth user with customers table
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const admin = createAdminClient()
        const { data: existing } = await admin
          .from('customers')
          .select('id')
          .eq('auth_user_id', user.id)
          .single()

        if (!existing) {
          // Check if customer exists by email
          const { data: byEmail } = await admin
            .from('customers')
            .select('id')
            .eq('email', user.email || '')
            .single()

          if (byEmail) {
            // Link existing customer to auth user
            await admin
              .from('customers')
              .update({ auth_user_id: user.id })
              .eq('id', byEmail.id)
          } else {
            // Create new customer record
            await admin
              .from('customers')
              .insert({
                email: user.email || '',
                full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Customer',
                phone: user.user_metadata?.phone || null,
                auth_user_id: user.id,
                preferred_language: 'en',
                is_active: true,
              })
          }
        }
      }
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_error`)
}
