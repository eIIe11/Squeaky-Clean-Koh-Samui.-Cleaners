'use client'

import { useEffect, useState, useCallback } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Save, Check } from 'lucide-react'
import { getBusinessSettings, updateBusinessSetting } from '@/lib/actions/admin'

interface Setting {
  key: string
  value: string
  label: string
  type: string
}

export function SettingsManager() {
  const [settings, setSettings] = useState<Setting[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editValues, setEditValues] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState<string | null>(null)
  const [saved, setSaved] = useState<string | null>(null)

  const loadSettings = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await getBusinessSettings()
      setSettings(data.settings)
      const values: Record<string, string> = {}
      data.settings.forEach((s) => { values[s.key] = s.value })
      setEditValues(values)
    } catch {
      setSettings([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadSettings()
  }, [loadSettings])

  const handleSave = async (key: string) => {
    setSaving(key)
    const result = await updateBusinessSetting(key, editValues[key])
    if (result.success) {
      setSaved(key)
      setTimeout(() => setSaved(null), 2000)
    }
    setSaving(null)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary font-[family-name:var(--font-display)]">
          Business Settings
        </h1>
        <p className="text-sm text-muted mt-1">Configure pricing, policies, and business rules</p>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted">Loading settings...</p>
          </CardContent>
        </Card>
      ) : settings.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted">No settings found. Run the database seed script to populate defaults.</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-primary">Pricing & Policies</h2>
          </CardHeader>
          <CardContent className="space-y-5">
            {settings.map((setting) => (
              <div key={setting.key} className="flex items-end gap-3">
                <div className="flex-1">
                  <Input
                    label={setting.label}
                    type={setting.type === 'number' || setting.type === 'percent' ? 'number' : 'text'}
                    value={editValues[setting.key] || ''}
                    onChange={(e) => setEditValues({ ...editValues, [setting.key]: e.target.value })}
                    helperText={setting.type === 'percent' ? 'Percentage value' : setting.type === 'number' ? 'Numeric value' : undefined}
                  />
                </div>
                <Button
                  size="sm"
                  variant={saved === setting.key ? 'outline' : 'primary'}
                  onClick={() => handleSave(setting.key)}
                  disabled={saving === setting.key || editValues[setting.key] === setting.value}
                  className="mb-0.5"
                >
                  {saved === setting.key ? (
                    <><Check size={14} className="mr-1" /> Saved</>
                  ) : saving === setting.key ? (
                    'Saving...'
                  ) : (
                    <><Save size={14} className="mr-1" /> Save</>
                  )}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
