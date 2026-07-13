import { Flex, Text, UnstyledButton } from '@mantine/core'
import { IconPhoto } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { useIsSmallScreen } from '@/hooks/useScreenChange'

export interface EmptyStateProps {
  onPromptSelect: (prompt: string) => void
}

export function EmptyState({ onPromptSelect }: EmptyStateProps) {
  const { t } = useTranslation()
  const isSmallScreen = useIsSmallScreen()

  const quickPrompts = [
    t('A serene mountain landscape at sunset'),
    t('A futuristic city with flying cars'),
    t('A cozy coffee shop interior'),
    t('An abstract painting with vibrant colors'),
    t('A cute rabbit in Pixar animation style'),
  ]

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      className="px-2 py-6"
      style={{ minHeight: isSmallScreen ? '46vh' : '60vh' }}
    >
      <div
        className={`${isSmallScreen ? 'w-16 h-16 mb-4' : 'w-20 h-20 mb-6'} rounded-2xl bg-[var(--chatbox-background-secondary)] flex items-center justify-center`}
      >
        <IconPhoto size={isSmallScreen ? 32 : 40} className="text-[var(--chatbox-tint-tertiary)]" stroke={1.5} />
      </div>

      <Text size={isSmallScreen ? 'lg' : 'xl'} fw={600} mb="xs" className="text-center">
        {t('Create amazing images')}
      </Text>
      <Text size="sm" c="dimmed" maw={420} className="text-center" mb={isSmallScreen ? 'lg' : 'xl'}>
        {t('Describe the image you want to generate. Be as detailed as possible for best results.')}
      </Text>

      {/* Quick Prompts - Grid Layout */}
      <Flex gap="sm" wrap="wrap" justify="center" maw={600}>
        {quickPrompts.map((promptText) => (
          <UnstyledButton
            key={promptText}
            onClick={() => onPromptSelect(promptText)}
            className={`${isSmallScreen ? 'px-3 py-2' : 'px-4 py-3'} rounded-xl bg-[var(--chatbox-background-secondary)] hover:bg-[var(--chatbox-background-tertiary)] transition-colors duration-200`}
            style={{ maxWidth: 280 }}
          >
            <Text size="sm" ta="center">
              {promptText}
            </Text>
          </UnstyledButton>
        ))}
      </Flex>
    </Flex>
  )
}
