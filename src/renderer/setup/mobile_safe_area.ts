// 这个库解决了移动端异形屏的显示安全区域的问题，比如iPhoneX，iPhone11等
// 这个库引入后，将设置全局的css变量 --mobile-safe-area-inset-top, --mobile-safe-area-inset-bottom, --mobile-safe-area-inset-left, --mobile-safe-area-inset-right
// 通过这些变量，可以在css中设置安全区域的padding，margin等，来规避异形屏的显示问题
// 为了达到最好的效果，在 html 的 meta 标签中设置 viewport-fit=cover

import { Keyboard } from '@capacitor/keyboard'
import { SafeArea } from 'capacitor-plugin-safe-area'
import { resolveAppViewportHeight } from './mobile_viewport'

type Insets = Record<'top' | 'right' | 'bottom' | 'left', number>

function applyInsets(insets: Insets) {
  for (const [key, value] of Object.entries(insets)) {
    document.documentElement.style.setProperty(`--mobile-safe-area-inset-${key}`, `${value}px`)
  }
}

async function refreshInsets() {
  try {
    const { insets } = await SafeArea.getSafeAreaInsets()
    applyInsets(insets)
  } catch (error) {
    console.error('Failed to read mobile safe-area insets:', error)
  }
}

let keyboardHeight = 0
let keyboardOpen = false
let fullViewportHeight = window.innerHeight

function syncViewportHeight() {
  const visualViewportHeight = window.visualViewport?.height

  if (!keyboardOpen) {
    fullViewportHeight = Math.max(window.innerHeight, visualViewportHeight ?? 0)
  }

  const height = resolveAppViewportHeight({
    fullViewportHeight,
    layoutViewportHeight: window.innerHeight,
    visualViewportHeight,
    keyboardHeight,
    keyboardOpen,
  })

  document.documentElement.style.setProperty('--app-viewport-height', `${height}px`)
}

function syncViewportHeightAfterLayout() {
  syncViewportHeight()
  requestAnimationFrame(() => requestAnimationFrame(syncViewportHeight))
}

void refreshInsets()
syncViewportHeight()

window.visualViewport?.addEventListener('resize', syncViewportHeight)
window.addEventListener('resize', syncViewportHeight)

void SafeArea.addListener('safeAreaChanged', ({ insets }) => {
  applyInsets(insets)
}).catch((error) => {
  console.error('Failed to listen for mobile safe-area changes:', error)
})

void Keyboard.addListener('keyboardWillShow', (info) => {
  keyboardOpen = true
  keyboardHeight = info.keyboardHeight
  document.documentElement.dataset.mobileKeyboardOpen = 'true'
  document.documentElement.style.setProperty('--mobile-safe-area-inset-bottom', '0px')
  window.scrollTo(0, 0)
  syncViewportHeightAfterLayout()
}).catch((error) => {
  console.error('Failed to listen for the mobile keyboard opening:', error)
})

void Keyboard.addListener('keyboardWillHide', () => {
  keyboardOpen = false
  keyboardHeight = 0
  delete document.documentElement.dataset.mobileKeyboardOpen
  syncViewportHeightAfterLayout()
  void refreshInsets()
}).catch((error) => {
  console.error('Failed to listen for the mobile keyboard closing:', error)
})
