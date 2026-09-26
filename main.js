'use strict';
import * as D from './deck.js';

// ---- 言葉（仕様「13.」）。端末の言語が ja で始まれば日本語、それ以外は英語 ----
// {n} などは差し込み。n === 1 のときは「キー_1」があればそちらを使う（英語の複数形）。
const T = {
  ja: {
    'app.title': 'LANDING DAY — 試験の日に着陸する暗記カード',
    'app.desc': '問題と答えを打って暗記カードを作り、試験の日を決めると、毎日「今日の分」だけ出てくる。上の滑走路のメーターで、今のペースで試験の日に全部覚えて着陸できるかが一目で分かる。',
    'coach.title': 'LANDING DAY の使い方',
    'coach.1': '試験の名前と日付を決める。',
    'coach.2': '問題と答えを打ってカードを作る。まとめて貼り付けもできる。',
    'coach.3': '毎日「今日の分」をめくって、「覚えた」か「まだ」を押す。',
    'coach.4': '上の飛行機が、試験の日に着陸できるかを見せる。遅れていたら、今日の分が少し増える。',
    'coach.ok': 'はじめる',
    'exam.set': '試験を決める',
    'exam.name': '試験の名前',
    'exam.namePh': '例: 英単語テスト',
    'exam.default': '試験',
    'exam.date': '試験の日',
    'exam.save': '決める',
    'exam.edit': '試験を直す',
    'meter.left': '{name} まで あと {n} 日',
    'meter.learned': '覚えた {p}%',
    'meter.onPace': '間に合うペース',
    'meter.bitBehind': '少し遅れ',
    'meter.behind': '遅れ（今日の分を少し増やした）',
    'meter.noExam': '試験を決めると、飛行機が飛び始める',
    'pace.onPace': '間に合うペース',
    'pace.bitBehind': '少し遅れ',
    'pace.behind': '遅れ',
    'home.today': '今日の分 {n} 枚',
    'home.todayCap': '今日の分 {n} 枚（残りは明日）',
    'home.doneToday': '今日の分おわり ✓',
    'home.more': 'もう少しやる',
    'plan.title': '今日の分の内訳',
    'plan.review': '復習（枚）',
    'plan.new': '新しい（枚）',
    'plan.flipped': '今日めくった（枚）',
    'plan.tomorrow': '明日の見込み（枚）',
    'plan.streak': 'つづけた（日）',
    'plan.daysLeft': '試験まで（日）',
    'home.makeCards': 'カードを作る',
    'nav.cards': 'カード',
    'nav.settings': '設定',
    'cards.count': '{n} / {max} 枚',
    'cards.q': '問題',
    'cards.a': '答え',
    'cards.add': '足す',
    'cards.paste': 'まとめて貼り付け',
    'cards.pasteHelp': '1 行に 1 枚。問題と答えはタブ・「 / 」・「,」で区切る。',
    'cards.pasteConfirm': '{n} 枚を足す',
    'cards.pasteSkipped': '区切りのない {n} 行を飛ばした',
    'cards.pasteOver': '上限のため {n} 枚は足せない',
    'cards.empty': 'まだカードがない。上の欄から足す。',
    'cards.edit': '直す',
    'cards.delete': '消す',
    'cards.deleteConfirm': 'このカードを消す？',
    'study.flip': 'タップで答え',
    'study.again': 'まだ',
    'study.good': '覚えた',
    'study.close': '閉じる（続きは保存）',
    'done.title': '今日の分おわり',
    'done.stats': '{n} 枚 ・ 覚えた {ok} ・ まだ {miss}',
    'done.streak': '{n} 日つづけて',
    'done.home': 'ホームへ',
    'landed.title': '着陸 ── {name}',
    'landed.next': '次の試験を決める',
    'landed.reset': 'カードの覚え具合を最初に戻す',
    'landed.keep': 'そのまま続ける',
    'lock.title': '有料の機能は近日',
    'lock.body': '今は無料で {max} 枚・試験 1 つまで使える。',
    'lock.soon': '近日',
    'pro.unlimited': '枚数と試験の数の制限なし',
    'pro.pass': '試験の前の券（3 か月）',
    'pro.images': '画像のカード',
    'pro.csv': 'CSV の読み込み・書き出し',
    'pro.weak': '苦手なカードだけ',
    'pro.graph': '覚え具合のグラフ',
    'set.sound': '音',
    'set.on': 'オン',
    'set.off': 'オフ',
    'set.pro': '有料の機能',
    'share.today': 'LANDING DAY: {name} まで あと {n} 日。今日の {c} 枚おわり、{state}（覚えた {p}%）',
    'share.landed': 'LANDING DAY: {name}に着陸（覚えた {p}%）',
    'kit.install': 'アプリにする',
    'kit.share': '共有',
    'ui.close': '閉じる',
    brand: 'T.OF... のアプリ',
  },
  en: {
    'app.title': 'LANDING DAY — Flashcards that land on exam day',
    'app.desc': "Type questions and answers to make flashcards, set your exam date, and get just today's share each day. The runway meter at the top shows at a glance whether you'll land with everything learned by exam day.",
    'coach.title': 'How LANDING DAY works',
    'coach.1': "Set your exam's name and date.",
    'coach.2': 'Type a question and answer to make a card. You can paste many at once.',
    'coach.3': 'Each day, flip through today\'s cards and tap "Got it" or "Not yet".',
    'coach.4': "The plane shows whether you'll land by exam day. Fall behind, and today's share grows a little.",
    'coach.ok': 'Start',
    'exam.set': 'Set exam',
    'exam.name': 'Exam name',
    'exam.namePh': 'e.g. Vocab test',
    'exam.default': 'Exam',
    'exam.date': 'Exam date',
    'exam.save': 'Save',
    'exam.edit': 'Edit exam',
    'meter.left': '{n} days to {name}',
    'meter.left_1': '1 day to {name}',
    'meter.learned': '{p}% learned',
    'meter.onPace': 'On pace',
    'meter.bitBehind': 'A bit behind',
    'meter.behind': "Behind (today's share raised)",
    'meter.noExam': 'Set an exam and your plane takes off',
    'pace.onPace': 'on pace',
    'pace.bitBehind': 'a bit behind',
    'pace.behind': 'behind',
    'home.today': 'Today: {n} cards',
    'home.today_1': 'Today: 1 card',
    'home.todayCap': 'Today: {n} cards (rest tomorrow)',
    'home.doneToday': 'Done for today ✓',
    'home.more': 'Do a few more',
    'plan.title': "Today's share",
    'plan.review': 'Review',
    'plan.new': 'New',
    'plan.flipped': 'Flipped today',
    'plan.tomorrow': 'Tomorrow (est.)',
    'plan.streak': 'Day streak',
    'plan.daysLeft': 'Days to exam',
    'home.makeCards': 'Make cards',
    'nav.cards': 'Cards',
    'nav.settings': 'Settings',
    'cards.count': '{n} / {max} cards',
    'cards.q': 'Question',
    'cards.a': 'Answer',
    'cards.add': 'Add',
    'cards.paste': 'Paste many',
    'cards.pasteHelp': 'One card per line. Separate question and answer with a tab, " / ", or ",".',
    'cards.pasteConfirm': 'Add {n} cards',
    'cards.pasteConfirm_1': 'Add 1 card',
    'cards.pasteSkipped': 'Skipped {n} lines with no separator',
    'cards.pasteSkipped_1': 'Skipped 1 line with no separator',
    'cards.pasteOver': "{n} won't fit under the limit",
    'cards.empty': 'No cards yet. Add one above.',
    'cards.edit': 'Edit',
    'cards.delete': 'Delete',
    'cards.deleteConfirm': 'Delete this card?',
    'study.flip': 'Tap to see the answer',
    'study.again': 'Not yet',
    'study.good': 'Got it',
    'study.close': 'Close (progress saved)',
    'done.title': 'Done for today',
    'done.stats': '{n} cards · {ok} got · {miss} not yet',
    'done.stats_1': '1 card · {ok} got · {miss} not yet',
    'done.streak': '{n}-day streak',
    'done.home': 'Home',
    'landed.title': 'Landed: {name}',
    'landed.next': 'Set next exam',
    'landed.reset': 'Reset card progress',
    'landed.keep': 'Keep progress',
    'lock.title': 'Pro features coming soon',
    'lock.body': 'For now, you can use up to {max} cards and 1 exam for free.',
    'lock.soon': 'Soon',
    'pro.unlimited': 'Unlimited cards and exams',
    'pro.pass': 'Exam pass (3 months)',
    'pro.images': 'Image cards',
    'pro.csv': 'CSV import / export',
    'pro.weak': 'Weak cards only',
    'pro.graph': 'Progress chart',
    'set.sound': 'Sound',
    'set.on': 'On',
    'set.off': 'Off',
    'set.pro': 'Pro features',
    'share.today': "LANDING DAY: {n} days to {name}. Finished today's {c} cards, {state} ({p}% learned)",
    'share.today_1': "LANDING DAY: 1 day to {name}. Finished today's {c} cards, {state} ({p}% learned)",
    'share.landed': 'LANDING DAY: Landed on {name} ({p}% learned)',
    'kit.install': 'Install app',
    'kit.share': 'Share',
    'ui.close': 'Close',
    brand: 'An app by T.OF...',
  },
};
const LANG = (navigator.language || '').toLowerCase().startsWith('ja') ? 'ja' : 'en';
function t(key, vars = {}) {
  const table = T[LANG];
  const s = (vars.n === 1 && table[`${key}_1`]) || table[key] || key;
  return s.replace(/\{(\w+)\}/g, (_, k) => (k in vars ? vars[k] : `{${k}}`));
}
const fmtNum = (x) => x.toLocaleString(LANG);
// 日本語「10月20日(火)」、英語「Tue, Oct 20」
const fmtDate = (s) => new Intl.DateTimeFormat(LANG, { month: LANG === 'ja' ? 'long' : 'short', day: 'numeric', weekday: 'short', timeZone: 'UTC' })
  .format(new Date(`${s}T00:00:00Z`));

