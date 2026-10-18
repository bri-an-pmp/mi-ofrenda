import {
  CATEGORIES, OFFERINGS, PHOTO, OFFERING_BY_ID, RELATIONS, FAMOUS,
  RELATION_BY_ID, FAMOUS_BY_ID, iconHTML,
} from './data.js';

const $ = (id) => document.getElementById(id);
const STORE_KEY = 'mi_ofrenda_altars';
const SVG_NS = 'http://www.w3.org/2000/svg';

// The altar drawing is 400 x 520 units. Offerings stand on these surfaces (y = where their base
// rests). A dropped offering falls onto the first surface below it, like real gravity.
const SURFACES = [
  { tier: 1, y: 168, x0: 106, x1: 294 },
  { tier: 2, y: 268, x0: 66, x1: 334 },
  { tier: 3, y: 368, x0: 26, x1: 374 },
  { tier: 4, y: 506, x0: 10, x1: 390 }, // the floor in front of the altar
];
// Spots used when an offering is tapped instead of dragged
const SLOTS = {
  1: [124, 148, 252, 276],
  2: [84, 112, 140, 168, 200, 232, 260, 288, 316],
  3: [44, 78, 112, 146, 180, 220, 254, 288, 322, 356],
  4: [30, 66, 102, 138, 262, 298, 334, 370],
};
const PHOTO_X = [160, 240]; // keep the photo on the top step uncovered
const WAX = ['#c2185b', '#e65100', '#6a1b9a', '#f9a825', '#ad1457', '#2e7d32', '#1565c0'];

let altars = loadAltars();
let current = null;     // the altar being decorated
let activeTab = 'esenciales';
let cardItem = null;    // offering shown in the word card
let cardUid = null;     // which placed copy the card is about (to remove it)

// ---------- saving ----------

function loadAltars() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORE_KEY) || '[]');
    return Array.isArray(raw) ? raw.map(cleanAltar).filter(Boolean) : [];
  } catch {
    return [];
  }
}

function newId(prefix) {
  return `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

function clamp(n, lo, hi) {
  return Math.min(hi, Math.max(lo, n));
}

// Saved data is checked before use so a damaged entry can't break the page.
// Altars saved by the first version stored offerings as a plain list of names; those still open
// and get placed automatically.
function cleanAltar(a) {
  if (!a || typeof a !== 'object' || typeof a.id !== 'string') return null;
  const text = (v, max) => (typeof v === 'string' ? v.slice(0, max) : '');
  const items = [];
  for (const raw of Array.isArray(a.items) ? a.items : []) {
    const id = typeof raw === 'string' ? raw : raw?.id;
    const o = OFFERINGS.find((x) => x.id === id);
    if (!o || items.filter((i) => i.id === id).length >= o.max) continue;
    const placed = raw && typeof raw === 'object' && Number.isFinite(raw.x) && Number.isFinite(raw.y);
    const spot = placed ? { x: clamp(raw.x, 0, 400), y: clamp(raw.y, 0, 520) } : autoSpot(o, items);
    const uid = raw && typeof raw.uid === 'string' ? raw.uid.slice(0, 24) : newId('i');
    items.push({ uid, id, ...spot });
  }
  return {
    id: a.id,
    name: text(a.name, 40) || 'Alguien especial',
    relation: RELATION_BY_ID[a.relation] ? a.relation : '',
    famous: FAMOUS_BY_ID[a.famous] ? a.famous : '',
    memory: text(a.memory, 200),
    items,
    updated: Number.isFinite(a.updated) ? a.updated : Date.now(),
  };
}

function saveAltars() {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(altars));
  } catch {
    say('Your altar could not be saved on this device (private browsing may block saving). It will stay open until you close the page.');
  }
}

function saveCurrent() {
  current.updated = Date.now();
  altars = [current, ...altars.filter((a) => a.id !== current.id)];
  saveAltars();
}

// ---------- screens ----------

function show(screen) {
  for (const id of ['screenHome', 'screenChoose', 'screenAltar']) $(id).hidden = id !== screen;
  document.body.classList.toggle('immersive', screen === 'screenAltar');
  window.scrollTo(0, 0);
  const heading = $(screen).querySelector('h1');
  heading.tabIndex = -1;
  heading.focus({ preventScroll: true });
}

function goHome() {
  renderSaved();
  show('screenHome');
}

function renderSaved() {
  const list = $('savedList');
  list.replaceChildren();
  $('savedWrap').hidden = altars.length === 0;
  for (const a of altars) {
    const li = document.createElement('li');
    const open = document.createElement('button');
    open.type = 'button';
    open.className = 'saved-open';
    const icon = document.createElement('span');
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = personIcon(a);
    const label = document.createElement('span');
    label.textContent = `${a.name} · ${a.items.length} ${a.items.length === 1 ? 'offering' : 'offerings'}`;
    open.append(icon, label);
    open.addEventListener('click', () => openAltar(a));

    const del = document.createElement('button');
    del.type = 'button';
    del.className = 'saved-delete';
    del.textContent = '✕';
    del.setAttribute('aria-label', `Delete the altar for ${a.name}`);
    del.addEventListener('click', () => {
      if (!confirm(`Delete the altar for ${a.name}? This can't be undone.`)) return;
      altars = altars.filter((x) => x.id !== a.id);
      saveAltars();
      renderSaved();
      say(`The altar for ${a.name} was deleted.`);
    });
    li.append(open, del);
    list.append(li);
  }
}

