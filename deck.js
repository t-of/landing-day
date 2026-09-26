// LANDING DAY の中身。画面（DOM）に触らない部分をここに集める。
// main.js（ブラウザ）と test.mjs（node）の両方から読む。決まりは仕様「3.」。

export const FREE_MAX = 200;   // 無料で持てるカードの数
export const DAILY_MAX = 120;  // 今日の分の上限（それ以上は明日へ）
export const MORE = 10;        // 「もう少しやる」で前倒しする新しいカードの数
export const RETRY_GAP = 5;    // 「まだ」のカードを何枚あとにもう一度出すか
export const TEXT_MAX = 500;   // 問題・答えの長さの上限
const INTERVAL = { 1: 1, 2: 3 }; // 段 → 次に出すまでの日数。段 3 は出さない
const EPS = 1e-9;

// ---- 日付（'YYYY-MM-DD'。端末の時計の 0 時で変わる） ----
const pad = (n) => String(n).padStart(2, '0');
export const toDay = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const num = (s) => Date.UTC(+s.slice(0, 4), +s.slice(5, 7) - 1, +s.slice(8, 10)) / 864e5;
export const diff = (a, b) => num(b) - num(a); // a から b まで何日
export const addDays = (s, n) => new Date((num(s) + n) * 864e5).toISOString().slice(0, 10);
export const isDate = (s) => typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s) && addDays(s, 0) === s;
const minDate = (a, b) => (a < b ? a : b);

// ---- 滑走路のメーター ----
// 進み p = 段の合計 ÷ (枚数 × 3)
export function progress(cards) {
  if (!cards.length) return 0;
  return cards.reduce((s, c) => s + c.lv, 0) / (cards.length * 3);
}
// 目安 t = (今日 − 始めた日) ÷ (試験の前日 − 始めた日)。0〜1
export function target(exam, today) {
  const span = diff(exam.start, addDays(exam.date, -1));
  if (span <= 0) return 1;
  return Math.min(1, Math.max(0, diff(exam.start, today) / span));
}
export function pace(p, t) {
  if (p >= t - EPS) return 'onPace';
  if (p >= t - 0.15 - EPS) return 'bitBehind';
  return 'behind';
}
export const daysLeft = (exam, today) => diff(today, exam.date);
export const isLanded = (exam, today) => !!exam && today >= exam.date;

// ---- 今日の分 ----
// 新しいカードの数 = 切り上げ(残りの段 0 ÷ max(1, 残り日数 − 2))。遅れなら 1.2 倍（切り上げ）
export function newCount(unseen, left, behind) {
  if (unseen <= 0) return 0;
  const base = Math.ceil(unseen / Math.max(1, left - 2));
  return Math.min(unseen, behind ? Math.ceil((base * 6) / 5) : base); // 1.2 を掛けると浮動小数で 12.000…2 になるので整数で
}

const unseen = (cards) => cards.filter((c) => c.lv === 0 && c.due == null);

export function buildToday(cards, exam, today) {
  const out = { date: today, queue: [], pos: 0, retry: [], capped: false };
  if (!exam || !cards.length || isLanded(exam, today)) return out;
  // ① 次に出す日が今日以前のカード（古い順）。「まだ」を押した段 0 のカードもここに入る
  const reviews = cards.filter((c) => c.lv < 3 && c.due != null && c.due <= today)
    .sort((a, b) => (a.due < b.due ? -1 : a.due > b.due ? 1 : a.id - b.id));
  // ② まだ出していないカード（足した順）
  const fresh = unseen(cards);
  const behind = pace(progress(cards), target(exam, today)) === 'behind';
  let queue = [...reviews, ...fresh.slice(0, newCount(fresh.length, daysLeft(exam, today), behind))].map((c) => c.id);
  if (queue.length > DAILY_MAX) { queue = queue.slice(0, DAILY_MAX); out.capped = true; }
  out.queue = queue;
  return out;
}

// 日付が変わった、またはまだ 1 枚もめくっていなければ作り直す（カードを足した・試験を変えたのを入れるため）
export function ensureToday(log, cards, exam, today) {
  const t = log.today;
  if (!t || t.date !== today || t.pos === 0) log.today = buildToday(cards, exam, today);
  return log.today;
}

export const remaining = (t) => (t ? Math.max(0, t.queue.length - t.pos) : 0);

// 「覚えた」(good = true) /「まだ」。deck と log を書き換える
export function answer(deck, log, exam, good) {
  const t = log.today;
  const id = t.queue[t.pos];
  const c = deck.cards.find((x) => x.id === id);
  t.pos++;
  if (!c) return null;
  const today = t.date;
  const eve = addDays(exam.date, -1); // 次に出す日は試験の前日より後にしない
  const again = t.retry.includes(id); // 今日すでに「まだ」を押したカード
  if (!again) {
    const day = (log.days[today] ||= { n: 0, ok: 0 });
    day.n++;
    if (good) day.ok++;
    if (good) {
      c.lv = Math.min(3, c.lv + 1);
      c.due = c.lv >= 3 ? null : minDate(addDays(today, INTERVAL[c.lv]), eve);
      c.ok++;
    } else {
      c.lv = Math.max(0, c.lv - 1);
      c.due = minDate(addDays(today, 1), eve); // 明日もまた出す
      c.miss++;
      t.retry.push(id);
    }
  }
  // 「まだ」は同じ回のうちに 5 枚あとにもう一度（2 回目以降の「まだ」でも）。2 回目の「覚えた」は段を上げない
  if (!good) t.queue.splice(Math.min(t.pos + RETRY_GAP, t.queue.length), 0, id);
  if (t.pos >= t.queue.length) (log.days[today] ||= { n: 0, ok: 0 }).fin = true;
  return c;
}

