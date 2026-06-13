import type { Metadata } from 'next'
import { SettingsManager } from '@/components/admin/settings-manager'

export const metadata: Metadata = {
  title: 'Settings | Admin',
  description: 'Business settings.',
}

export default function SettingsPage() {
  return <SettingsManager />
}
