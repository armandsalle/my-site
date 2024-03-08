"use client"

import * as React from "react"
import { Check } from "lucide-react"

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { CaretSortIcon } from "@radix-ui/react-icons"
import { isoToEmoji } from "./_helpers"

export type Option = Record<"value" | "label", string> & Record<string, string>

type ComboboxCountryInputProps<T extends Option> = {
  value: T
  onValueChange: (value: T) => void
  options: T[]
  renderOption: ({ option, isSelected }: { option: T; isSelected: boolean }) => React.ReactNode
  renderValue: (option: T) => string
  emptyMessage: string
  placeholder?: string
  className?: string
}

export function ComboboxCountryInput<T extends Option>({
  value,
  onValueChange,
  options,
  renderOption,
  renderValue,
  placeholder,
  emptyMessage,
}: ComboboxCountryInputProps<T>) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="self-start justify-between bg-white">
          {value.value ? isoToEmoji(value.value) : "Select framework..."}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-2 pb-0" align="start">
        <Command>
          <CommandInput placeholder={placeholder} className="h-9" />
          <CommandEmpty>{emptyMessage}</CommandEmpty>
          <CommandGroup className="h-full max-h-48 overflow-auto mt-2 p-0 [&_div[cmdk-group-items]]:flex [&_div[cmdk-group-items]]:flex-col [&_div[cmdk-group-items]]:gap-1">
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
                  {isSelected ? <Check className="mr-2 ml-auto h-4 w-4" /> : null}
                </CommandItem>
              )
            })}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
