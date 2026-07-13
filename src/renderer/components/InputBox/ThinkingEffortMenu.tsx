import { Menu, Text, Tooltip, UnstyledButton } from '@mantine/core'
import type { Session, SessionSettings } from '@shared/types'
import { ModelProviderEnum } from '@shared/types'
import {
  getGoogleThinkingMode,
  getSupportedGoogleThinkingLevels,
  type GoogleThinkingLevel,
} from '@shared/utils/google-thinking'
import { IconBrain, IconCheck } from '@tabler/icons-react'
import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import * as chatStore from '@/stores/chatStore'

// Preset budgets shared with SessionSettings' ThinkingBudgetConfig (Low/Medium/High)
const BUDGET_PRESETS = { low: 2048, medium: 5120, high: 10240 } as const

type BudgetLevel = keyof typeof BUDGET_PRESETS

interface ThinkingEffortMenuProps {
  sessionId: string | null
  settings?: SessionSettings | null
  iconSize: number
}

/**
 * Quick thinking-depth selector shown in the input toolbar.
 * Writes to the same session providerOptions consumed by SessionSettings,
 * so both UIs stay in sync.
 */
export default function ThinkingEffortMenu({ sessionId, settings, iconSize }: ThinkingEffortMenuProps) {
  const { t } = useTranslation()
  const provider = settings?.provider
  const modelId = settings?.modelId || ''

  const updateProviderOptions = useCallback(
    (patch: NonNullable<Session['settings']>['providerOptions']) => {
      if (!sessionId) return
      void chatStore.updateSession(sessionId, (session) => {
        if (!session) {
          throw new Error('Session not found')
        }
        return {
          ...session,
          settings: {
            ...(session.settings || {}),
            providerOptions: {
              ...(session.settings?.providerOptions || {}),
              ...patch,
            },
          },
        }
      })
    },
    [sessionId]
  )

  const googleMode = provider === ModelProviderEnum.Gemini ? getGoogleThinkingMode(modelId) : 'none'

  const { options, currentValue } = useMemo(() => {
    if (provider === ModelProviderEnum.OpenAI) {
      const effort = settings?.providerOptions?.openai?.reasoningEffort
      return {
        options: [
          { value: 'auto', label: t('Auto') },
          { value: 'low', label: t('Low') },
          { value: 'medium', label: t('Medium') },
          { value: 'high', label: t('High') },
          { value: 'xhigh', label: t('Extreme') },
        ],
        currentValue: effort ?? 'auto',
      }
    }
    if (provider === ModelProviderEnum.Claude) {
      const thinking = settings?.providerOptions?.claude?.thinking
      const enabled = thinking?.type === 'enabled'
      const budget = thinking?.budgetTokens ?? 0
      const preset = (Object.keys(BUDGET_PRESETS) as BudgetLevel[]).find((k) => BUDGET_PRESETS[k] === budget)
      return {
        options: [
          { value: 'disabled', label: t('Disabled') },
          { value: 'low', label: t('Low') },
          { value: 'medium', label: t('Medium') },
          { value: 'high', label: t('High') },
        ],
        currentValue: enabled ? (preset ?? 'medium') : 'disabled',
      }
    }
    if (provider === ModelProviderEnum.Gemini && googleMode === 'level') {
      const level = settings?.providerOptions?.google?.thinkingConfig?.thinkingLevel
      const supported = getSupportedGoogleThinkingLevels(modelId)
      const labels: Record<GoogleThinkingLevel, string> = {
        minimal: t('Minimal'),
        low: t('Low'),
        medium: t('Medium'),
        high: t('High'),
      }
      return {
        options: supported.map((l) => ({ value: l, label: labels[l] })),
        currentValue: level ?? '',
      }
    }
    if (provider === ModelProviderEnum.Gemini && googleMode === 'budget') {
      const budget = settings?.providerOptions?.google?.thinkingConfig?.thinkingBudget ?? 0
      const preset = (Object.keys(BUDGET_PRESETS) as BudgetLevel[]).find((k) => BUDGET_PRESETS[k] === budget)
      return {
        options: [
          { value: 'disabled', label: t('Disabled') },
          { value: 'low', label: t('Low') },
          { value: 'medium', label: t('Medium') },
          { value: 'high', label: t('High') },
        ],
        currentValue: budget > 0 ? (preset ?? 'medium') : 'disabled',
      }
    }
    return { options: [], currentValue: '' }
  }, [provider, googleMode, modelId, settings?.providerOptions, t])

  const handleSelect = useCallback(
    (value: string) => {
      if (provider === ModelProviderEnum.OpenAI) {
        updateProviderOptions({
          openai: {
            reasoningEffort: value === 'auto' ? undefined : (value as 'low' | 'medium' | 'high' | 'xhigh'),
          },
        })
      } else if (provider === ModelProviderEnum.Claude) {
        const enabled = value !== 'disabled'
        updateProviderOptions({
          claude: {
            thinking: {
              type: enabled ? 'enabled' : 'disabled',
              budgetTokens: enabled ? BUDGET_PRESETS[value as BudgetLevel] : 0,
            },
          },
        })
      } else if (provider === ModelProviderEnum.Gemini) {
        if (googleMode === 'level') {
          updateProviderOptions({
            google: { thinkingConfig: { thinkingLevel: value as GoogleThinkingLevel, includeThoughts: true } },
          })
        } else {
          const enabled = value !== 'disabled'
          updateProviderOptions({
            google: {
              thinkingConfig: {
                thinkingBudget: enabled ? BUDGET_PRESETS[value as BudgetLevel] : 0,
                includeThoughts: enabled,
              },
            },
          })
        }
      }
    },
    [provider, googleMode, updateProviderOptions]
  )

  if (!sessionId || options.length === 0) {
    return null
  }

  const active = currentValue !== '' && currentValue !== 'disabled' && currentValue !== 'auto'

  return (
    <Menu trigger="click" position="top-start" transitionProps={{ transition: 'pop', duration: 200 }}>
      <Menu.Target>
        <Tooltip label={t('Thinking Effort')} position="top" withArrow>
          <UnstyledButton className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-[var(--chatbox-background-tertiary)] transition-colors">
            <IconBrain
              size={iconSize}
              strokeWidth={1.8}
              className={active ? 'text-[var(--chatbox-tint-brand)]' : 'text-[var(--chatbox-tint-secondary)]'}
            />
          </UnstyledButton>
        </Tooltip>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>{t('Thinking Effort')}</Menu.Label>
        {options.map((option) => (
          <Menu.Item
            key={option.value}
            onClick={() => handleSelect(option.value)}
            rightSection={option.value === currentValue ? <IconCheck size={14} /> : undefined}
          >
            <Text size="sm">{option.label}</Text>
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  )
}
