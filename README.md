# LANDING DAY — 試験の日に着陸する暗記カード

問題と答えを打って暗記カードを作り、試験の日を決めると、毎日「今日の分」だけ出てくる。上の滑走路のメーターで、今のペースで試験の日に全部覚えて着陸できるかが一目で分かる。

English: Type questions and answers to make flashcards, set your exam date, and get just today's share each day. The runway meter at the top shows at a glance whether you'll land with everything learned by exam day.

## 🔗 リンク

- 使う: https://t-of.github.io/landing-day/
- 制作: [T.OF...](https://t-of.github.io/)

## 遊び方

1. 試験の名前と日付を決める。
2. 問題と答えを打ってカードを作る。「まとめて貼り付け」なら 1 行 1 枚（問題と答えはタブ・「 / 」・「,」で区切る。表計算からコピーするとタブになる）。
3. 毎日「今日の分」をめくる。カードをタップで裏返し、「覚えた」か「まだ」を押す。PC は Space で裏返す、← まだ、→ 覚えた。
4. 上の飛行機が進み（覚えた量）、小さな輪が目安（今日までに覚えていたい量）。飛行機が輪より右なら間に合うペース。遅れていたら今日の分が少し増える。

決まり（段を 0〜3 で数える自前の簡単なやり方）:

| | |
|---|---|
| 覚えた | 段 +1。段 1 は 1 日後、段 2 は 3 日後にまた出す（試験の前日より後にはしない）。段 3 で「覚えた」になり、もう出さない |
| まだ | 段 −1（0 より下にはしない）。同じ回の 5 枚あとにもう一度出し、明日もまた出す |
| 今日の分 | 次に出す日が来たカード ＋ 新しいカード。新しいカードは 切り上げ(残り ÷ (残り日数 − 2)) 枚で、試験の 2 日前までに全部 1 回は出る。遅れているときは 1.2 倍。1 日 120 枚まで |
| もう少しやる | 今日の分が終わったあと、明日の新しいカードを 10 枚前倒しで出す |

無料で使えるのはカード 200 枚・試験 1 つ。有料の機能（制限なし・画像のカード・CSV の読み込みと書き出し など）は「近日」。

## アプリとして入れる（PWA）

- iPhone / iPad: Safari で開き、共有 → 「ホーム画面に追加」
- Android / PC の Chrome・Edge: 画面の「アプリにする」ボタン、またはアドレスバーのインストールボタン

## 開発

ビルド不要。フォルダをそのまま静的サーバで開く。

```sh
python3 -m http.server 0 --bind 127.0.0.1   # 出た番号で http://127.0.0.1:<番号>/ を開く
node test.mjs                                # 今日の分の計算・段・上限・貼り付け・保存データのテスト
```

| ファイル | 中身 |
|---|---|
| `deck.js` | 画面に触らない決まり（今日の分、段、メーター、貼り付け、保存データの確かめ）。`main.js` と `test.mjs` の両方から読む |
| `main.js` | 画面、言葉（日本語・英語の表 `T`）、音、保存 |
| `test.mjs` | `deck.js` のテスト（node の assert だけ） |

### 保存

カードは端末の中の **localStorage** に置く（サーバー・ログインなし）。IndexedDB にしなかったのは、無料の 200 枚なら 1 枚 150 バイトほどで全部で 30 KB くらいにしかならず、localStorage の容量（5 MB ほど）に十分収まり、同期で読み書きできて簡単だから。画像のカードや枚数の制限なしを入れるときに IndexedDB（名前 `landing-day`）へ移し、古いキーから引き継ぐ。

| キー | 中身 |
|---|---|
| `landing-day.settings` | `{ v: 1, sound, coached }` |
| `landing-day.exam` | `{ v: 1, name, date, start }` |
| `landing-day.cards` | `{ v: 1, next, cards: [{ id, q, a, lv, due, ok, miss, added }] }` |
| `landing-day.days` | `{ v: 1, days: { 'YYYY-MM-DD': { n, ok, fin } }, today: { date, queue, pos, retry, capped } }` |

どれも版の番号 `v` を持つ。読めない値ははじめの値に戻し、知らない項目は捨てる（`deck.js` の `clean*`）。

### 言葉

端末の言語（`navigator.language`）が `ja` で始まれば日本語、それ以外は英語。`<html lang>` と webapp-kit もそれに合わせる。HTML の `<title>`・説明・OGP・manifest は日本語のまま（ポータルが日本語のため）。
