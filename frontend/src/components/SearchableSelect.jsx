import React, { useState, useRef, useEffect } from 'react'

export default function SearchableSelect({ value, onChange, options = [], placeholder = 'Select...', label }) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const containerRef = useRef(null)
  const inputRef = useRef(null)

  // Click-outside detection
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
        setSearch('')
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  // Escape key closes dropdown
  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') {
        setOpen(false)
        setSearch('')
      }
    }
    if (open) {
      document.addEventListener('keydown', handleKey)
    }
    return () => document.removeEventListener('keydown', handleKey)
  }, [open])

  const filtered = options.filter(opt =>
    opt.toLowerCase().includes(search.toLowerCase())
  )

  function handleSelect(opt) {
    onChange(opt)
    setOpen(false)
    setSearch('')
  }

  function handleInputClick() {
    setOpen(true)
    setSearch('')
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  const styles = {
    container: {
      position: 'relative',
      width: '100%',
      fontFamily: "'Satoshi', sans-serif",
    },
    label: {
      display: 'block',
      fontSize: 11,
      fontWeight: 500,
      color: 'rgba(232,236,241,0.45)',
      marginBottom: 6,
      letterSpacing: '0.04em',
      textTransform: 'uppercase',
    },
    input: {
      width: '100%',
      padding: '10px 14px',
      background: 'rgba(255,255,255,0.025)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 10,
      color: '#E8ECF1',
      fontSize: 12,
      fontFamily: "'Satoshi', sans-serif",
      outline: 'none',
      cursor: 'pointer',
      boxSizing: 'border-box',
      transition: 'border-color 0.2s ease',
    },
    inputFocused: {
      borderColor: 'rgba(255,69,98,0.25)',
    },
    chevron: {
      position: 'absolute',
      right: 12,
      top: label ? 32 : 12,
      pointerEvents: 'none',
      color: 'rgba(232,236,241,0.3)',
      fontSize: 10,
      transition: 'transform 0.2s ease',
      transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
    },
    dropdown: {
      position: 'absolute',
      top: '100%',
      left: 0,
      right: 0,
      marginTop: 6,
      background: 'rgba(14,18,32,0.97)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 12,
      boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
      zIndex: 50,
      maxHeight: 240,
      overflowY: 'auto',
      padding: '4px 0',
    },
    option: {
      padding: '10px 14px',
      fontSize: 12,
      color: '#E8ECF1',
      cursor: 'pointer',
      transition: 'background 0.15s ease',
      fontFamily: "'Satoshi', sans-serif",
    },
    optionSelected: {
      color: '#FF4562',
      fontWeight: 600,
    },
    noResults: {
      padding: '10px 14px',
      fontSize: 12,
      color: 'rgba(232,236,241,0.3)',
      fontStyle: 'italic',
    },
  }

  return (
    <div ref={containerRef} style={styles.container}>
      {label && <span style={styles.label}>{label}</span>}

      <input
        ref={inputRef}
        type="text"
        readOnly={!open}
        value={open ? search : (value || '')}
        placeholder={open ? 'Type to filter...' : placeholder}
        onClick={handleInputClick}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          ...styles.input,
          ...(open ? styles.inputFocused : {}),
        }}
      />

      <span style={styles.chevron}>&#9662;</span>

      {open && (
        <div style={styles.dropdown}>
          {filtered.length === 0 ? (
            <div style={styles.noResults}>No matches found</div>
          ) : (
            filtered.map((opt) => (
              <div
                key={opt}
                style={{
                  ...styles.option,
                  ...(opt === value ? styles.optionSelected : {}),
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,69,98,0.05)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent'
                }}
                onClick={() => handleSelect(opt)}
              >
                {opt}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
