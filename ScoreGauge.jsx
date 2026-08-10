const RADIUS = 44
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

function scoreColor(score) {
  if (score === null || score === undefined) return 'var(--line-strong)'
  if (score >= 90) return 'var(--gold)'
  if (score >= 50) return 'var(--steel)'
  return 'var(--warn)'
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
  const progress = hasScore ? Math.max(0, Math.min(100, score)) : 0
  const offset = CIRCUMFERENCE * (1 - progress / 100)

  return (
    <div className="gauge-card">
      <svg viewBox="0 0 110 110" className="gauge-svg">
        <circle cx="55" cy="55" r={RADIUS} className="gauge-track" />
        <circle
          cx="55"
          cy="55"
          r={RADIUS}
          className="gauge-fill"
          style={{
            stroke: scoreColor(score),
            strokeDasharray: CIRCUMFERENCE,
            strokeDashoffset: hasScore ? offset : CIRCUMFERENCE,
          }}
        />
        <text x="55" y="52" textAnchor="middle" className="gauge-number">
          {hasScore ? progress : '—'}
        </text>
        <text x="55" y="70" textAnchor="middle" className="gauge-unit">
          {hasScore ? '/ 100' : '未計測'}
        </text>
      </svg>
      <div className="gauge-label">{label}</div>
      <DiffBadge diff={diff} />
    </div>
  )
}