// ---------- choosing who to remember ----------

let pickedRelation = null;

function pickButton(icon, es, en, onClick) {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'pick';
  const i = document.createElement('span');
  i.className = 'pick-icon';
  i.setAttribute('aria-hidden', 'true');
  i.textContent = icon;
  const s = document.createElement('span');
  s.className = 'pick-es';
  s.lang = 'es';
  s.textContent = es;
  const e = document.createElement('span');
  e.className = 'pick-en';
  e.textContent = en;
  b.append(i, s, e);
  b.addEventListener('click', onClick);
  return b;
}

function buildChooser() {
  for (const r of RELATIONS) {
    $('relationGrid').append(pickButton(r.icon, r.es, r.en, (ev) => {
      pickedRelation = r;
      for (const b of $('relationGrid').children) b.setAttribute('aria-pressed', String(b === ev.currentTarget));
      $('pickedLabel').textContent = `Remembering ${r.es} (${r.en}).`;
      $('nameInput').placeholder = r.kind === 'pet' ? 'For example: Canela' : 'For example: Rosa';
      $('personForm').hidden = false;
      $('nameInput').focus();
    }));
  }
  for (const b of $('relationGrid').children) b.setAttribute('aria-pressed', 'false');

  for (const f of FAMOUS) {
    $('famousGrid').append(pickButton(f.icon, f.name, `${f.es} · ${f.en}`, () => {
      startAltar({ name: f.name, famous: f.id });
    }));
  }

  $('personForm').addEventListener('submit', (ev) => {
    ev.preventDefault();
    if (!pickedRelation) return;
    const typed = $('nameInput').value.trim();
    const name = typed || capitalize(pickedRelation.es);
    startAltar({ name, relation: pickedRelation.id, memory: $('memoryInput').value.trim() });
  });
}

function startAltar({ name, relation = '', famous = '', memory = '' }) {
  openAltar(cleanAltar({ id: newId('a'), name, relation, famous, memory, items: [] }));
  saveCurrent();
}

function resetChooser() {
  pickedRelation = null;
  $('personForm').reset();
  $('personForm').hidden = true;
  for (const b of $('relationGrid').children) b.setAttribute('aria-pressed', 'false');
}

// ---------- the altar ----------

function isPet(a) {
  return RELATION_BY_ID[a.relation]?.kind === 'pet';
}

function personIcon(a) {
  return RELATION_BY_ID[a.relation]?.icon || FAMOUS_BY_ID[a.famous]?.icon || '💛';
}

function personSubtitle(a) {
  if (a.famous) return FAMOUS_BY_ID[a.famous].es;
  const r = RELATION_BY_ID[a.relation];
  return r && r.id !== 'otro' ? r.es : '';
}