// 「もう少しやる」: まだ出していないカードを 10 枚、今日の並びの後ろに足す
export function more(deck, log) {
  const t = log.today;
  const inQueue = new Set(t.queue);
  const add = unseen(deck.cards).filter((c) => !inQueue.has(c.id)).slice(0, MORE).map((c) => c.id);
  t.queue.push(...add);
  return add.length;
}
export const moreLeft = (deck, log) => {
  const inQueue = new Set(log.today?.queue || []);
  return unseen(deck.cards).some((c) => !inQueue.has(c.id));
};

// 1 日でも今日の分を終えた日が、今日からさかのぼって何日つづいているか
export function streak(days, today) {
  let n = 0;
  for (let d = today; days[d]?.fin; d = addDays(d, -1)) n++;
  return n;
}

// ---- カード ----
// 足した数を返す。無料の上限を越えるぶんは足さない
export function addCards(deck, items, today) {
  const room = Math.max(0, FREE_MAX - deck.cards.length);
  const list = items.slice(0, room);
  for (const { q, a } of list) {
    deck.cards.push({ id: deck.next++, q: q.slice(0, TEXT_MAX), a: a.slice(0, TEXT_MAX), lv: 0, due: null, ok: 0, miss: 0, added: today });
  }
  return list.length;
}

export function removeCard(deck, log, id) {
  deck.cards = deck.cards.filter((c) => c.id !== id);
  const t = log.today;
  if (!t) return;
  t.pos -= t.queue.slice(0, t.pos).filter((x) => x === id).length;
  t.queue = t.queue.filter((x) => x !== id);
  t.retry = t.retry.filter((x) => x !== id);
}

export function resetProgress(deck) {
  for (const c of deck.cards) { c.lv = 0; c.due = null; }
}

// まとめて貼り付け: 1 行 1 枚。区切りはタブ →「 / 」→「,」の順に探す（最初に見つかった 1 か所で分ける）
export function parsePaste(text) {
  const items = [];
  let skipped = 0;
  for (const line of String(text).split(/\r?\n/)) {
    if (!line.trim()) continue;
    const sep = ['\t', ' / ', ','].find((s) => line.includes(s));
    const i = sep ? line.indexOf(sep) : -1;
    const q = i < 0 ? '' : line.slice(0, i).trim();
    const a = i < 0 ? '' : line.slice(i + sep.length).trim();
    if (q && a) items.push({ q, a });
    else skipped++;
  }
  return { items, skipped };
}

// ---- 保存データを確かめる（読めない項目ははじめの値、知らない項目は捨てる） ----
const nat = (x) => (Number.isInteger(x) && x >= 0 ? x : 0);
const ids = (a) => (Array.isArray(a) ? a.filter((x) => Number.isInteger(x)) : []);

export function cleanSettings(o) {
  return { v: 1, sound: typeof o?.sound === 'boolean' ? o.sound : true, coached: o?.coached === true };
}

export function cleanExam(o, today) {
  if (!o || !isDate(o.date)) return null;
  const name = typeof o.name === 'string' ? o.name.trim().slice(0, 40) : '';
  return { v: 1, name, date: o.date, start: isDate(o.start) ? o.start : today };
}

export function cleanDeck(o) {
  const src = Array.isArray(o?.cards) ? o.cards : [];
  const seen = new Set();
  const cards = [];
  for (const c of src) {
    if (!c || !Number.isInteger(c.id) || seen.has(c.id) || typeof c.q !== 'string' || typeof c.a !== 'string') continue;
    seen.add(c.id);
    const lv = [0, 1, 2, 3].includes(c.lv) ? c.lv : 0;
    cards.push({ id: c.id, q: c.q, a: c.a, lv, due: lv < 3 && isDate(c.due) ? c.due : null,
      ok: nat(c.ok), miss: nat(c.miss), added: isDate(c.added) ? c.added : null });
  }
  const next = Math.max(nat(o?.next), 1, ...cards.map((c) => c.id + 1));
  return { v: 1, next, cards };
}

export function cleanLog(o) {
  const days = {};
  if (o?.days && typeof o.days === 'object') {
    for (const [d, e] of Object.entries(o.days)) {
      if (!isDate(d) || !e || typeof e !== 'object') continue;
      days[d] = { n: nat(e.n), ok: nat(e.ok) };
      if (e.fin === true) days[d].fin = true;
    }
  }
  let today = null;
  const t = o?.today;
  if (t && isDate(t.date)) {
    const queue = ids(t.queue);
    today = { date: t.date, queue, pos: Math.min(nat(t.pos), queue.length), retry: ids(t.retry), capped: t.capped === true };
  }
  return { v: 1, days, today };
}
