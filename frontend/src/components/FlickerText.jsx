import { useState, useEffect, useRef } from 'react';

export default function FlickerText({ children, delay = 0 }) {
  const [phase, setPhase] = useState(0);
  const ref = useRef(null);
  const triggered = useRef(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !triggered.current) {
          triggered.current = true;
          [
            [delay, 0],
            [delay + 100, 1],
            [delay + 200, 2],
            [delay + 350, 3],
            [delay + 450, 4],
            [delay + 600, 5],
            [delay + 700, 6],
            [delay + 850, 7],
            [delay + 950, 8],
            [delay + 1100, 9],
          ].forEach(([t, p]) => setTimeout(() => setPhase(p), t));
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [delay]);

  const ops = [0, 0.15, 0, 0.4, 0.08, 0.7, 0.15, 0.85, 0.3, 1];
  const gls = [0, 4, 0, 8, 2, 14, 4, 18, 6, 22];

  return (
    <span
      ref={ref}
      style={{
        opacity: ops[phase] || 0,
        filter: `drop-shadow(0 0 ${gls[phase] || 0}px rgba(255,69,98,${(ops[phase] || 0) * 0.5}))`,
        transition:
          phase >= 9
            ? 'opacity 0.4s,filter 0.4s'
            : 'opacity 0.04s,filter 0.04s',
      }}
    >
      {children}
    </span>
  );
}
