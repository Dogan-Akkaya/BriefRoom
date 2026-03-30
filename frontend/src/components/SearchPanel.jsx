import { useState, useRef, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { POPULAR, GLOBAL_REPORTS, CATEGORIES } from '../lib/data'

const FILTER_CHIPS = [
  { key: 'industry', label: 'Industry', prefix: 'industry:' },
  { key: 'country', label: 'Country', prefix: 'country:' },
  { key: 'attack', label: 'Attack Type', prefix: 'attack:' },
  { key: 'source', label: 'Source', prefix: 'source:' },
]

const INDUSTRIES_LIST = ['Healthcare', 'Financial Services', 'Technology', 'Government', 'Manufacturing', 'Energy & Utilities', 'Retail', 'Education', 'Telecommunications', 'Transportation']
const COUNTRIES_LIST = ['United States', 'United Kingdom', 'Germany', 'France', 'Turkey', 'UAE', 'Japan', 'Australia', 'Brazil', 'India', 'Singapore', 'South Korea', 'Canada', 'Netherlands']
const SOURCES_LIST = ['IBM X-Force', 'CrowdStrike', 'Verizon DBIR', 'Mandiant M-Trends', 'Palo Alto Unit 42', 'ENISA']

export default function SearchPanel() {
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const [activeFilters, setActiveFilters] = useState([])
  const containerRef = useRef(null)
  const inputRef = useRef(null)
  const navigate = useNavigate()

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setFocused(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Escape to close
  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') {
        setFocused(false)
        inputRef.current?.blur()
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [])

  const activeCategories = useMemo(() => CATEGORIES.filter(c => c.hasData), [])

  // Combined search results respecting active filters + query
  const searchResults = useMemo(() => {
    const q = query.toLowerCase()
    const hasFilters = activeFilters.length > 0

    if (!q && !hasFilters) return null

    let popularMatches = POPULAR
    let reportMatches = GLOBAL_REPORTS
    let categoryMatches = CATEGORIES.filter(c => c.hasData)

    // Apply text query
    if (q) {
      popularMatches = popularMatches.filter(p => p.title.toLowerCase().includes(q))
      reportMatches = reportMatches.filter(r => r.title.toLowerCase().includes(q) || r.source.toLowerCase().includes(q))
      categoryMatches = categoryMatches.filter(c => c.label.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q))
    }

    // Build filter result sections
    const filterSections = {}
    if (hasFilters) {
      if (activeFilters.includes('industry')) {
        filterSections.industry = INDUSTRIES_LIST.filter(item => !q || item.toLowerCase().includes(q))
      }
      if (activeFilters.includes('country')) {
        filterSections.country = COUNTRIES_LIST.filter(item => !q || item.toLowerCase().includes(q))
      }
      if (activeFilters.includes('attack')) {
        filterSections.attack = categoryMatches
      }
      if (activeFilters.includes('source')) {
        filterSections.source = SOURCES_LIST.filter(item => !q || item.toLowerCase().includes(q))
      }
    }

    // If only filters (no query text), show filter sections only
    if (hasFilters) {
      return { filterSections, popular: [], reports: [], categories: [] }
    }

    // Text search only
    return {
      filterSections: {},
      popular: popularMatches.slice(0, 3),
      reports: reportMatches.slice(0, 3),
      categories: categoryMatches.slice(0, 3),
    }
  }, [query, activeFilters])

  function closeAndNavigate(path) {
    setFocused(false)
    setQuery('')
    navigate(path)
  }

  function handleFilterClick(filterKey) {
    setActiveFilters(prev =>
      prev.includes(filterKey)
        ? prev.filter(k => k !== filterKey)
        : [...prev, filterKey]
    )
    inputRef.current?.focus()
  }

  function handleSearch() {
    if (!query && activeFilters.length === 0) return
    // Route based on active filters
    if (activeFilters.length === 1 && activeFilters[0] === 'source') {
      closeAndNavigate('/reports')
    } else if (activeFilters.length === 1 && activeFilters[0] === 'attack') {
      closeAndNavigate('/builder')
    } else {
      closeAndNavigate('/popular')
    }
  }

  const showDropdown = focused

  const placeholderText = activeFilters.length > 0
    ? `Search ${activeFilters.map(f => FILTER_CHIPS.find(c => c.key === f)?.label).join(' + ')}...`
    : 'Search threats, charts, reports...'

  // --- Styles ---
  const inputContainerStyle = {
    position: 'relative',
    width: '100%',
    maxWidth: 720,
    margin: '0 auto',
  }

  const inputStyle = {
    width: '100%',
    padding: '18px 22px 18px 50px',
    fontSize: 15,
    background: 'rgba(255,255,255,0.05)',
    border: `1px solid ${focused ? 'rgba(255,69,98,0.35)' : 'rgba(255,255,255,0.08)'}`,
    borderRadius: 14,
    color: '#E8ECF1',
    backdropFilter: 'blur(12px)',
    transition: 'all 0.4s',
    outline: 'none',
    fontFamily: 'inherit',
    boxShadow: focused ? '0 0 0 3px rgba(255,69,98,0.06)' : 'none',
    boxSizing: 'border-box',
  }

  const searchIconStyle = {
    position: 'absolute',
    top: '50%',
    left: 18,
    transform: 'translateY(-50%)',
    color: focused ? '#FF4562' : 'rgba(232,236,241,0.3)',
    transition: 'color 0.3s',
    pointerEvents: 'none',
  }

  const chipsRowStyle = {
    display: 'flex',
    gap: 6,
    marginTop: 10,
    justifyContent: 'center',
  }

  const chipStyle = (isActive) => ({
    fontSize: 10,
    fontFamily: 'JetBrains Mono, monospace',
    padding: '4px 10px',
    borderRadius: 6,
    border: `1px solid ${isActive ? 'rgba(255,69,98,0.3)' : 'rgba(255,255,255,0.06)'}`,
    background: isActive ? 'rgba(255,69,98,0.06)' : 'rgba(255,255,255,0.02)',
    color: isActive ? '#FF4562' : 'rgba(232,236,241,0.35)',
    cursor: 'pointer',
    transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)',
    userSelect: 'none',
  })

  const dropdownStyle = {
    position: 'absolute',
    top: 'calc(100% + 8px)',
    left: 0,
    right: 0,
    maxHeight: 420,
    overflowY: 'auto',
    background: 'rgba(14,18,32,0.97)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 16,
    backdropFilter: 'blur(24px)',
    boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
    padding: '8px 0',
    zIndex: 50,
  }

  const sectionHeaderStyle = (dotColor) => ({
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: 10,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: 'rgba(232,236,241,0.25)',
    padding: '12px 18px 6px',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  })

  const dotStyle = (color) => ({
    width: 5,
    height: 5,
    borderRadius: '50%',
    background: color,
    flexShrink: 0,
  })

  const resultItemStyle = {
    padding: '11px 18px',
    fontSize: 13,
    color: 'rgba(232,236,241,0.6)',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    transition: 'all 0.15s',
    borderBottom: '1px solid rgba(255,255,255,0.02)',
  }

  const badgeStyle = {
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: 10,
    color: 'rgba(232,236,241,0.2)',
    padding: '2px 8px',
    borderRadius: 4,
    background: 'rgba(255,255,255,0.03)',
    flexShrink: 0,
    marginLeft: 12,
  }

  const typeIconDot = (color) => ({
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: color,
    flexShrink: 0,
    marginRight: 10,
  })

  const typeIconLetter = {
    width: 16,
    height: 16,
    borderRadius: 3,
    background: 'rgba(255,69,98,0.12)',
    color: '#FF4562',
    fontSize: 9,
    fontWeight: 700,
    fontFamily: 'JetBrains Mono, monospace',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginRight: 10,
  }

  // --- Render helpers ---

  function renderSectionHeader(label, dotColor) {
    return (
      <div style={sectionHeaderStyle(dotColor)}>
        <span style={dotStyle(dotColor)} />
        {label}
      </div>
    )
  }

  function ResultItem({ children, badge, onClick, icon }) {
    const [hovered, setHovered] = useState(false)
    return (
      <div
        style={{
          ...resultItemStyle,
          background: hovered ? 'rgba(255,69,98,0.04)' : 'transparent',
          color: hovered ? '#E8ECF1' : 'rgba(232,236,241,0.6)',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={onClick}
      >
        <span style={{ display: 'flex', alignItems: 'center', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {icon}
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{children}</span>
        </span>
        {badge && <span style={badgeStyle}>{badge}</span>}
      </div>
    )
  }

  // --- Default suggestions (focused, no query, no filter) ---
  function renderDefaultSuggestions() {
    return (
      <>
        {renderSectionHeader('Popular Charts', '#FF4562')}
        {POPULAR.slice(0, 2).map((p, i) => (
          <ResultItem
            key={`pop-${i}`}
            badge={p.views}
            onClick={() => closeAndNavigate('/popular')}
            icon={<span style={typeIconDot('#FF4562')} />}
          >
            {p.title}
          </ResultItem>
        ))}

        {renderSectionHeader('Custom Builder', '#FF4562')}
        {activeCategories.slice(0, 2).map((cat, i) => {
          const firstDp = cat.label
          return (
            <ResultItem
              key={`build-${i}`}
              badge="builder"
              onClick={() => closeAndNavigate(`/builder/${cat.id}`)}
              icon={<span style={typeIconLetter}>B</span>}
            >
              Build: {cat.label} &middot; {cat.desc.split(',')[0]}
            </ResultItem>
          )
        })}

        {renderSectionHeader('Global Reports', '#3B82F6')}
        {GLOBAL_REPORTS.slice(0, 2).map((r, i) => (
          <ResultItem
            key={`rep-${i}`}
            badge={r.sourceShort}
            onClick={() => closeAndNavigate('/reports')}
            icon={<span style={typeIconDot('#3B82F6')} />}
          >
            {r.sourceShort}: {r.title}
          </ResultItem>
        ))}
      </>
    )
  }

  // --- Combined results renderer ---
  function renderCombinedResults() {
    if (!searchResults) {
      if (query) {
        return (
          <div style={{ padding: '20px 18px', fontSize: 13, color: 'rgba(232,236,241,0.25)', textAlign: 'center' }}>
            No results found for &ldquo;{query}&rdquo;
          </div>
        )
      }
      return null
    }

    const { filterSections, popular, reports, categories } = searchResults

    return (
      <>
        {/* Filter sections */}
        {filterSections.industry?.length > 0 && (
          <>
            {renderSectionHeader('Industry', '#FF4562')}
            {filterSections.industry.map((item, i) => (
              <ResultItem key={`fi-${i}`} badge="industry" onClick={() => closeAndNavigate('/builder')} icon={<span style={typeIconDot('#FF4562')} />}>{item}</ResultItem>
            ))}
          </>
        )}
        {filterSections.country?.length > 0 && (
          <>
            {renderSectionHeader('Country', '#FF4562')}
            {filterSections.country.map((item, i) => (
              <ResultItem key={`fc-${i}`} badge="country" onClick={() => closeAndNavigate('/builder')} icon={<span style={typeIconDot('#FF4562')} />}>{item}</ResultItem>
            ))}
          </>
        )}
        {filterSections.attack?.length > 0 && (
          <>
            {renderSectionHeader('Attack Type', '#FF4562')}
            {filterSections.attack.map((cat, i) => (
              <ResultItem key={`fa-${i}`} badge={cat.desc.split(',')[0]} onClick={() => closeAndNavigate(`/builder/${cat.id}`)} icon={<span style={typeIconLetter}>B</span>}>{cat.label}</ResultItem>
            ))}
          </>
        )}
        {filterSections.source?.length > 0 && (
          <>
            {renderSectionHeader('Source', '#3B82F6')}
            {filterSections.source.map((item, i) => (
              <ResultItem key={`fs-${i}`} badge="source" onClick={() => closeAndNavigate('/reports')} icon={<span style={typeIconDot('#3B82F6')} />}>{item}</ResultItem>
            ))}
          </>
        )}

        {/* Text search sections */}
        {popular?.length > 0 && (
          <>
            {renderSectionHeader('Popular Charts', '#FF4562')}
            {popular.map((p, i) => (
              <ResultItem key={`sp-${i}`} badge={p.views} onClick={() => closeAndNavigate('/popular')} icon={<span style={typeIconDot('#FF4562')} />}>{p.title}</ResultItem>
            ))}
          </>
        )}
        {categories?.length > 0 && (
          <>
            {renderSectionHeader('Custom Builder', '#FF4562')}
            {categories.map((cat, i) => (
              <ResultItem key={`sc-${i}`} badge={cat.label} onClick={() => closeAndNavigate(`/builder/${cat.id}`)} icon={<span style={typeIconLetter}>B</span>}>{cat.label} &mdash; {cat.desc}</ResultItem>
            ))}
          </>
        )}
        {reports?.length > 0 && (
          <>
            {renderSectionHeader('Global Reports', '#3B82F6')}
            {reports.map((r, i) => (
              <ResultItem key={`sr-${i}`} badge={r.sourceShort} onClick={() => closeAndNavigate('/reports')} icon={<span style={typeIconDot('#3B82F6')} />}>{r.sourceShort}: {r.title}</ResultItem>
            ))}
          </>
        )}
      </>
    )
  }

  // --- Main render ---
  return (
    <div ref={containerRef} style={inputContainerStyle}>
      <div style={{ position: 'relative' }}>
        {/* Search icon */}
        <svg
          style={searchIconStyle}
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholderText}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSearch() }}
          aria-label="Search threats, charts, and reports"
          style={inputStyle}
        />

        {/* Dropdown */}
        {showDropdown && focused && (
          <div style={dropdownStyle}>
            {(query.length > 0 || activeFilters.length > 0)
              ? renderCombinedResults()
              : renderDefaultSuggestions()}
          </div>
        )}
      </div>

      {/* Filter chips + Search button */}
      <div style={chipsRowStyle}>
        {FILTER_CHIPS.map((chip) => {
          const isActive = activeFilters.includes(chip.key)
          return (
            <button
              key={chip.key}
              style={chipStyle(isActive)}
              onClick={() => handleFilterClick(chip.key)}
              onMouseEnter={e => {
                if (!isActive) {
                  e.currentTarget.style.borderColor = 'rgba(255,69,98,0.2)'
                  e.currentTarget.style.background = 'rgba(255,69,98,0.04)'
                  e.currentTarget.style.color = 'rgba(232,236,241,0.6)'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
                  e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
                  e.currentTarget.style.color = 'rgba(232,236,241,0.35)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }
              }}
            >
              {chip.label}
            </button>
          )
        })}
        {(query || activeFilters.length > 0) && (
          <button
            style={{
              fontSize: 10,
              fontFamily: 'JetBrains Mono, monospace',
              padding: '4px 14px',
              borderRadius: 6,
              border: '1px solid rgba(255,69,98,0.35)',
              background: 'rgba(255,69,98,0.12)',
              color: '#FF4562',
              cursor: 'pointer',
              transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)',
              userSelect: 'none',
              fontWeight: 600,
            }}
            onClick={handleSearch}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(255,69,98,0.2)'
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(255,69,98,0.15)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255,69,98,0.12)'
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            Search →
          </button>
        )}
      </div>
    </div>
  )
}
