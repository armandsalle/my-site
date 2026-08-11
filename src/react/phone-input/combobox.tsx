import * as React from "react"
import { Check } from "lucide-react"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { CaretSortIcon } from "@radix-ui/react-icons"
import { parsePhoneNumberFromString } from "libphonenumber-js"
import { FlagComponent } from "react-phone-number-input"
import type { CountryCode } from "libphonenumber-js"

export type Option = Record<"value" | "label", string> & Record<string, string>

type ComboboxCountryInputProps<T extends Option> = {
  value: T
  onValueChange: (value: T) => void
  options: T[]
  renderOption: ({
    option,
    isSelected,
  }: {
    option: T
    isSelected: boolean
  }) => React.ReactNode
  renderValue: (option: T) => string
  emptyMessage: string
  placeholder?: string
  className?: string
  phoneNumber?: string
}

export function ComboboxCountryInput<T extends Option>({
  value,
  onValueChange,
  options,
  renderOption,
  renderValue,
  placeholder,
  emptyMessage,
  phoneNumber,
}: ComboboxCountryInputProps<T>) {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    if (phoneNumber && phoneNumber.length > 0) {
      const parsed = parsePhoneNumberFromString(phoneNumber)
      if (parsed && parsed.country && value.value !== parsed.country) {
        const matchingOption = options.find((opt) => opt.value === parsed.country)
        if (matchingOption) {
          onValueChange(matchingOption)
        }
      }
    }
  }, [phoneNumber, options, value, onValueChange])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          role="combobox"
          aria-expanded={open}
          className="inline-flex h-10 items-center justify-between self-start rounded-md border border-stone-200 bg-white px-4 py-2 text-sm font-medium ring-offset-white transition-colors hover:bg-stone-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 "
        >
          {value.value ? (
            <div className="flex items-center gap-2">
              <FlagComponent
                country={value.value as CountryCode}
                countryName={value.label}
              />
              <span>{value.label}</span>
            </div>
          ) : (
            "Select country..."
          )}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-2 pb-0" align="start">
        <Command>
          <CommandInput placeholder={placeholder} className="h-9" />
          <CommandEmpty>{emptyMessage}</CommandEmpty>
          <CommandList>
            <CommandGroup className="mt-2 h-full max-h-48 overflow-auto p-0 [&_div[cmdk-group-items]]:flex [&_div[cmdk-group-items]]:flex-col [&_div[cmdk-group-items]]:gap-1">
              {options.map((option) => {
                const isSelected = value.value === option.value

                return (
                  <CommandItem
                    key={option.value}
                    value={renderValue(option)}
                    onSelect={() => {
                      onValueChange(option)
                      setOpen(false)
                    }}
                  >
                    {renderOption({ option, isSelected: isSelected })}
                    {isSelected ? (
                      <Check className="ml-auto mr-2 h-4 w-4" />
                    ) : null}
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
