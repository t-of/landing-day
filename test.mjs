// node test.mjs — 画面を使わない部分のテスト（仕様「3.」の決まり・「8.」の自己チェック）
import assert from 'node:assert/strict';
import * as D from './deck.js';

let n = 0;
const test = (name, fn) => { fn(); n++; console.log(`ok ${name}`); };

const TODAY = '2026-10-01';
const deckOf = (count, fill = {}) => {
  const deck = { v: 1, next: 1, cards: [] };
  D.addCards(deck, Array.from({ length: count }, (_, i) => ({ q: `q${i}`, a: `a${i}` })), TODAY);
  deck.cards.forEach((c) => Object.assign(c, fill));
  return deck;
};
const log0 = () => ({ v: 1, days: {}, today: null });

test('今日の分: 残り 20 日・段 0 が 180 枚 → 10 枚', () => {
  const exam = { name: 'x', date: D.addDays(TODAY, 20), start: TODAY };
  assert.equal(D.buildToday(deckOf(180).cards, exam, TODAY).queue.length, 10);
});

test('今日の分: 遅れていれば 1.2 倍 → 12 枚', () => {
  // 始めて 20 日たって段が全部 0 → p = 0、t > 0.15 で「遅れ」
  const exam = { name: 'x', date: D.addDays(TODAY, 20), start: D.addDays(TODAY, -20) };
  const cards = deckOf(180).cards;
  assert.equal(D.pace(D.progress(cards), D.target(exam, TODAY)), 'behind');
  assert.equal(D.buildToday(cards, exam, TODAY).queue.length, 12);
  assert.equal(D.newCount(180, 20, true), 12);
});

test('今日の分: 1.2 倍の切り上げ・残りより多くしない・残り日数が少ないとき', () => {
  assert.equal(D.newCount(19, 20, false), 2);   // 19/18 → 2
  assert.equal(D.newCount(19, 20, true), 3);    // 2 × 1.2 = 2.4 → 3
  assert.equal(D.newCount(5, 2, true), 5);      // max(1, 0) → 5、1.2 倍しても 5 まで
  assert.equal(D.newCount(0, 10, true), 0);
});

test('今日の分: 復習が先・次に出す日が古い順、120 枚で打ち切り', () => {
  const exam = { name: 'x', date: D.addDays(TODAY, 30), start: TODAY };
  const deck = deckOf(3);
  deck.cards[0].lv = 1; deck.cards[0].due = TODAY;
  deck.cards[2].lv = 2; deck.cards[2].due = D.addDays(TODAY, -2);
  const q = D.buildToday(deck.cards, exam, TODAY).queue;
  assert.deepEqual(q, [3, 1, 2]);
  const big = deckOf(200, { lv: 1, due: TODAY });
  const t = D.buildToday(big.cards, exam, TODAY);
  assert.equal(t.queue.length, 120);
  assert.equal(t.capped, true);
});

test('今日の分: カード 0 枚・試験なし → 空', () => {
  const exam = { name: 'x', date: D.addDays(TODAY, 20), start: TODAY };
  assert.equal(D.buildToday([], exam, TODAY).queue.length, 0);
  assert.equal(D.buildToday(deckOf(5).cards, null, TODAY).queue.length, 0);
  assert.equal(D.progress([]), 0);
});

test('試験の日を過ぎた（当日も）→ 着陸・今日の分は空', () => {
  const exam = { name: 'x', date: TODAY, start: D.addDays(TODAY, -10) };
  assert.equal(D.isLanded(exam, TODAY), true);
  assert.equal(D.isLanded(exam, D.addDays(TODAY, 3)), true);
  assert.equal(D.isLanded(exam, D.addDays(TODAY, -1)), false);
  assert.equal(D.buildToday(deckOf(5, { lv: 1, due: TODAY }).cards, exam, D.addDays(TODAY, 3)).queue.length, 0);
});

test('段: 覚えたで上がる（1 日後・3 日後・段 3 は出さない）、まだで下がる', () => {
  const exam = { name: 'x', date: D.addDays(TODAY, 30), start: TODAY };
  const deck = deckOf(1);
  const c = deck.cards[0];
  const day = (d, good) => {
    const log = log0();
    log.today = { date: d, queue: [c.id], pos: 0, retry: [], capped: false };
    D.answer(deck, log, exam, good);
    return log;
  };
  day(TODAY, true); assert.equal(c.lv, 1); assert.equal(c.due, D.addDays(TODAY, 1));
  day(c.due, true); assert.equal(c.lv, 2); assert.equal(c.due, D.addDays(TODAY, 4));
  day(c.due, false); assert.equal(c.lv, 1); assert.equal(c.due, D.addDays(TODAY, 5));
  day(c.due, true); assert.equal(c.lv, 2);
  day(c.due, true); assert.equal(c.lv, 3); assert.equal(c.due, null);
  const d0 = deckOf(1).cards[0];
  const deck0 = { v: 1, next: 2, cards: [d0] };
  const log = log0();
  log.today = { date: TODAY, queue: [d0.id], pos: 0, retry: [], capped: false };
  D.answer(deck0, log, exam, false);
  assert.equal(d0.lv, 0, '0 より下にしない');
  assert.equal(d0.due, D.addDays(TODAY, 1), '段 0 でも明日また出す');
});

