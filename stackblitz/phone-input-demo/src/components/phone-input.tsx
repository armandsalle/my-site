import { useState } from "react"
import type { Country } from "react-phone-number-input/input"
import PhoneInput from "react-phone-number-input/input"
import {
  type E164Number,
  getExampleNumber,
  isValidPhoneNumber as matchIsValidPhoneNumber,
  parsePhoneNumberWithError,
} from "libphonenumber-js"
import examples from "libphonenumber-js/mobile/examples"
import i18nIsoCountries from "i18n-iso-countries"
import enCountries from "i18n-iso-countries/langs/en.json"
import { cn } from "../utils/cn"
import { Input } from "./ui/input"
import { ComboboxCountryInput } from "./combobox"
import {
  getCountriesOptions,
  isoToEmoji,
  replaceNumbersWithZeros,
} from "./helpers"

type CountryOption = {
  value: Country
  label: string
  indicatif: string
}

i18nIsoCountries.registerLocale(enCountries)

export const PhoneInputShadcnUiPhoneInput = () => {
  const options = getCountriesOptions()
  const defaultCountry = (() => {
    try {
      return parsePhoneNumberWithError("+33606060606").country
    } catch {
      return undefined
    }
  })()
  const defaultCountryOption = options.find(
    (option) => option.value === defaultCountry,
  )

  const [country, setCountry] = useState<CountryOption>(
    defaultCountryOption || options[0]!,
  )
  const [phoneNumber, setPhoneNumber] = useState<E164Number>()

  const placeholder = replaceNumbersWithZeros(
    getExampleNumber(country.value, examples)!.formatInternational(),
  )

  const onCountryChange = (value: CountryOption) => {
    setPhoneNumber(undefined)
    setCountry(value)
  }

  const isValidPhoneNumber = matchIsValidPhoneNumber(phoneNumber ?? "")

  return (
    <div className="mt-8 flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        <ComboboxCountryInput
          value={country}
          onValueChange={onCountryChange}
          options={options}
          placeholder="Find your country..."
          renderOption={({ option }) =>
            `${isoToEmoji(option.value)} ${option.label}`
          }
          renderValue={(option) => option.label}
          emptyMessage="No country found."
        />
        <PhoneInput
          international
          withCountryCallingCode
          country={country.value.toUpperCase() as Country}
          value={phoneNumber}
          inputComponent={Input}
          placeholder={placeholder}
          onChange={(value) => {
            setPhoneNumber(value)
          }}
        />
      </div>
      <span className="text-sm">country: {country.label}</span>
      <span className="text-sm">indicatif: {country.indicatif}</span>
      <span className="text-sm">placeholder: {placeholder}</span>
      <span className="text-sm">value: {phoneNumber}</span>
      <span
        className={cn(
          "text-sm",
          isValidPhoneNumber ? "text-green-500" : "text-red-500",
        )}
      >
        isValid: {isValidPhoneNumber ? "true" : "false"}
      </span>
    </div>
  )
}
