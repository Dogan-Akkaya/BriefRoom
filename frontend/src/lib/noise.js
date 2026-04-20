// Hand-rolled multi-layer sine/cosine noise.
// Identical formula to SmokeHero.jsx (kept inline there per "do not touch" rule).
// Output roughly in [-1.5, 1.5].
export const noise = (x, y, t) =>
  Math.sin(x * 0.007 + t * 0.0011) *
    Math.cos(y * 0.009 + t * 0.0013) *
    Math.sin((x + y) * 0.005 + t * 0.0007) +
  Math.sin(x * 0.013 + y * 0.011 + t * 0.0019) * 0.5
