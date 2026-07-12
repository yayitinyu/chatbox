import { describe, expect, it } from 'vitest'
import { ProviderOptionsSchema } from './settings'

describe('ProviderOptionsSchema', () => {
  it('accepts xhigh OpenAI reasoning effort and keeps auto unset', () => {
    expect(
      ProviderOptionsSchema.parse({
        openai: { reasoningEffort: 'xhigh' },
      }).openai?.reasoningEffort
    ).toBe('xhigh')

    expect(
      ProviderOptionsSchema.parse({
        openai: {},
      }).openai?.reasoningEffort
    ).toBeUndefined()
  })
})

