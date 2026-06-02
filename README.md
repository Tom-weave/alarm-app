# alarm-app

シンプルなWeb版の目覚ましアプリ。HTML/CSS/JavaScript + [Convex](https://www.convex.dev/) で動きます。
アラーム設定はConvexに保存され、リロード/別デバイスからも同期されます。

## セットアップ

```bash
npm install
npx convex dev
```

`npx convex dev` の初回実行で:
- ブラウザでConvexにログイン
- 新規プロジェクト名を選択
- `.env.local` にデプロイURLが書き出されます

`.env.local` の `CONVEX_URL`（例: `https://xxxx-yyyy-123.convex.cloud`）を
`config.js` の `window.CONVEX_URL` にコピーしてください。

## 起動

`index.html` をローカルサーバ経由で開きます（ESモジュール読み込みのため `file://` は不可）:

```bash
npx serve .
```

## ファイル構成

- `index.html` / `style.css` / `app.js` — フロント
- `convex/schema.ts` — `alarms` テーブル定義
- `convex/alarms.ts` — `get` / `set` / `clear` クエリ・ミューテーション
- `config.js` — Convex デプロイURL設定（公開リポジトリのURLなので秘匿不要）
