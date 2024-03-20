import { useState } from "react"

import {
  type CountryCallingCode,
  type E164Number,
  getExampleNumber,
  isValidPhoneNumber as matchIsValidPhoneNumber,
  parsePhoneNumber,
} from "libphonenumber-js"
import i18nIsoCountries from "i18n-iso-countries"
import enCountries from "i18n-iso-countries/langs/en.json"
import PhoneInput, { type Country } from "react-phone-number-input/input"
import examples from "libphonenumber-js/mobile/examples"
import { Input } from "../ui/input"

import { ComboboxCountryInput } from "./combobox"
import {
  getCountriesOptions,
  isoToEmoji,
  replaceNumbersWithZeros,
} from "./helpers"
import { cn } from "../../utils/utils"

type CountryOption = {
  value: Country
  label: string
  indicatif: CountryCallingCode
}

i18nIsoCountries.registerLocale(enCountries)

export const PhoneInputShadcnUiPhoneInput = () => {
  const options = getCountriesOptions()

  // You can use a the country of the phone number to set the default country
  const defaultCountry = parsePhoneNumber("+33606060606")?.country
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
    <div className="not-prose mt-8 flex flex-col gap-4">
      <div className="flex gap-2">
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
