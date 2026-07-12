const PROTECTED_MARKDOWN_PATTERN = /(```[\s\S]*?(?:```|$)|~~~[\s\S]*?(?:~~~|$)|`+[^`\n]*`+)/g

function normalizeStrongPairSpacing(segment: string): string {
  return segment
    .replace(/(\*\*|__)([^\r\n]*?)\1/g, (match, marker: string, content: string, offset: number, source: string) => {
      if (offset > 0 && source[offset - 1] === '\\') {
        return match
      }

      const normalizedContent = content.trim()
      if (!normalizedContent || normalizedContent === content) {
        return match
      }

      return `${marker}${normalizedContent}${marker}`
    })
    .replace(/＊＊([^\r\n]+?)＊＊/g, (_match, content: string) => {
      const normalizedContent = content.trim()
      return normalizedContent ? `**${normalizedContent}**` : _match
    })
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