test('次に出す日は試験の前日を越えない', () => {
  const exam = { name: 'x', date: D.addDays(TODAY, 2), start: TODAY };
  const deck = deckOf(1, { lv: 1, due: TODAY });
  const log = log0();
  log.today = { date: TODAY, queue: [1], pos: 0, retry: [], capped: false };
  D.answer(deck, log, exam, true); // 段 2 → 本来は 3 日後
  assert.equal(deck.cards[0].due, D.addDays(TODAY, 1));
});

test('まだ: 5 枚あとにもう一度。2 回目の覚えたでは段が上がらない、数えない', () => {
  const exam = { name: 'x', date: D.addDays(TODAY, 30), start: TODAY };
  const deck = deckOf(10);
  const log = log0();
  log.today = { date: TODAY, queue: deck.cards.map((c) => c.id), pos: 0, retry: [], capped: false };
  D.answer(deck, log, exam, false);
  assert.deepEqual(log.today.queue.slice(0, 8), [1, 2, 3, 4, 5, 6, 1, 7]);
  for (let i = 0; i < 5; i++) D.answer(deck, log, exam, true);
  D.answer(deck, log, exam, true); // 2 回目のカード 1
  assert.equal(deck.cards[0].lv, 0);
  assert.equal(deck.cards[0].due, D.addDays(TODAY, 1));
  assert.deepEqual(log.days[TODAY], { n: 6, ok: 5 });
  while (D.remaining(log.today)) D.answer(deck, log, exam, true);
  assert.equal(log.days[TODAY].fin, true);
  assert.equal(log.days[TODAY].n, 10);
});

test('進み・目安・状態の境目', () => {
  const exam = { name: 'x', date: '2026-10-11', start: '2026-10-01' }; // 前日まで 9 日
  assert.equal(D.target(exam, '2026-10-01'), 0);
  assert.equal(D.target(exam, '2026-10-10'), 1);
  assert.equal(D.target(exam, '2026-09-01'), 0);
  assert.equal(D.target({ date: '2026-10-02', start: '2026-10-01' }, '2026-10-01'), 1);
  assert.equal(D.pace(0.5, 0.5), 'onPace');
  assert.equal(D.pace(0.35, 0.5), 'bitBehind');
  assert.equal(D.pace(0.34, 0.5), 'behind');
  assert.equal(D.progress(deckOf(2, { lv: 3 }).cards), 1);
  assert.equal(D.progress([{ lv: 3 }, { lv: 0 }]), 0.5);
});

test('200 枚の上限: 越えるぶんは足さない', () => {
  const deck = deckOf(195);
  const added = D.addCards(deck, Array.from({ length: 10 }, () => ({ q: 'q', a: 'a' })), TODAY);
  assert.equal(added, 5);
  assert.equal(deck.cards.length, D.FREE_MAX);
  assert.equal(D.addCards(deck, [{ q: 'q', a: 'a' }], TODAY), 0);
  assert.equal(deck.cards.length, 200);
  assert.equal(new Set(deck.cards.map((c) => c.id)).size, 200);
});

test('まとめて貼り付けの区切り（タブ・ / ・,）', () => {
  const r = D.parsePaste('apple\tりんご\ndog / 犬\ncat,ねこ\n\nno separator\n  , 空\nA / B, C');
  assert.deepEqual(r.items, [
    { q: 'apple', a: 'りんご' }, { q: 'dog', a: '犬' }, { q: 'cat', a: 'ねこ' }, { q: 'A', a: 'B, C' },
  ]);
  assert.equal(r.skipped, 2);
});

test('日付をまたぐと今日の並びを作り直す。めくり始めたら同じ日は保つ', () => {
  const exam = { name: 'x', date: D.addDays(TODAY, 20), start: TODAY };
  const deck = deckOf(36);
  const log = log0();
  const t1 = D.ensureToday(log, deck.cards, exam, TODAY);
  assert.equal(t1.queue.length, 2);
  D.answer(deck, log, exam, true);
  D.addCards(deck, [{ q: 'x', a: 'y' }], TODAY);
  assert.equal(D.ensureToday(log, deck.cards, exam, TODAY), t1);
  const t2 = D.ensureToday(log, deck.cards, exam, D.addDays(TODAY, 1));
  assert.notEqual(t2, t1);
  assert.equal(t2.date, D.addDays(TODAY, 1));
  assert.equal(t2.queue[0], 1, '昨日覚えたカードが復習で先頭');
});

