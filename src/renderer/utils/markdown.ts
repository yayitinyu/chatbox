const PROTECTED_MARKDOWN_PATTERN = /(```[\s\S]*?(?:```|$)|~~~[\s\S]*?(?:~~~|$)|`+[^`\n]*`+)/g
const ASTERISK_STRONG_PAIR_PATTERN = /(?<![\\*])\*\*(?!\*)([^\r\n]*?)(?<!\*)\*\*(?!\*)/g
const UNDERSCORE_STRONG_PAIR_PATTERN = /(?<![\\_])__(?!_)([^\r\n]*?)(?<!_)__(?!_)/g
const UNICODE_PUNCTUATION_OR_SYMBOL_PATTERN = /^[\p{P}\p{S}]$/u

function flattenCitationText(value: unknown): string | null {
  if (typeof value === 'string' || typeof value === 'number') {
    return String(value)
  }
  if (Array.isArray(value)) {
    const parts = value.map(flattenCitationText)
    return parts.some((part) => part === null) ? null : parts.join('')
  }
  return null
}

/** Returns a positive citation number for numeric Markdown links such as [1](url). */
export function getMarkdownCitationNumber(value: unknown): number | null {
  const text = flattenCitationText(value)?.trim()
  const match = text?.match(/^\[?([1-9]\d{0,2})\]?$/)
  return match ? Number(match[1]) : null
}

function isWordLike(character: string | undefined): boolean {
  return !!character && !/\s/u.test(character) && !UNICODE_PUNCTUATION_OR_SYMBOL_PATTERN.test(character)
}

function normalizeStrongPairs(segment: string, pattern: RegExp, marker: '**' | '__'): string {
  return segment.replace(pattern, (match, content: string, offset: number, source: string) => {
    const normalizedContent = content.trim()
    if (!normalizedContent) {
      return match
    }

    const previousCharacter = source[offset - 1]
    const nextCharacter = source[offset + match.length]
    const startsWithPunctuation = UNICODE_PUNCTUATION_OR_SYMBOL_PATTERN.test(normalizedContent[0])
    const endsWithPunctuation = UNICODE_PUNCTUATION_OR_SYMBOL_PATTERN.test(
      normalizedContent[normalizedContent.length - 1]
    )

    // CommonMark does not recognize strong delimiters when punctuation inside
    // the pair touches a word-like CJK character outside it. Character
    // references create an invisible boundary without changing visible text.
    const prefix = startsWithPunctuation && isWordLike(previousCharacter) ? '&#8203;' : ''
    const suffix = endsWithPunctuation && isWordLike(nextCharacter) ? '&#8203;' : ''

    return `${prefix}${marker}${normalizedContent}${marker}${suffix}`
  })
}

function normalizeStrongPairSpacing(segment: string): string {
  const normalizedFullWidthMarkers = segment.replace(/＊＊([^\r\n]+?)＊＊/g, (_match, content: string) => {
    const normalizedContent = content.trim()
    return normalizedContent ? `**${normalizedContent}**` : _match
  })

  return normalizeStrongPairs(
    normalizeStrongPairs(normalizedFullWidthMarkers, ASTERISK_STRONG_PAIR_PATTERN, '**'),
    UNDERSCORE_STRONG_PAIR_PATTERN,
    '__'
  )
}

/**
 * Repairs common model-generated strong-emphasis mistakes without touching code.
 *
 * CommonMark intentionally rejects whitespace directly inside ** delimiters.
 * Models still emit forms such as `** important **`, especially while
 * streaming. Normalizing those paired delimiters keeps the source readable and
 * lets the standard remark parser handle the final AST.
 */
export function normalizeMarkdownEmphasis(markdown: string): string {
  return markdown
    .split(PROTECTED_MARKDOWN_PATTERN)
    .map((segment, index) => (index % 2 === 1 ? segment : normalizeStrongPairSpacing(segment)))
    .join('')
}
