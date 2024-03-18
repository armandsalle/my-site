import {
  type CountryCode,
  getCountries,
  getCountryCallingCode,
} from "libphonenumber-js"
import i18nIsoCountries from "i18n-iso-countries"

/**
 * Source: https://grafikart.fr/tutoriels/drapeau-emoji-fonction-2152
 * @param code fr, en, de...
 * @returns the emoji flag (🇫🇷, 🇬🇧, 🇩🇪)
 */
export function isoToEmoji(code: string) {
  return code
    .split("")
    .map((letter) => (letter.charCodeAt(0) % 32) + 0x1f1e5)
    .map((emojiCode) => String.fromCodePoint(emojiCode))
    .join("")
}

/**
 * Get all countries options
 * @returns array of countries options
 *
 * @example
 * getCountriesOptions() // [{value: "DE", label: "Germany", indicatif: "+49"}, ...]
 */
export function getCountriesOptions() {
  const countries = getCountries()

  // Type inference is not working here
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

/**
 *
 * @param phoneNumber international phone number
 * @returns phone number with digits replaced with zeros
 *
 * @example
 * replaceNumbersWithZeros("+1 123 456 7890") // +1 000 000 0000
 */
export function replaceNumbersWithZeros(phoneNumber: string): string {
  // Split the phone number into country code and the rest of the number
  const [countryCode, ...restOfNumber] = phoneNumber.split(/\s+/)

  // Replace digits in the rest of the number with zeros
  const replacedRestOfNumber = restOfNumber
    .map((num) => num.replace(/\d/g, "0"))
    .join(" ")

  // Concatenate the country code and the replaced number
  const replacedPhoneNumber =
    (countryCode as string) + " " + replacedRestOfNumber

  return replacedPhoneNumber
}
