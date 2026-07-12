import { Loader } from 'lucide-react'
import type { Message } from '@shared/types'
import { useTranslation } from 'react-i18next'

export default function MessageStatuses(props: { statuses: Message['status'] }) {
  const { statuses } = props
  if (!statuses || statuses.length === 0) {
    return null
  }

  return (
    <>
      {statuses.map((status, index) => (
        <MessageStatus key={index} status={status} />
      ))}
    </>
  )
}
function MessageStatus(props: { status: NonNullable<Message['status']>[number] }) {
  const { status } = props
  const { t } = useTranslation()

  if (status.type === 'sending_file') {
    return (
      <LoadingBubble>
        <span className="flex flex-col">
          <span>{t('Reading file...')}</span>
          {status.mode && (
            <span className="text-[10px] font-normal opacity-70">
              {status.mode === 'local' ? t('Local Mode') : t('Advanced Mode')}
            </span>
          )}
        </span>
      </LoadingBubble>
    )
  }

  if (status.type === 'loading_webpage') {
    return (
      <LoadingBubble>
        <span className="flex flex-col">
          <span>{t('Loading webpage...')}</span>
          {status.mode && (
            <span className="text-[10px] font-normal opacity-70">
              {status.mode === 'local' ? t('Local Mode') : t('Advanced Mode')}
            </span>
          )}
        </span>
      </LoadingBubble>
    )
  }

  if (status.type === 'retrying') {
    return <RetryingIndicator attempt={status.attempt} maxAttempts={status.maxAttempts} />
  }

  return null
}

function RetryingIndicator(props: { attempt: number; maxAttempts: number }) {
  const { attempt, maxAttempts } = props
  const { t } = useTranslation()

  return (
    <div className="mb-1 flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
      <Loader className="h-3 w-3 animate-spin" />
      <span>{t('Retrying {{attempt}}/{{maxAttempts}}', { attempt, maxAttempts })}</span>
    </div>
  )
}

export function LoadingBubble(props: { children: React.ReactNode }) {
  return (
    <div className="flex flex-row items-start justify-start overflow-x-auto overflow-y-hidden">
      <div className="mb-1 flex items-center justify-start rounded-lg border border-solid border-chatbox-border-primary bg-chatbox-background-brand-secondary px-2 py-2 shadow-sm">
        <Loader className="ml-1 mr-2 h-5 w-5 animate-spin text-chatbox-tint-brand" />
        <span className="mr-4 font-bold text-chatbox-tint-secondary">{props.children}</span>
      </div>
    </div>
  )
}