document.documentElement.lang = LANG;
document.title = t('app.title');
WebAppKit.init({ lang: LANG, title: 'LANDING DAY', text: t('app.desc') });
const SHARE_URL = 'https://t-of.github.io/landing-day/';

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js');
}

// ---- 保存（仕様「5.」。どれも { v: 1, … }） ----
// localStorage はほかのアプリと共有される（同じ t-of.github.io のため）。キーは必ず 'landing-day.' で始める。
const STORE = 'landing-day.';
function load(key) {
  try {
    const v = localStorage.getItem(STORE + key);
    return v == null ? null : JSON.parse(v);
  } catch { return null; }
}
function save(key, value) {
  try { localStorage.setItem(STORE + key, JSON.stringify(value)); } catch { /* 保存できなくても使える */ }
}

const today = () => D.toDay();
const settings = D.cleanSettings(load('settings'));
let exam = D.cleanExam(load('exam'), today());
const deck = D.cleanDeck(load('cards'));
const log = D.cleanLog(load('days'));
const saveAll = () => { save('cards', deck); save('days', log); };

// ---- 音（Web Audio。仕様「6.」） ----
// iPhone のマナーモードでも鳴らす（Safari 16.4 以降）。
// 'playback' にすると音楽アプリの曲が止まるので、アプリの音がオンのときだけにする。
function setAudioSession(soundOn) {
  try { if (navigator.audioSession) navigator.audioSession.type = soundOn ? 'playback' : 'auto'; } catch { /* 対応していない */ }
}
let ac = null;
function audio() {
  if (!settings.sound) return null;
  try {
    setAudioSession(true);
    ac ||= new (window.AudioContext || window.webkitAudioContext)();
    if (ac.state === 'suspended') ac.resume();
    return ac;
  } catch { return null; }
}
function tone(freq, start, dur, { vol = 0.07, type = 'sine', to = null } = {}) {
  const a = audio();
  if (!a) return;
  const t0 = a.currentTime + start;
  const o = a.createOscillator();
  const g = a.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t0);
  if (to) o.frequency.exponentialRampToValueAtTime(to, t0 + dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(vol, t0 + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(g).connect(a.destination);
  o.start(t0);
  o.stop(t0 + dur + 0.02);
}
// 紙をめくるような「シュッ」（ノイズ 0.05 秒、高い方だけ）
function swish() {
  const a = audio();
  if (!a) return;
  const len = Math.floor(a.sampleRate * 0.05);
  const buf = a.createBuffer(1, len, a.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const src = a.createBufferSource();
  const hp = a.createBiquadFilter();
  const g = a.createGain();
  src.buffer = buf;
  hp.type = 'highpass';
  hp.frequency.value = 2500;
  g.gain.value = 0.12;
  src.connect(hp).connect(g).connect(a.destination);
  src.start();
}
const chime = (notes, gap, vol = 0.07) => notes.forEach((f, i) => tone(f, i * gap, 0.35, { vol }));
const sfx = {
  flip: swish,
  good: (top) => chime(top ? [660, 880, 1320] : [660, 990], 0.06, 0.06),
  again: () => tone(220, 0, 0.12, { vol: 0.06, type: 'triangle' }),
  done: () => { chime([523, 659, 784], 0.14); tone(900, 0.4, 0.8, { vol: 0.025, to: 300 }); },
  landed: () => chime([523, 659, 784, 1047], 0.16),
  add: () => tone(1400, 0, 0.03, { vol: 0.03, type: 'triangle' }),
  click: () => tone(1800, 0, 0.015, { vol: 0.02, type: 'square' }),
};

// ---- 画面の言葉を入れる ----
const $ = (id) => document.getElementById(id);
for (const el of document.querySelectorAll('[data-t]')) el.textContent = t(el.dataset.t, { max: D.FREE_MAX });
for (const el of document.querySelectorAll('[data-t-label]')) el.setAttribute('aria-label', t(el.dataset.tLabel));
for (const el of document.querySelectorAll('[data-t-ph]')) el.placeholder = t(el.dataset.tPh);

// ---- 滑走路のメーター ----
// 左上の空から右端（試験の日＝滑走路の終わり）へ降りていく。飛行機は進み p、小さな輪は目安 t。
const W = 320, H = 190;
const GLIDE = { x0: 26, y0: 42, x1: 286, y1: 158 };
const at = (f) => [GLIDE.x0 + (GLIDE.x1 - GLIDE.x0) * f, GLIDE.y0 + (GLIDE.y1 - GLIDE.y0) * f];
const ANGLE = (Math.atan2(GLIDE.y1 - GLIDE.y0, GLIDE.x1 - GLIDE.x0) * 180) / Math.PI;
const planeAt = (f) => { const [x, y] = at(f); return `translate(${x}px, ${y}px) rotate(${f >= 1 ? 0 : ANGLE}deg) scale(1.5)`; };
const ahead = (p, tt) => p >= tt - 1e-9;
const STARS = [[40, 14], [92, 30], [150, 12], [205, 38], [262, 18], [300, 52], [118, 62], [232, 76], [60, 92], [20, 64]];

function meterSVG(p, tt, dateLabel) {
  const [tx, ty] = at(tt);
  const edge = (y) => Array.from({ length: 8 }, (_, i) => `<circle cx="${190 + i * 17}" cy="${y}" r="1.4"/>`).join('');
  const stars = STARS.map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i % 3 ? 0.8 : 1.2}"/>`).join('');
  return `<svg class="runway ${ahead(p, tt) ? 'is-good' : 'is-late'}" viewBox="0 0 ${W} ${H}" aria-hidden="true">
    <g class="runway__stars">${stars}</g>
    <line class="runway__glide" x1="${GLIDE.x0}" y1="${GLIDE.y0}" x2="${GLIDE.x1}" y2="${GLIDE.y1}"/>
    <rect class="runway__strip" x="184" y="158" width="128" height="14" rx="2"/>
    <line class="runway__center" x1="192" y1="165" x2="306" y2="165"/>
    <g class="runway__lights">${edge(158)}${edge(172)}</g>
    <circle class="runway__mark" cx="${tx.toFixed(1)}" cy="${ty.toFixed(1)}" r="6"/>
    <g class="runway__plane" style="transform:${planeAt(p)}">
      <path d="M-13 0 L9 -2 Q14 -1 14 0 Q14 1 9 2 L-13 0 Z M-2 -1 L-8 -10 L-4 -10 L5 -1 Z M-2 1 L-8 10 L-4 10 L5 1 Z M-12 -1 L-15 -6 L-12 -6 L-8 -1 Z"/>
    </g>
    ${dateLabel ? `<text class="runway__date" x="${W - 8}" y="${H - 2}" text-anchor="end">${dateLabel}</text>` : ''}
  </svg>`;
}

// メーターの下の 1 行。区切りの「・」の所で折り返す
function meterLine(parts, state) {
  const el = $('meterLine');
  el.textContent = '';
  parts.forEach((txt, i) => {
    const s = document.createElement('span');
    s.textContent = txt;
    if (state && i === parts.length - 1) s.className = `is-${state}`;
    el.append(i ? ' ' : '', s); // span のあいだの空白で折り返す
  });
}

// ---- ホーム ----
const pct = () => Math.round(D.progress(deck.cards) * 100);
const examName = () => exam?.name || t('exam.default');
const paceNow = () => (exam ? D.pace(D.progress(deck.cards), D.target(exam, today())) : 'onPace');

function render() {
  const d = today();
  const landed = D.isLanded(exam, d);
  const p = D.progress(deck.cards);
  $('examName').textContent = exam ? examName() : 'LANDING DAY';

  if (!exam) {
    $('meter').innerHTML = meterSVG(0, 0, '');
    meterLine([t('meter.noExam')]);
  } else if (landed) {
    $('meter').innerHTML = meterSVG(1, 1, fmtDate(exam.date));
    meterLine([]);
  } else {
    const tt = D.target(exam, d);
    $('meter').innerHTML = meterSVG(p, tt, fmtDate(exam.date));
    const state = D.pace(p, tt);
    meterLine([
      t('meter.left', { name: examName(), n: D.daysLeft(exam, d) }),
      t('meter.learned', { p: pct() }),
      t(`meter.${state}`),
    ], state);
  }

  $('landed').hidden = !landed;
  $('today').hidden = landed;
  $('plan').hidden = true;
  if (landed) {
    $('landedTitle').textContent = t('landed.title', { name: examName() });
    $('landedSub').textContent = t('meter.learned', { p: pct() });
    return;
  }

  const btn = $('btnToday');
  let doneToday = false;
  if (!exam) {
    btn.textContent = t('exam.set');
    btn.dataset.act = 'exam';
  } else if (!deck.cards.length) {
    btn.textContent = t('home.makeCards');
    btn.dataset.act = 'cards';
  } else {
    const td = D.ensureToday(log, deck.cards, exam, d);
    save('days', log);
    const left = D.remaining(td);
    doneToday = left === 0;
    btn.textContent = t(td.capped ? 'home.todayCap' : 'home.today', { n: left });
    btn.dataset.act = 'study';
    renderPlan(td, doneToday, d);
  }
  btn.hidden = doneToday;
  $('btnMore').hidden = !(doneToday && D.moreLeft(deck, log));
}

// 今日の分の内訳のカード。終わったら、めくった数と明日の見込み
function renderPlan(td, done, d) {
  const [l1, v1, l2, v2] = done
    ? ['plan.flipped', log.days[d]?.n || 0, 'plan.tomorrow', D.forecast(deck.cards, exam, d)]
    : ['plan.review', D.split(td, deck.cards).review, 'plan.new', D.split(td, deck.cards).fresh];
  $('plan').hidden = false;
  $('plan').classList.toggle('is-done', done);
  $('planTitle').textContent = t(done ? 'home.doneToday' : 'plan.title');
  $('planL1').textContent = t(l1);
  $('planV1').textContent = fmtNum(v1);
  $('planL2').textContent = t(l2);
  $('planV2').textContent = fmtNum(v2);
  $('planStreak').textContent = fmtNum(D.streakNow(log.days, d));
  $('planDays').textContent = fmtNum(D.daysLeft(exam, d));
}

$('btnToday').addEventListener('click', () => {
  sfx.click();
  const act = $('btnToday').dataset.act;
  if (act === 'exam') openExam(false);
  else if (act === 'cards') openCards();
  else startStudy();
});
$('btnMore').addEventListener('click', () => { if (D.more(deck, log)) { save('days', log); startStudy(); } });
$('btnCards').addEventListener('click', () => { sfx.click(); openCards(); });
$('btnSettings').addEventListener('click', () => { sfx.click(); openSettings(); });
$('meter').addEventListener('click', () => openLock()); // 覚え具合のグラフ（有料・近日）
$('btnNextExam').addEventListener('click', () => { sfx.click(); openExam(true); });
$('btnShareLanded').addEventListener('click', () => {
  WebAppKit.share({ text: t('share.landed', { name: examName(), p: pct() }), url: SHARE_URL });
});

// シートを閉じる: [data-close] と、シートの外（背景）を押したとき。鍵のしるしは「近日」のシートへ
document.addEventListener('click', (e) => {
  const close = e.target.closest('[data-close]');
  if (close) { close.closest('dialog')?.close(); return; }
  if (e.target.closest('[data-lock]')) { openLock(); return; }
  if (e.target instanceof HTMLDialogElement) {
    const r = e.target.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) e.target.close();
  }
});
for (const dlg of document.querySelectorAll('dialog')) dlg.addEventListener('close', render);

