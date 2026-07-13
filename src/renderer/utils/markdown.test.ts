import { describe, expect, it } from 'vitest'
import { getMarkdownCitationNumber, normalizeMarkdownEmphasis } from './markdown'

describe('getMarkdownCitationNumber', () => {
  it('recognizes linked reference labels with or without brackets', () => {
    expect(getMarkdownCitationNumber('1')).toBe(1)
    expect(getMarkdownCitationNumber('[12]')).toBe(12)
    expect(getMarkdownCitationNumber(['[', '3', ']'])).toBe(3)
  })

  it('leaves regular links and invalid reference numbers unchanged', () => {
    expect(getMarkdownCitationNumber('Open source')).toBeNull()
    expect(getMarkdownCitationNumber('0')).toBeNull()
    expect(getMarkdownCitationNumber('1000')).toBeNull()
    expect(getMarkdownCitationNumber({ type: 'span' })).toBeNull()
  })
})

describe('normalizeMarkdownEmphasis', () => {
  it('repairs whitespace inside paired strong delimiters', () => {
    expect(normalizeMarkdownEmphasis('A ** highlighted text ** example.')).toBe('A **highlighted text** example.')
    expect(normalizeMarkdownEmphasis('A __ highlighted text__ example.')).toBe('A __highlighted text__ example.')
  })

  it('normalizes full-width strong markers emitted in CJK text', () => {
    expect(normalizeMarkdownEmphasis('这是＊＊ 重点内容 ＊＊。')).toBe('这是**重点内容**。')
  })

  it('repairs strong emphasis ending in CJK punctuation before CJK text', () => {
    const input = '老实说……**我没听说过真实的「樱花大福杀人事件」**哦。'

    expect(normalizeMarkdownEmphasis(input)).toBe('老实说……**我没听说过真实的「樱花大福杀人事件」**&#8203;哦。')
  })

  it('repairs strong emphasis starting with CJK punctuation after CJK text', () => {
    expect(normalizeMarkdownEmphasis('请看**「重点」**正文。')).toBe('请看&#8203;**「重点」**&#8203;正文。')
  })

  it('preserves combined strong and italic delimiters', () => {
    expect(normalizeMarkdownEmphasis('This is ***very important***.')).toBe('This is ***very important***.')
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
