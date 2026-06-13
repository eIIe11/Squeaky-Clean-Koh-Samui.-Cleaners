'use client'

import { useEffect, useState, useCallback } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { UserPlus, Phone, Mail, MessageCircle, X } from 'lucide-react'
import { getStaff, createStaffMember, updateStaffMember, deleteStaffMember } from '@/lib/actions/admin'

interface Staff {
  id: number
  name: string
  phone: string
  email: string
  whatsapp: string
  employmentType: string
  workingDays: number[]
  workingHoursStart: string
  workingHoursEnd: string
  isActive: boolean
  isAvailable: boolean
  createdAt: string
}

const dayNames = ['', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export function StaffManager() {
  const [staff, setStaff] = useState<Staff[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newWhatsapp, setNewWhatsapp] = useState('')
  const [newType, setNewType] = useState('employed')
  const [isAdding, setIsAdding] = useState(false)

  const loadStaff = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await getStaff()
      setStaff(data.staff)
    } catch {
      setStaff([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadStaff()
  }, [loadStaff])

  const handleAdd = async () => {
    if (!newName.trim()) return
    setIsAdding(true)
    const result = await createStaffMember({
      name: newName,
      phone: newPhone || undefined,
      email: newEmail || undefined,
      whatsapp: newWhatsapp || undefined,
      employmentType: newType,
    })
    if (result.success) {
      setNewName('')
      setNewPhone('')
      setNewEmail('')
      setNewWhatsapp('')
      setShowAddForm(false)
      await loadStaff()
    }
    setIsAdding(false)
  }

  const handleToggleAvailable = async (member: Staff) => {
    await updateStaffMember(member.id, { isAvailable: !member.isAvailable })
    await loadStaff()
  }

  const handleDeactivate = async (member: Staff) => {
    if (!confirm(`Deactivate ${member.name}? They will no longer appear in scheduling.`)) return
    await deleteStaffMember(member.id)
    await loadStaff()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary font-[family-name:var(--font-display)]">
            Staff Management
          </h1>
          <p className="text-sm text-muted mt-1">{staff.filter(s => s.isActive).length} active cleaners</p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <UserPlus size={16} className="mr-2" />
          Add Cleaner
        </Button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <h2 className="text-lg font-semibold text-primary">New Staff Member</h2>
            <button type="button" onClick={() => setShowAddForm(false)} className="text-muted hover:text-text">
              <X size={20} />
            </button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Full Name *" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Somchai K." />
              <Input label="Phone" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} placeholder="+66 81 234 5678" />
              <Input label="Email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="somchai@email.com" />
              <Input label="WhatsApp" value={newWhatsapp} onChange={(e) => setNewWhatsapp(e.target.value)} placeholder="+66 81 234 5678" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">Employment Type</label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setNewType('employed')}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${newType === 'employed' ? 'border-primary bg-primary/5 text-primary' : 'border-gray-200 text-muted'}`}
                >
                  Employed
                </button>
                <button
                  type="button"
                  onClick={() => setNewType('contractor')}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${newType === 'contractor' ? 'border-primary bg-primary/5 text-primary' : 'border-gray-200 text-muted'}`}
                >
                  Contractor
                </button>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
              <Button onClick={handleAdd} disabled={!newName.trim() || isAdding}>
                {isAdding ? 'Adding...' : 'Add Staff Member'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Staff List */}
      {isLoading ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted">Loading staff...</p>
          </CardContent>
        </Card>
      ) : staff.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <UserPlus size={40} className="mx-auto text-muted mb-3" />
            <p className="text-muted font-medium">No staff members yet</p>
            <p className="text-sm text-muted mt-1">Add your first cleaner to get started with scheduling.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {staff.map((member) => (
            <Card key={member.id} className={!member.isActive ? 'opacity-50' : ''}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-text">{member.name}</h3>
                    <p className="text-xs text-muted capitalize">{member.employmentType}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${member.isAvailable ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                      {member.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 text-sm">
                  {member.phone && (
                    <div className="flex items-center gap-2 text-muted">
                      <Phone size={14} /> <span>{member.phone}</span>
                    </div>
                  )}
                  {member.email && (
                    <div className="flex items-center gap-2 text-muted">
                      <Mail size={14} /> <span>{member.email}</span>
                    </div>
                  )}
                  {member.whatsapp && (
                    <div className="flex items-center gap-2 text-muted">
                      <MessageCircle size={14} /> <span>{member.whatsapp}</span>
                    </div>
                  )}
                </div>

                <div className="mt-3 flex items-center gap-1">
                  {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                    <span
                      key={day}
                      className={`w-8 h-6 rounded text-xs flex items-center justify-center font-medium ${
                        member.workingDays?.includes(day) ? 'bg-primary/10 text-primary' : 'bg-gray-50 text-gray-300'
                      }`}
                    >
                      {dayNames[day]}
                    </span>
                  ))}
                  <span className="ml-2 text-xs text-muted">
                    {member.workingHoursStart?.substring(0, 5)} – {member.workingHoursEnd?.substring(0, 5)}
                  </span>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleToggleAvailable(member)}>
                    {member.isAvailable ? 'Set Unavailable' : 'Set Available'}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDeactivate(member)} className="text-red-600 border-red-200 hover:bg-red-50">
                    Deactivate
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
