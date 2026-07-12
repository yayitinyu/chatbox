export type ImageSize = `${number}x${number}`

/**
 * Converts a friendly aspect ratio into a size accepted by OpenAI image APIs.
 * OpenAI image models ignore the generic aspectRatio option.
 */
export function resolveOpenAIImageSize(modelId: string, aspectRatio?: string): ImageSize | undefined {
  if (!aspectRatio || aspectRatio === 'auto') {
    return undefined
  }

  const [width, height] = aspectRatio.split(':').map(Number)
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    return undefined
  }

  if (width === height) {
    return '1024x1024'
  }

  const isLandscape = width > height
  if (/dall-e-3/i.test(modelId)) {
    return isLandscape ? '1792x1024' : '1024x1792'
  }

  if (/dall-e-2/i.test(modelId)) {
    return undefined
  }

  return isLandscape ? '1536x1024' : '1024x1536'
}

