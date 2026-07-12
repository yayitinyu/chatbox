import { Button, Flex, Image, Paper, Stack, Text } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { navigateToSettings } from '@/modals/Settings'
import sakuraLogo from '@/static/sakurabox-logo.svg'
import type { HomeWelcomeCardMode } from '@/utils/homeWelcomeCard'

export function ChatboxWelcomeCard(props: { mode: HomeWelcomeCardMode; pageName: string; className?: string }) {
  const { mode, className } = props
  const { t } = useTranslation()

  if (mode === 'none') {
    return null
  }

  return (
    <Paper radius="md" withBorder py="md" px="lg" className={`bg-chatbox-background-secondary ${className || ''}`}>
      <Flex gap="md" align="center" justify="space-between" wrap="wrap">
        <Flex gap="sm" align="center">
          <Image src={sakuraLogo} w={42} h={42} alt="" aria-hidden />
          <Stack gap={2}>
            <Text fw={700}>{t('Welcome to SakuraBox')}</Text>
            <Text size="sm" c="chatbox-tertiary">
              {t('Connect a model provider to start a private conversation.')}
            </Text>
          </Stack>
        </Flex>
        <Button size="sm" variant="filled" onClick={() => navigateToSettings('provider')}>
          {t('Connect Provider')}
        </Button>
      </Flex>
    </Paper>
  )
}
