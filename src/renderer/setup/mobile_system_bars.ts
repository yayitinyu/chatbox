import { registerPlugin } from '@capacitor/core'
import { CHATBOX_BUILD_PLATFORM, CHATBOX_BUILD_TARGET } from '@/variables'

interface SakuraSystemBarsPlugin {
  setStyle(options: { dark: boolean }): Promise<void>
}

const SakuraSystemBars = registerPlugin<SakuraSystemBarsPlugin>('SakuraSystemBars')

export function shouldSyncMobileSystemBars(buildTarget: string, buildPlatform: string): boolean {
  return buildTarget === 'mobile_app' && buildPlatform === 'android'
}

export async function syncMobileSystemBarsTheme(theme: 'light' | 'dark'): Promise<void> {
  if (!shouldSyncMobileSystemBars(CHATBOX_BUILD_TARGET, CHATBOX_BUILD_PLATFORM)) {
    return
  }

  try {
    await SakuraSystemBars.setStyle({ dark: theme === 'dark' })
  } catch (error) {
    console.error('Failed to synchronize Android system bar appearance:', error)
  }
}
