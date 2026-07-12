import { describe, expect, it } from 'vitest'
import { resolveOpenAIImageSize } from './image_generation'

describe('resolveOpenAIImageSize', () => {
  it('maps GPT Image ratios to supported sizes', () => {
    expect(resolveOpenAIImageSize('gpt-image-1.5', '1:1')).toBe('1024x1024')
    expect(resolveOpenAIImageSize('gpt-image-1.5', '3:2')).toBe('1536x1024')
    expect(resolveOpenAIImageSize('gpt-image-1.5', '2:3')).toBe('1024x1536')
  })

  it('uses the documented DALL-E 3 landscape and portrait sizes', () => {
    expect(resolveOpenAIImageSize('dall-e-3', '16:9')).toBe('1792x1024')
    expect(resolveOpenAIImageSize('dall-e-3', '9:16')).toBe('1024x1792')
  })

  it('leaves automatic, invalid, and unsupported DALL-E 2 ratios unset', () => {
    expect(resolveOpenAIImageSize('gpt-image-1', 'auto')).toBeUndefined()
    expect(resolveOpenAIImageSize('gpt-image-1', 'wide')).toBeUndefined()
    expect(resolveOpenAIImageSize('dall-e-2', '3:2')).toBeUndefined()
  })
})

