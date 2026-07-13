import { Box, Container, Flex, Image, SimpleGrid, Stack, Text, Title } from '@mantine/core'
import { IconBrush, IconMarkdown, IconPhotoSpark, IconShieldLock } from '@tabler/icons-react'
import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { ScalableIcon } from '@/components/common/ScalableIcon'
import Page from '@/components/layout/Page'
import { useIsSmallScreen } from '@/hooks/useScreenChange'
import useVersion from '@/hooks/useVersion'
import sakuraLogo from '@/static/sakurabox-logo.svg'

export const Route = createFileRoute('/about')({
  component: RouteComponent,
})

const HIGHLIGHTS = [
  {
    icon: IconMarkdown,
    title: 'Colorful Markdown',
    description: 'Clear hierarchy, resilient emphasis parsing, polished code and math typography.',
  },
  {
    icon: IconPhotoSpark,
    title: 'Flexible image creation',
    description: 'Use built-in or custom image models with references and model-aware output sizes.',
  },
  {
    icon: IconBrush,
    title: 'Your reading style',
    description: 'Switch between a clean sans-serif interface and a comfortable serif reading mode.',
  },
  {
    icon: IconShieldLock,
    title: 'Private by default',
    description: 'Bring your own provider credentials. Optional analytics and commercial prompts stay disabled.',
  },
] as const

function RouteComponent() {
  const version = useVersion()
  const isSmallScreen = useIsSmallScreen()
  const { t } = useTranslation()

  return (
    <Page title={t('About SakuraBox')}>
      <Container size="md" p={0}>
        <Stack gap="xl" px={isSmallScreen ? 'sm' : 'md'} py={isSmallScreen ? 'xl' : 'md'}>
          <Flex
            gap="lg"
            align="center"
            p="lg"
            className="rounded-lg border border-solid border-chatbox-border-primary bg-chatbox-background-secondary"
          >
            <Image src={sakuraLogo} w={88} h={88} alt={t('SakuraBox logo')} />
            <Stack gap={4}>
              <Title order={2}>SakuraBox</Title>
              <Text c="chatbox-secondary">
                {t('A friendly, focused workspace for conversations with your AI models.')}
              </Text>
              {/\d/.test(version.version) && (
                <Text size="xs" c="chatbox-tertiary">
                  {t('Version {{version}}', { version: version.version })}
                </Text>
              )}
            </Stack>
          </Flex>

          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
            {HIGHLIGHTS.map((item) => (
              <Flex
                key={item.title}
                gap="md"
                p="md"
                align="flex-start"
                className="rounded-md border border-solid border-chatbox-border-primary bg-chatbox-background-primary"
              >
                <Box
                  w={36}
                  h={36}
                  className="grid shrink-0 place-items-center rounded-md bg-chatbox-background-brand-secondary text-chatbox-tint-brand"
                >
                  <ScalableIcon icon={item.icon} size={20} />
                </Box>
                <Stack gap={3}>
                  <Text fw={700}>{t(item.title)}</Text>
                  <Text size="sm" c="chatbox-secondary">
                    {t(item.description)}
                  </Text>
                </Stack>
              </Flex>
            ))}
          </SimpleGrid>

          <Stack gap="xs" p="md" className="rounded-md bg-chatbox-background-secondary">
            <Text fw={700}>{t('Open-source foundation')}</Text>
            <Text size="sm" c="chatbox-secondary">
              {t(
                'SakuraBox is built from the open-source Chatbox project. Original licenses and notices remain in the repository LICENSE file.'
              )}
            </Text>
          </Stack>
        </Stack>
      </Container>
    </Page>
  )
}
