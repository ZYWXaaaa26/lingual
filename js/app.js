(function () {
'use strict';

/* ---------- utilitaires ---------- */
function $(s) { return document.querySelector(s); }
function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}
function shuffle(a) {
  a = a.slice();
  for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
  return a;
}
function unique(a) { return a.filter(function (x, i) { return a.indexOf(x) === i; }); }
function firstAlt(f) { return String(f).split('|')[0]; }
function alts(f) {
  var out = [];
  String(f).split('|').forEach(function (a) {
    if (a.indexOf('(e)') >= 0) { out.push(a.replace('(e)', 'e')); out.push(a.replace('(e)', '')); } else out.push(a);
  });
  return out;
}
function norm(s) { return String(s).toLowerCase().replace(/[.!?¿¡,;:«»"“”’']/g, '').replace(/\s+/g, ' ').trim(); }
function strip(s) { return norm(s).normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ß/g, 'ss'); }
function checkTyped(input, ans) {
  var list = alts(ans), n = norm(input);
  if (!n) return false;
  if (list.some(function (a) { return norm(a) === n; })) return 'exact';
  if (list.some(function (a) { return strip(a) === strip(input); })) return 'accent';
  return false;
}
function speakable(t) { return String(t).split('|')[0].replace('(e)', '').replace(/\s*\(.*?\)\s*/g, ' ').trim(); }

/* ---------- langues ---------- */
var LANGS = [
  { id: 'es', name: 'Espagnol', hello: 'Hola', level: 'A2', note: 'Débutant', gen: 'Spanish', glevel: 'A2 (beginner)',
    focus: 'Priorité : les verbes irréguliers au présent, puis le passé (indefinido et perfecto) et les phrases du quotidien.' },
  { id: 'de', name: 'Allemand', hello: 'Hallo', level: 'B2', note: 'À réactiver', gen: 'German', glevel: 'B2 (rusty, being reactivated after years without practice)',
    focus: 'Tu as déjà vu tout ça : on réactive vite. Priorité : articles et cas, verbes forts, Perfekt, ordre des mots.' },
  { id: 'en', name: 'Anglais', hello: 'Hello', level: 'B2 → C1', note: 'Objectif fluidité', gen: 'English', glevel: 'B2 aiming for C1 / fluent',
    focus: 'Objectif fluidité : nuances de temps, conditionnels, expressions naturelles et réponses sans traduire dans ta tête.' },
  { id: 'ru', name: 'Russe', hello: 'Привет', level: 'A0', note: 'Départ de zéro', gen: 'Russian', glevel: 'A0 (absolute beginner: keep sentences very short and add phonetics)',
    focus: 'On commence par l’alphabet, puis les phrases de survie, puis le présent. Toute la phonétique est donnée en français.' },
  { id: 'x', name: 'Langue 5', hello: '…', level: '', note: 'À choisir ensemble', off: true }
];
function L(id) { return LANGS.filter(function (l) { return l.id === id; })[0]; }
var CODES = { es: 'es-ES', de: 'de-DE', en: 'en-GB', ru: 'ru-RU' };

/* ---------- état et sauvegarde ---------- */
var KEY = 'babel-de-poche-v1', DAY = 86400000, BOX_DAYS = [0, 1, 3, 7, 14, 30];
var mem = null;
function defState() { return { cards: {}, xp: 0, streak: { last: '', n: 0 }, path: {}, min: {}, goal: 25, active: ['es', 'de', 'en', 'ru'], settings: { rate: 1, conj: { es: 'type', de: 'type', en: 'type', ru: 'mcq' } } }; }
var S = defState();
function loadState() {
  try {
    var raw = null;
    try { raw = window.localStorage.getItem(KEY); } catch (e) { raw = mem; }
    if (raw) mergeState(JSON.parse(raw));
  } catch (e) {}
}
function mergeState(o) {
  var d = defState();
  S = Object.assign(d, o);
  S.settings = Object.assign(defState().settings, o.settings || {});
  S.settings.conj = Object.assign(defState().settings.conj, (o.settings && o.settings.conj) || {});
}
function save() {
  var raw = JSON.stringify(S);
  mem = raw;
  try { window.localStorage.setItem(KEY, raw); } catch (e) {}
}
var KEY2 = 'babel-de-poche-content-v1', CONT = {}, mem2 = null;
function loadContent() {
  try {
    var raw = null;
    try { raw = window.localStorage.getItem(KEY2); } catch (e) { raw = mem2; }
    if (raw) CONT = JSON.parse(raw) || {};
  } catch (e) { CONT = {}; }
}
function saveContent() {
  var raw = JSON.stringify(CONT); mem2 = raw;
  try { window.localStorage.setItem(KEY2, raw); } catch (e) {}
}
function dayKey(t) { var d = new Date(t); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
function touchStreak() {
  var today = dayKey(Date.now());
  if (S.streak.last === today) return;
  S.streak.n = (S.streak.last === dayKey(Date.now() - DAY)) ? S.streak.n + 1 : 1;
  S.streak.last = today;
}
/* temps passé dans l'app : on compte l'écart entre deux touches, plafonné à 2 min */
var lastTick = 0, lastSave = 0;
function tick() {
  var n = Date.now();
  if (lastTick && n - lastTick < 120000) {
    var k = dayKey(n); S.min[k] = (S.min[k] || 0) + (n - lastTick) / 60000;
    if (n - lastSave > 15000) { lastSave = n; save(); }
  }
  lastTick = n;
}
function todayMin() { return S.min[dayKey(Date.now())] || 0; }
function curStreak() {
  var l = S.streak.last;
  return (l === dayKey(Date.now()) || l === dayKey(Date.now() - DAY)) ? S.streak.n : 0;
}

/* ---------- audio ---------- */
var speechOK = ('speechSynthesis' in window) && typeof window.SpeechSynthesisUtterance === 'function';
function pickVoice(code) {
  var vs = [];
  try { vs = window.speechSynthesis.getVoices() || []; } catch (e) {}
  var c = code.toLowerCase();
  var ex = vs.filter(function (v) { return v.lang.replace('_', '-').toLowerCase() === c; });
  if (ex.length) return ex[0];
  var p = vs.filter(function (v) { return v.lang.toLowerCase().slice(0, 2) === c.slice(0, 2); });
  return p[0] || null;
}
var curUtter = null, audioMsg = '';
function speak(text, lang) {
  if (!speechOK) { audioMsg = 'Cet appareil n’a pas de synthèse vocale.'; return; }
  var synth = window.speechSynthesis;
  function go() {
    try {
      var u = new window.SpeechSynthesisUtterance(speakable(text));
      u.lang = CODES[lang] || lang;
      var v = pickVoice(u.lang); if (v) u.voice = v;
      u.rate = S.settings.rate || 1; u.volume = 1;
      u.onerror = function (e) { audioMsg = 'Erreur audio : ' + ((e && e.error) || 'inconnue'); };
      u.onstart = function () { audioMsg = ''; };
      curUtter = u;                       /* garde une référence : Safari peut sinon couper la voix */
      try { synth.resume(); } catch (e) {}
      synth.speak(u);
    } catch (e) { audioMsg = 'Erreur audio.'; }
  }
  try {
    if (synth.speaking || synth.pending) { synth.cancel(); setTimeout(go, 90); } else go();
  } catch (e) { go(); }
}
function voiceInfo() {
  var vs = []; try { vs = window.speechSynthesis.getVoices() || []; } catch (e) {}
  return { n: vs.length, ok: ['es-ES', 'de-DE', 'en-GB', 'ru-RU'].map(function (c) { return [c, !!pickVoice(c)]; }) };
}
if (speechOK) { try { window.speechSynthesis.onvoiceschanged = function () {}; window.speechSynthesis.getVoices(); } catch (e) {} }

/* ---------- cartes ---------- */
var CACHE = {};
function buildCards(lang) {
  if (CACHE[lang]) return CACHE[lang];
  var d = D[lang], out = [];
  d.sit.forEach(function (s) {
    s.phrases.forEach(function (p, i) { out.push({ id: lang + '|ph|' + s.id + '|' + i, lang: lang, kind: 'phrase', sit: s.id, t: p[0], f: p[1], r: p[2] || '' }); });
  });
  d.quiz.forEach(function (q, i) { out.push({ id: lang + '|q|' + i, lang: lang, kind: 'mcq', q: q[0], opts: q[1], a: q[1][q[2]], why: q[3] }); });
  if (d.alpha) {
    var n = d.alpha.length;
    d.alpha.forEach(function (a, i) {
      var o1 = [a[2]], o2 = [a[0] + ' ' + a[1]];
      [7, 13, 21].forEach(function (k) { var b = d.alpha[(i + k) % n]; o1.push(b[2]); o2.push(b[0] + ' ' + b[1]); });
      out.push({ id: lang + '|al|' + i + '|s', lang: lang, kind: 'mcq', alpha: true, q: 'Quel son fait la lettre « ' + a[0] + ' ' + a[1] + ' » ?', opts: o1, a: a[2], why: a[0] + ' ' + a[1] + ' se prononce [' + a[2] + '], comme dans ' + a[3] + ' (' + a[4] + ').', say: a[3] });
      out.push({ id: lang + '|al|' + i + '|l', lang: lang, kind: 'mcq', alpha: true, q: 'Quelle lettre fait le son [' + a[2] + '] ?', opts: o2, a: a[0] + ' ' + a[1], why: 'Le son [' + a[2] + '] s’écrit ' + a[0] + ' ' + a[1] + ' (' + a[3] + ', ' + a[4] + ').', say: a[3] });
    });
  }
  d.verbs.forEach(function (v) {
    d.tenses.forEach(function (t) {
      v.t[t.k].forEach(function (f, i) {
        if (f === '—' || (d.noDrill && d.noDrill[t.k])) return;
        out.push({ id: lang + '|c|' + v.inf + '|' + t.k + '|' + i, lang: lang, kind: 'conj', verb: v, tense: t, idx: i, ans: f });
      });
    });
  });
  CACHE[lang] = out;
  return out;
}
function dueCount(lang) {
  var now = Date.now(), n = 0, pre = lang + '|';
  for (var k in S.cards) { if (k.indexOf(pre) === 0 && S.cards[k].due <= now) n++; }
  return n;
}
function seenCount(lang) {
  var n = 0, pre = lang + '|';
  for (var k in S.cards) { if (k.indexOf(pre) === 0) n++; }
  return n;
}
function conjOpts(c) {
  var v = c.verb, ans = firstAlt(c.ans);
  var same = unique(v.t[c.tense.k].map(firstAlt)).filter(function (x) { return x !== ans && x !== '—'; });
  var pool = [];
  D[c.lang].tenses.forEach(function (t) { v.t[t.k].forEach(function (f) { var x = firstAlt(f); if (x !== ans && x !== '—') pool.push(x); }); });
  pool = unique(pool);
  var opts = [ans];
  shuffle(same).concat(shuffle(pool)).forEach(function (x) { if (opts.length < 4 && opts.indexOf(x) < 0) opts.push(x); });
  return opts;
}
function reviewCards(lang) {
  var all = buildCards(lang), now = Date.now();
  var due = dueCards(lang, 12);
  var need = Math.max(0, 10 - due.length);
  var fresh = all.filter(function (c) { return !S.cards[c.id]; });
  var easy = shuffle(fresh.filter(function (c) { return c.kind !== 'conj'; }));
  var conj = shuffle(fresh.filter(function (c) { return c.kind === 'conj'; }));
  var cp = conj.slice(0, Math.min(3, need));
  var ep = easy.slice(0, need - cp.length);
  return shuffle(due.concat(ep).concat(cp));
}

/* ---------- navigation ---------- */
var V = { view: 'home', lang: null, verb: 0, tense: 0, sit: null, unit: 0, prep: null, session: null, chat: null, ret: null, note: '' };
var TOP = { home: 1, review: 1, settings: 1 };
function go(p) { Object.assign(V, p); render(); try { window.scrollTo(0, 0); } catch (e) {} }

/* ---------- vues ---------- */
function topBar(title, backLabel) {
  return '<div class="top"><button class="back" data-act="back">‹ ' + esc(backLabel || 'Retour') + '</button>' + (title ? '<span class="muted small">' + esc(title) + '</span>' : '') + '</div>';
}
function tabbar() {
  var t = [['home', 'Langues'], ['review', 'Réviser'], ['settings', 'Réglages']];
  return '<nav class="tabbar" aria-label="Navigation"><div>' + t.map(function (x) {
    return '<button class="tab" data-act="tab" data-v="' + x[0] + '"' + (V.view === x[0] ? ' aria-current="page"' : '') + '>' + x[1] + '</button>';
  }).join('') + '</div></nav>';
}
function viewHome() {
  var total = 0; LANGS.forEach(function (l) { if (!l.off) total += dueCount(l.id); });
  return '<div class="top"><h1 style="display:flex;align-items:center;gap:10px"><img src="icon-180.png" alt="" width="44" height="44" style="border-radius:10px">Lingual</h1><div class="chips"><span class="chip"><b>' + curStreak() + '</b> j de suite</span><span class="chip"><b>' + S.xp + '</b> XP</span></div></div>' +
    todayCard() + '<h3 class="month">Tes langues</h3><p class="muted small" style="margin-bottom:8px">' + (total ? total + ' cartes à réviser aujourd’hui.' : 'Rien à réviser pour l’instant.') + '</p>' +
    '<ul class="langs">' + LANGS.filter(function (l) { return !l.off; }).map(function (l) {
      if (l.off) return '<li><button class="lang-card off" data-act="openLang" data-l="x"><span class="hello">' + l.hello + '</span><span class="meta">' + l.name + ' <span>· ' + l.note + '</span></span></button></li>';
      var d = dueCount(l.id);
      return '<li><button class="lang-card" data-act="openLang" data-l="' + l.id + '" style="--c:var(--' + l.id + ')"><span class="hello">' + l.hello + '</span><span class="meta">' + l.name + ' <span>· ' + l.level + ' · ' + l.note + '</span></span><span class="due' + (d ? ' hot' : '') + '">' + (d ? d + ' à réviser' : seenCount(l.id) + ' vues') + '</span></button></li>';
    }).join('') + '</ul>';
}
function viewLang5() {
  return topBar('Langue 5') + '<div class="hero"><span class="hello" style="color:var(--x)">…</span></div>' +
    '<div class="card"><h2>La cinquième langue reste à choisir</h2><p style="margin-top:10px">Dis-moi dans le chat laquelle tu veux et ton niveau de départ : j’ajoute le même parcours que les quatre autres (conjugaison, grammaire, situations, conversation).</p><p class="muted small">Pistes : italien, portugais, néerlandais, japonais, arabe, chinois.</p></div>';
}
function viewLang() {
  var l = L(V.lang), d = D[l.id], cards = buildCards(l.id), due = dueCount(l.id), seen = seenCount(l.id);
  var nph = d.sit.reduce(function (n, s) { return n + s.phrases.length; }, 0);
  var b = [], f = frontier(l.id), nu = CUR[l.id].length;
  b.push(['path', 'Parcours 6 mois', f >= nu ? 'Parcours terminé' : 'Unité ' + (f + 1) + ' sur ' + nu + ' · ' + CUR[l.id][f][0]]);
  if (d.alpha) b.push(['alpha', 'Alphabet cyrillique', '31 lettres, sons et mots, avec quiz']);
  b.push(['conj', 'Conjugaison', d.tenses.length + ' temps · ' + d.verbs.length + ' verbes · entraînement']);
  b.push(['grammar', 'Grammaire et articles', d.rules.length + ' fiches · ' + d.quiz.length + ' questions']);
  b.push(['sits', 'Situations réelles', d.sit.length + ' scènes · ' + nph + ' phrases']);
  b.push(['chat', 'Conversation corrigée', 'Joue une scène, l’IA corrige tes erreurs']);
  b.push(['review', 'Révision espacée', due ? due + ' à réviser maintenant' : 'Séance de 10 cartes']);
  return topBar('') + '<div class="hero"><span class="hello">' + l.hello + '</span><span class="lvl">' + l.level + ' · ' + l.note + '</span></div>' +
    '<div class="focus">' + esc(l.focus) + '<div class="muted small" style="margin-top:6px">' + seen + ' cartes vues sur ' + cards.length + '</div></div>' +
    '<div class="blocks">' + b.map(function (x) {
      return '<button class="block" data-act="openBlock" data-b="' + x[0] + '"><h3>' + x[1] + '</h3><p>' + esc(x[2]) + '</p><span class="go">›</span></button>';
    }).join('') + '</div>';
}
function viewConj() {
  var l = L(V.lang), d = D[l.id], v = d.verbs[V.verb], t = d.tenses[V.tense], forms = v.t[t.k];
  var mode = S.settings.conj[l.id];
  return topBar('Conjugaison · ' + l.name) +
    '<div class="scroller" role="group" aria-label="Verbes">' + d.verbs.map(function (x, i) { return '<button class="pill" data-act="verb" data-i="' + i + '" aria-pressed="' + (i === V.verb) + '">' + esc(x.inf) + '</button>'; }).join('') + '</div>' +
    '<div class="scroller" role="group" aria-label="Temps">' + d.tenses.map(function (x, i) { return '<button class="pill" data-act="tense" data-i="' + i + '" aria-pressed="' + (i === V.tense) + '">' + esc(x.fr) + '</button>'; }).join('') + '</div>' +
    '<div class="card"><h2>' + esc(v.inf) + '</h2><p class="muted small" style="margin:4px 0 8px">' + esc(v.fr) + ' · ' + esc(t.fr) + ' (' + esc(t.sub) + ')</p>' +
    t.rows.map(function (r, i) {
      var f = forms[i];
      var shown = f === '—' ? 'pas d’impératif' : f.split('|').join(' / ');
      return '<div class="form-row"><span class="who">' + esc(r) + '</span><button class="f" data-act="say" data-t="' + esc(f) + '" data-l="' + l.id + '">' + esc(shown) + '</button></div>';
    }).join('') + '</div>' +
    '<div class="tip">' + esc(t.tip) + '</div>' +
    '<div class="stack"><button class="btn wide" data-act="drill" data-m="tense">S’entraîner : ' + esc(t.fr.toLowerCase()) + '</button>' +
    '<button class="btn ghost wide" data-act="drill" data-m="all">S’entraîner : tout mélanger</button>' +
    '<p class="muted small">Mode actuel : ' + (mode === 'type' ? 'saisie au clavier' : 'choix multiple') + '. Change-le dans Réglages. Touche une forme pour l’écouter.</p></div>';
}
function viewGrammar() {
  var l = L(V.lang), d = D[l.id];
  return topBar('Grammaire · ' + l.name) +
    '<div class="stack" style="margin-bottom:14px"><button class="btn wide" data-act="quiz">Quiz de grammaire (' + Math.min(12, d.quiz.length) + ' questions)</button></div>' +
    d.rules.map(function (r, i) { return '<details class="rule"' + (i === 0 ? ' open' : '') + '><summary>' + esc(r.title) + '</summary><div class="in tbl-wrap">' + r.body + '</div></details>'; }).join('');
}
function viewSits() {
  var l = L(V.lang), d = D[l.id];
  return topBar('Situations · ' + l.name) + '<div class="blocks">' + d.sit.map(function (s) {
    return '<button class="block" data-act="openSit" data-s="' + s.id + '"><h3>' + esc(s.title) + '</h3><p>' + esc(s.intro) + ' · ' + s.phrases.length + ' phrases</p><span class="go">›</span></button>';
  }).join('') + '</div>';
}
function viewSit() {
  var l = L(V.lang), s = D[l.id].sit.filter(function (x) { return x.id === V.sit; })[0];
  return topBar(l.name, 'Scènes') + '<h2 style="margin-bottom:6px">' + esc(s.title) + '</h2><p class="muted">' + esc(s.intro) + '</p>' +
    '<div class="row" style="margin-bottom:12px"><button class="btn" data-act="sitPractice">S’entraîner</button><button class="btn ghost" data-act="sitChat">Jouer la scène</button></div>' +
    '<div class="card">' + s.phrases.map(function (p) {
      return '<div class="phr"><span class="t">' + esc(p[0]) + '</span>' + (p[2] ? '<span class="rom">' + esc(p[2]) + '</span>' : '') + '<span class="f">' + esc(p[1]) + '</span><button class="say" data-act="say" data-t="' + esc(p[0]) + '" data-l="' + l.id + '" aria-label="Écouter">Audio</button></div>';
    }).join('') + '</div>';
}
function viewAlpha() {
  var l = L('ru'), d = D.ru;
  return topBar('Alphabet · Русский') + '<p class="muted">Touche une lettre pour écouter le mot d’exemple. Sons notés à la française.</p>' +
    '<div class="alpha">' + d.alpha.map(function (a) {
      return '<button class="letter" data-act="say" data-t="' + esc(a[3]) + '" data-l="ru"><b>' + a[0] + ' ' + a[1] + '</b><span>[' + esc(a[2]) + ']</span><i>' + esc(a[3]) + '</i><span>' + esc(a[4]) + '</span></button>';
    }).join('') + '</div>' +
    '<div class="card" style="margin-bottom:14px"><h3>Les deux signes</h3>' + d.alphaSigns.map(function (a) { return '<p style="margin-top:8px"><b>' + a[0] + ' ' + a[1] + '</b> · ' + esc(a[2]) + '</p>'; }).join('') + '</div>' +
    '<button class="btn wide" data-act="alphaQuiz">Quiz des lettres (10 questions)</button>';
}
function viewReview() {
  return '<div class="top"><h1>Réviser</h1></div><p class="muted">Séances de 10 cartes mêlant phrases, grammaire et conjugaison. Les erreurs reviennent plus vite, les réussites s’espacent.</p><div class="blocks" style="margin-top:14px">' +
    LANGS.filter(function (l) { return !l.off; }).map(function (l) {
      var d = dueCount(l.id);
      return '<button class="block" data-act="startReview" data-l="' + l.id + '" style="--c:var(--' + l.id + ')"><h3 style="color:var(--c)">' + l.name + '</h3><p>' + (d ? d + ' à réviser, plus des nouvelles cartes' : 'Rien d’urgent : nouvelles cartes') + '</p><span class="go">›</span></button>';
    }).join('') + '</div>';
}
function viewSettings() {
  var s = S.settings;
  return '<div class="top"><h1>Réglages</h1></div>' +
    '<div class="card"><div class="set"><label for="rate">Vitesse de la voix</label><select id="rate" data-ch="rate"><option value="0.7"' + (s.rate == 0.7 ? ' selected' : '') + '>Lente</option><option value="0.85"' + (s.rate == 0.85 ? ' selected' : '') + '>Posée</option><option value="1"' + (s.rate == 1 ? ' selected' : '') + '>Normale</option></select></div>' +
    '<div class="set"><span>Objectif par jour</span><span class="row">' + [20, 25, 30].map(function (m) { return '<button class="pill" data-act="setGoal" data-m="' + m + '" aria-pressed="' + (S.goal === m) + '">' + m + ' min</button>'; }).join('') + '</span></div>' +
    '<div class="set"><span>Langues du jour</span><span class="row">' + LANGS.filter(function (l) { return !l.off; }).map(function (l) { return '<button class="pill" data-act="toggleActive" data-l="' + l.id + '" aria-pressed="' + (S.active.indexOf(l.id) >= 0) + '" style="--c:var(--' + l.id + ')">' + l.name + '</button>'; }).join('') + '</span></div>' +
    (function () {
      var vi = voiceInfo(), nm = { 'es-ES': 'espagnol', 'de-DE': 'allemand', 'en-GB': 'anglais', 'ru-RU': 'russe' };
      return '<div class="set"><span>Audio sur cet appareil</span><b>' + (speechOK ? 'disponible' : 'indisponible') + '</b></div>' +
        '<div class="set" style="display:block"><p class="muted small" style="margin:0 0 8px">Voix trouvées : ' + vi.n + ' · ' + vi.ok.map(function (x) { return nm[x[0]] + ' ' + (x[1] ? 'oui' : 'non'); }).join(', ') + '.</p>' +
        '<div class="row"><button class="btn sm" data-act="testVoice" data-l="es">Tester l’espagnol</button><button class="btn sm ghost" data-act="testVoice" data-l="de">Allemand</button><button class="btn sm ghost" data-act="testVoice" data-l="en">Anglais</button><button class="btn sm ghost" data-act="testVoice" data-l="ru">Russe</button></div>' +
        '<p class="status">' + esc(audioMsg || 'Si tu n’entends rien : coupe le mode silencieux (interrupteur sur le côté de l’iPhone) et monte le volume.') + '</p></div>';
    })() +
    LANGS.filter(function (l) { return !l.off; }).map(function (l) {
      return '<div class="set"><span>Conjugaison · ' + l.name + '</span><span class="row"><button class="pill" data-act="setConj" data-l="' + l.id + '" data-m="type" aria-pressed="' + (s.conj[l.id] === 'type') + '" style="--c:var(--' + l.id + ')">Saisie</button><button class="pill" data-act="setConj" data-l="' + l.id + '" data-m="mcq" aria-pressed="' + (s.conj[l.id] === 'mcq') + '" style="--c:var(--' + l.id + ')">QCM</button></span></div>';
    }).join('') + '</div>' +
    '<div class="card" style="margin-top:14px"><h3>Sauvegarde de la progression</h3><p class="muted small" style="margin-top:6px">Ta progression est gardée dans ce navigateur. Copie-la ici pour la conserver ou la remettre ailleurs.</p><textarea id="bk" class="in-area" aria-label="Sauvegarde">' + esc(V.bk || '') + '</textarea>' +
    '<div class="row" style="margin-top:8px"><button class="btn sm" data-act="bkExport">Préparer</button><button class="btn sm ghost" data-act="bkCopy">Copier</button><button class="btn sm ghost" data-act="bkImport">Restaurer</button></div><p class="status">' + esc(V.note) + '</p></div>' +
    '<div class="card" style="margin-top:14px"><h3>Remettre à zéro</h3><p class="muted small" style="margin-top:6px">Efface la progression de toutes les langues.</p><button class="btn sm ghost" data-act="reset">' + (V.confirmReset ? 'Confirmer l’effacement' : 'Effacer la progression') + '</button></div>';
}

/* ----- séance ----- */
function prepCur() {
  var s = V.session, c = s.queue[s.i], cur = {};
  if (c.kind === 'mcq') cur.opts = shuffle(c.opts);
  else if (c.kind === 'conj') { cur.mode = S.settings.conj[c.lang]; if (cur.mode === 'mcq') cur.opts = shuffle(conjOpts(c)); }
  else if (c.kind === 'type') cur.mode = 'type';
  else if (c.kind === 'phrase') cur.mode = (speechOK && Math.random() < 0.35) ? 'listen' : 'read';
  s.cur = cur;
}
function startSession(o) {
  if (!o.cards.length) { V.note = 'Aucune carte disponible.'; return; }
  V.session = { lang: o.lang, title: o.title, queue: o.cards.slice(), i: 0, ok: 0, n: 0, again: {}, ret: o.ret, cur: null, done: false, path: o.path || null, test: !!o.test };
  prepCur(); go({ view: 'session' });
}
function record(card, ok) {
  var st = S.cards[card.id] || { b: 0, due: 0, n: 0 };
  if (ok) { st.b = Math.min(st.b + 1, 5); st.due = Date.now() + BOX_DAYS[st.b] * DAY; S.xp += 10; }
  else { st.b = 0; st.due = Date.now() + 10 * 60000; S.xp += 2; }
  st.n = (st.n || 0) + 1; S.cards[card.id] = st;
  touchStreak(); save();
  var s = V.session; s.n++; if (ok) s.ok++;
  if (!ok && !s.again[card.id] && !s.test) { s.again[card.id] = 1; s.queue.push(card); }
}
function viewSession() {
  var s = V.session, l = L(s.lang);
  if (s.done && s.path) return pathSummary(s);
  if (s.done) {
    return '<div class="sum"><p class="muted">' + esc(s.title) + '</p><div class="score">' + s.ok + ' / ' + s.n + '</div><p>' + (s.ok === s.n ? 'Sans faute.' : 'Les cartes ratées reviendront bientôt.') + '</p><div class="stack" style="margin-top:16px"><button class="btn wide" data-act="again">Encore une séance</button><button class="btn ghost wide" data-act="quit">Terminer</button></div></div>';
  }
  var c = s.queue[s.i], cur = s.cur, pct = Math.round(s.i / s.queue.length * 100), h = '';
  h += '<div class="sess"><div class="row" style="justify-content:space-between;margin-bottom:10px"><button class="back" data-act="quit" style="padding-left:0">‹ Quitter</button><span class="muted small">' + (s.i + 1) + ' / ' + s.queue.length + '</span></div><div class="bar"><span style="width:' + pct + '%"></span></div><div class="card">';
  if (c.kind === 'info') {
    h += '<div class="prompt">À retenir</div><h2 style="margin-bottom:10px">' + esc(c.title) + '</h2><div class="info tbl-wrap">' + c.html + '</div><div class="stack" style="margin-top:14px"><button class="btn wide" data-act="next">Compris</button></div>';
  } else if (c.kind === 'phrase') {
    if (cur.mode === 'listen') {
      h += '<div class="prompt">Écoute puis traduis en français</div><button class="btn listen" data-act="say" data-t="' + esc(c.t) + '" data-l="' + c.lang + '">Écouter la phrase</button>';
      if (!cur.revealed) h += '<div class="stack" style="margin-top:12px"><button class="btn ghost wide" data-act="reveal">Voir la réponse</button></div>';
      else h += '<div style="margin-top:14px"><div class="target">' + esc(c.t) + '</div>' + (c.r ? '<div class="rom">' + esc(c.r) + '</div>' : '') + '<p>' + esc(c.f) + '</p></div>';
    } else {
      h += '<div class="prompt">Dis en ' + l.name.toLowerCase() + '</div><div class="big">' + esc(c.f) + '</div>';
      if (!cur.revealed) h += '<button class="btn ghost wide" data-act="reveal">Voir la réponse</button>';
      else h += '<div class="target">' + esc(c.t) + '</div>' + (c.r ? '<div class="rom">' + esc(c.r) + '</div>' : '') + '<button class="btn sm ghost" data-act="say" data-t="' + esc(c.t) + '" data-l="' + c.lang + '">Écouter</button>';
    }
    if (cur.revealed) h += '<div class="row" style="margin-top:14px"><button class="btn ghost" style="flex:1" data-act="grade" data-ok="0">À revoir</button><button class="btn" style="flex:1" data-act="grade" data-ok="1">Je savais</button></div>';
  } else if (c.kind === 'mcq') {
    h += '<div class="prompt">' + (c.alpha ? 'Alphabet' : (c.vocab ? 'Vocabulaire' : 'Grammaire')) + '</div><div class="big">' + esc(c.q) + '</div><div class="opts">' + cur.opts.map(function (o, i) {
      var cls = 'opt';
      if (cur.picked != null) { if (o === c.a) cls += ' right'; else if (i === cur.picked) cls += ' wrong'; }
      return '<button class="' + cls + '" data-act="pick" data-i="' + i + '"' + (cur.picked != null ? ' disabled' : '') + '>' + esc(o) + '</button>';
    }).join('') + '</div>';
    if (cur.picked != null) h += '<div class="fb ' + (cur.result ? 'ok' : 'ko') + '"><b>' + (cur.result ? 'Bien joué.' : 'Pas tout à fait.') + '</b> ' + esc(c.why) + '</div><div class="row" style="margin-top:12px">' + (c.say ? '<button class="btn sm ghost" data-act="say" data-t="' + esc(c.say) + '" data-l="' + c.lang + '">Écouter</button>' : '') + '<button class="btn" style="flex:1" data-act="next">Suivant</button></div>';
  } else if (c.kind === 'conj' || c.kind === 'type') {
    if (c.kind === 'type') h += '<div class="prompt">Écris en ' + l.name.toLowerCase() + '</div><div class="big">' + esc(c.f) + '</div>';
    else h += '<div class="prompt">Conjugue</div><div class="big">' + esc(c.verb.inf) + ' <span class="muted small">(' + esc(c.verb.fr) + ')</span></div><p class="muted">' + esc(c.tense.fr) + ' · <b style="color:var(--ink)">' + esc(c.tense.rows[c.idx]) + '</b></p>';
    var shown = alts(c.ans).filter(function (x, i, a) { return a.indexOf(x) === i; }).join(' / ');
    if (cur.mode === 'mcq') {
      h += '<div class="opts">' + cur.opts.map(function (o, i) {
        var cls = 'opt';
        if (cur.picked != null) { if (o === firstAlt(c.ans)) cls += ' right'; else if (i === cur.picked) cls += ' wrong'; }
        return '<button class="' + cls + '" data-act="pick" data-i="' + i + '"' + (cur.picked != null ? ' disabled' : '') + '>' + esc(o) + '</button>';
      }).join('') + '</div>';
    } else if (cur.picked == null) {
      h += '<input id="ans" class="in-text" type="text" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" aria-label="Ta réponse" placeholder="Ta réponse"><div class="stack" style="margin-top:12px"><button class="btn wide" data-act="check">Vérifier</button></div>';
    } else {
      h += '<input class="in-text" type="text" value="' + esc(cur.typed) + '" disabled aria-label="Ta réponse">';
    }
    if (cur.picked != null) {
      var msg = cur.result === 'accent' ? 'Presque : attention aux accents. ' : (cur.result ? 'Bien joué. ' : 'Pas tout à fait. ');
      h += '<div class="fb ' + (cur.result ? 'ok' : 'ko') + '"><b>' + msg + '</b>Réponse : <b>' + esc(shown) + '</b></div><div class="row" style="margin-top:12px"><button class="btn sm ghost" data-act="say" data-t="' + esc(c.ans) + '" data-l="' + c.lang + '">Écouter</button><button class="btn" style="flex:1" data-act="next">Suivant</button></div>';
    }
  }
  h += '</div></div>';
  return h;
}

/* ----- conversation ----- */
var sampleFn = null, dict = null, capsReady = false, dictState = 'idle';
function chatInstr(lang, scen, text) {
  var l = L(lang);
  return 'You are a warm, patient ' + l.gen + ' conversation partner and teacher for a native French speaker. Learner level: ' + l.glevel + '. Scene: ' + (text || SCEN[scen]) + '\n\n' +
    'Rules:\n- In "reply", speak ONLY in ' + l.gen + ', one to three short sentences matched to the level. End with ONE question or prompt so the learner keeps talking.\n' +
    '- After each learner message, check it. List real mistakes in "corrections" as {wrong, right, why}; "why" is one short sentence in French. If the learner wrote in French, give the ' + l.gen + ' way to say it as one correction with an empty "wrong". Never invent mistakes: if the message is correct, leave "corrections" empty and put a short French compliment in "praise".\n' +
    '- "upgrade": for B2 or higher learners, optionally a more natural or idiomatic way to say what they meant, in ' + l.gen + '. Otherwise an empty string.\n' +
    '- "reply_fr": French translation of your reply. "rom": for Russian only, a French-style phonetic transcription of your reply; otherwise an empty string.\n' +
    '- Stay in character. Output nothing outside the JSON.\n\n' +
    'Output ONLY one JSON object: {"reply":"","reply_fr":"","rom":"","corrections":[{"wrong":"","right":"","why":""}],"praise":"","upgrade":""}';
}
function parseAI(text) {
  var t = String(text || '').trim().replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
  try { return JSON.parse(t); } catch (e) {}
  var m = t.match(/\{[\s\S]*\}/);
  if (m) { try { return JSON.parse(m[0]); } catch (e) {} }
  return { reply: t, reply_fr: '', rom: '', corrections: [], praise: '', upgrade: '' };
}
function errMsg(e) {
  var c = e && e.code;
  if (c === 'not_granted') return 'Accès à l’IA refusé. Autorise-le pour utiliser la conversation.';
  if (c === 'rate_limited') return 'Trop de demandes. Attends un moment puis réessaie.';
  return 'La réponse n’est pas arrivée. Réessaie.';
}
function startChat(scen, text, ret) {
  var lang = V.lang;
  V.chat = { lang: lang, scen: scen, text: text, ret: ret || null, msgs: [{ role: 'user', content: chatInstr(lang, scen, text) + '\n\nStart the scene now: greet the learner in character and ask the first question. "corrections" must be an empty list.' }], log: [], busy: false, err: '', draft: '' };
  go({ view: 'chat' });
  callAI();
}
function chatSend() {
  var c = V.chat, ta = $('#draft');
  if (!c || c.busy || !ta) return;
  var text = ta.value.trim(); if (!text) return;
  c.msgs.push({ role: 'user', content: text }); c.log.push({ me: text, fix: null });
  c.draft = ''; ta.value = ''; S.xp += 5; touchStreak(); save();
  callAI();
}
function callAI() {
  var c = V.chat; c.busy = true; c.err = ''; updateChat();
  if (!sampleFn) {
    c.busy = false;
    c.err = capsReady ? 'La conversation avec l’IA n’est pas disponible dans cet affichage. Ouvre la page depuis l’application Claude.' : 'Connexion en cours. Réessaie dans quelques secondes.';
    updateChat(); return;
  }
  var input = c.msgs.length > 15 ? [c.msgs[0]].concat(c.msgs.slice(-14)) : c.msgs;
  Promise.resolve().then(function () { return sampleFn(input, { cache: false }); }).then(function (r) {
    var raw = (r && r.text) || '', p = parseAI(raw);
    c.msgs.push({ role: 'assistant', content: raw });
    var last = c.log[c.log.length - 1];
    if (last && last.me != null && !last.fix) last.fix = { c: Array.isArray(p.corrections) ? p.corrections : [], praise: p.praise || '', up: p.upgrade || '' };
    c.log.push({ ai: true, reply: p.reply || '', fr: p.reply_fr || '', rom: p.rom || '' });
    c.busy = false; updateChat();
  }).catch(function (e) { c.busy = false; c.err = errMsg(e); updateChat(); });
}
function chatLogHtml() {
  var c = V.chat;
  return c.log.map(function (m) {
    if (m.ai) {
      return '<div class="msg ai"><div>' + esc(m.reply) + '</div>' + (m.rom ? '<div class="rom">' + esc(m.rom) + '</div>' : '') + (m.fr ? '<div class="fr">' + esc(m.fr) + '</div>' : '') + '<button class="btn sm ghost" style="margin-top:8px" data-act="say" data-t="' + esc(m.reply) + '" data-l="' + c.lang + '">Écouter</button></div>';
    }
    var h = '<div class="msg me">' + esc(m.me) + '</div>';
    if (m.fix) {
      var parts = '';
      m.fix.c.forEach(function (x) {
        parts += '<div style="margin-bottom:6px">' + (x.wrong ? '<span class="w">' + esc(x.wrong) + '</span> → ' : '') + '<span class="r">' + esc(x.right) + '</span><br><span class="muted">' + esc(x.why) + '</span></div>';
      });
      if (!m.fix.c.length && m.fix.praise) parts += '<div class="good">' + esc(m.fix.praise) + '</div>';
      if (m.fix.up) parts += '<div><b>Plus naturel :</b> ' + esc(m.fix.up) + '</div>';
      if (parts) h += '<div class="fix">' + parts + '</div>';
    }
    return h;
  }).join('');
}
function updateChat() {
  var c = V.chat, el = $('#chatlog'); if (!c || !el) return;
  el.innerHTML = chatLogHtml();
  var st = $('#chatstatus');
  if (st) st.innerHTML = c.busy ? '<span class="dots">L’IA répond</span>' : (c.err ? esc(c.err) + ' <button class="btn sm ghost" data-act="retry">Réessayer</button>' : '');
  var b = $('#chatsend'); if (b) b.disabled = !!c.busy;
  var mic = $('#chatmic'); if (mic) mic.textContent = dictState === 'listening' ? 'Stop' : 'Micro';
  try { window.scrollTo(0, document.body.scrollHeight); } catch (e) {}
}
function viewChatPick() {
  var l = L(V.lang), d = D[l.id];
  var items = d.sit.map(function (s) { return [s.id, s.title, s.intro]; }).concat([['libre', 'Conversation libre', 'Parle de ta journée, de tes goûts']]);
  return topBar('Conversation · ' + l.name) +
    '<p class="muted">Choisis une scène. L’IA joue l’autre personnage, parle ' + l.name.toLowerCase() + ' à ton niveau et corrige chaque message que tu envoies.</p>' +
    '<div class="blocks" style="margin-top:12px">' + items.map(function (x) {
      return '<button class="block" data-act="chatStart" data-s="' + x[0] + '"><h3>' + esc(x[1]) + '</h3><p>' + esc(x[2]) + '</p><span class="go">›</span></button>';
    }).join('') + '</div>' +
    '<p class="muted small" style="margin-top:12px">Pour parler au lieu d’écrire, utilise le micro du clavier de l’iPhone.</p>';
}
function viewChat() {
  var c = V.chat;
  return topBar('Conversation · ' + L(c.lang).name, 'Scènes') +
    '<div id="chatlog" class="chat-log">' + chatLogHtml() + '</div><div id="chatstatus" class="status"></div>' +
    '<div class="compose"><textarea id="draft" rows="1" aria-label="Ton message" placeholder="Écris ta réponse (le micro du clavier fonctionne aussi)" autocapitalize="sentences">' + esc(c.draft) + '</textarea>' +
    '<div class="row" style="flex-wrap:nowrap">' + (dict ? '<button class="btn ghost sm" id="chatmic" data-act="mic">Micro</button>' : '') + '<button class="btn" id="chatsend" data-act="chatSend">Envoyer</button></div></div>';
}

/* ---------- parcours de 6 mois ---------- */
var LES = ['Découvrir', 'Vocabulaire', 'Règles et pratique', 'Phrases et oreille', 'Mise en situation', 'Bilan'];
var PASS = 70, PASS_TEST = 80, UC = {}, IDX = {};
function ensP(l) { if (!S.path[l]) S.path[l] = { t0: Date.now(), start: 0, u: {} }; return S.path[l]; }
function ug(l, k) { var p = S.path[l]; return (p && p.u[k]) || { d: [0, 0, 0, 0, 0, 0], ok: 0, best: 0 }; }
function uset(l, k) { var p = ensP(l); if (!p.u[k]) p.u[k] = { d: [0, 0, 0, 0, 0, 0], ok: 0, best: 0 }; return p.u[k]; }
function passed(l, k) { return !!ug(l, k).ok; }
function unitOpen(l, k) { return k === 0 || passed(l, k - 1) || passed(l, k); }
function frontier(l) { var n = CUR[l].length; for (var k = 0; k < n; k++) if (!passed(l, k)) return k; return n; }
function nextLesson(l) {
  var k = frontier(l); if (k >= CUR[l].length) return null;
  var u = ug(l, k), d = 0; while (d < 5 && u.d[d]) d++;
  return { k: k, d: d };
}
function monthOf(k) { for (var m = 0; m < 6; m++) if (k < MB[m + 1]) return m; return 5; }
function lessonsDone(l, k) { var u = ug(l, k), n = 0; for (var i = 0; i < 6; i++) if (u.d[i]) n++; return n; }
function pacing(l) {
  var p = S.path[l]; if (!p || !Object.keys(p.u).length) return '';
  var weeks = Math.floor((Date.now() - p.t0) / (7 * DAY)), diff = frontier(l) - ((p.start || 0) + weeks);
  if (frontier(l) >= CUR[l].length) return 'Parcours terminé. Bravo.';
  if (diff >= 1) return 'En avance de ' + diff + ' semaine' + (diff > 1 ? 's' : '') + '.';
  if (diff === 0) return 'Dans le rythme : une unité par semaine.';
  return 'En retard de ' + (-diff) + ' semaine' + (diff < -1 ? 's' : '') + '. Prends une leçon de plus certains jours, ou passe le test d’une unité que tu connais déjà.';
}

/* contenu d'une unité : manuel d'espagnol corrigé + contenu généré par l'IA (gardé sur l'appareil) */
function curated(l, k) {
  var o = CUR[l][k][3];
  if (l === 'es') return (o.core && ESCORE[o.core]) || null;
  return (typeof XCORE !== 'undefined' && XCORE[l + '|' + k]) || null;
}
function ckey(l, k) { return l + '|' + k; }
function unitData(l, k) {
  var c = curated(l, k), g = CONT[ckey(l, k)] || {};
  return { vocab: (c && c.vocab || []).concat(g.vocab || []), phrases: (c && c.phrases || []).concat(g.phrases || []), note: (c && c.note) || g.note || '', dialogue: (c && c.dialogue) || null, qs: g.qs || [] };
}
function needsGen(l, k) {
  var o = CUR[l][k][3]; if (o.alpha || curated(l, k)) return false;
  var g = CONT[ckey(l, k)]; return !(g && g.vocab && g.vocab.length);
}
function genPrompt(l, k) {
  var g = L(l), u = CUR[l][k];
  return 'You are writing one weekly unit of a language course for a native French speaker.\nLanguage: ' + g.gen + '\nUnit level: ' + u[1] + '\nUnit title (French): ' + u[0] + '\nTopic and scope: ' + u[2] + '\n\n' +
    'Return ONLY one JSON object, no markdown, no text around it:\n{"note":"","vocab":[{"t":"","f":"","r":""}],"phrases":[{"t":"","f":"","r":""}],"qs":[{"q":"","opts":["","","",""],"a":0,"why":""}]}\n\n' +
    'Rules:\n- "note": 2 to 4 sentences in French giving the key point to remember for this unit.\n' +
    '- "vocab": exactly 16 useful words or short chunks (max 4 words) for the topic, at the unit level. "t" is in ' + g.gen + ' (include the article for nouns in Spanish and German), "f" is the short French translation, "r" is a French-style phonetic spelling for Russian only, otherwise an empty string.\n' +
    '- "phrases": exactly 8 natural complete sentences a person would really say in this topic, at the unit level; "f" is the French translation; "r" as above.\n' +
    '- "qs": exactly 6 multiple-choice questions testing the unit (grammar or vocabulary). The question is written in French or is a fill-in-the-blank sentence in ' + g.gen + '. "opts" has exactly 4 different strings, "a" is the index 0 to 3 of the only correct option, "why" is one short French sentence explaining the answer. Make the wrong options plausible.\n' +
    '- Everything must be correct, natural and standard. Do not invent words.';
}
function parseJSON(text) {
  var t = String(text || '').trim().replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
  try { return JSON.parse(t); } catch (e) {}
  var m = t.match(/\{[\s\S]*\}/);
  if (m) { try { return JSON.parse(m[0]); } catch (e) {} }
  return null;
}
function cleanContent(o) {
  if (!o || typeof o !== 'object') return null;
  function s(x, m) { return typeof x === 'string' ? x.trim().slice(0, m || 160) : ''; }
  var vocab = (Array.isArray(o.vocab) ? o.vocab : []).map(function (x) { return [s(x && x.t, 60), s(x && x.f, 80), s(x && x.r, 80)]; }).filter(function (x) { return x[0] && x[1]; });
  var phrases = (Array.isArray(o.phrases) ? o.phrases : []).map(function (x) { return [s(x && x.t, 160), s(x && x.f, 200), s(x && x.r, 200)]; }).filter(function (x) { return x[0] && x[1]; });
  var qs = (Array.isArray(o.qs) ? o.qs : []).map(function (x) {
    if (!x || !Array.isArray(x.opts)) return null;
    var opts = x.opts.map(function (z) { return s(z, 100); }).filter(Boolean), a = +x.a;
    if (opts.length !== 4 || unique(opts).length !== 4 || !(a >= 0 && a < 4) || a % 1) return null;
    return [s(x.q, 220), opts, a, s(x.why, 220)];
  }).filter(function (x) { return x && x[0]; });
  if (vocab.length < 6) return null;
  return { vocab: vocab.slice(0, 20), phrases: phrases.slice(0, 10), qs: qs.slice(0, 8), note: s(o.note, 500) };
}
function fetchUnit(l, k) {
  return Promise.resolve().then(function () { return sampleFn([{ role: 'user', content: genPrompt(l, k) }], { cache: false }); }).then(function (r) {
    var c = cleanContent(parseJSON(r && r.text));
    if (!c) throw new Error('bad');
    CONT[ckey(l, k)] = c; saveContent(); delete UC[ckey(l, k)]; delete IDX[l]; return c;
  });
}

/* cartes d'une unité */
function dlgHtml(l, dl) {
  return dl.map(function (x) {
    return '<div class="phr"><span class="who">' + esc(x.w) + '</span><span class="t">' + esc(x.t) + '</span><span class="f">' + esc(x.f) + '</span><button class="say" data-act="say" data-t="' + esc(x.t) + '" data-l="' + l + '">Audio</button></div>';
  }).join('');
}
function unitCards(l, k) {
  var key = ckey(l, k); if (UC[key]) return UC[key];
  var u = unitData(l, k), o = CUR[l][k][3], d = D[l], base = buildCards(l), pre = l + '|u' + k + '|';
  var out = { v: [], vm: [], vt: [], vr: [], p: [], q: [], aq: [], c: [], r: [], n: [], dlg: [], al: [] };
  var fs = u.vocab.map(function (x) { return x[1]; }), ts = u.vocab.map(function (x) { return x[0]; });
  u.vocab.forEach(function (x, i) {
    out.v.push({ id: pre + 'v|' + i, lang: l, kind: 'phrase', t: x[0], f: x[1], r: x[2] || '' });
    var o1 = [x[1]], o2 = [x[0]];
    shuffle(fs).forEach(function (f) { if (o1.length < 4 && o1.indexOf(f) < 0) o1.push(f); });
    shuffle(ts).forEach(function (t) { if (o2.length < 4 && o2.indexOf(t) < 0) o2.push(t); });
    out.vm.push(o1.length >= 3 ? { id: pre + 'vm|' + i, lang: l, kind: 'mcq', vocab: true, q: 'Que veut dire « ' + x[0] + ' » ?', opts: o1, a: x[1], why: x[0] + ' = ' + x[1] + '.', say: x[0] } : null);
    out.vr.push(o2.length >= 3 ? { id: pre + 'vr|' + i, lang: l, kind: 'mcq', vocab: true, q: 'Comment dit-on « ' + x[1] + ' » ?', opts: o2, a: x[0], why: x[1] + ' = ' + x[0] + '.', say: x[0] } : null);
    out.vt.push(x[0].split(' ').length <= 5 ? { id: pre + 'vt|' + i, lang: l, kind: 'type', f: x[1], ans: x[0] } : null);
  });
  u.phrases.forEach(function (x, i) { out.p.push({ id: pre + 'p|' + i, lang: l, kind: 'phrase', t: x[0], f: x[1], r: x[2] || '' }); });
  if (o.sit) base.forEach(function (c) { if (c.kind === 'phrase' && c.sit === o.sit) out.p.push(c); });
  (o.q || []).forEach(function (n) { base.forEach(function (c) { if (c.id === l + '|q|' + n) out.q.push(c); }); });
  u.qs.forEach(function (q, i) { out.aq.push({ id: pre + 'aq|' + i, lang: l, kind: 'mcq', q: q[0], opts: q[1], a: q[1][q[2]], why: q[3] }); });
  if (o.conj) {
    base.forEach(function (c) {
      if (c.kind === 'conj' && o.conj.indexOf(c.tense.k) >= 0 && (!o.verbs || o.verbs.some(function (n) { return d.verbs[n] === c.verb; }))) out.c.push(c);
    });
  }
  (o.rules || []).forEach(function (n) { if (d.rules[n]) out.r.push({ id: pre + 'r|' + n, lang: l, kind: 'info', title: d.rules[n].title, html: d.rules[n].body }); });
  if (u.note) out.n.push({ id: pre + 'n', lang: l, kind: 'info', title: CUR[l][k][0], html: '<p>' + esc(u.note) + '</p>' });
  if (u.dialogue) out.dlg.push({ id: pre + 'dlg', lang: l, kind: 'info', title: 'Un dialogue à écouter', html: dlgHtml(l, u.dialogue) });
  if (o.alpha && d.alpha) {
    var a0 = o.alpha === 1 ? 0 : 16, a1 = o.alpha === 1 ? 16 : d.alpha.length;
    out.n.push({ id: pre + 'n', lang: l, kind: 'info', title: 'Les lettres de la semaine', html: '<div class="alpha">' + d.alpha.slice(a0, a1).map(function (a) {
      return '<button class="letter" data-act="say" data-t="' + esc(a[3]) + '" data-l="ru"><b>' + a[0] + ' ' + a[1] + '</b><span>[' + esc(a[2]) + ']</span><i>' + esc(a[3]) + '</i><span>' + esc(a[4]) + '</span></button>';
    }).join('') + '</div>' });
    base.forEach(function (c) { if (c.alpha) { var i = +c.id.split('|')[2]; if (i >= a0 && i < a1) out.al.push(c); } });
  }
  UC[key] = out; return out;
}
function cardIndex(l) {
  if (IDX[l]) return IDX[l];
  var m = {}; buildCards(l).forEach(function (c) { m[c.id] = c; });
  CUR[l].forEach(function (u, k) { var U = unitCards(l, k); Object.keys(U).forEach(function (t) { U[t].forEach(function (c) { if (c && c.kind !== 'info') m[c.id] = c; }); }); });
  IDX[l] = m; return m;
}
function dueCards(l, max) {
  var now = Date.now(), m = cardIndex(l), out = [];
  for (var id in S.cards) { if (m[id] && S.cards[id].due <= now) out.push(m[id]); }
  return out.sort(function (a, b) { return S.cards[a.id].due - S.cards[b.id].due; }).slice(0, max);
}
function nonInfo(c) { return c.kind !== 'info'; }
function lessonCards(l, k, d) {
  var U = unitCards(l, k), typed = l !== 'ru', vv = U.v, h = Math.min(10, Math.ceil(vv.length / 2)), body = [];
  function teach(a, b) {
    var o = [], q = [];
    for (var i = a; i < b && i < vv.length; i++) { o.push(vv[i]); if (U.vm[i]) q.push(U.vm[i]); }
    return o.concat(shuffle(q));
  }
  function typedQ(a, b, m) {
    var src = typed ? U.vt : U.vr, o = [];
    for (var i = a; i < b && i < src.length; i++) if (src[i]) o.push(src[i]);
    return shuffle(o).slice(0, m);
  }
  var vm = U.vm.filter(Boolean), pool = U.v.concat(vm, U.q, U.aq, U.c, U.p, U.al);
  if (d === 0) body = U.n.concat(U.r.slice(0, 1), U.dlg, teach(0, h), U.al.slice(0, 12));
  else if (d === 1) body = teach(h, h + 10).concat(typedQ(0, h + 10, 6), U.al.slice(12, 24));
  else if (d === 2) body = U.r.slice(0, 3).concat(shuffle(U.q).slice(0, 6), shuffle(U.aq).slice(0, 4), shuffle(U.c).slice(0, 10));
  else if (d === 3) body = U.dlg.concat(shuffle(U.p).slice(0, 12), typedQ(0, 40, 5), U.al.slice(24));
  else if (d === 4) body = shuffle(pool).slice(0, 14).concat(typedQ(0, 40, 4));
  else body = shuffle([].concat(shuffle(vm).slice(0, 7), typedQ(0, 60, 4), shuffle(U.q.concat(U.aq)).slice(0, 6), shuffle(U.c).slice(0, 4), shuffle(U.p).slice(0, 3), shuffle(U.al).slice(0, 12)));
  var min = d === 5 ? 12 : 20, real = body.filter(nonInfo), ids = {};
  body.forEach(function (c) { ids[c.id] = 1; });
  shuffle(pool).forEach(function (c) { if (real.length < min && !ids[c.id]) { ids[c.id] = 1; body.push(c); real.push(c); } });
  if (d < 5) {
    var warm = dueCards(l, 5).filter(function (c) { return !ids[c.id]; });
    body = warm.concat(body);
  }
  return body;
}

function startLesson(l, k, d, test, ret) {
  ensP(l); V.lang = l; V.unit = k;
  var r = ret || { view: 'unit', lang: l, unit: k };
  if (needsGen(l, k) && sampleFn) {
    var pr = { l: l, k: k, d: d, test: test, ret: r, state: 'busy', msg: '' };
    V.prep = pr; go({ view: 'prep' });
    fetchUnit(l, k).then(function () { if (V.prep === pr && V.view === 'prep') launch(l, k, d, test, r); })
      .catch(function () { if (V.prep === pr) { pr.state = 'err'; pr.msg = 'L’IA n’a pas pu préparer le vocabulaire de cette unité.'; if (V.view === 'prep') render(); } });
    return;
  }
  launch(l, k, d, test, r);
}
function launch(l, k, d, test, ret) {
  var cards = lessonCards(l, k, d);
  if (cards.filter(nonInfo).length < 3) {
    V.prep = { l: l, k: k, d: d, test: test, ret: ret, state: 'err', msg: 'Cette unité n’a pas encore de contenu sur cet appareil.', nogo: true };
    go({ view: 'prep' }); return;
  }
  V.session = { lang: l, title: 'Unité ' + (k + 1) + ' · ' + (d === 5 ? 'Bilan' : 'Leçon ' + (d + 1)), queue: cards, i: 0, ok: 0, n: 0, again: {}, ret: ret, cur: null, done: false, path: { lang: l, k: k, d: d, test: !!test }, test: d === 5 };
  V.prep = null; prepCur(); go({ view: 'session', lang: l });
}
function finishSession(s) {
  if (!s.path) return;
  var p = s.path, st = uset(p.lang, p.k), pct = s.n ? Math.round(s.ok / s.n * 100) : 100;
  s.pct = pct;
  if (p.d < 5) { st.d[p.d] = 1; S.xp += 30; }
  else {
    var th = p.test ? PASS_TEST : PASS;
    st.best = Math.max(st.best || 0, pct); s.th = th;
    if (pct >= th) {
      st.d = [1, 1, 1, 1, 1, 1]; st.ok = 1; S.xp += 80; s.passed = true;
      for (var j = 0; j < p.k; j++) { var x = uset(p.lang, j); if (!x.ok) { x.ok = 1; x.skip = 1; } }
    } else s.passed = false;
  }
  ensP(p.lang).last = dayKey(Date.now()); touchStreak(); tick(); save();
}
function pathSummary(s) {
  var p = s.path, k = p.k, h = '<div class="sum"><p class="muted">' + esc(s.title) + ' · ' + esc(CUR[p.lang][k][0]) + '</p><div class="score">' + s.ok + ' / ' + s.n + '</div>';
  if (p.d < 5) {
    h += '<p>Leçon terminée. Les cartes ratées reviennent dans tes révisions.</p>';
  } else if (s.passed) {
    var last = MB.indexOf(k + 1) > 0 && k + 1 < CUR[p.lang].length;
    h += '<p><b>Unité validée.</b> ' + (k + 1 >= CUR[p.lang].length ? 'Tu as terminé le parcours.' : (last ? 'Fin du mois ' + (monthOf(k) + 1) + ' : l’unité suivante ouvre un nouveau chapitre.' : 'L’unité suivante est ouverte.')) + '</p>';
  } else {
    h += '<p>Il faut ' + s.th + ' % pour valider (tu as ' + s.pct + ' %). Relis les règles, fais les leçons de révision puis retente le bilan.</p>';
  }
  h += '<p class="muted small">Aujourd’hui : ' + Math.round(todayMin()) + ' min sur ' + S.goal + '.</p><div class="stack" style="margin-top:16px">';
  if (p.d === 4) h += '<button class="btn ghost wide" data-act="unitChat" data-l="' + p.lang + '" data-k="' + k + '">Bonus : parler de ce thème avec l’IA</button>';
  if (p.d < 5 && todayMin() < S.goal) h += '<button class="btn ghost wide" data-act="startReview" data-l="' + p.lang + '">Réviser pour compléter ta séance</button>';
  if (p.d === 5 && !s.passed) h += '<button class="btn wide" data-act="again">Retenter le bilan</button>';
  h += '<button class="btn wide" data-act="quit">' + (p.d === 5 && s.passed ? 'Continuer le parcours' : 'Terminer') + '</button></div></div>';
  return h;
}

/* vues du parcours */
function goalBar() {
  var m = todayMin(), g = S.goal, pct = Math.min(100, Math.round(m / g * 100));
  return '<div class="goalbar"><div class="gtop"><b>Aujourd’hui</b><span>' + Math.round(m) + ' / ' + g + ' min' + (m >= g ? ' · objectif atteint' : '') + '</span></div><div class="bar"><span style="width:' + pct + '%"></span></div></div>';
}
function todayCard() {
  var act = S.active.filter(function (l) { return CUR[l]; }), t = dayKey(Date.now());
  var rows = act.map(function (l) {
    var nl = nextLesson(l), g = L(l), p = S.path[l];
    if (!nl) return '<div class="today-row done" style="--c:var(--' + l + ')"><span><b>' + g.name + '</b><small>Parcours terminé</small></span></div>';
    var did = p && p.last === t;
    return '<button class="today-row" data-act="lesson" data-l="' + l + '" data-k="' + nl.k + '" data-d="' + nl.d + '" data-from="home" style="--c:var(--' + l + ')"><span><b>' + g.name + '</b><small>Unité ' + (nl.k + 1) + ' · ' + esc(CUR[l][nl.k][0]) + '</small><small>' + (nl.d === 5 ? 'Bilan' : 'Leçon ' + (nl.d + 1) + ' sur 6 · ' + LES[nl.d]) + (did ? ' · fait aujourd’hui' : '') + '</small></span><span class="go">' + (did ? 'Encore' : 'Commencer') + '</span></button>';
  }).join('');
  var note = act.length > 2 ? '<p class="muted small" style="margin-top:8px">Chaque langue demande 6 leçons par semaine. Avec ' + act.length + ' langues actives, tu ne tiendras pas 6 mois sur toutes : garde-en une ou deux (Réglages).</p>' : '';
  return goalBar() + '<div class="today">' + rows + '</div>' + note;
}
function viewPath() {
  var l = L(V.lang), g = GOALS[l.id], n = CUR[l.id].length, f = frontier(l.id), p = S.path[l.id];
  var h = topBar('Parcours · ' + l.name) + '<div class="focus"><b>De ' + esc(g.from) + ' à ' + esc(g.to) + ' en 6 mois</b><div class="bar" style="margin:10px 0 6px"><span style="width:' + Math.round(f / n * 100) + '%"></span></div><div class="muted small">' + f + ' unités validées sur ' + n + '. ' + esc(pacing(l.id)) + '</div></div>';
  if (!p || !Object.keys(p.u).length) {
    h += '<div class="card" style="margin-bottom:14px"><h3>Où veux-tu commencer ?</h3><p class="muted small" style="margin:6px 0 10px">Si tu connais déjà le début, saute-le. Tu peux aussi passer un test sur n’importe quelle unité verrouillée.</p><div class="row">' +
      MB.slice(0, 6).map(function (k, m) { return '<button class="pill" data-act="startAt" data-k="' + k + '" aria-pressed="false">' + (m === 0 ? 'Au début' : 'Mois ' + (m + 1)) + '</button>'; }).join('') + '</div></div>';
  }
  for (var m = 0; m < 6; m++) {
    h += '<h3 class="month">Mois ' + (m + 1) + ' · ' + esc(g.months[m]) + '</h3><div class="nodes">';
    for (var k = MB[m]; k < MB[m + 1]; k++) {
      var done = passed(l.id, k), open = unitOpen(l.id, k), cur = k === f;
      h += '<button class="node' + (done ? ' done' : (cur ? ' cur' : (open ? '' : ' lock'))) + '" data-act="openUnit" data-k="' + k + '"><span class="dot">' + (done ? '✓' : (k + 1)) + '</span><span class="nt"><b>' + esc(CUR[l.id][k][0]) + '</b><small>' + CUR[l.id][k][1] + ' · ' + (done ? (ug(l.id, k).skip ? 'sautée' : 'validée') : (open ? lessonsDone(l.id, k) + ' / 6 leçons' : 'verrouillée')) + '</small></span></button>';
    }
    h += '</div>';
  }
  return h;
}
function viewUnit() {
  var l = L(V.lang), k = V.unit, u = CUR[l.id][k], st = ug(l.id, k), open = unitOpen(l.id, k), f = frontier(l.id);
  var h = topBar('Unité ' + (k + 1) + ' sur ' + CUR[l.id].length, 'Parcours') + '<h2 style="margin-bottom:4px">' + esc(u[0]) + '</h2><p class="muted">' + u[1] + ' · mois ' + (monthOf(k) + 1) + (st.ok ? ' · validée (' + st.best + ' %)' : '') + '</p>';
  if (open) {
    h += '<div class="lessons">' + LES.map(function (nm, d) {
      var ok = st.d[d], can = d === 0 || st.d[d - 1];
      return '<button class="les' + (ok ? ' done' : '') + '" data-act="lesson" data-l="' + l.id + '" data-k="' + k + '" data-d="' + d + '"' + (can ? '' : ' disabled') + '><span class="dot">' + (ok ? '✓' : d + 1) + '</span><span class="nt"><b>' + nm + '</b><small>' + (d === 5 ? 'Il faut ' + PASS + ' % pour valider l’unité' : 'Environ 20 à 25 cartes') + '</small></span></button>';
    }).join('') + '</div>';
    h += '<div class="stack" style="margin-top:14px"><button class="btn ghost wide" data-act="unitChat" data-l="' + l.id + '" data-k="' + k + '">Parler de ce thème avec l’IA</button>' +
      (!st.ok ? '<button class="btn ghost wide" data-act="testOut" data-k="' + k + '">Je connais déjà : passer le test (' + PASS_TEST + ' %)</button>' : '') + '</div>';
    if (needsGen(l.id, k)) h += '<p class="muted small" style="margin-top:12px">' + (sampleFn ? 'Le vocabulaire et les exercices de cette unité seront préparés par l’IA au début de la première leçon.' : 'Le vocabulaire de cette unité est préparé par l’IA : ouvre la page depuis l’application Claude pour le générer. Sans cela, seules les fiches et exercices intégrés sont disponibles.') + '</p>';
  } else {
    h += '<div class="card" style="margin:14px 0"><p>Cette unité s’ouvre quand tu valides l’unité ' + f + ' (' + esc(CUR[l.id][f][0]) + ').</p></div><div class="stack"><button class="btn wide" data-act="testOut" data-k="' + k + '">Passer le test pour sauter jusqu’ici (' + PASS_TEST + ' %)</button><p class="muted small">Si tu réussis, les unités précédentes sont marquées comme sautées.</p></div>';
  }
  return h;
}
function viewPrep() {
  var pr = V.prep; if (!pr) return topBar('', 'Retour');
  if (pr.state === 'busy') return '<div class="sum"><p class="muted">Unité ' + (pr.k + 1) + ' · ' + esc(CUR[pr.l][pr.k][0]) + '</p><h2 style="margin:10px 0"><span class="dots">L’IA prépare ton unité</span></h2><p class="muted small">Vocabulaire, phrases et exercices. Quelques secondes, puis la leçon démarre toute seule. Le contenu est gardé sur l’appareil.</p><div class="stack" style="margin-top:16px"><button class="btn ghost wide" data-act="prepBack">Annuler</button></div></div>';
  return '<div class="sum"><h2 style="margin-bottom:10px">' + esc(pr.msg) + '</h2><div class="stack">' + (pr.nogo ? '' : '<button class="btn wide" data-act="prepRetry">Réessayer</button><button class="btn ghost wide" data-act="prepGo">Continuer avec le contenu de base</button>') + '<button class="btn ghost wide" data-act="prepBack">Retour</button></div></div>';
}
function unitChatText(l, k) {
  var u = CUR[l][k];
  return 'Role-play a realistic everyday situation about this topic: "' + u[0] + '" (' + u[2] + '). The learner is working at level ' + u[1] + ' in this unit, so keep your language at that level and make them use the unit\'s vocabulary and grammar.';
}

var VIEWS = { home: viewHome, review: viewReview, settings: viewSettings, lang: viewLang, lang5: viewLang5, conj: viewConj, grammar: viewGrammar, sits: viewSits, sit: viewSit, alpha: viewAlpha, path: viewPath, unit: viewUnit, prep: viewPrep, session: viewSession, chatpick: viewChatPick, chat: viewChat };
function render() {
  var app = $('#app');
  app.setAttribute('data-lang', (V.lang && L(V.lang) && !L(V.lang).off) ? V.lang : '');
  app.innerHTML = VIEWS[V.view]() + (TOP[V.view] ? tabbar() : '');
  if (V.view === 'chat') updateChat();
  var a = $('#ans'); if (a) { try { a.focus(); } catch (e) {} }
}

/* ---------- actions ---------- */
var BACK = { path: 'lang', unit: 'path', prep: 'unit', lang: 'home', lang5: 'home', conj: 'lang', grammar: 'lang', sits: 'lang', alpha: 'lang', chatpick: 'lang', sit: 'sits', chat: 'chatpick' };
function answerCurrent(ok, extra) {
  var s = V.session, c = s.queue[s.i];
  Object.assign(s.cur, extra || {});
  record(c, !!ok);
  render();
}
function nextCard() {
  var s = V.session;
  if (s.i + 1 >= s.queue.length) { s.done = true; finishSession(s); render(); return; }
  s.i++; prepCur(); render();
  try { window.scrollTo(0, 0); } catch (e) {}
}
function onAction(act, el) {
  var s = V.session;
  switch (act) {
    case 'tab': V.lang = null; go({ view: el.dataset.v, note: '', confirmReset: false }); break;
    case 'openLang':
      if (el.dataset.l === 'x') go({ view: 'lang5', lang: null }); else go({ view: 'lang', lang: el.dataset.l, verb: 0, tense: 0 });
      break;
    case 'openBlock': {
      var b = el.dataset.b;
      if (b === 'path') go({ view: 'path' });
      else if (b === 'review') { startSession({ lang: V.lang, title: 'Révision', cards: reviewCards(V.lang), ret: { view: 'lang', lang: V.lang } }); }
      else if (b === 'chat') go({ view: 'chatpick' });
      else go({ view: b });
      break;
    }
    case 'back':
      if (V.view === 'chat') { var cr = V.chat && V.chat.ret; V.chat = null; if (cr) { go(cr); break; } }
      if (V.view === 'prep') { V.prep = null; }
      go({ view: BACK[V.view] || 'home', lang: (BACK[V.view] === 'home') ? null : V.lang });
      break;
    case 'verb': go({ verb: +el.dataset.i }); break;
    case 'tense': go({ tense: +el.dataset.i }); break;
    case 'openUnit': go({ view: 'unit', unit: +el.dataset.k }); break;
    case 'startAt': {
      var k0 = +el.dataset.k, p0 = ensP(V.lang); p0.start = k0;
      for (var j0 = 0; j0 < k0; j0++) { var x0 = uset(V.lang, j0); x0.ok = 1; x0.skip = 1; }
      save(); render(); break;
    }
    case 'lesson': {
      var lk = +el.dataset.k, lg = el.dataset.l, ld = +el.dataset.d;
      startLesson(lg, lk, ld, false, el.dataset.from === 'home' ? { view: 'home', lang: null } : null);
      break;
    }
    case 'testOut': startLesson(V.lang, +el.dataset.k, 5, true); break;
    case 'unitChat': {
      var cl = el.dataset.l, ck = +el.dataset.k; V.lang = cl;
      startChat('unit', unitChatText(cl, ck), { view: 'unit', lang: cl, unit: ck });
      break;
    }
    case 'prepBack': { var rr = (V.prep && V.prep.ret) || { view: 'home' }; V.prep = null; go(Object.assign({ view: 'home' }, rr)); break; }
    case 'prepRetry': { var pp = V.prep; if (pp) startLesson(pp.l, pp.k, pp.d, pp.test, pp.ret); break; }
    case 'prepGo': { var pq = V.prep; if (pq) launch(pq.l, pq.k, pq.d, pq.test, pq.ret); break; }
    case 'setGoal': S.goal = +el.dataset.m; save(); render(); break;
    case 'toggleActive': {
      var li = S.active.indexOf(el.dataset.l);
      if (li >= 0) { if (S.active.length > 1) S.active.splice(li, 1); } else S.active.push(el.dataset.l);
      save(); render(); break;
    }
    case 'testVoice': { var tt = { es: 'Hola, ¿cómo estás?', de: 'Guten Tag, wie geht es Ihnen?', en: 'Hello, how are you?', ru: 'Здравствуйте, как дела?' }; speak(tt[el.dataset.l], el.dataset.l); setTimeout(render, 700); break; }
    case 'say': speak(el.dataset.t, el.dataset.l); if (!speechOK) { V.note = ''; } break;
    case 'drill': {
      var d = D[V.lang], t = d.tenses[V.tense];
      var pool = buildCards(V.lang).filter(function (c) { return c.kind === 'conj' && (el.dataset.m === 'all' || c.tense.k === t.k); });
      startSession({ lang: V.lang, title: 'Conjugaison', cards: shuffle(pool).slice(0, 10), ret: { view: 'conj', lang: V.lang, verb: V.verb, tense: V.tense } });
      break;
    }
    case 'quiz':
      startSession({ lang: V.lang, title: 'Quiz de grammaire', cards: shuffle(buildCards(V.lang).filter(function (c) { return c.kind === 'mcq'; })).slice(0, 12), ret: { view: 'grammar', lang: V.lang } });
      break;
    case 'alphaQuiz':
      startSession({ lang: 'ru', title: 'Alphabet', cards: shuffle(buildCards('ru').filter(function (c) { return c.alpha; })).slice(0, 10), ret: { view: 'alpha', lang: 'ru' } });
      break;
    case 'openSit': go({ view: 'sit', sit: el.dataset.s }); break;
    case 'sitPractice':
      startSession({ lang: V.lang, title: 'Situation', cards: shuffle(buildCards(V.lang).filter(function (c) { return c.kind === 'phrase' && c.sit === V.sit; })), ret: { view: 'sit', lang: V.lang, sit: V.sit } });
      break;
    case 'sitChat': startChat(V.sit); break;
    case 'chatStart': startChat(el.dataset.s); break;
    case 'chatSend': chatSend(); break;
    case 'retry': callAI(); break;
    case 'mic':
      if (dict) { if (dictState === 'listening') { dict.stop(); } else { try { var pr = dict.start(); if (pr && pr.catch) pr.catch(function () {}); } catch (e) {} } }
      break;
    case 'startReview': startSession({ lang: el.dataset.l, title: 'Révision', cards: reviewCards(el.dataset.l), ret: { view: 'review', lang: null } }); break;
    case 'reveal': s.cur.revealed = true; render(); break;
    case 'grade': { var ok = el.dataset.ok === '1'; record(s.queue[s.i], ok); nextCard(); break; }
    case 'pick': {
      var c = s.queue[s.i], txt = s.cur.opts[+el.dataset.i];
      var good = c.kind === 'mcq' ? txt === c.a : txt === firstAlt(c.ans);
      answerCurrent(good, { picked: +el.dataset.i, result: good });
      break;
    }
    case 'check': {
      var inp = $('#ans'), cc = s.queue[s.i];
      if (!inp || !inp.value.trim()) return;
      var r = checkTyped(inp.value, cc.ans);
      answerCurrent(!!r, { picked: 1, typed: inp.value, result: r });
      break;
    }
    case 'next': nextCard(); break;
    case 'again': if (s.path) { startLesson(s.path.lang, s.path.k, s.path.d, s.path.test, s.ret); break; } startSession({ lang: s.lang, title: s.title, cards: s.ret && s.ret.view === 'review' || s.title === 'Révision' ? reviewCards(s.lang) : shuffle(s.queue.filter(function (c, i, a) { return a.indexOf(c) === i; })), ret: s.ret }); break;
    case 'quit': { var rt = s.ret || { view: 'home' }; V.session = null; go(Object.assign({ view: 'home' }, rt)); break; }
    case 'setConj': S.settings.conj[el.dataset.l] = el.dataset.m; save(); render(); break;
    case 'bkExport': V.bk = JSON.stringify(S); V.note = 'Sauvegarde prête. Copie-la.'; render(); break;
    case 'bkCopy': {
      var ta = $('#bk'); if (!ta || !ta.value) { V.note = 'Prépare d’abord la sauvegarde.'; render(); break; }
      try { navigator.clipboard.writeText(ta.value).then(function () { V.note = 'Copié.'; render(); }, function () { V.note = 'Copie impossible ici : sélectionne le texte et copie-le à la main.'; render(); }); }
      catch (e) { V.note = 'Copie impossible ici : sélectionne le texte et copie-le à la main.'; render(); }
      break;
    }
    case 'bkImport': {
      var t2 = $('#bk');
      try { mergeState(JSON.parse(t2.value)); save(); V.bk = ''; V.note = 'Progression restaurée.'; }
      catch (e) { V.note = 'Texte non valide. Colle la sauvegarde complète.'; }
      render(); break;
    }
    case 'reset':
      if (!V.confirmReset) { V.confirmReset = true; render(); }
      else { S = defState(); save(); V.confirmReset = false; V.note = 'Progression effacée.'; render(); }
      break;
  }
}
document.addEventListener('click', function (e) {
  var el = e.target.closest('[data-act]');
  tick();
  if (!el || el.disabled) return;
  onAction(el.dataset.act, el);
});
document.addEventListener('keydown', function (e) {
  tick();
  if (e.key === 'Enter' && e.target.id === 'ans') { e.preventDefault(); onAction('check', e.target); }
  if (e.key === 'Enter' && !e.shiftKey && e.target.id === 'draft') { e.preventDefault(); chatSend(); }
});
document.addEventListener('input', function (e) {
  if (e.target.id === 'draft' && V.chat) {
    V.chat.draft = e.target.value;
    e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 140) + 'px';
  }
});
document.addEventListener('change', function (e) {
  if (e.target.id === 'rate') { S.settings.rate = parseFloat(e.target.value); save(); speak('Hello', 'en'); }
});

/* ---------- capacités de la page ---------- */
function initCaps() {
  var cl = window.claude;
  if (!cl || !cl.use) { capsReady = true; return; }
  Promise.resolve(cl.use('sample')).then(function (s) { sampleFn = s || null; }).catch(function () {})
    .then(function () { return Promise.resolve(cl.use('dictation')); })
    .then(function (d) {
      dict = d || null;
      if (dict) {
        dict.onFinal(function (x) { var ta = $('#draft'); if (ta && V.chat) { ta.value = (ta.value + ' ' + x.text).trim(); V.chat.draft = ta.value; } });
        if (dict.onState) dict.onState(function (x) { dictState = x.state === 'listening' ? 'listening' : 'idle'; var m = $('#chatmic'); if (m) m.textContent = dictState === 'listening' ? 'Stop' : 'Micro'; });
      }
    }).catch(function () {})
    .then(function () { capsReady = true; if (V.view === 'chat') render(); });
}

/* ---------- démarrage ---------- */
function boot(data) {
  loadState(); loadContent();
  if (data && data.S) mergeState(data.S);
  if (data && data.C && !Object.keys(CONT).length) CONT = data.C;
  render();
  initCaps();
}
var hot = window.claude && window.claude.hot;
if (hot && hot.snapshot) { try { hot.snapshot(function () { return { S: S, C: CONT }; }); } catch (e) {} }
if (hot && hot.ready) hot.ready(boot); else boot((hot && hot.data) || {});
})();