// ---- はじめて（30 秒で分かる版を 1 回だけ） ----
$('coachOk').addEventListener('click', () => {
  sfx.click();
  settings.coached = true;
  save('settings', settings);
  $('coachSheet').close();
  if (!exam) openExam(false);
});

// ---- 試験を決める ----
let examFromLanded = false;
function openExam(fromLanded) {
  examFromLanded = fromLanded;
  const tomorrow = D.addDays(today(), 1);
  $('examNameIn').value = fromLanded ? '' : exam?.name || '';
  $('examDateIn').min = tomorrow; // 今日より後だけ
  $('examDateIn').value = !fromLanded && exam && exam.date >= tomorrow ? exam.date : '';
  $('examReset').hidden = !(fromLanded && deck.cards.length);
  $('examForm').elements.reset[0].checked = true;
  $('examSheet').showModal();
}
$('examForm').addEventListener('submit', (e) => {
  const d = today();
  const date = $('examDateIn').value;
  if (!D.isDate(date) || date <= d) { e.preventDefault(); $('examDateIn').reportValidity(); return; }
  const first = !exam;
  // 試験を直すときは始めた日をそのまま（段もそのまま）。次の試験・はじめては今日から
  const start = exam && !examFromLanded ? exam.start : d;
  exam = D.cleanExam({ name: $('examNameIn').value, date, start }, d);
  save('exam', exam);
  if (examFromLanded && $('examForm').elements.reset.value === 'reset') D.resetProgress(deck);
  log.today = null; // 今日の分は計算し直す
  saveAll();
  sfx.click();
  if (first && !deck.cards.length) setTimeout(openCards, 0);
});

