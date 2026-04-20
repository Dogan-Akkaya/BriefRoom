import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loaded, setLoaded] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 150);
    return () => clearTimeout(t);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false) }, [location.pathname]);

  const links = [
    { label: "Home", path: "/", activeColor: "#FF4562", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: 2}}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>, exact: true },
    { label: "Popular Charts", path: "/popular", activeColor: "#FF4562" },
    { label: "Global Reports", path: "/reports", activeColor: "#3B82F6" },
    { label: "Custom Builder", path: "/explore", activeColor: "#FF4562" },
    { label: "Methodology", path: "/methodology", activeColor: "#FF4562" },
  ];

  return (
    <>
      <style>{`
        .br-nav-link {
          font-size: 13px;
          color: rgba(232,236,241,0.7);
          cursor: pointer;
          transition: color 0.2s;
          font-weight: 500;
          background: none;
          border: none;
          border-bottom: 2px solid transparent;
          padding-bottom: 4px;
          font-family: 'Satoshi','DM Sans',sans-serif;
        }
        .br-nav-link:hover { color: #E8ECF1; }
        .br-nav-link.active {
          color: #E8ECF1;
          border-bottom-color: #FF4562;
        }
        @media(max-width:900px) { .br-nav-desktop { display: none !important; } }
        @media(min-width:901px) { .br-nav-burger { display: none !important; } }
        .br-mobile-menu {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 999;
          background: rgba(10,14,26,0.97); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
          display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px;
        }
        .br-mobile-link {
          font-size: 18px; font-weight: 600; color: rgba(232,236,241,0.6); cursor: pointer;
          background: none; border: none; padding: 14px 32px; border-radius: 12px;
          font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.2s; width: 260px; text-align: center;
        }
        .br-mobile-link:hover, .br-mobile-link.active { color: #E8ECF1; background: rgba(255,255,255,0.04); }
        .br-mobile-link.active { border: 1px solid rgba(255,69,98,0.2); }
      `}</style>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: "14px 28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(180deg,rgba(10,14,26,0.97) 0%,rgba(10,14,26,0.85) 60%,rgba(10,14,26,0) 100%)",
          backdropFilter: "blur(20px)",
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.5s 0.1s",
        }}
      >
        {/* Desktop nav */}
        <div
          className="br-nav-desktop"
          style={{ display: "flex", gap: 28, alignItems: "center" }}
        >
          {links.map((link) => {
            const isActive = link.exact ? location.pathname === link.path : location.pathname.startsWith(link.path);
            return (
              <span
                key={link.path}
                className="br-nav-link"
                role="link"
                tabIndex={0}
                style={{ display: 'inline-flex', alignItems: 'center', ...(isActive ? { color: '#E8ECF1', borderBottomColor: link.activeColor } : {}) }}
                onClick={() => navigate(link.path)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate(link.path) }}
              >
                {link.icon}{link.label}
              </span>
            );
          })}
        </div>

        {/* Mobile hamburger */}
        <button
          className="br-nav-burger"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation menu"
          style={{
            position: 'absolute', right: 20, top: 14,
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 10, width: 40, height: 40, cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 5,
          }}
        >
          <span style={{ width: 18, height: 2, background: '#E8ECF1', borderRadius: 1, transition: 'all 0.2s', transform: mobileOpen ? 'rotate(45deg) translateY(3.5px)' : 'none' }} />
          {!mobileOpen && <span style={{ width: 18, height: 2, background: '#E8ECF1', borderRadius: 1 }} />}
          <span style={{ width: 18, height: 2, background: '#E8ECF1', borderRadius: 1, transition: 'all 0.2s', transform: mobileOpen ? 'rotate(-45deg) translateY(-3.5px)' : 'none' }} />
        </button>
      </nav>

      {/* Mobile fullscreen menu */}
      {mobileOpen && (
        <div className="br-mobile-menu" onClick={() => setMobileOpen(false)}>
          <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 10, letterSpacing: '0.12em', color: 'rgba(255,69,98,0.5)', textTransform: 'uppercase', marginBottom: 16 }}>
            Brief Room
          </div>
          {links.map((link) => {
            const isActive = link.exact ? location.pathname === link.path : location.pathname.startsWith(link.path);
            return (
              <button
                key={link.path}
                className={`br-mobile-link${isActive ? ' active' : ''}`}
                onClick={() => navigate(link.path)}
              >
                {link.label}
              </button>
            );
          })}
        </div>
      )}
    </>
  );
}
