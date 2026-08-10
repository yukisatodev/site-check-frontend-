const SEO_LABELS = {
  title: 'title タグ',
  meta_description: 'meta description',
  h1: 'h1 タグ',
  images: '画像の alt 属性',
}

const SECURITY_LABELS = {
  https: 'HTTPS化',
  hsts: 'Strict-Transport-Security',
  x_content_type_options: 'X-Content-Type-Options',
  x_frame_options: 'X-Frame-Options',
}

function FindingsGroup({ title, labels, data }) {
  return (
    <div className="findings-group">
      <h3 className="findings-title">{title}</h3>
      <ul className="findings-list">
        {Object.entries(labels).map(([key, label]) => {
          const item = data?.[key]
          if (!item) return null
          return (
            <li key={key} className={item.ok ? 'ok' : 'warn'}>
              <span className="icon">{item.ok ? '✓' : '!'}</span>
              <span className="label">{label}</span>
              {item.note && <span className="note">{item.note}</span>}
              {item.suggestion && <span className="suggestion">💡 {item.suggestion}</span>}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function collectSuggestions(details) {
  const all = []
  for (const group of ['seo', 'security']) {
    const data = details?.[group]
    if (!data) continue
    for (const item of Object.values(data)) {
      if (item?.suggestion) all.push(item.suggestion)
    }
  }
  return all
}

export default function FindingsList({ details }) {
  if (!details) return null
  const suggestions = collectSuggestions(details)

  return (
    <>
      {suggestions.length > 0 && (
        <div className="recommendations">
          <h3 className="findings-title">改善提案</h3>
          <ol className="recommendations-list">
            {suggestions.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
        </div>
      )}
      <div className="findings">
        <FindingsGroup title="SEO" labels={SEO_LABELS} data={details.seo} />
        <FindingsGroup title="セキュリティ" labels={SECURITY_LABELS} data={details.security} />
      </div>
    </>
  )
}