// ---- カードのシート ----
const dots = (lv) => '●'.repeat(lv) + '○'.repeat(3 - lv);
function renderCards() {
  const n = deck.cards.length;
  const full = n >= D.FREE_MAX;
  $('cardsCount').textContent = t('cards.count', { n: fmtNum(n), max: fmtNum(D.FREE_MAX) });
  $('addBtn').classList.toggle('is-locked', full);
  $('addBtn').innerHTML = full ? `<svg class="lock"><use href="#i-lock"/></svg> ${t('cards.add')}` : t('cards.add');
  $('cardsEmpty').hidden = n > 0;
  const list = $('cardList');
  list.textContent = '';
  for (const c of [...deck.cards].reverse()) { // 新しいものを上に
    const b = document.createElement('button');
    b.className = 'list__item';
    b.dataset.id = c.id;
    const q = document.createElement('span');
    q.className = 'list__q';
    q.textContent = c.q;
    const lv = document.createElement('span');
    lv.className = 'list__lv';
    lv.textContent = dots(c.lv);
    lv.setAttribute('aria-label', `${c.lv} / 3`);
    b.append(q, lv);
    const li = document.createElement('li');
    li.append(b);
    list.append(li);
  }
  updatePaste();
}
function openCards() {
  renderCards();
  $('cardsSheet').showModal();
  $('cardsSheet').scrollTop = 0;
  if (matchMedia('(pointer: fine)').matches) $('addQ').focus();
  else document.activeElement?.blur(); // スマホで開いたとたんにキーボードを出さない
}
$('addForm').addEventListener('submit', (e) => {
  e.preventDefault();
  if (deck.cards.length >= D.FREE_MAX) { openLock(); return; } // 200 枚で止めるのは「足す」だけ
  const q = $('addQ').value.trim(), a = $('addA').value.trim();
  if (!q || !a) return;
  D.addCards(deck, [{ q, a }], today());
  save('cards', deck);
  sfx.add();
  $('addQ').value = '';
  $('addA').value = '';
  $('addQ').focus(); // 続けて打てるように
  renderCards();
});
function updatePaste() {
  const { items, skipped } = D.parsePaste($('pasteIn').value);
  const room = Math.max(0, D.FREE_MAX - deck.cards.length);
  const n = Math.min(items.length, room);
  const notes = [];
  if (skipped) notes.push(t('cards.pasteSkipped', { n: skipped }));
  if (items.length > room) notes.push(t('cards.pasteOver', { n: items.length - room }));
  $('pasteNote').textContent = notes.join(' ・ ');
  $('pasteBtn').textContent = t('cards.pasteConfirm', { n });
  $('pasteBtn').disabled = n === 0;
}
$('pasteIn').addEventListener('input', updatePaste);
$('pasteBtn').addEventListener('click', () => {
  const { items } = D.parsePaste($('pasteIn').value);
  const added = D.addCards(deck, items, today());
  if (!added) return;
  save('cards', deck);
  sfx.add();
  $('pasteIn').value = '';
  $('paste').open = false;
  renderCards();
  if (items.length > added) openLock();
});