test('もう少しやる: 新しいカードを 10 枚まで前倒し', () => {
  const exam = { name: 'x', date: D.addDays(TODAY, 20), start: TODAY };
  const deck = deckOf(15);
  const log = log0();
  D.ensureToday(log, deck.cards, exam, TODAY);
  const first = log.today.queue.length;
  assert.equal(D.more(deck, log), 10);
  assert.equal(new Set(log.today.queue).size, first + 10);
  D.more(deck, log);
  assert.equal(D.moreLeft(deck, log), false);
});

test('続けた日数', () => {
  const days = { [TODAY]: { fin: true }, [D.addDays(TODAY, -1)]: { fin: true }, [D.addDays(TODAY, -3)]: { fin: true } };
  assert.equal(D.streak(days, TODAY), 2);
  assert.equal(D.streak({}, TODAY), 0);
  assert.equal(D.streakNow({ [D.addDays(TODAY, -1)]: { fin: true } }, TODAY), 1, '今日まだなら昨日までを数える');
  assert.equal(D.streakNow(days, TODAY), 2);
});

test('ホームの内訳: 残りの復習と新しい、明日の見込み', () => {
  const exam = { name: 'x', date: D.addDays(TODAY, 20), start: TODAY };
  const deck = deckOf(36);
  deck.cards[0].lv = 1; deck.cards[0].due = TODAY;
  const log = log0();
  D.ensureToday(log, deck.cards, exam, TODAY);
  assert.deepEqual(D.split(log.today, deck.cards), { review: 1, fresh: 2 });
  D.answer(deck, log, exam, true); // 復習を 1 枚
  assert.deepEqual(D.split(log.today, deck.cards), { review: 0, fresh: 2 });
  assert.deepEqual(D.split(null, deck.cards), { review: 0, fresh: 0 });
  // 明日: 残り 19 日・段 0 が 35 枚 → 切り上げ(35/17) = 3 枚（段 2 のカードは 3 日後なので入らない）
  assert.equal(D.forecast(deck.cards, exam, TODAY), 3);
  assert.equal(D.forecast(deck.cards, { ...exam, date: D.addDays(TODAY, 1) }, TODAY), 0, '明日が試験の日なら 0');
});

test('消す: 今日の並びからも抜き、めくった位置を合わせる', () => {
  const deck = deckOf(4);
  const log = { v: 1, days: {}, today: { date: TODAY, queue: [1, 2, 3, 1, 4], pos: 2, retry: [1], capped: false } };
  D.removeCard(deck, log, 1);
  assert.deepEqual(log.today.queue, [2, 3, 4]);
  assert.equal(log.today.pos, 1);
  assert.deepEqual(log.today.retry, []);
});

test('保存データ: 壊れた値ははじめの値、知らない項目は捨てる、版の番号を付ける', () => {
  assert.deepEqual(D.cleanSettings(null), { v: 1, sound: true, coached: false });
  assert.deepEqual(D.cleanSettings({ sound: false, coached: true, x: 1 }), { v: 1, sound: false, coached: true });
  assert.equal(D.cleanExam({ date: 'nope' }, TODAY), null);
  assert.deepEqual(D.cleanExam({ name: ' 英単語 ', date: '2026-10-20' }, TODAY), { v: 1, name: '英単語', date: '2026-10-20', start: TODAY });
  const deck = D.cleanDeck({ next: 2, cards: [{ id: 5, q: 'a', a: 'b', lv: 9, due: 'x', extra: 1 }, { id: 5, q: 'dup', a: '' }, { q: 'no id' }] });
  assert.deepEqual(deck, { v: 1, next: 6, cards: [{ id: 5, q: 'a', a: 'b', lv: 0, due: null, ok: 0, miss: 0, added: null }] });
  assert.deepEqual(D.cleanLog('garbage'), { v: 1, days: {}, today: null });
  const log = D.cleanLog({ days: { [TODAY]: { n: 3, ok: 2, fin: true }, bad: {} }, today: { date: TODAY, queue: [1, 'x', 2], pos: 9 } });
  assert.deepEqual(log.days, { [TODAY]: { n: 3, ok: 2, fin: true } });
  assert.deepEqual(log.today, { date: TODAY, queue: [1, 2], pos: 2, retry: [], capped: false });
});

test('日付の計算', () => {
  assert.equal(D.addDays('2026-12-31', 1), '2027-01-01');
  assert.equal(D.diff('2026-03-01', '2026-03-31'), 30);
  assert.equal(D.toDay(new Date(2026, 0, 5, 23, 59)), '2026-01-05');
  assert.equal(D.isDate('2026-02-30'), false);
});

console.log(`\n${n} 件すべて合格`);
