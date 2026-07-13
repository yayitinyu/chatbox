export function normalizeImageUrl(value: string): string | null {
  const trimmedValue = value.trim()
  if (!trimmedValue) {
    return null
  }

  try {
    const url = new URL(trimmedValue)
    return url.protocol === 'https:' || url.protocol === 'http:' ? trimmedValue : null
  } catch {
    return null
  }
}
