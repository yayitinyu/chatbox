export interface MobileViewportMetrics {
  fullViewportHeight: number
  layoutViewportHeight: number
  visualViewportHeight?: number
  keyboardHeight: number
  keyboardOpen: boolean
}

function validHeight(value: number | undefined): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0
}

/**
 * Resolves the visible app height across native resize and fullscreen WebView modes.
 * Some Android WebViews report an unchanged visual viewport while the keyboard is
 * open, so the native keyboard height remains the final fallback.
 */
export function resolveAppViewportHeight(metrics: MobileViewportMetrics): number {
  const layoutHeight = validHeight(metrics.layoutViewportHeight) ? metrics.layoutViewportHeight : 1
  const visibleHeight = validHeight(metrics.visualViewportHeight)
    ? Math.min(layoutHeight, metrics.visualViewportHeight)
    : layoutHeight

  if (!metrics.keyboardOpen || !validHeight(metrics.keyboardHeight)) {
    return Math.max(1, Math.round(visibleHeight))
  }

  const fullHeight = validHeight(metrics.fullViewportHeight) ? metrics.fullViewportHeight : layoutHeight
  const keyboardAdjustedHeight = Math.max(1, fullHeight - metrics.keyboardHeight)
  return Math.max(1, Math.round(Math.min(visibleHeight, keyboardAdjustedHeight)))
}
