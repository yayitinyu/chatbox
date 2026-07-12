export type HomeWelcomeCardMode = 'none' | 'setup'

export function getHomeWelcomeCardMode(params: {
  providerCount: number
  isLoggedIn: boolean
  hasLicense: boolean
  hasExpiredLicense: boolean
}): HomeWelcomeCardMode {
  return params.providerCount > 0 ? 'none' : 'setup'
}
