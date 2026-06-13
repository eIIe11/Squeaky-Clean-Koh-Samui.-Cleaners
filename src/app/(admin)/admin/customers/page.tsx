import type { Metadata } from 'next'
import { CustomersManager } from '@/components/admin/customers-manager'

export const metadata: Metadata = {
  title: 'Customers | Admin',
  description: 'Manage customers.',
}

export default function CustomersPage() {
  return <CustomersManager />
}
