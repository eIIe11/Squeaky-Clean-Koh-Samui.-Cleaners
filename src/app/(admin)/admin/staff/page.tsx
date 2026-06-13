import type { Metadata } from 'next'
import { StaffManager } from '@/components/admin/staff-manager'

export const metadata: Metadata = {
  title: 'Staff | Admin',
  description: 'Manage cleaning staff.',
}

export default function StaffPage() {
  return <StaffManager />
}
