import { describe, expect, it } from 'vitest'
import { shouldSyncMobileSystemBars } from './mobile_system_bars'

describe('shouldSyncMobileSystemBars', () => {
  it('enables native system-bar synchronization only for Android mobile builds', () => {
    expect(shouldSyncMobileSystemBars('mobile_app', 'android')).toBe(true)
    expect(shouldSyncMobileSystemBars('mobile_app', 'ios')).toBe(false)
    expect(shouldSyncMobileSystemBars('unknown', 'android')).toBe(false)
  })
})
