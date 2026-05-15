# リズムレーン（Rhythm Lane）

TD-11 などの電子ドラムを **USB MIDI** で接続したPCのブラウザ上で、メトロノームに対する打撃の **早い／遅れ** をレーン表示し、セッション後に簡単なまとめを出す練習用Webアプリです。

## 必要環境

- **Chrome または Edge**（Web MIDI / Web Audio 利用）
- PCとドラム音源の **USB MIDI** 接続
- ローカルまたは `https` でのホスト（`file://` では MIDI が制限される場合があります）

## 使い方

```bash
npm install
npm run dev
```

表示された URL（通常 `http://localhost:5173`）をブラウザで開き、MIDIアクセスを許可してから **はじめる** を押してください。

### Git 取得後の手順（PC / iPad 別）

ZIP や `git clone` したあとからの具体的な流れは、次のドキュメントにまとめています。

- **[docs/getting-started-pc-ipad.md](./docs/getting-started-pc-ipad.md)** — PC での利用（推奨）、iPad での利用（同一 LAN から PC に接続する方法／単体利用の注意）

## スクリプト

| コマンド | 説明 |
|----------|------|
| `npm run dev` | 開発サーバー（localhost） |
| `npm run dev:lan` | 開発サーバー（LAN 公開・iPad からアクセスしやすい） |
| `npm run build` | 本番用 `dist/` を生成 |
| `npm run preview` | ビルド結果のプレビュー |
| `npm test` | Vitest ユニットテスト |

## 注意

- ハイハットの **オープン／クローズを要する課題は入れていません**（機器都合に合わせた仕様）。
- 拍の基準は **アプリ内メトロノーム**（Web Audio クロック）です。TD-11 のクリックはオフにすることを推奨します。
