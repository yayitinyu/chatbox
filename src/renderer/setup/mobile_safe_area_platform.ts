export function shouldInitializeMobileSafeArea(buildTarget: string, buildPlatform: string): boolean {
  return buildTarget === 'mobile_app' && (buildPlatform === 'android' || buildPlatform === 'ios')
}
