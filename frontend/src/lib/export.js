import { toPng } from 'html-to-image'

export async function downloadPNG(element, filename = 'chart') {
  const url = await toPng(element, { backgroundColor: '#151C2F' })
  const link = document.createElement('a')
  link.download = `${filename}.png`
  link.href = url
  link.click()
}

export async function copyToClipboard(element) {
  const url = await toPng(element, { backgroundColor: '#151C2F' })
  const res = await fetch(url)
  const blob = await res.blob()
  await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
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
