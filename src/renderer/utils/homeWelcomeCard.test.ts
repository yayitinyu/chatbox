import { describe, expect, it } from 'vitest'
import { getHomeWelcomeCardMode } from './homeWelcomeCard'

describe('getHomeWelcomeCardMode', () => {
  it('returns none when at least one provider is configured', () => {
    expect(
      getHomeWelcomeCardMode({
        providerCount: 1,
        isLoggedIn: false,
        hasLicense: false,
        hasExpiredLicense: false,
      })
    ).toBe('none')
  })

  it('returns setup when no local provider is configured', () => {
    expect(
      getHomeWelcomeCardMode({
        providerCount: 0,
        isLoggedIn: true,
        hasLicense: true,
        hasExpiredLicense: true,
      })
    ).toBe('setup')
  })
})