function openAltar(a) {
  current = a;
  activeTab = isPet(a) ? 'mascotas' : 'esenciales';
  $('altarName').textContent = a.name;
  $('altarMemory').hidden = !a.memory;
  $('altarMemory').textContent = a.memory ? `“${a.memory}”` : '';
  $('photoIcon').textContent = personIcon(a);
  $('photoName').textContent = a.name;
  $('photoBtn').setAttribute('aria-label', `Photo of ${a.name}${personSubtitle(a) ? `, ${personSubtitle(a)}` : ''}. Tap to learn the word.`);
  $('caption').hidden = true;
  renderTabs();
  show('screenAltar');
  renderAltar();
}

function countOf(id) {
  return current.items.filter((i) => i.id === id).length;
}

function lastUid(id) {
  return [...current.items].reverse().find((i) => i.id === id)?.uid ?? null;
}

// A free spot for a tapped offering: its usual step first, then the nearest other steps
function autoSpot(o, items) {
  if (o.tier === 0) return { x: 200, y: 0 };
  const tiers = [1, 2, 3, 4].sort((a, b) => Math.abs(a - o.tier) - Math.abs(b - o.tier));
  for (const tier of tiers) {
    const s = SURFACES[tier - 1];
    for (const x of SLOTS[tier]) {
      if (!items.some((i) => Math.abs(i.y - s.y) < 2 && Math.abs(i.x - x) < 24)) return { x, y: s.y };
    }
  }
  const s = SURFACES[o.tier - 1];
  return { x: s.x0 + Math.random() * (s.x1 - s.x0), y: s.y };
}

// Where a dropped offering comes to rest: straight down onto the first step under it
function dropSpot(x, bottomY) {
  x = clamp(x, SURFACES[3].x0, SURFACES[3].x1);
  const s = SURFACES.find((f) => bottomY <= f.y + 16 && x >= f.x0 && x <= f.x1) || SURFACES[3];
  if (s.tier === 1 && x > PHOTO_X[0] && x < PHOTO_X[1]) x = x < 200 ? PHOTO_X[0] - 8 : PHOTO_X[1] + 8;
  return { x, y: s.y };
}

function buildAltarArt() {
  const el = (tag, attrs, parent) => {
    const n = document.createElementNS(SVG_NS, tag);
    for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
    parent.append(n);
    return n;
  };

  // three cloth-covered steps; the cloth ends in a lace hem above the step below
  const steps = $('steps');
  el('ellipse', { cx: 200, cy: 474, rx: 205, ry: 14, fill: '#000', opacity: 0.55 }, steps);
  const defs = [
    { x0: 100, x1: 300, front: 172, back: 160, end: 254, bottom: 270 },
    { x0: 60, x1: 340, front: 272, back: 260, end: 354, bottom: 370 },
    { x0: 20, x1: 380, front: 372, back: 360, end: 460, bottom: 472 },
  ];
  for (const d of defs) {
    const w = d.x1 - d.x0;
    const h = d.end - d.front;
    el('rect', { x: d.x0, y: d.front, width: w, height: d.bottom - d.front, fill: '#3b2314' }, steps);
    el('polygon', { points: `${d.x0},${d.front} ${d.x0 + 8},${d.back} ${d.x1 - 8},${d.back} ${d.x1},${d.front}`, fill: 'url(#topCloth)' }, steps);
    el('rect', { x: d.x0, y: d.front, width: w, height: h, fill: 'url(#folds)' }, steps);
    el('rect', { x: d.x0, y: d.front, width: w, height: h, fill: 'url(#faceShade)' }, steps);
    el('rect', { x: d.x0, y: d.front + 6, width: w, height: 12, fill: 'url(#embroidery)' }, steps);
    let lace = `M${d.x0} ${d.end}`;
    for (let x = d.x0; x < d.x1; x += 10) lace += ' a5 5 0 0 0 10 0';
    el('path', { d: `${lace} V${d.end - 1} H${d.x0}z`, fill: '#efe6d8' }, steps);
    for (let x = d.x0 + 5; x < d.x1; x += 10) el('circle', { cx: x, cy: d.end + 2, r: 1.3, fill: '#3b2314' }, steps);
    el('rect', { x: d.x0, y: d.front, width: 5, height: h, fill: '#000', opacity: 0.18 }, steps);
    el('rect', { x: d.x1 - 5, y: d.front, width: 5, height: h, fill: '#000', opacity: 0.25 }, steps);
  }

  // arch of marigolds over the top step
  const arco = $('arco');
  el('path', { d: 'M98 168 Q200 -70 302 168', fill: 'none', stroke: '#2f5d2a', 'stroke-width': 4 }, arco);
  const n = 34;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const x = (1 - t) ** 2 * 98 + 2 * (1 - t) * t * 200 + t ** 2 * 302;
    const y = (1 - t) ** 2 * 168 + 2 * (1 - t) * t * -70 + t ** 2 * 168;
    el('circle', { cx: x, cy: y, r: 7.5, fill: ['#e65100', '#f59b23', '#ffb300'][i % 3] }, arco);
    el('circle', { cx: x + 1, cy: y - 1, r: 2.5, fill: '#ffd166', opacity: 0.8 }, arco);
  }

  // marigold petals on the floor
  const petals = $('petals');
  for (let i = 0; i < 46; i++) {
    const x = 200 + Math.sin(i * 1.7) * (14 + i * 0.6);
    const y = 480 + i * 0.85;
    el('ellipse', { cx: x, cy: y, rx: 3, ry: 2, fill: i % 2 ? '#f59b23' : '#e65100', transform: `rotate(${i * 37} ${x} ${y})` }, petals);
  }

  // papel picado
  const colors = ['#e8418c', '#f59b23', '#7b5cd6', '#2fb38a', '#2a9fd6', '#f2c45a', '#e8418c', '#f59b23'];
  colors.forEach((c, i) => {
    const x = 14 + i * 48;
    const sag = 18 + 28 * Math.sin((Math.PI * (x + 17)) / 400); // follow the string's curve
    const g = el('g', { class: 'flag' }, $('papelPicado'));
    g.style.animationDelay = `${-i * 0.7}s`;
    el('path', { d: `M${x} ${sag} h34 v38 l-5.6 -6 l-5.6 6 l-5.6 -6 l-5.6 6 l-5.6 -6 l-6 6 z`, fill: c, opacity: 0.92 }, g);
    for (const [dx, dy, r] of [[17, 15, 5], [8, 27, 2], [26, 27, 2], [17, 29, 2.4], [8, 8, 1.5], [26, 8, 1.5]]) {
      el('circle', { cx: x + dx, cy: sag + dy, r, fill: '#1a0f14' }, g);
    }
  });
}

