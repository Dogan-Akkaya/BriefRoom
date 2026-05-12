import { toPng } from 'html-to-image'

export async function downloadPNG(element, filename = 'chart') {
  try {
    const url = await toPng(element, { backgroundColor: '#151C2F' })
    const link = document.createElement('a')
    link.download = `${filename}.png`
    link.href = url
    link.click()
    return true
  } catch (err) {
    console.error('PNG export failed:', err)
    return false
  }
}

export async function copyToClipboard(element) {
  const url = await toPng(element, { backgroundColor: '#151C2F' })
  const res = await fetch(url)
  const blob = await res.blob()
  await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
}

// Copy a plain-text string to the clipboard. Used for "copy stat with
// citation" on verified tiles — `navigator.clipboard.writeText` falls back
// to a hidden textarea + execCommand on older browsers.
export async function copyText(text) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }
    const ta = document.createElement('textarea')
    ta.value = text
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(ta)
    return ok
  } catch (err) {
    console.error('Clipboard text copy failed:', err)
    return false
  }
}

// Build a one-line citation string for a verified stat item.
// Output: `"<value> — <vendor> (<year>): <title>"` with optional
// `, indexed <YYYY-MM-DD>` when the indexed date is known.
export function citationForItem(item) {
  if (!item) return ''
  const value = item.value || item.quote || ''
  const source = item.source || ''
  const year = item.year ?? ''
  const title = item.title || ''
  const indexed = item.indexed_on || item.report_meta?.extracted_on || ''
  const head = value ? `${value} — ` : ''
  const tail = source ? `${source}${year ? ` (${year})` : ''}` : ''
  const titlePart = title ? `: ${title}` : ''
  const indexedPart = indexed ? `, indexed ${indexed}` : ''
  return `${head}${tail}${titlePart}${indexedPart}`.trim()
}

export function downloadCSV(labels, datasets, filename = 'data') {
  const headers = ['Label', ...datasets.map((_, i) => `Series ${i + 1}`)]
  const rows = labels.map((label, i) => [
    `"${label}"`,
    ...datasets.map((ds) => ds[i]),
  ])
  const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const link = document.createElement('a')
  link.download = `${filename}.csv`
  link.href = URL.createObjectURL(blob)
  link.click()
}
