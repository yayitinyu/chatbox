import { describe, expect, it } from 'vitest'
import { shouldInitializeMobileSafeArea } from './mobile_safe_area_platform'

describe('shouldInitializeMobileSafeArea', () => {
  it('initializes native insets on Android and iOS mobile builds', () => {
    expect(shouldInitializeMobileSafeArea('mobile_app', 'android')).toBe(true)
    expect(shouldInitializeMobileSafeArea('mobile_app', 'ios')).toBe(true)
  })

  it('does not load native plugins for web or desktop builds', () => {
    expect(shouldInitializeMobileSafeArea('mobile_app', 'web')).toBe(false)
    expect(shouldInitializeMobileSafeArea('unknown', 'android')).toBe(false)
  })
})
