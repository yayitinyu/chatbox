import { Button, Flex, Stack, Text, TextInput } from '@mantine/core'
import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { normalizeImageUrl } from '@/utils/imageUrl'

interface ImageUrlInputProps {
  value?: string
  label?: ReactNode
  onApply: (url: string) => void
  onClear?: () => void
}

export function ImageUrlInput({ value, label, onApply, onClear }: ImageUrlInputProps) {
  const { t } = useTranslation()
  const [draft, setDraft] = useState(value || '')
  const [error, setError] = useState('')

  useEffect(() => {
    setDraft(value || '')
    setError('')
  }, [value])

  const apply = () => {
    const normalizedUrl = normalizeImageUrl(draft)
    if (!normalizedUrl) {
      setError(t('Please enter a valid HTTP(S) image URL.') || '')
      return
    }

    setDraft(normalizedUrl)
    setError('')
    onApply(normalizedUrl)
  }

  return (
    <Stack gap={4}>
      <Flex align="flex-end" gap="xs" wrap="wrap">
        <TextInput
          label={label ?? t('Image URL')}
          placeholder="https://example.com/image.png"
          value={draft}
          onChange={(event) => {
            setDraft(event.currentTarget.value)
            setError('')
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault()
              apply()
            }
          }}
          className="min-w-48 flex-1"
        />
        <Button variant="outline" size="xs" onClick={apply} mb={2}>
          {t('Use URL')}
        </Button>
        {onClear && value && (
          <Button
            variant="subtle"
            color="gray"
            size="xs"
            onClick={() => {
              setDraft('')
              setError('')
              onClear()
            }}
            mb={2}
          >
            {t('Clear')}
          </Button>
        )}
      </Flex>
      {error && (
        <Text size="xs" c="red">
          {error}
        </Text>
      )}
    </Stack>
  )
}
