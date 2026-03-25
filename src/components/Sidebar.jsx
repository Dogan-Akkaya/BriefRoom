import { useNavigate, useLocation } from 'react-router-dom'
import { useToastStore } from '../stores/useToastStore'

const SidebarIcon = ({ children, tip, active, onClick }) => (
  <div
    onClick={onClick}
    className={`w-9 h-9 rounded-[7px] flex items-center justify-center cursor-pointer transition-all relative group
      ${active ? 'bg-[var(--color-brand-dim)] text-[var(--color-brand)]' : 'text-[var(--color-text-3)] hover:bg-white/[0.04] hover:text-[var(--color-text-2)]'}`}
  >
    {children}
    <span className="absolute left-[46px] bg-[var(--color-bg-card)] text-[var(--color-text-1)] text-[10px] px-2 py-1 rounded border border-[var(--color-border)] whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-10">
      {tip}
    </span>
  </div>
)

export default function Sidebar() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const toast = useToastStore((s) => s.show)
  const isHome = pathname === '/'
  const isBuilder = pathname.startsWith('/builder')

  return (
    <aside className="w-[52px] bg-[var(--color-bg-sidebar)] border-r border-[var(--color-border)] flex flex-col items-center shrink-0 pt-3.5 gap-[3px]">
      <svg className="w-7 h-7 mb-3.5 cursor-pointer" viewBox="0 0 28 28" fill="none" onClick={() => navigate('/')}>
        <circle cx="14" cy="14" r="12" stroke="#E8463A" strokeWidth="2" />
        <circle cx="14" cy="14" r="6" stroke="#E8463A" strokeWidth="1.5" opacity=".5" />
        <text x="14" y="17" textAnchor="middle" fill="#E8463A" fontFamily="Inter,sans-serif" fontWeight="700" fontSize="9">BR</text>
      </svg>

      <SidebarIcon tip="Search" active={isHome} onClick={() => navigate('/')}>
        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="7" cy="7" r="4.5" /><path d="M10 10l3.5 3.5" /></svg>
      </SidebarIcon>
      <SidebarIcon tip="Builder" active={isBuilder} onClick={() => navigate('/builder')}>
        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 8h10M8 3v10" /></svg>
      </SidebarIcon>
      <SidebarIcon tip="Trending" onClick={() => navigate('/')}>
        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="8" r="5" /><path d="M8 5v3l2 2" /></svg>
      </SidebarIcon>

      <div className="w-6 h-px bg-[var(--color-border)] my-1.5" />

      <SidebarIcon tip="Reports" onClick={() => navigate('/builder')}>
        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="2" width="10" height="12" rx="1.5" /><path d="M6 5h4M6 8h4" /></svg>
      </SidebarIcon>
      <SidebarIcon tip="Regions" onClick={() => navigate('/builder')}>
        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="8" r="5.5" /><path d="M2.5 8h11" /></svg>
      </SidebarIcon>

      <div className="w-6 h-px bg-[var(--color-border)] my-1.5" />

      <SidebarIcon tip="Dashboard" active={isHome} onClick={() => navigate('/')}>
        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="5" height="5" rx="1" /><rect x="9" y="2" width="5" height="5" rx="1" /><rect x="2" y="9" width="5" height="5" rx="1" /><rect x="9" y="9" width="5" height="5" rx="1" /></svg>
      </SidebarIcon>
      <SidebarIcon tip="History" onClick={() => toast('History feature coming soon', 'info')}>
        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 2v4l3 2" /><circle cx="8" cy="8" r="6" /></svg>
      </SidebarIcon>
      <SidebarIcon tip="Charts" active={isHome} onClick={() => navigate('/')}>
        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="6" width="3" height="8" rx=".5" /><rect x="6.5" y="3" width="3" height="11" rx=".5" /><rect x="11" y="1" width="3" height="13" rx=".5" /></svg>
      </SidebarIcon>
    </aside>
  )
}