function renderAltar() {
  const placed = $('placed');
  placed.replaceChildren();
  const items = [...current.items].sort((a, b) => a.y - b.y || a.x - b.x);
  let candle = 0;
  for (const it of items) {
    const o = OFFERING_BY_ID[it.id];
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-label', `${o.es}, ${o.en}`);
    if (o.tier === 0) {
      // the banner hangs above the altar; this invisible button lets it be tapped
      b.className = 'banner-btn';
      b.addEventListener('click', () => openCard(o, it.uid));
      placed.append(b);
      continue;
    }
    b.className = 'on-altar';
    b.dataset.uid = it.uid;
    b.style.left = `${it.x / 4}%`;
    b.style.top = `${it.y / 5.2}%`;
    b.style.zIndex = String(Math.round(it.y));
    if (o.id === 'vela') {
      b.classList.add('candle');
      b.style.setProperty('--wax', WAX[candle++ % WAX.length]);
    }
    setIcon(b, o);
    if (o.id === 'copal') {
      const smoke = document.createElement('span');
      smoke.className = 'smoke';
      smoke.setAttribute('aria-hidden', 'true');
      for (let i = 0; i < 4; i++) smoke.append(document.createElement('i'));
      b.append(smoke);
    }
    b.addEventListener('pointerdown', (ev) => pressStart(ev, o, it.uid));
    b.addEventListener('click', () => {
      if (!consumeDrag()) openCard(o, it.uid);
    });
    placed.append(b);
  }

  $('papelPicado').setAttribute('opacity', countOf('papel') ? '1' : '0');
  $('arco').setAttribute('opacity', countOf('cempasuchil') ? '1' : '0');
  $('petals').setAttribute('opacity', countOf('cempasuchil') ? '1' : '0');
  $('darkHint').hidden = countOf('vela') > 0;

  const n = current.items.length;
  const words = new Set(current.items.map((i) => i.id)).size;
  $('count').textContent = n
    ? `${n} ${n === 1 ? 'offering' : 'offerings'} · ${words} ${words === 1 ? 'palabra' : 'palabras'}`
    : 'No offerings yet.';
  renderTray();
  updateLights();
}

