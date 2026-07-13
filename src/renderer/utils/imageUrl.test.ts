import { describe, expect, it } from 'vitest'
import { normalizeImageUrl } from './imageUrl'

describe('normalizeImageUrl', () => {
  it('accepts trimmed HTTP and HTTPS image URLs', () => {
    expect(normalizeImageUrl('  https://example.com/avatar.png?size=2  ')).toBe('https://example.com/avatar.png?size=2')
    expect(normalizeImageUrl('http://example.com/background.jpg')).toBe('http://example.com/background.jpg')
  })

  it('rejects empty, relative, and unsafe URLs', () => {
    expect(normalizeImageUrl('')).toBeNull()
    expect(normalizeImageUrl('/avatar.png')).toBeNull()
    expect(normalizeImageUrl('data:image/svg+xml,<svg></svg>')).toBeNull()
    expect(normalizeImageUrl('javascript:alert(1)')).toBeNull()
  })
})
