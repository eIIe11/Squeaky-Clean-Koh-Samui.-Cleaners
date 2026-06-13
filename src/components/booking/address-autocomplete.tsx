'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { MapPin, Search, X } from 'lucide-react'

interface AddressSuggestion {
  display_name: string
  lat: string
  lon: string
  place_id: number
}

interface Props {
  value: string
  onChange: (address: string) => void
  label?: string
  placeholder?: string
}

export function AddressAutocomplete({ value, onChange, label, placeholder }: Props) {
  const [query, setQuery] = useState(value)
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isManualMode, setIsManualMode] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Sync external value changes
  useEffect(() => {
    if (value !== query && !isOpen) {
      setQuery(value)
    }
  }, [value]) // eslint-disable-line react-hooks/exhaustive-deps

  const searchAddresses = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 3) {
      setSuggestions([])
      setIsOpen(false)
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?` +
        new URLSearchParams({
          q: searchQuery,
          format: 'json',
          countrycodes: 'th',
          limit: '6',
          addressdetails: '1',
        }),
        {
          headers: {
            'Accept-Language': 'en',
          },
        }
      )

      if (response.ok) {
        const data: AddressSuggestion[] = await response.json()
        setSuggestions(data)
        setIsOpen(data.length > 0)
      }
    } catch {
      // Silently fail — user can always type manually
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setQuery(newValue)

    if (isManualMode) {
      onChange(newValue)
      return
    }

    // Debounce API calls
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      searchAddresses(newValue)
    }, 400)
  }

  const handleSelect = (suggestion: AddressSuggestion) => {
    const address = suggestion.display_name
    setQuery(address)
    onChange(address)
    setIsOpen(false)
    setSuggestions([])
  }

  const handleClear = () => {
    setQuery('')
    onChange('')
    setSuggestions([])
    setIsOpen(false)
  }

  const toggleManualMode = () => {
    setIsManualMode(!isManualMode)
    setSuggestions([])
    setIsOpen(false)
    if (!isManualMode) {
      onChange(query)
    }
  }

  return (
    <div ref={containerRef} className="relative space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-text">{label}</label>
      )}

      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none">
          {isManualMode ? <MapPin size={18} /> : <Search size={18} />}
        </div>

        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => {
            if (!isManualMode && suggestions.length > 0) setIsOpen(true)
          }}
          placeholder={placeholder || (isManualMode ? 'Type your full address...' : 'Start typing to search Thai addresses...')}
          className={`
            w-full pl-10 pr-10 py-3 rounded-lg border transition-colors duration-200
            bg-white text-text placeholder:text-muted
            focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
            min-h-[44px] border-gray-200
          `}
        />

        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute right-10 top-[calc(50%+0.75rem)] -translate-y-1/2">
          <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      )}

      {/* Suggestions dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-[240px] overflow-y-auto">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.place_id}
              type="button"
              onClick={() => handleSelect(suggestion)}
              className="w-full px-4 py-3 text-left text-sm hover:bg-primary/5 transition-colors border-b border-gray-50 last:border-0 flex items-start gap-2"
            >
              <MapPin size={16} className="text-primary mt-0.5 shrink-0" />
              <span className="text-text leading-snug">{suggestion.display_name}</span>
            </button>
          ))}
        </div>
      )}

      {/* Manual mode toggle */}
      <button
        type="button"
        onClick={toggleManualMode}
        className="text-xs text-primary hover:underline"
      >
        {isManualMode ? 'Search for address instead' : "Can't find your address? Enter it manually"}
      </button>
    </div>
  )
}
