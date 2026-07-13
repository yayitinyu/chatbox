import { describe, expect, it } from 'vitest'
import { ProviderModelInfoSchema, ProviderSettingsSchema } from './settings'

describe('provider icon settings', () => {
  it('preserves provider and model icon URLs', () => {
    const parsed = ProviderSettingsSchema.parse({
      iconUrl: 'https://example.com/provider.png',
      models: [
        {
          modelId: 'custom-model',
          iconUrl: 'https://example.com/model.png',
        },
      ],
    })

    expect(parsed.iconUrl).toBe('https://example.com/provider.png')
    expect(parsed.models?.[0]?.iconUrl).toBe('https://example.com/model.png')
  })

  it('keeps icon URLs optional for existing settings', () => {
    expect(ProviderModelInfoSchema.parse({ modelId: 'legacy-model' }).iconUrl).toBeUndefined()
    expect(ProviderSettingsSchema.parse({}).iconUrl).toBeUndefined()
  })
})
