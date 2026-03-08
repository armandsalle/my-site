import {
  type CountryCode,
  getCountries,
  getCountryCallingCode,
} from "libphonenumber-js"
import i18nIsoCountries from "i18n-iso-countries"

export function isoToEmoji(code: string) {
  return code
    .split("")
    .map((letter) => (letter.charCodeAt(0) % 32) + 0x1f1e5)
    .map((emojiCode) => String.fromCodePoint(emojiCode))
    .join("")
}

export function getCountriesOptions() {
  const countries = getCountries()

  const options = countries
    .map((country) => ({
      value: country,
      label: i18nIsoCountries.getName(country.toUpperCase(), "en", {
        select: "official",
      }),
      indicatif: `+${getCountryCallingCode(country)}`,
    }))
    .filter((option) => option.label) as {
    value: CountryCode
    label: string
    indicatif: string
  }[]

  return options
}

export function replaceNumbersWithZeros(phoneNumber: string): string {
  const [countryCode, ...restOfNumber] = phoneNumber.split(/\s+/)
  const replacedRestOfNumber = restOfNumber
    .map((num) => num.replace(/\d/g, "0"))
    .join(" ")

  return `${countryCode as string} ${replacedRestOfNumber}`
}
