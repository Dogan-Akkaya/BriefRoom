import { useState } from 'react'

const hints = [
  { label: '<code>topic:</code>ransomware', query: 'ransomware' },
  { label: '<code>region:</code>latam', query: 'latam' },
  { label: '<code>industry:</code>healthcare', query: 'healthcare' },
  { label: '<code>type:</code>bar,line,donut', query: 'bar line donut' },
  { label: 'ransomware payment brazil', query: 'ransomware payment brazil' },
  { label: 'phishing click rates 2026', query: 'phishing click rates 2026' },
]

export default function SearchBar({ onSearch }) {
  const [value, setValue] = useState('')

  const handleSearch = (q) => {
    setValue(q)
    onSearch(q)
  }

  return (
    <>
      <div className="max-w-[600px] mx-auto mb-3.5 relative">
        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[var(--color-text-3)] pointer-events-none" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="7.5" cy="7.5" r="5.5" /><path d="M11.5 11.5L16 16" strokeLinecap="round" />
        </svg>
        <input
          className="w-full bg-[var(--color-bg-input)] border-[1.5px] border-white/[0.07] rounded-[10px] py-[13px] pl-[42px] pr-12 text-sm font-[var(--font-sans)] text-[var(--color-text-1)] outline-none focus:border-[rgba(232,70,58,0.4)] focus:shadow-[0_0_0_3px_rgba(232,70,58,0.08)] transition-all placeholder:text-[var(--color-text-3)]"
          type="text"
          placeholder='Try "ransomware healthcare europe" or "phishing click rates"'
          value={value}
          onChange={(e) => handleSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch(value)}
        />
        <button
          onClick={() => handleSearch(value)}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-[var(--color-brand)] border-none rounded-[6px] w-8 h-8 flex items-center justify-center cursor-pointer hover:opacity-85 transition-opacity"
        >
          <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 14 14" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
            <path d="M5 7h4M7 1v12" /><path d="M1 7h12" transform="rotate(45 7 7)" />
          </svg>
        </button>
      </div>
      <div className="flex justify-center flex-wrap gap-1.5 mb-0">
        {hints.map((h) => (
          <span
            key={h.query}
            onClick={() => handleSearch(h.query)}
            className="text-[10px] font-mono text-[var(--color-text-3)] bg-white/[0.03] border border-[var(--color-border)] rounded px-2 py-[3px] cursor-pointer hover:text-[var(--color-text-2)] hover:border-[var(--color-border-hover)] hover:bg-white/[0.05] transition-all [&_code]:text-[var(--color-brand)] [&_code]:font-mono"
            dangerouslySetInnerHTML={{ __html: h.label }}
          />
        ))}
      </div>
    </>
  )
}
