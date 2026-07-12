import { describe, expect, it } from 'vitest'
import { normalizeMarkdownEmphasis } from './markdown'

describe('normalizeMarkdownEmphasis', () => {
  it('repairs whitespace inside paired strong delimiters', () => {
    expect(normalizeMarkdownEmphasis('A ** highlighted text ** example.')).toBe(
      'A **highlighted text** example.'
    )
    expect(normalizeMarkdownEmphasis('A __ highlighted text__ example.')).toBe(
      'A __highlighted text__ example.'
    )
  })

  it('normalizes full-width strong markers emitted in CJK text', () => {
    expect(normalizeMarkdownEmphasis('这是＊＊ 重点内容 ＊＊。')).toBe('这是**重点内容**。')
  })

  it('does not rewrite fenced or inline code', () => {
    const input = ['`** code **`', '', '```md', '** fenced **', '```', '', '** prose **'].join('\n')
    const output = normalizeMarkdownEmphasis(input)

    expect(output).toContain('`** code **`')
    expect(output).toContain('** fenced **')
    expect(output).toContain('**prose**')
  })

  it('leaves unmatched streaming delimiters untouched', () => {
    expect(normalizeMarkdownEmphasis('Partial ** bold')).toBe('Partial ** bold')
  })

  it('preserves escaped delimiters', () => {
    expect(normalizeMarkdownEmphasis('\\** literal **')).toBe('\\** literal **')
  })
})

