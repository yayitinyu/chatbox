import { Image, useComputedColorScheme } from '@mantine/core'
import type { ModelProvider } from '@shared/types'
import { useEffect, useState } from 'react'
import { renderModelIcon } from '@/utils/modelLogo'
import ProviderImageIcon from './ProviderImageIcon'

interface ModelIconProps {
  modelId: string
  providerId?: ModelProvider | string
  iconUrl?: string
  size?: number
  className?: string
}

/**
 * Display a model-specific icon with fallback to provider icon.
 * Uses @lobehub/icons for model-specific icons with proper dark mode support.
 *
 * Priority:
 * 1. Custom model icon
 * 2. Model-specific icon (based on modelId)
 * 3. Provider/channel icon (if providerId is provided)
 * 4. First letter avatar (as final fallback)
 */
export function ModelIcon({ modelId, providerId, iconUrl, size = 16, className }: ModelIconProps) {
  const colorScheme = useComputedColorScheme('light')
  const isDarkMode = colorScheme === 'dark'
  const [failedIconUrl, setFailedIconUrl] = useState<string>()

  useEffect(() => {
    setFailedIconUrl(undefined)
  }, [iconUrl])

  if (iconUrl && failedIconUrl !== iconUrl) {
    return (
      <Image
        src={iconUrl}
        alt={`${modelId} icon`}
        w={size}
        h={size}
        radius="sm"
        fit="contain"
        className={className}
        onError={() => setFailedIconUrl(iconUrl)}
      />
    )
  }

  const icon = renderModelIcon(modelId, size, isDarkMode)

  if (icon) {
    return (
      <div
        className={className}
        style={{
          width: size,
          height: size,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
    )
  }

  // Fall back to the configured channel icon when the model is unknown.
  if (providerId) {
    return <ProviderImageIcon provider={providerId} size={size} className={className} />
  }

  // Final fallback: first letter avatar
  const firstLetter = modelId.charAt(0).toUpperCase()
  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: 'var(--mantine-color-gray-3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.6,
        fontWeight: 500,
        color: 'var(--mantine-color-gray-7)',
      }}
    >
      {firstLetter}
    </div>
  )
}
