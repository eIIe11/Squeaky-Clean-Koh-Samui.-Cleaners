import type { Metadata } from 'next'
import { AdminDashboard } from '@/components/admin/dashboard'

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Squeaky Clean administration panel.',
}

export default function AdminPage() {
  return <AdminDashboard />
}
