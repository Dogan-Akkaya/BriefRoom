import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 150);
    return () => clearTimeout(t);
  }, []);

  const links = [
    { label: "Home", path: "/", activeColor: "#FF4562", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: 2}}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>, exact: true },
    { label: "Popular Charts", path: "/popular", activeColor: "#FF4562" },
    { label: "Global Reports", path: "/reports", activeColor: "#3B82F6" },
    { label: "Custom Builder", path: "/builder", activeColor: "#FF4562" },
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
                style={{ display: 'inline-flex', alignItems: 'center', ...(isActive ? { color: '#E8ECF1', borderBottomColor: link.activeColor } : {}) }}
                onClick={() => navigate(link.path)}
              >
                {link.icon}{link.label}
              </span>
            );
          })}
        </div>
      </nav>
    </>
  );
}
