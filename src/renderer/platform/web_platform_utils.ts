import { isTextFilePath } from '@shared/file-extensions'
import { v4 as uuidv4 } from 'uuid'
import platform from '@/platform'
import * as remote from '../packages/remote'

function decodeUtf16ByNullPattern(bytes: Uint8Array): string | undefined {
  const sampleLength = Math.min(bytes.length, 512)
  if (sampleLength < 4) return undefined

  let evenNulls = 0
  let oddNulls = 0
  for (let index = 0; index < sampleLength; index += 1) {
    if (bytes[index] !== 0) continue
    if (index % 2 === 0) evenNulls += 1
    else oddNulls += 1
  }

  const pairs = Math.floor(sampleLength / 2)
  if (oddNulls > pairs * 0.3 && evenNulls < pairs * 0.1) {
    return new TextDecoder('utf-16le').decode(bytes)
  }
  if (evenNulls > pairs * 0.3 && oddNulls < pairs * 0.1) {
    return new TextDecoder('utf-16be').decode(bytes)
  }
  return undefined
}

export async function decodeTextFile(file: File): Promise<string> {
  const bytes = new Uint8Array(await file.arrayBuffer())

  if (bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf) {
    return new TextDecoder('utf-8').decode(bytes.subarray(3))
  }
  if (bytes[0] === 0xff && bytes[1] === 0xfe) {
    return new TextDecoder('utf-16le').decode(bytes.subarray(2))
  }
  if (bytes[0] === 0xfe && bytes[1] === 0xff) {
    return new TextDecoder('utf-16be').decode(bytes.subarray(2))
  }

  return decodeUtf16ByNullPattern(bytes) ?? new TextDecoder('utf-8').decode(bytes)
}

export async function parseTextFileLocally(file: File): Promise<{ text: string; isSupported: boolean }> {
  if (!isTextFilePath(file.name)) {
    // 只在桌面端有 attachment.path，网页版本只有 attachment.name
    return { text: '', isSupported: false }
  }
  const text = await decodeTextFile(file)
  return { text, isSupported: true }
}

export async function parseUrlContentFree(url: string) {
  const result = await remote.parseUserLinkFree({ url })
  const key = `parseUrl-` + uuidv4()
  await platform.setStoreBlob(key, result.text)
  return { key, title: result.title }
}
