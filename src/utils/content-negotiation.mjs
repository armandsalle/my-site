const SUPPORTED_TYPES = ["text/html", "text/markdown"]

function parseMediaRange(value, index) {
  const [rawType, ...parameters] = value.split(";")
  const type = rawType.trim().toLowerCase()

  if (!/^([a-z0-9!#$&^_.+-]+|\*)\/([a-z0-9!#$&^_.+-]+|\*)$/.test(type)) {
    return null
  }

  let quality = 1
  for (const parameter of parameters) {
    const [name, rawValue] = parameter.split("=")
    if (name?.trim().toLowerCase() !== "q") continue

    const parsedQuality = Number(rawValue?.trim())
    quality = Number.isFinite(parsedQuality)
      ? Math.min(1, Math.max(0, parsedQuality))
      : 0
  }

  const [major, minor] = type.split("/")
  const specificity = major === "*" ? 0 : minor === "*" ? 1 : 2

  return { type, quality, specificity, index }
}

function rangeMatches(range, supportedType) {
  const [rangeMajor, rangeMinor] = range.type.split("/")
  const [typeMajor, typeMinor] = supportedType.split("/")

  return (
    (rangeMajor === "*" || rangeMajor === typeMajor) &&
    (rangeMinor === "*" || rangeMinor === typeMinor)
  )
}

export function negotiateContentType(acceptHeader) {
  if (!acceptHeader?.trim()) return "text/html"

  const ranges = acceptHeader.split(",").map(parseMediaRange).filter(Boolean)

  const candidates = SUPPORTED_TYPES.map((type, serverPreference) => {
    const matches = ranges.filter((range) => rangeMatches(range, type))
    if (matches.length === 0) return null

    matches.sort(
      (left, right) =>
        right.specificity - left.specificity || left.index - right.index,
    )

    const match = matches[0]
    return {
      type,
      quality: match.quality,
      specificity: match.specificity,
      clientPreference: match.index,
      serverPreference,
    }
  }).filter((candidate) => candidate && candidate.quality > 0)

  candidates.sort(
    (left, right) =>
      right.quality - left.quality ||
      right.specificity - left.specificity ||
      left.clientPreference - right.clientPreference ||
      left.serverPreference - right.serverPreference,
  )

  return candidates[0]?.type ?? null
}

export function appendVary(headers, field) {
  const values = new Set(
    (headers.get("Vary") ?? "")
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean),
  )
  values.add(field)
  headers.set("Vary", [...values].join(", "))
}