// 直す・消す
let editing = null;
$('cardList').addEventListener('click', (e) => {
  const b = e.target.closest('.list__item');
  if (!b) return;
  editing = deck.cards.find((c) => c.id === +b.dataset.id);
  if (!editing) return;
  sfx.click();
  $('editQ').value = editing.q;
  $('editA').value = editing.a;
  $('editSheet').showModal();
});
$('editForm').addEventListener('submit', (e) => {
  const q = $('editQ').value.trim(), a = $('editA').value.trim();
  if (!editing || !q || !a) { e.preventDefault(); return; }
  editing.q = q;
  editing.a = a;
  save('cards', deck);
  renderCards();
});
$('editDelete').addEventListener('click', () => {
  if (!editing || !confirm(t('cards.deleteConfirm'))) return;
  D.removeCard(deck, log, editing.id);
  saveAll();
  $('editSheet').close();
  renderCards();
});

// ---- 設定・有料の機能（最初の版は鍵と「近日」を並べるだけ。決済は入れない） ----
const PRO = ['unlimited', 'pass', 'images', 'csv', 'weak', 'graph'];
$('proList').innerHTML = PRO.map((k) => `<li><button class="line" data-lock="${k}"><span><svg class="lock"><use href="#i-lock"/></svg> ${t(`pro.${k}`)}</span><em>${t('lock.soon')}</em></button></li>`).join('');
const renderSound = () => { $('soundState').textContent = t(settings.sound ? 'set.on' : 'set.off'); };
function openSettings() { renderSound(); $('settingsSheet').showModal(); }
$('soundBtn').addEventListener('click', () => {
  settings.sound = !settings.sound;
  setAudioSession(settings.sound);
  save('settings', settings);
  renderSound();
  sfx.click();
});
$('editExamBtn').addEventListener('click', () => { $('settingsSheet').close(); openExam(false); });
function openLock() {
  sfx.click();
  $('lockBody').textContent = t('lock.body', { max: D.FREE_MAX });
  $('lockSheet').showModal();
}

