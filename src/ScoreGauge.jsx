import { useEffect, useRef, useState } from 'react'

const RADIUS = 46
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

function scoreTier(score) {
  if (score === null || score === undefined) return 'none'
  if (score >= 90) return 'great'
  if (score >= 50) return 'ok'
  return 'warn'
}

const TIER_COLOR = {
  great: 'var(--gold)',
  ok: 'var(--steel)',
  warn: 'var(--warn)',
  none: 'var(--line-strong)',
}

function DiffBadge({ diff }) {
  if (diff === null || diff === undefined) return null
  if (diff === 0) return <span className="diff diff-flat">±0</span>
  const up = diff > 0
  return (
    <span className={`diff ${up ? 'diff-up' : 'diff-down'}`}>
      {up ? '▲' : '▼'} {Math.abs(diff)}
    </span>
  )
}

export default function ScoreGauge({ label, score, diff }) {
  const hasScore = score !== null && score !== undefined
  const target = hasScore ? Math.max(0, Math.min(100, score)) : 0
  const [display, setDisplay] = useState(0)
  const rafRef = useRef(null)

  useEffect(() => {
    if (!hasScore) { setDisplay(0); return }
    const duration = 900
    const start = performance.now()
    const from = 0

    function tick(now) {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setDisplay(Math.round(from + (target - from) * eased))
      if (t < 1) rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, hasScore])

  const offset = CIRCUMFERENCE * (1 - display / 100)
  const tier = scoreTier(score)

  return (
    <div className={`gauge-card tier-${tier}`}>
      <div className="gauge-glow" aria-hidden="true" />
      <svg viewBox="0 0 120 120" className="gauge-svg">
        <circle cx="60" cy="60" r={RADIUS} className="gauge-track" />
        <circle
          cx="60"
          cy="60"
          r={RADIUS}
          className="gauge-fill"
          style={{
            stroke: TIER_COLOR[tier],
            strokeDasharray: CIRCUMFERENCE,
            strokeDashoffset: hasScore ? offset : CIRCUMFERENCE,
          }}
        />
        <text x="60" y="57" textAnchor="middle" className="gauge-number">
          {hasScore ? display : '—'}
        </text>
        <text x="60" y="76" textAnchor="middle" className="gauge-unit">
          {hasScore ? '/ 100' : '未計測'}
        </text>
      </svg>
      <div className="gauge-label">{label}</div>
      <DiffBadge diff={diff} />
    </div>
  )
}
