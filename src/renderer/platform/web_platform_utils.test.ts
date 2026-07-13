import { describe, expect, it } from 'vitest'
import { decodeTextFile, parseTextFileLocally } from './web_platform_utils'

function toArrayBuffer(bytes: number[]): ArrayBuffer {
  const buffer = new ArrayBuffer(bytes.length)
  new Uint8Array(buffer).set(bytes)
  return buffer
}

function encodeUtf16Le(value: string, withBom = true): ArrayBuffer {
  const bytes: number[] = withBom ? [0xff, 0xfe] : []
  for (let index = 0; index < value.length; index += 1) {
    const codeUnit = value.charCodeAt(index)
    bytes.push(codeUnit & 0xff, codeUnit >> 8)
  }
  return toArrayBuffer(bytes)
}

describe('web platform text parsing', () => {
  it('decodes UTF-16 LE text with a byte-order mark', async () => {
    const file = new File([encodeUtf16Le('Hello，世界')], 'notes.txt')

    await expect(decodeTextFile(file)).resolves.toBe('Hello，世界')
  })

  it('detects common UTF-16 LE text without a byte-order mark', async () => {
    const file = new File([encodeUtf16Le('plain text', false)], 'notes.txt')

    await expect(decodeTextFile(file)).resolves.toBe('plain text')
  })

  it('accepts known extensionless text files', async () => {
    const file = new File(['FROM node:22'], 'Dockerfile')

    await expect(parseTextFileLocally(file)).resolves.toEqual({ text: 'FROM node:22', isSupported: true })
  })

  it('does not decode unsupported binary document types as text', async () => {
    const file = new File([toArrayBuffer([0, 1, 2, 3])], 'report.pdf')

    await expect(parseTextFileLocally(file)).resolves.toEqual({ text: '', isSupported: false })
  })
})
