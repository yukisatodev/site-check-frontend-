// バックエンドのURL。開発時はVite proxyかローカルAPIを、本番はビルド時に環境変数で差し替える。
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'

export async function diagnose(url) {
  const res = await fetch(`${API_BASE}/api/diagnose`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  })

  if (!res.ok) {
    const body = await res.json().catch(() => null)
    throw new Error(body?.detail || `診断に失敗しました (status ${res.status})`)
  }

  return res.json()
}

export function reportUrl(id) {
  return `${API_BASE}/api/report/${id}`
}

export async function fetchHistory(url) {
  const res = await fetch(`${API_BASE}/api/history/${encodeURIComponent(url)}`)
  if (!res.ok) throw new Error('履歴の取得に失敗しました')
  return res.json()
}