function setIcon(el, o) {
  if (o.art) el.insertAdjacentHTML('beforeend', iconHTML(o)); // static drawings from data.js only
  else {
    const s = document.createElement('span');
    s.className = 'emoji';
    s.setAttribute('aria-hidden', 'true');
    s.textContent = o.emoji;
    el.append(s);
  }
}

// ---------- candlelight ----------

// The room is dark; each candle opens a pool of warm light around its flame.
function updateLights() {
  const stage = $('stage');
  if (!current || $('screenAltar').hidden) return;
  const sr = stage.getBoundingClientRect();
  const ar = $('altar').getBoundingClientRect();
  const ax = ar.left - sr.left;
  const ay = ar.top - sr.top;
  const lights = current.items.filter((i) => i.id === 'vela').map((i) => ({
    x: ax + (i.x / 400) * ar.width,
    y: ay + ((i.y - 44) / 520) * ar.height,
  }));
  const r = ar.width * 0.48;

  // moonlight from the window (the room drawing is 1000 x 700, cropped to fill the stage)
  const s = Math.max(sr.width / 1000, sr.height / 700);
  const mx = (sr.width - 1000 * s) / 2 + 165 * s;
  const my = sr.height - 700 * s + 245 * s;

  const masks = [
    `radial-gradient(circle ${210 * s}px at ${mx}px ${my}px, rgba(0,0,0,.35), #000)`,
    `radial-gradient(circle ${ar.width * 0.7}px at ${ax + ar.width / 2}px ${ay + ar.height * 0.45}px, rgba(0,0,0,.62), #000)`,
    ...lights.map((l) => `radial-gradient(circle ${r}px at ${l.x}px ${l.y}px, rgba(0,0,0,0) 0%, rgba(0,0,0,.3) 40%, #000 100%)`),
  ].join(',');
  const dark = $('dark');
  dark.style.webkitMaskImage = masks;
  dark.style.maskImage = masks;
  dark.style.backgroundColor = `rgba(6, 3, 8, ${Math.max(0.6, 0.88 - lights.length * 0.035)})`;

  $('glow').style.backgroundImage = lights.length
    ? lights.map((l) => `radial-gradient(circle ${r * 0.8}px at ${l.x}px ${l.y}px, rgba(255,172,70,.32), rgba(255,130,40,.1) 45%, rgba(0,0,0,0) 75%)`).join(',')
    : 'none';
}

// ---------- offerings tray ----------

function renderTabs() {
  const tabs = $('tabs');
  tabs.replaceChildren();
  const pets = CATEGORIES.filter((c) => c.id === 'mascotas');
  const cats = isPet(current) ? [...pets, ...CATEGORIES.filter((c) => c.id !== 'mascotas')] : CATEGORIES;
  for (const c of cats) {
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('role', 'tab');
    b.id = `tab-${c.id}`;
    b.className = 'tab';
    b.setAttribute('aria-selected', String(c.id === activeTab));
    b.tabIndex = c.id === activeTab ? 0 : -1;
    const es = document.createElement('span');
    es.lang = 'es';
    es.textContent = c.es;
    const en = document.createElement('span');
    en.className = 'tab-en';
    en.textContent = c.en;
    b.append(es, en);
    b.addEventListener('click', () => selectTab(c.id));
    tabs.append(b);
  }
}

function selectTab(id, focus = false) {
  activeTab = id;
  for (const b of $('tabs').children) {
    const on = b.id === `tab-${id}`;
    b.setAttribute('aria-selected', String(on));
    b.tabIndex = on ? 0 : -1;
    if (on && focus) b.focus();
  }
  $('tray').scrollLeft = 0;
  renderTray();
}