// ---- めくる ----
let flipped = false;
let pBefore = 0;
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
function startStudy() {
  if (!exam || !D.remaining(log.today)) return;
  pBefore = D.progress(deck.cards);
  $('study').hidden = false;
  $('home').inert = true;
  showCard(false);
}
function closeStudy() {
  $('study').hidden = true;
  $('home').inert = false;
  render();
}
function showCard(slide) {
  const td = log.today;
  while (td.pos < td.queue.length && !deck.cards.some((c) => c.id === td.queue[td.pos])) td.pos++; // 念のため、無いカードは飛ばす
  if (td.pos >= td.queue.length) { finish(); return; }
  const c = deck.cards.find((x) => x.id === td.queue[td.pos]);
  flipped = false;
  const card = $('card');
  card.classList.remove('is-flipped');
  $('cardQ').textContent = c.q;
  $('cardQ2').textContent = c.q;
  $('cardA').textContent = c.a;
  $('answers').classList.remove('is-shown'); // 表のうちは押せない（答えを見ずに押さないように）
  $('studyCount').textContent = `${td.pos + 1} / ${td.queue.length}`;
  $('studyBar').style.width = `${(td.pos / td.queue.length) * 100}%`;
  if (slide && !reduced.matches) {
    card.classList.remove('is-in');
    void card.offsetWidth; // アニメーションをやり直す
    card.classList.add('is-in');
  }
}
function flip() {
  flipped = !flipped;
  $('card').classList.toggle('is-flipped', flipped);
  if (flipped) $('answers').classList.add('is-shown');
  sfx.flip();
}
function respond(good) {
  if (!flipped) return;
  const c = D.answer(deck, log, exam, good);
  saveAll(); // 押した瞬間に書く
  if (good) sfx.good(c?.lv === 3); else sfx.again();
  showCard(true);
}
function finish() {
  $('study').hidden = true;
  $('home').inert = false;
  render();
  const d = log.today.date;
  const day = log.days[d] || { n: 0, ok: 0 };
  const p = D.progress(deck.cards);
  const tt = D.target(exam, d);
  $('doneStats').textContent = t('done.stats', { n: day.n, ok: day.ok, miss: day.n - day.ok });
  $('doneMeter').innerHTML = meterSVG(pBefore, tt, fmtDate(exam.date));
  $('donePace').textContent = `${t(`meter.${paceNow()}`)} ・ ${t('meter.learned', { p: pct() })}`;
  const s = D.streak(log.days, d);
  $('doneStreak').textContent = s ? t('done.streak', { n: s }) : '';
  $('doneMore').hidden = !D.moreLeft(deck, log);
  $('doneSheet').showModal();
  // 飛行機を今日の前の位置から今の位置へ（0.8 秒）
  const svg = $('doneMeter').querySelector('.runway');
  requestAnimationFrame(() => requestAnimationFrame(() => {
    svg.querySelector('.runway__plane').style.transform = planeAt(p);
    svg.classList.toggle('is-good', ahead(p, tt));
    svg.classList.toggle('is-late', !ahead(p, tt));
  }));
  sfx.done();
}
$('card').addEventListener('click', flip);
$('btnAgain').addEventListener('click', () => respond(false));
$('btnGood').addEventListener('click', () => respond(true));
$('studyClose').addEventListener('click', () => { sfx.click(); closeStudy(); });
$('doneMore').addEventListener('click', () => {
  $('doneSheet').close();
  if (D.more(deck, log)) { save('days', log); startStudy(); }
});
$('doneShare').addEventListener('click', () => {
  const d = log.today.date;
  WebAppKit.share({
    text: t('share.today', { name: examName(), n: D.daysLeft(exam, d), c: log.days[d]?.n || 0, state: t(`pace.${paceNow()}`), p: pct() }),
    url: SHARE_URL,
  });
});

// PC: Space で裏返す、← まだ、→ 覚えた、Esc で閉じる
document.addEventListener('keydown', (e) => {
  if ($('study').hidden || e.repeat) return;
  if (e.key === ' ') { e.preventDefault(); document.activeElement?.blur(); flip(); } // フォーカス中のボタンが Space で押されないように
  else if (e.key === 'ArrowLeft') respond(false);
  else if (e.key === 'ArrowRight') respond(true);
  else if (e.key === 'Escape') closeStudy();
});

// 開いたまま 0 時をまたいだ・あとで開き直したときに今日の分を作り直す
document.addEventListener('visibilitychange', () => { if (!document.hidden && $('study').hidden) render(); });

// 着陸した画面では、最初に触ったときに 4 音のチャイム（ブラウザは触る前の音を止めるため）
document.addEventListener('pointerdown', () => { if (D.isLanded(exam, today())) sfx.landed(); }, { once: true });

// ---- はじまり ----
render();
if (!settings.coached) $('coachSheet').showModal();
