import { useState } from 'react'
import { diagnose, reportUrl } from './api.js'
import ScoreGauge from './ScoreGauge.jsx'
import FindingsList from './FindingsList.jsx'

export default function App() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!url.trim()) return

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const normalized = /^https?:\/\//.test(url.trim()) ? url.trim() : `https://${url.trim()}`
      const data = await diagnose(normalized)
      setResult(data)
    } catch (err) {
      setError(err.message || '診断中に問題が発生しました。URLを確認してもう一度お試しください。')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <header className="hero">
        <div className="eyebrow">SATOLAB. / SITE CHECK</div>
        <h1>あなたのサイト、<br />健康診断しませんか。</h1>
        <p className="hero-sub">
          URLを入力するだけで、SEO・セキュリティ・パフォーマンスの基本項目を無料でチェックします。
        </p>

        <form className="url-form" onSubmit={handleSubmit}>
          <input
            type="text"
            inputMode="url"
            placeholder="example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            aria-label="診断したいサイトのURL"
          />
          <button type="submit" disabled={loading}>
            {loading ? '診断中…' : '診断する'}
          </button>
        </form>

        {error && <p className="error-message" role="alert">{error}</p>}
      </header>

      {result && (
        <section className="results">
          <div className="results-meta mono">
            <span>{result.url}</span>
            <span>{new Date(result.checked_at).toLocaleString('ja-JP')}</span>
          </div>

          <div className="report-download">
            <a href={reportUrl(result.id)} className="download-button" download>
              PDFでダウンロード
            </a>
          </div>

          <div className="gauges">
            <ScoreGauge
              label="パフォーマンス"
              score={result.scores.performance}
              diff={result.diff?.performance}
            />
            <ScoreGauge label="SEO" score={result.scores.seo} diff={result.diff?.seo} />
            <ScoreGauge
              label="セキュリティ"
              score={result.scores.security}
              diff={result.diff?.security}
            />
          </div>

          {result.previous && (
            <p className="compare-note">前回の診断結果と比較しています。</p>
          )}

          <FindingsList details={result.details} />
        </section>
      )}

      {loading && !result && (
        <div className="skeleton" aria-hidden="true">
          <div className="skeleton-bar" />
          <div className="skeleton-bar short" />
        </div>
      )}
    </div>
  )
}