function renderTray() {
  const tray = $('tray');
  tray.setAttribute('aria-labelledby', `tab-${activeTab}`);
  tray.replaceChildren();
  for (const o of OFFERINGS.filter((x) => x.cat === activeTab)) {
    const n = countOf(o.id);
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'offering';
    b.setAttribute('aria-label', `${o.es}, ${o.en}${n ? `, ${n} on the altar` : ''}`);
    const icon = document.createElement('span');
    icon.className = 'offering-icon';
    setIcon(icon, o);
    const es = document.createElement('span');
    es.className = 'offering-es';
    es.lang = 'es';
    es.textContent = o.es;
    const en = document.createElement('span');
    en.className = 'offering-en';
    en.textContent = o.en;
    b.append(icon, es, en);
    if (n) {
      const badge = document.createElement('span');
      badge.className = 'badge';
      badge.setAttribute('aria-hidden', 'true');
      badge.textContent = o.max > 1 ? `${n}/${o.max}` : '✓';
      b.append(badge);
    }
    b.addEventListener('pointerdown', (ev) => pressStart(ev, o, null));
    b.addEventListener('click', () => {
      if (consumeDrag()) return;
      if (countOf(o.id) < o.max) addOffering(o, autoSpot(o, current.items));
      else openCard(o, lastUid(o.id));
    });
    tray.append(b);
  }
}

function addOffering(o, spot, fromY) {
  if (countOf(o.id) >= o.max) {
    say(o.max === 1 ? `${o.es} is already on the altar.` : `The altar already has ${o.max} of ${o.es}.`);
    return;
  }
  const item = { uid: newId('i'), id: o.id, ...spot };
  current.items.push(item);
  saveCurrent();
  renderAltar();
  if (fromY !== undefined) fall(item, fromY);
  showCaption(o, item.uid);
  speakWord(o);
}

