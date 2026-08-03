# スプシアシスト オンライン座談会LP

GitHub Pagesでそのまま公開できる、完全静的なランディングページです。ビルドやGitHub Actionsは不要です。

## 公開前に必ず変更する項目

### 1. 開催情報・申込先・計測ID

`assets/js/config.js` を開き、以下を実際の値へ変更します。

```js
window.LP_CONFIG = {
  applicationUrl: "https://申込フォームのURL",
  eventDate: "2026年9月10日（木）19:00〜20:00",
  capacity: "先着15名",
  contactEmail: "contact@example.com",
  websiteUrl: "https://example.com/",
  ga4MeasurementId: "G-XXXXXXXXXX",
  gtmContainerId: ""
};
```

- GA4だけを使う場合は `ga4MeasurementId` を設定します。
- GTMを使う場合は `gtmContainerId` に `GTM-XXXXXXX` を設定し、`ga4MeasurementId` は空欄にします（GTM側でGA4を配信）。
- GA4/GTMを使わない場合は両方とも空欄のままで構いません。

### 2. 公開URL

リポジトリ内の `https://example.com/` を実際の公開URLに置換してください。対象ファイルは次の4つです。

- `index.html`（canonical、OGP、構造化データ）
- `robots.txt`
- `sitemap.xml`
- 必要に応じて `assets/js/config.js` の `websiteUrl`

プロジェクトPages（`https://ユーザー名.github.io/リポジトリ名/`）を使う場合は、その階層まで含めます。

## GitHub Pagesで公開する手順

1. GitHubで新しいリポジトリを作成します。
2. このフォルダの**中身**（`index.html`、`assets`、`README.md` など）をリポジトリのルートへアップロードします。
3. GitHubのリポジトリ画面で **Settings → Pages** を開きます。
4. **Build and deployment** の Source を **Deploy from a branch** にします。
5. Branchで `main`、フォルダで `/ (root)` を選び **Save** を押します。
6. 数分後に表示される公開URLを開き、申込ボタン・画像・404ページを確認します。
7. 公開URLを `index.html`、`robots.txt`、`sitemap.xml` へ反映して再アップロードします。

独自ドメインを使う場合は、Pagesの **Custom domain** も設定してください。

## 計測イベント

CTAクリック時は次のイベントが `dataLayer` とGA4へ送られます。

- イベント名：`application_click`
- パラメータ：`cta_location`（`header` / `hero` / `final` / `mobile`）、`link_url`

GTMでは「カスタムイベント = `application_click`」をトリガーにしてGA4イベントタグを設定できます。

外部フォームではなくページ内フォームを後から設置する場合は、送信成功時に次を実行してください。`form_submit` がGA4/GTMへ送られます。

```js
document.dispatchEvent(new CustomEvent("supushi:form-submit", {
  detail: { form_name: "roundtable_application" }
}));
```

## CVR改善の考え方

- Heroをサービス説明から「自分の疑問」に変え、最初の画面で対象者・価値・所要時間・無料・参加ハードルを理解できるようにしました。
- 「悩みへの共感 → 持ち帰れること → Before/After → 当日の流れ → 参加条件 → 申込」の順にし、申込前の疑問をスクロールに沿って解消します。
- CTAは「無料」だけでなく、何に申し込むか・所要時間・遷移先を明示しました。営業感を抑える安心材料も隣接させています。
- Before/Afterは画像だけに頼らず、作業内容を左右で比較できる構造にしました。
- スマートフォンではHeroのCTAが見えなくなった後だけ固定CTAを表示し、本文を読む邪魔を減らしています。
- 「限定」「残席わずか」など根拠のない希少性や、未確認の成果数値は使用していません。

## 技術・保守

- `index.html`：文章と構造
- `assets/css/style.css`：デザインとレスポンシブ対応
- `assets/js/config.js`：更新頻度の高い開催情報・URL・計測ID
- `assets/js/main.js`：CTA計測、軽量アニメーション、固定CTA
- `404.html`：GitHub Pages用404ページ
- `robots.txt` / `sitemap.xml`：検索エンジン向け
- `.nojekyll`：GitHub Pagesで静的ファイルをそのまま配信

画像はWebP化し、ファーストビュー以外は遅延読込にしています。OS標準フォントを使用するため、外部フォントの通信もありません。アニメーションは `prefers-reduced-motion` に対応しています。

## 公開前チェック

- 申込ボタンが正しいフォームを開く
- 開催日時・定員・連絡先が正しい
- `https://example.com/` が残っていない
- スマートフォンで文字やボタンが見切れない
- OGP画像が共有時に表示される
- GA4のDebugViewまたはGTM Previewで `application_click` を確認する
- 実際のフォーム送信完了数と申込者数を照合する
