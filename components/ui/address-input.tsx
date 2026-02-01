'use client'

import * as React from 'react'
import { Check, MapPin, Loader2 } from 'lucide-react'
import { useDebounce } from 'use-debounce'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

interface AddressInputProps {
  value: string
  // Updated signature to return coordinates
  onAddressSelect: (address: string, lat?: number, lon?: number) => void 
  className?: string
  placeholder?: string
}

interface BanFeature {
  geometry: {
    coordinates: [number, number] // [lon, lat]
  }
  properties: {
    id: string
    label: string
    context: string
  }
}

export function AddressInput({ value, onAddressSelect, className, placeholder = "Search address..." }: AddressInputProps) {
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState(value)
  const [debouncedValue] = useDebounce(inputValue, 300)
  const [suggestions, setSuggestions] = React.useState<BanFeature[]>([])
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    if (value !== inputValue) setInputValue(value)
  }, [value])

  React.useEffect(() => {
    const fetchAddress = async () => {
      if (!debouncedValue || debouncedValue.length < 3) return
      setLoading(true)
      try {
        const response = await fetch(
          `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(debouncedValue)}&limit=5&autocomplete=1`
        )
        const data = await response.json()
        setSuggestions(data.features || [])
      } catch (error) {
        console.error("Failed to fetch addresses:", error)
      } finally {
        setLoading(false)
      }
    }
    if (open) fetchAddress()
  }, [debouncedValue, open])

  const handleSelect = (feature: BanFeature) => {
    const address = feature.properties.label
    const [lon, lat] = feature.geometry.coordinates
    
    setInputValue(address)
    onAddressSelect(address, lat, lon) // Pass data back
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between bg-white/50 dark:bg-black/20 border-white/10 text-left font-normal",
            !value && "text-muted-foreground",
            className
          )}
        >
          <span className="truncate flex items-center gap-2">
            {value || <span className="text-muted-foreground">{placeholder}</span>}
          </span>
          {loading ? <Loader2 className="ml-2 h-4 w-4 animate-spin opacity-50" /> : <MapPin className="ml-2 h-4 w-4 opacity-50" />}
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0 bg-white/95 dark:bg-black/90 backdrop-blur-xl border-white/10" align="start">
        <Command shouldFilter={false} className="bg-transparent">
          <CommandInput placeholder="Type address..." value={inputValue} onValueChange={setInputValue} className="border-none focus:ring-0" />
          <CommandList>
            {!loading && suggestions.length === 0 && debouncedValue.length >= 3 && (
              <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">No address found.</CommandEmpty>
            )}
            {!loading && suggestions.map((feature) => (
              <CommandItem
                key={feature.properties.id}
                value={feature.properties.label}
                onSelect={() => handleSelect(feature)}
                className="cursor-pointer aria-selected:bg-indigo-50 dark:aria-selected:bg-indigo-900/20"
              >
                <Check className={cn("mr-2 h-4 w-4 text-indigo-500", value === feature.properties.label ? "opacity-100" : "opacity-0")} />
                <div className="flex flex-col">
                  <span className="font-medium">{feature.properties.label}</span>
                  <span className="text-xs text-muted-foreground">{feature.properties.context}</span>
                </div>
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}