// Let a dropped offering fall the last bit onto its step
function fall(item, fromY) {
  const el = $('placed').querySelector(`[data-uid="${item.uid}"]`);
  if (!el || fromY >= item.y - 4 || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  el.animate([{ top: `${fromY / 5.2}%` }, { top: `${item.y / 5.2}%` }], {
    duration: clamp((item.y - fromY) * 1.6, 120, 420), easing: 'cubic-bezier(.55,0,1,.45)',
  });
}

// ---------- drag and drop ----------
// Works with a mouse or a finger. Dropping an offering outside the room takes it off the altar.

let press = null;     // a pointer is down on an offering
let dragged = false;  // the last press became a drag, so its click is ignored

function consumeDrag() {
  const was = dragged;
  dragged = false;
  return was;
}

function pressStart(ev, o, uid) {
  if (ev.button > 0 || press) return;
  press = { o, uid, id: ev.pointerId, x0: ev.clientX, y0: ev.clientY, ghost: null, size: 0, src: ev.currentTarget };
  dragged = false;
}

function overStage(ev) {
  const r = $('stage').getBoundingClientRect();
  return ev.clientX >= r.left && ev.clientX <= r.right && ev.clientY >= r.top && ev.clientY <= r.bottom;
}

function dragMove(ev) {
  if (!press || ev.pointerId !== press.id) return;
  if (!press.ghost) {
    if (Math.hypot(ev.clientX - press.x0, ev.clientY - press.y0) < 8) return;
    // start dragging: a copy of the offering follows the pointer
    const ar = $('altar').getBoundingClientRect();
    press.size = Math.max(44, ar.width * 0.12);
    const g = document.createElement('div');
    g.className = `ghost${press.o.id === 'vela' ? ' candle' : ''}`;
    g.style.width = `${press.size}px`;
    g.style.height = `${press.size * (press.o.id === 'vela' ? 1.33 : 1)}px`;
    setIcon(g, press.o);
    document.body.append(g);
    press.ghost = g;
    press.src.setPointerCapture?.(press.id);
    if (press.uid) press.src.classList.add('lifted');
    document.body.classList.add('dragging');
    $('caption').hidden = true;
  }
  ev.preventDefault();
  press.ghost.style.left = `${ev.clientX}px`;
  press.ghost.style.top = `${ev.clientY}px`;
  $('stage').classList.toggle('drop-target', overStage(ev));
}

function dragEnd(ev) {
  if (!press || ev.pointerId !== press.id) return;
  const p = press;
  press = null;
  if (!p.ghost) return; // a plain tap; the click handler takes it from here
  dragged = true;
  setTimeout(() => { dragged = false; }, 400); // in case no click follows
  p.ghost.remove();
  p.src.classList.remove('lifted');
  document.body.classList.remove('dragging');
  $('stage').classList.remove('drop-target');
  if (ev.type === 'pointercancel') return;

  const existing = p.uid && current.items.find((i) => i.uid === p.uid);
  if (!overStage(ev)) {
    if (existing) removeItem(existing.uid);
    return;
  }
  const ar = $('altar').getBoundingClientRect();
  const x = ((ev.clientX - ar.left) / ar.width) * 400;
  const bottom = ((ev.clientY + p.size * 0.45 - ar.top) / ar.height) * 520;
  const spot = p.o.tier === 0 ? { x: 200, y: 0 } : dropSpot(x, bottom);
  if (existing) {
    Object.assign(existing, spot);
    saveCurrent();
    renderAltar();
    fall(existing, bottom);
  } else {
    addOffering(p.o, spot, bottom);
  }
}

window.addEventListener('pointermove', dragMove, { passive: false });
window.addEventListener('pointerup', dragEnd);
window.addEventListener('pointercancel', dragEnd);

// ---------- caption and word card ----------

let captionTimer;
let captionFor = null;

function showCaption(o, uid) {
  captionFor = { o, uid };
  const icon = $('captionIcon');
  icon.replaceChildren();
  setIcon(icon, o);
  $('captionWord').textContent = o.es;
  $('captionSub').textContent = `${o.say} · ${o.en}`;
  $('caption').hidden = false;
  clearTimeout(captionTimer);
  captionTimer = setTimeout(() => { $('caption').hidden = true; }, 8000);
}

function fill(text) {
  return text.replaceAll('{name}', current.name);
}

function fullSentence(o) {
  return `${o.core} ${fill(o.tail)}.`;
}

function openCard(o, uid = null) {
  cardItem = o;
  cardUid = uid;
  const icon = $('cardIcon');
  icon.replaceChildren();
  setIcon(icon, o);
  $('cardWord').textContent = o.es;
  $('cardSay').textContent = o.say;
  $('cardEn').textContent = o.en;
  $('cardSentence').textContent = fullSentence(o);
  $('cardSentenceEn').textContent = fill(o.sentenceEn);
  $('cardWhy').textContent = o.why;
  $('removeBtn').hidden = !uid;
  $('card').showModal();
  speakWord(o);
}

function removeItem(uid) {
  const item = current.items.find((i) => i.uid === uid);
  if (!item) return;
  current.items = current.items.filter((i) => i.uid !== uid);
  saveCurrent();
  renderAltar();
  say(`${OFFERING_BY_ID[item.id].es} was taken off the altar.`);
}

// ---------- speaking Spanish ----------
// Recorded clips in public/audio play when they exist (see README). Otherwise the device's own
// Spanish voice reads the text.

let spanishVoice = null;
let warnedNoVoice = false;
let clip = null;
const missingClips = new Set();

function findVoice() {
  if (!('speechSynthesis' in window)) return;
  const voices = speechSynthesis.getVoices();
  spanishVoice = voices.find((v) => v.lang === 'es-MX')
    || voices.find((v) => v.lang === 'es-US')
    || voices.find((v) => v.lang?.toLowerCase().startsWith('es')) || null;
}

function deviceSpeak(text) {
  if (!('speechSynthesis' in window)) {
    if (!warnedNoVoice) say('This browser can\'t read words aloud. Use the pronunciation guide under each word, or try Safari or Chrome.');
    warnedNoVoice = true;
    return;
  }
  if (!spanishVoice) findVoice();
  if (!spanishVoice && speechSynthesis.getVoices().length && !warnedNoVoice) {
    warnedNoVoice = true;
    say('Your device has no Spanish voice installed, so words may sound English. On iPhone: Settings → Accessibility → Spoken Content → Voices → Spanish.');
  }
  const u = new SpeechSynthesisUtterance(text);
  u.lang = spanishVoice?.lang || 'es-MX';
  if (spanishVoice) u.voice = spanishVoice;
  u.rate = 0.85;
  speechSynthesis.speak(u);
}

function play(url, fallbackText) {
  clip?.pause();
  if ('speechSynthesis' in window) speechSynthesis.cancel();
  if (missingClips.has(url)) {
    deviceSpeak(fallbackText);
    return;
  }
  const audio = new Audio(url);
  clip = audio;
  let failed = false;
  const fail = () => {
    if (failed) return;
    failed = true;
    missingClips.add(url);
    if (clip === audio) deviceSpeak(fallbackText);
  };
  audio.addEventListener('error', fail, { once: true });
  audio.play().catch((err) => {
    if (err.name !== 'NotAllowedError' && err.name !== 'AbortError') fail();
  });
}

function speakWord(o) {
  play(`audio/words/${o.id}.mp3`, o.es);
}

function speakSentence(o) {
  play(`audio/sentences/${o.id}.mp3`, fullSentence(o));
}

// ---------- practice quiz ----------

const quiz = { pool: [], current: null, right: 0, asked: 0 };

function shuffle(list) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function startQuiz() {
  const pool = [...new Set(current.items.map((i) => i.id))].map((id) => OFFERING_BY_ID[id]);
  if (pool.length < 3) {
    say(`Place at least 3 different offerings first, then practice their names. (${pool.length} so far.)`);
    return;
  }
  Object.assign(quiz, { pool, current: null, right: 0, asked: 0 });
  nextQuestion();
  $('quiz').showModal();
}

function nextQuestion() {
  const options = quiz.pool.filter((o) => o !== quiz.current);
  const q = options[Math.floor(Math.random() * options.length)];
  quiz.current = q;
  const icon = $('quizIcon');
  icon.replaceChildren();
  setIcon(icon, q);
  $('quizEn').textContent = q.en;
  $('quizFeedback').textContent = '';
  $('quizNext').hidden = true;

  const wrong = shuffle(OFFERINGS.filter((o) => o !== q)).slice(0, 2);
  const choices = $('quizChoices');
  choices.replaceChildren();
  for (const o of shuffle([q, ...wrong])) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'btn choice';
    b.lang = 'es';
    b.textContent = o.es;
    b.addEventListener('click', () => answer(b, o));
    choices.append(b);
  }
}

