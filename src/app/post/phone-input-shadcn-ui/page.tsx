"use client"

import { link, p } from "@/components/typography"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Github } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

import {
  CountryCallingCode,
  E164Number,
  getExampleNumber,
  isValidPhoneNumber,
  parsePhoneNumber,
} from "libphonenumber-js"
import { registerLocale } from "i18n-iso-countries"
import enCountries from "i18n-iso-countries/langs/en.json"
import PhoneInput, { Country } from "react-phone-number-input/input"
import examples from "libphonenumber-js/mobile/examples"
import { Input } from "@/components/ui/input"

import { ComboboxCountryInput } from "./_combobox"
import { getCountriesOptions, isoToEmoji, replaceNumbersWithZeros } from "./_helpers"

registerLocale(enCountries)

type CountryOption = {
  value: Country
  label: string
  indicatif: CountryCallingCode
}

export default function Post() {
  const options = getCountriesOptions()

  const defaultCountry = parsePhoneNumber("+33604025368")?.country
  const defaultCountryOption = options.find((option) => option.value === defaultCountry)

  const [country, setCountry] = useState<CountryOption>(defaultCountryOption || options[0]!)
  const [phoneNumber, setPhoneNumber] = useState<E164Number>()

  const placeholder = replaceNumbersWithZeros(getExampleNumber(country.value, examples)!.formatInternational())

  const onCountryChange = (value: CountryOption) => {
    setPhoneNumber(undefined)
    setCountry(value)
  }

  return (
    <main className="mx-auto my-12 max-w-[33.75rem] px-6 text-black antialiased sm:my-32">
      <Button asChild variant="ghost">
        <Link href="/">
          <ChevronLeft size={16} className="mr-2" />
          Get back to the homepage
        </Link>
      </Button>
      <header className="flex flex-col gap-2 items-start mt-6">
        <p className={p}>
          This is a demo of a custom phone number component built with{" "}
          <Link href="https://ui.shadcn.com/" target="_blank" className={link}>
            Shadcn UI
          </Link>
          . Feel free to play around with it and customize it to your needs.
        </p>
        <Button asChild size="sm" variant="default">
          <Link
            href="https://github.com/armandsalle/my-site/blob/main/src/app/post/phone-input-shadcn-ui/page.tsx"
            target="_blank"
          >
            <Github size={16} className="mr-2" />
            Get the source code here
          </Link>
        </Button>
      </header>
      <div className="flex flex-col gap-4 mt-8">
        <div className="flex gap-2">
          <ComboboxCountryInput
            value={country}
            onValueChange={onCountryChange}
            options={options}
            placeholder="Find your country..."
            renderOption={({ option }) => `${isoToEmoji(option.value)} ${option.label}`}
            renderValue={(option) => option.label}
            emptyMessage="No country found."
          />
          <PhoneInput
            international
            withCountryCallingCode
            country={country.value.toUpperCase() as Country}
            value={phoneNumber}
            inputComponent={Input}
            // className="text-red-500 border-red-500"
            placeholder={placeholder}
            onChange={(value) => {
              setPhoneNumber(value)
              // setValue("owner_phone", value as Value, { shouldValidate: true })
            }}
          />
        </div>
        <span className="text-sm">value: {phoneNumber}</span>
        <span className="text-sm">isValid: {isValidPhoneNumber(phoneNumber ?? "") ? "true" : "false"}</span>
      </div>
    </main>
  )
}
