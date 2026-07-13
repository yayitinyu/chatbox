import { describe, expect, it } from 'vitest'
import { resolveAppViewportHeight } from './mobile_viewport'

describe('resolveAppViewportHeight', () => {
  it('uses the visual viewport when native resize is active', () => {
    expect(
      resolveAppViewportHeight({
        fullViewportHeight: 800,
        layoutViewportHeight: 500,
        visualViewportHeight: 500,
        keyboardHeight: 300,
        keyboardOpen: true,
      })
    ).toBe(500)
  })

  it('subtracts the keyboard height when a fullscreen WebView does not resize', () => {
    expect(
      resolveAppViewportHeight({
        fullViewportHeight: 800,
        layoutViewportHeight: 800,
        visualViewportHeight: 800,
        keyboardHeight: 300,
        keyboardOpen: true,
      })
    ).toBe(500)
  })

  it('ignores stale keyboard metrics after the keyboard closes', () => {
    expect(
      resolveAppViewportHeight({
        fullViewportHeight: 800,
        layoutViewportHeight: 800,
        visualViewportHeight: 780.4,
        keyboardHeight: 300,
        keyboardOpen: false,
      })
    ).toBe(780)
  })
})
