# Site Check（Webサイト診断ツール）

URLを入れると、SEO・セキュリティ・パフォーマンス（PageSpeed Insights連携時）を診断し、
前回結果との差分・履歴つきでレポートするツールです。

## 構成

```
web-diagnostic-tool/       ← バックエンド（FastAPI）
  app/
    main.py                ← APIエンドポイント
    database.py             ← SQLiteモデル（DATABASE_URLでクラウドDBに差し替え可）
    diagnostics.py          ← 診断ロジック本体
  requirements.txt

web-diagnostic-frontend/   ← フロントエンド（React + Vite）
  src/
    App.jsx                ← メイン画面
    ScoreGauge.jsx          ← スコアの円グラフ
    FindingsList.jsx        ← SEO/セキュリティの指摘事項一覧
    api.js                  ← バックエンドAPIとの通信
```

## ローカルで動かす

### 1. バックエンド

```bash
cd web-diagnostic-tool
pip install -r requirements.txt
uvicorn app.main:app --reload
```

`http://127.0.0.1:8000/docs` でAPIを直接試せます。

パフォーマンス計測をしたい場合は、[Google PageSpeed Insights API](https://developers.google.com/speed/docs/insights/v5/get-started)
のAPIキーを取得し、環境変数 `PAGESPEED_API_KEY` に設定してください（未設定でもSEO・セキュリティ診断は動きます）。

### 2. フロントエンド

```bash
cd web-diagnostic-frontend
npm install
npm run dev
```

`http://127.0.0.1:5173` が開きます。バックエンドのURLを変えたい場合は `.env` に

```
VITE_API_BASE_URL=http://127.0.0.1:8000
```

を書いてください。

## デプロイの目安

- バックエンド: Render / Railway の無料枠（常時起動が必要なため、GitHub Pages/Netlifyのような静的ホスティングでは動きません）
- フロントエンド: Vercel / Netlify / GitHub Pages（`npm run build` の `dist/` を公開）
- DB: そのままSQLiteでもよいが、無料クラウドはディスクが揮発することが多いので、永続化したい場合はTurso等への切り替えを推奨（`DATABASE_URL`環境変数を差し替えるだけで対応できる構成にしてある）

## 次にやると良さそうなこと

- PDFレポート出力（WeasyPrintでHTML→PDF）
- 履歴のグラフ表示（フロントに`/api/history/{url}`を使ったチャートを追加）
- 診断項目の追加（robots.txt / sitemap.xml の有無など）
