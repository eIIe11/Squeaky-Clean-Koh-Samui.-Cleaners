'use client'

import { useEffect, useState, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Search, Mail, Phone, Tag } from 'lucide-react'
import { getCustomers } from '@/lib/actions/admin'

interface Customer {
  id: number
  name: string
  email: string
  phone: string
  tags: string[]
  referralCode: string
  isActive: boolean
  createdAt: string
}

export function CustomersManager() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')

  const loadCustomers = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await getCustomers(search || undefined)
      setCustomers(data.customers)
    } catch {
      setCustomers([])
    } finally {
      setIsLoading(false)
    }
  }, [search])

  useEffect(() => {
    const timer = setTimeout(loadCustomers, 300)
    return () => clearTimeout(timer)
  }, [loadCustomers])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary font-[family-name:var(--font-display)]">
          Customers
        </h1>
        <p className="text-sm text-muted mt-1">{customers.length} customers</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <Input
          placeholder="Search by name, email, or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Customer List */}
      {isLoading ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted">Loading customers...</p>
          </CardContent>
        </Card>
      ) : customers.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted">No customers found.</p>
            <p className="text-sm text-muted mt-1">Customers are created automatically when they make a booking.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left px-4 py-3 text-xs font-medium text-muted uppercase tracking-wider">Customer</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted uppercase tracking-wider">Contact</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted uppercase tracking-wider">Referral Code</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted uppercase tracking-wider">Tags</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted uppercase tracking-wider">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-4">
                    <p className="text-sm font-medium text-text">{customer.name}</p>
                    <span className={`inline-flex px-1.5 py-0.5 rounded text-xs ${customer.isActive ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                      {customer.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-sm text-muted">
                        <Mail size={12} /> {customer.email}
                      </div>
                      {customer.phone && (
                        <div className="flex items-center gap-1.5 text-sm text-muted">
                          <Phone size={12} /> {customer.phone}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm font-mono text-primary">{customer.referralCode}</span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex gap-1 flex-wrap">
                      {customer.tags.map((tag) => (
                        <span key={tag} className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-primary/5 text-primary text-xs">
                          <Tag size={10} /> {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-muted">
                    {new Date(customer.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