function answer(button, picked) {
  const q = quiz.current;
  quiz.asked++;
  const ok = picked === q;
  if (ok) quiz.right++;
  for (const b of $('quizChoices').children) {
    b.disabled = true;
    if (b.textContent === q.es) b.classList.add('right');
  }
  if (!ok) button.classList.add('wrong');
  $('quizFeedback').textContent = ok
    ? `¡Muy bien! ${quiz.right} of ${quiz.asked} right.`
    : `Not quite. It's “${q.es}” (${q.say}). ${quiz.right} of ${quiz.asked} right.`;
  speakWord(q);
  $('quizNext').hidden = false;
  $('quizNext').focus();
}

// ---------- status messages ----------

let statusTimer;

function say(message) {
  const el = $('status');
  el.textContent = message;
  el.classList.add('visible');
  clearTimeout(statusTimer);
  statusTimer = setTimeout(() => el.classList.remove('visible'), 7000);
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// ---------- start ----------

buildChooser();
buildAltarArt();
findVoice();
if ('speechSynthesis' in window) speechSynthesis.addEventListener?.('voiceschanged', findVoice);
new ResizeObserver(updateLights).observe($('stage'));

$('homeBtn').addEventListener('click', goHome);
$('startBtn').addEventListener('click', () => {
  resetChooser();
  show('screenChoose');
});
$('photoBtn').addEventListener('click', () => openCard(PHOTO));
$('practiceBtn').addEventListener('click', startQuiz);
$('speakBtn').addEventListener('click', () => speakWord(cardItem));
$('speakSentenceBtn').addEventListener('click', () => speakSentence(cardItem));
$('removeBtn').addEventListener('click', () => {
  $('card').close();
  removeItem(cardUid);
});
$('closeCard').addEventListener('click', () => $('card').close());
$('captionSpeak').addEventListener('click', () => speakWord(captionFor.o));
$('captionMore').addEventListener('click', () => openCard(captionFor.o, captionFor.uid));
$('quizNext').addEventListener('click', nextQuestion);
$('quizClose').addEventListener('click', () => $('quiz').close());

// Arrow keys move between the offering tabs
$('tabs').addEventListener('keydown', (ev) => {
  if (ev.key !== 'ArrowRight' && ev.key !== 'ArrowLeft') return;
  const ids = [...$('tabs').children].map((b) => b.id.slice(4));
  const i = ids.indexOf(activeTab);
  selectTab(ids[(i + (ev.key === 'ArrowRight' ? 1 : ids.length - 1)) % ids.length], true);
});

goHome();
