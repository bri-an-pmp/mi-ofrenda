// Everything the learner can choose: who to remember and what to leave on the altar.
// Each offering carries its Spanish word, a pronunciation guide, an example sentence and why it
// belongs on an ofrenda. The sentence is `core` (a full sentence on its own, which is what the
// recorded audio says) plus `tail` with the remembered person's name, e.g. "a {name}".
// `max` is how many of that offering can go on one altar.

// Small drawings for offerings that have no good emoji. Static strings only (never user text).
// Shared gradients (flame, glassShade) live once in index.html.
// A glass of agua fresca in a given color, with optional bits floating in it
const fresca = (color, bits = '') => `<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M30 3l-4 14" stroke="#e8418c" stroke-width="2.5" stroke-linecap="round"/><path d="M12 10h24l-3 32H15z" fill="#d8eef7" fill-opacity=".35" stroke="#e6f4fb" stroke-width="1.5"/><path d="M13.6 17h20.8l-2.4 24H16z" fill="${color}"/>${bits}<rect x="18" y="19" width="5" height="5" rx="1" fill="#fff" opacity=".45"/><rect x="25" y="22" width="5" height="5" rx="1" fill="#fff" opacity=".35"/><path d="M15 12l2 29" stroke="#fff" stroke-width="1.2" opacity=".5"/></svg>`;

const ART = {
  vela: `<svg viewBox="0 0 48 64" aria-hidden="true"><path class="flame" d="M24 6c4 6 6 10 6 14a6 6 0 0 1-12 0c0-4 2-8 6-14z" fill="url(#fl)"/><rect x="23.2" y="20" width="1.6" height="5" fill="#2a1a10"/><rect x="11" y="24" width="26" height="38" rx="3" class="wax"/><rect x="11" y="24" width="26" height="38" rx="3" fill="url(#glassShade)" opacity=".55"/><rect x="14" y="27" width="3" height="32" rx="1.5" fill="#fff" opacity=".35"/><rect x="11" y="34" width="26" height="16" fill="#f6efe5" opacity=".85"/><path d="M24 37l2 4 4 .5-3 2.6 1 4-4-2-4 2 1-4-3-2.6 4-.5z" fill="#c2185b" opacity=".8"/></svg>`,
  papel: `<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M2 8 Q24 14 46 8" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M5 9h12v16l-3-3-3 3-3-3-3 3z" fill="#e8418c"/><path d="M18 11h12v16l-3-3-3 3-3-3-3 3z" fill="#f59b23"/><path d="M31 9h12v16l-3-3-3 3-3-3-3 3z" fill="#7b5cd6"/><circle cx="11" cy="15" r="2" fill="#2a1638"/><circle cx="24" cy="17" r="2" fill="#2a1638"/><circle cx="37" cy="15" r="2" fill="#2a1638"/></svg>`,
  copal: `<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M10 28h28l-4 10H14z" fill="#b5562b"/><path d="M10 28h28l-1 2.5H11z" fill="#8a3d1c"/><rect x="18" y="38" width="12" height="5" rx="1" fill="#8a3d1c"/><path d="M14 28c3-3 17-3 20 0" fill="#f2c45a"/><circle cx="20" cy="26.5" r="1.6" fill="#ff8a3a"/><circle cx="27" cy="26" r="1.3" fill="#ff8a3a"/></svg>`,
  agua: `<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M13 8h22l-3 34H16z" fill="#bfe3f5" fill-opacity=".45" stroke="#e6f4fb" stroke-width="1.5"/><path d="M15 18h18l-2 22H17z" fill="#7cc4e8" fill-opacity=".75"/><path d="M16 10l2 30" stroke="#fff" stroke-width="1.5" opacity=".5"/></svg>`,
  pan: `<svg viewBox="0 0 48 48" aria-hidden="true"><ellipse cx="24" cy="31" rx="19" ry="11" fill="#b8692a"/><ellipse cx="24" cy="28" rx="17" ry="9" fill="#d98e3f"/><path d="M10 28q14-6 28 0M17 21q7 10 14 0" fill="none" stroke="#a85c1e" stroke-width="3" stroke-linecap="round"/><circle cx="24" cy="21" r="3.5" fill="#b8692a"/><g fill="#fff3d6"><circle cx="15" cy="31" r=".8"/><circle cx="30" cy="33" r=".8"/><circle cx="34" cy="27" r=".8"/><circle cx="20" cy="34" r=".8"/></g></svg>`,
  calavera: `<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 5C13 5 7 12 7 21c0 6 3 10 7 12v6h20v-6c4-2 7-6 7-12 0-9-6-16-17-16z" fill="#fbf6ee"/><circle cx="17" cy="22" r="5" fill="#2a9fd6"/><circle cx="31" cy="22" r="5" fill="#e8418c"/><path d="M24 26l-2 5h4z" fill="#2a1638"/><path d="M18 35v4M22 35v4M26 35v4M30 35v4" stroke="#2a1638" stroke-width="1.5"/><path d="M16 11q8-4 16 0" fill="none" stroke="#f59b23" stroke-width="2.5" stroke-linecap="round"/><circle cx="24" cy="13" r="2" fill="#4caf50"/></svg>`,
  petate: `<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M3 34h42l-3 8H6z" fill="#d9b46a"/><path d="M3 34h42l-1 2H4z" fill="#ecd08f"/><g stroke="#a8803e" stroke-width="1"><path d="M8 34l-2 8M14 34l-2 8M20 34l-1 8M26 34v8M32 34l1 8M38 34l2 8M44 34l-2 8"/><path d="M5 38h38" stroke-dasharray="3 3"/></g></svg>`,
  virgen: `<svg viewBox="0 0 48 64" aria-hidden="true"><rect x="6" y="2" width="36" height="60" rx="2" fill="#5a3820"/><rect x="9" y="5" width="30" height="54" fill="#2a1a10"/><ellipse cx="24" cy="32" rx="13" ry="24" fill="#f2c45a"/><g stroke="#ffd98a" stroke-width="1"><path d="M24 6v6M24 52v6M11 32h4M33 32h4M15 13l3 4M33 13l-3 4M15 51l3-4M33 51l-3-4"/></g><path d="M24 14c-7 2-9 12-9 22 0 8 2 14 9 16 7-2 9-8 9-16 0-10-2-20-9-22z" fill="#1f7a6e"/><path d="M24 22c-3 1-4 8-4 16 0 6 1 9 4 10 3-1 4-4 4-10 0-8-1-15-4-16z" fill="#d9546e"/><circle cx="24" cy="19" r="3.2" fill="#c9a27a"/><g fill="#ffe08a"><circle cx="18" cy="30" r=".9"/><circle cx="17" cy="38" r=".9"/><circle cx="30" cy="30" r=".9"/><circle cx="31" cy="39" r=".9"/></g><path d="M18 52h12l-2 3h-8z" fill="#3a2a5a"/></svg>`,
  mariposa: `<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M23 22C17 8 4 8 5 18c1 7 9 8 18 6z" fill="#f08a1c" stroke="#1a0f0a" stroke-width="1.5"/><path d="M25 22C31 8 44 8 43 18c-1 7-9 8-18 6z" fill="#f08a1c" stroke="#1a0f0a" stroke-width="1.5"/><path d="M23 25c-8 0-14 5-11 11 3 4 9 1 11-8zM25 25c8 0 14 5 11 11-3 4-9 1-11-8z" fill="#e0701a" stroke="#1a0f0a" stroke-width="1.5"/><path d="M23 22L10 14M23 22L12 21M25 22l13-8M25 22l11-1" stroke="#1a0f0a" stroke-width="1"/><rect x="23" y="16" width="2" height="18" rx="1" fill="#1a0f0a"/><g fill="#fff"><circle cx="7" cy="16" r=".9"/><circle cx="9" cy="21" r=".9"/><circle cx="41" cy="16" r=".9"/><circle cx="39" cy="21" r=".9"/></g></svg>`,
  platoAgua: `<svg viewBox="0 0 48 48" aria-hidden="true"><ellipse cx="24" cy="34" rx="19" ry="7" fill="#2e5c8a"/><path d="M5 30 q19 14 38 0 v4 q-19 14 -38 0z" fill="#244a70"/><ellipse cx="24" cy="30" rx="19" ry="7" fill="#3c78b3"/><ellipse cx="24" cy="30" rx="15" ry="5" fill="#9fd4f2"/><path d="M14 29 q5 -2 10 0" stroke="#e8f7ff" stroke-width="1.5" fill="none" stroke-linecap="round"/><text x="24" y="40" font-size="5" text-anchor="middle" fill="#cfe6f7" font-family="sans-serif" font-weight="700">AGUA</text></svg>`,
  platoComida: `<svg viewBox="0 0 48 48" aria-hidden="true"><ellipse cx="24" cy="34" rx="19" ry="7" fill="#b3542a"/><path d="M5 30 q19 14 38 0 v4 q-19 14 -38 0z" fill="#8e3f1e"/><ellipse cx="24" cy="30" rx="19" ry="7" fill="#d26a30"/><ellipse cx="24" cy="29" rx="15" ry="5" fill="#7a4a24"/><g fill="#a8682e"><circle cx="17" cy="27" r="2.2"/><circle cx="22" cy="25.5" r="2.2"/><circle cx="27" cy="26" r="2.2"/><circle cx="31" cy="28" r="2.2"/><circle cx="20" cy="29" r="2.2"/><circle cx="26" cy="29.5" r="2.2"/></g><g fill="#c98a4a"><circle cx="24" cy="27" r="1.6"/><circle cx="29" cy="25.5" r="1.6"/><circle cx="18" cy="25" r="1.6"/></g></svg>`,
  raton: `<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M40 33 q8 -2 5 -10" stroke="#c98a9a" stroke-width="2" fill="none" stroke-linecap="round"/><ellipse cx="25" cy="32" rx="15" ry="9" fill="#a99fb3"/><ellipse cx="25" cy="34" rx="11" ry="5" fill="#c7bfd0"/><circle cx="12" cy="27" r="7" fill="#a99fb3"/><circle cx="10" cy="19" r="5" fill="#a99fb3"/><circle cx="10" cy="19" r="3" fill="#f2b5c4"/><circle cx="17" cy="21" r="4.5" fill="#a99fb3"/><circle cx="17" cy="21" r="2.6" fill="#f2b5c4"/><circle cx="9" cy="27" r="1.4" fill="#2a1638"/><circle cx="5.5" cy="29.5" r="1.6" fill="#e07a8a"/><path d="M20 29 l3 3 M23 29 l-3 3" stroke="#7a6a8a" stroke-width="1" /><path d="M30 28 q3 2 0 4 M34 30 q3 2 0 4" stroke="#7a6a8a" stroke-width=".9" fill="none" stroke-dasharray="1.5 1.2"/></svg>`,
  domino: `<svg viewBox="0 0 48 48" aria-hidden="true"><g transform="rotate(-12 24 24)"><rect x="6" y="14" width="22" height="34" rx="3" fill="#f6f1e6" stroke="#2a1638" stroke-width="1.2"/><line x1="8" y1="31" x2="26" y2="31" stroke="#2a1638" stroke-width="1.2"/><g fill="#2a1638"><circle cx="12" cy="20" r="1.8"/><circle cx="22" cy="26" r="1.8"/><circle cx="17" cy="23" r="1.8"/><circle cx="12" cy="36" r="1.8"/><circle cx="22" cy="36" r="1.8"/><circle cx="12" cy="43" r="1.8"/><circle cx="22" cy="43" r="1.8"/></g></g><g transform="rotate(14 34 30)"><rect x="24" y="8" width="18" height="30" rx="3" fill="#f6f1e6" stroke="#2a1638" stroke-width="1.2"/><line x1="26" y1="23" x2="40" y2="23" stroke="#2a1638" stroke-width="1.2"/><g fill="#2a1638"><circle cx="33" cy="15.5" r="1.7"/><circle cx="29" cy="28" r="1.7"/><circle cx="37" cy="28" r="1.7"/><circle cx="29" cy="33" r="1.7"/><circle cx="37" cy="33" r="1.7"/></g></g></svg>`,
  mazapan: `<svg viewBox="0 0 48 48" aria-hidden="true"><ellipse cx="24" cy="36" rx="17" ry="6" fill="#c9a06a"/><path d="M7 30 v6 q17 10 34 0 v-6z" fill="#d9b27a"/><ellipse cx="24" cy="30" rx="17" ry="6" fill="#ead2a4"/><g fill="#d6b783" opacity=".8"><circle cx="17" cy="29" r="1.2"/><circle cx="28" cy="31" r="1"/><circle cx="31" cy="28" r="1.1"/><circle cx="21" cy="32" r=".9"/></g><path d="M7 33 q17 9 34 0" stroke="#e6556f" stroke-width="2.6" fill="none"/><path d="M7 36.5 q17 9 34 0" stroke="#fff" stroke-width="1.6" fill="none" opacity=".9"/></svg>`,
  takis: `<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M10 8 h28 l-2 6 2 6 -2 6 2 6 -2 6 2 6 h-28 l2 -6 -2 -6 2 -6 -2 -6 2 -6z" fill="#5b2a86"/><path d="M12 14 h24 v20 h-24z" fill="#7a3fb0"/><g transform="rotate(-25 24 26)"><rect x="14" y="22" width="20" height="6" rx="3" fill="#d84a1b"/><rect x="14" y="22" width="20" height="2" rx="1" fill="#f07a3a"/></g><g transform="rotate(20 26 30)"><rect x="16" y="28" width="18" height="5" rx="2.5" fill="#c43c14"/></g><path d="M14 11 h20" stroke="#f2c230" stroke-width="2"/></svg>`,
  cheetos: `<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M9 8 h30 l-2 6 2 6 -2 6 2 6 -2 6 2 6 h-30 l2 -6 -2 -6 2 -6 -2 -6 2 -6z" fill="#c8102e"/><path d="M12 12 h24 v24 h-24z" fill="#e0262f"/><g fill="#ff4b2b" stroke="#a80c1c" stroke-width=".8"><path d="M15 24 q4 -6 8 -2 q4 4 9 -1 q-1 5 -6 5 q-5 0 -6 3 q-4 1 -5 -5z"/><path d="M18 31 q3 -3 7 -1 q3 2 6 -1 q0 4 -4 4 q-6 2 -9 -2z"/></g><path d="M14 10 h20" stroke="#ffd23a" stroke-width="2"/><circle cx="34" cy="15" r="3" fill="#ffd23a"/></svg>`,
  coca: `<svg viewBox="0 0 48 64" aria-hidden="true"><rect x="20" y="2" width="8" height="4" rx="1" fill="#c62828"/><path d="M20 6h8v8c0 4 4 6 4 12 0 5-3 7-3 11s4 6 4 13v8a3 3 0 0 1-3 3H18a3 3 0 0 1-3-3v-8c0-7 4-9 4-13s-3-6-3-11c0-6 4-8 4-12z" fill="#3b1a0c" stroke="#c8d8d0" stroke-opacity=".5"/><rect x="15.5" y="34" width="17" height="9" fill="#c62828"/><path d="M17 38.5c4-2 10 2 14 0" stroke="#fff" stroke-width="1.2" fill="none"/><path d="M21 10v40" stroke="#fff" stroke-opacity=".25" stroke-width="1.5"/></svg>`,
  jamaica: fresca('#9b1b30'),
  horchata: fresca('#efe3cf', '<g fill="#a0612b"><circle cx="20" cy="30" r=".9"/><circle cx="27" cy="34" r=".9"/><circle cx="24" cy="28" r=".7"/><circle cx="29" cy="29" r=".8"/></g>'),
  tamarindo: fresca('#8a5a2b'),
};

// Candle colors, in the order candles are drawn (left to right, back to front)
export const WAX = ['#c2185b', '#e65100', '#6a1b9a', '#f9a825', '#ad1457', '#2e7d32', '#1565c0'];

export const CATEGORIES = [
  { id: 'esenciales', es: 'Lo esencial', en: 'Essentials' },
  { id: 'tradicion', es: 'Tradición', en: 'Tradition' },
  { id: 'comida', es: 'Comida', en: 'Food' },
  { id: 'bebidas', es: 'Bebidas', en: 'Drinks' },
  { id: 'gustos', es: 'Sus gustos', en: 'Favorites' },
  { id: 'mascotas', es: 'Mascotas', en: 'For pets' },
];

// tier: where a tapped offering goes (1 = top step, 3 = bottom step, 4 = floor, 0 = hangs above)
const o = (id, cat, tier, max, look, es, say, en, core, tail, sentenceEn, why) => ({
  id, cat, tier, max, ...(ART[look] ? { art: look } : { emoji: look }), es, say, en, core, tail, sentenceEn, why,
});

export const OFFERINGS = [
  // the essentials
  o('vela', 'esenciales', 2, 9, 'vela', 'la vela', 'VEH-lah', 'candle',
    'Le enciendo una vela', 'a {name}', 'I light a candle for {name}.',
    'Candlelight shows the spirits the way home. White candles light the path; purple ones stand for mourning. In some communities, families light one candle for each soul they expect.'),
  o('cempasuchil', 'esenciales', 4, 4, '🌼', 'el cempasúchil', 'sem-pah-SOO-cheel', 'marigold',
    'Le traigo cempasúchil', 'a {name}', 'I bring marigolds for {name}.',
    'Every altar has marigolds. Their bright orange color and strong scent guide the spirits home. Families build an arch of them, the doorway between the living and the dead, and lay petals in a path.'),
  o('terciopelo', 'esenciales', 3, 2, '🌺', 'la flor de terciopelo', 'FLOR deh tehr-see-oh-PEH-loh', 'cockscomb flower',
    'Le traigo flores de terciopelo', 'a {name}', 'I bring velvet flowers for {name}.',
    'A deep red, velvety flower. After the marigold it is the most popular flower on altars, and it is said to bring comfort after a loss.'),
  o('papel', 'esenciales', 0, 1, 'papel', 'el papel picado', 'pah-PEL pee-KAH-doh', 'cut-paper banner',
    'Cuelgo papel picado', 'para {name}', 'I hang papel picado for {name}.',
    'Tissue paper with cut-out designs, a sign that life is delicate. The souls travel through its holes, and when the wind moves it, the ancestors have arrived.'),
  o('agua', 'esenciales', 1, 1, 'agua', 'el vaso de agua', 'VAH-soh deh AH-gwah', 'glass of water',
    'Le dejo un vaso de agua', 'a {name}', 'I leave a glass of water for {name}.',
    'Water is the first thing the spirits look for after their long journey. Some say the water level drops after the visit.'),
  o('sal', 'esenciales', 1, 1, '🧂', 'la sal', 'SAHL', 'salt',
    'Le pongo sal', 'a {name}', 'I put out salt for {name}.',
    'Salt purifies. It keeps the spirit safe on its journey so it can come back again next year.'),
  o('copal', 'esenciales', 4, 1, 'copal', 'el copal', 'koh-PAHL', 'copal incense',
    'Quemo copal', 'para {name}', 'I burn copal for {name}.',
    'A tree resin burned as incense since before the Spanish arrived. Its smoke cleanses the space and its aroma draws loved ones to the family.'),
  o('petate', 'esenciales', 4, 1, 'petate', 'el petate', 'peh-TAH-teh', 'woven palm mat',
    'Le pongo un petate', 'a {name}', 'I lay out a mat for {name}.',
    'A mat of woven palm at the foot of the altar, where the arriving souls can rest after their journey.'),

  // tradition
  o('cruz', 'tradicion', 3, 1, '✝️', 'la cruz', 'KROOS', 'cross',
    'Hago una cruz de flores', 'para {name}', 'I make a cross of flowers for {name}.',
    'Many altars have a cross of flowers, seeds, candles or sand on the lowest step, a sign of Mexico\'s Catholic faith.'),
  o('virgen', 'tradicion', 1, 1, 'virgen', 'la Virgen de Guadalupe', 'VEER-hen deh gwah-dah-LOO-peh', 'Virgin of Guadalupe',
    'Pongo a la Virgen de Guadalupe', 'para {name}', 'I put out the Virgin of Guadalupe for {name}.',
    'Many families place an image of the Virgin of Guadalupe or a patron saint on the top step to watch over the altar.'),
  o('rosario', 'tradicion', 2, 1, '📿', 'el rosario', 'roh-SAH-ree-oh', 'rosary',
    'Le dejo su rosario', 'a {name}', 'I leave {name} their rosary.',
    'Prayer beads for someone who prayed: a keepsake that is both personal and religious.'),
  o('mariposa', 'tradicion', 2, 3, 'mariposa', 'la mariposa monarca', 'mah-ree-POH-sah moh-NAR-kah', 'monarch butterfly',
    'Pongo una mariposa monarca', 'para {name}', 'I put out a monarch butterfly for {name}.',
    'Monarch butterflies reach Mexico each year around the Day of the Dead. The Purépecha people of Michoacán believe they are the souls of the dead returning.'),
  o('xolo', 'tradicion', 1, 1, '🐕', 'el xoloitzcuintle', 'show-loh-eets-KWEEN-tleh', 'Mexican hairless dog',
    'Pongo un xoloitzcuintle', 'para {name}', 'I put out a xolo dog for {name}.',
    'In Aztec belief, the xolo dog guards people in life and guides souls across the river to the land of the dead, Mictlán.'),

  // food
  o('pan', 'comida', 2, 3, 'pan', 'el pan dulce', 'PAHN DOOL-seh', 'sweet bread',
    'Le dejo pan dulce', 'a {name}', 'I leave sweet bread for {name}.',
    'Sweet breads like conchas from the neighborhood bakery are a favorite offering, shared with the family after the visit.'),
  o('calavera', 'tradicion', 1, 3, 'calavera', 'la calavera de azúcar', 'kah-lah-VEH-rah deh ah-SOO-kar', 'sugar skull',
    'Le hago una calavera de azúcar', 'a {name}', 'I make a sugar skull for {name}.',
    'Sugar skulls carry the name of the person on the forehead. Small skulls are for children, large ones for adults. Death is met with sweetness, not fear.'),
  o('mole', 'comida', 2, 1, '🍲', 'el mole', 'MOH-leh', 'mole',
    'Le sirvo mole', 'a {name}', 'I serve mole to {name}.',
    'In Oaxaca, Puebla and Michoacán, mole negro with chicken and sesame is the dish for this celebration.'),
  o('tamales', 'comida', 2, 1, '🫔', 'los tamales', 'tah-MAH-lehs', 'tamales',
    'Le preparo tamales', 'a {name}', 'I make tamales for {name}.',
    'Families cook the dishes their loved ones enjoyed most. The spirits enjoy the aroma; some say the food loses its flavor afterward because the spirits already tasted it.'),
  o('tacos', 'comida', 2, 1, '🌮', 'los tacos', 'TAH-kohs', 'tacos',
    'Le preparo tacos', 'a {name}', 'I make tacos for {name}.',
    'Any favorite food belongs on the altar, from a holiday dish to everyday tacos.'),
  o('pizza', 'comida', 2, 1, '🍕', 'la pizza', 'PEET-sah', 'pizza',
    'Le traigo pizza', 'a {name}', 'I bring pizza for {name}.',
    'An ofrenda is personal. If pizza was their favorite, pizza goes on the altar.'),
  o('hamburguesa', 'comida', 2, 1, '🍔', 'la hamburguesa', 'ahm-boor-GEH-sah', 'hamburger',
    'Le traigo una hamburguesa', 'a {name}', 'I bring a hamburger for {name}.',
    'What matters is what they loved to eat, traditional or not.'),
  o('fruta', 'comida', 3, 3, '🍊', 'la fruta', 'FROO-tah', 'fruit',
    'Le dejo fruta', 'a {name}', 'I leave fruit for {name}.',
    'Seasonal fruit such as oranges, tangerines, guavas and sugarcane is a gift from the harvest.'),
  o('dulces', 'comida', 3, 3, '🍬', 'los dulces', 'DOOL-sehs', 'candy',
    'Le traigo dulces', 'a {name}', 'I bring candy for {name}.',
    'Candy is a favorite offering, especially for children who have passed.'),
  o('takis', 'comida', 3, 1, 'takis', 'los Takis', 'TAH-kees', 'Takis',
    'Le dejo sus Takis', 'a {name}', 'I leave {name} their Takis.',
    'Rolled, spicy, lime-flavored tortilla chips, a favorite snack for kids and grown-ups.'),
  o('cheetos', 'comida', 3, 1, 'cheetos', 'los Hot Cheetos', 'jot CHEE-tohs', 'Hot Cheetos',
    'Le dejo sus Hot Cheetos', 'a {name}', 'I leave {name} their Hot Cheetos.',
    'Spicy red cheese puffs, often eaten with lime, a classic after-school snack.'),
  o('menudo', 'comida', 2, 1, '🥘', 'el menudo', 'meh-NOO-doh', 'menudo',
    'Le sirvo un plato de menudo', 'a {name}', 'I serve a bowl of menudo to {name}.',
    'A spicy red soup of beef tripe and hominy, served on weekends and holidays and shared by the whole family.'),
  o('mazapan', 'comida', 3, 2, 'mazapan', 'el mazapán', 'mah-sah-PAHN', 'peanut marzipan',
    'Le dejo un mazapán', 'a {name}', 'I leave a peanut marzipan for {name}.',
    'A crumbly peanut candy that almost every Mexican kid grew up with.'),

  // drinks
  o('cafe', 'bebidas', 1, 1, '☕', 'el café', 'kah-FEH', 'coffee',
    'Le sirvo un café', 'a {name}', 'I pour a coffee for {name}.',
    'A cup of the coffee they drank every morning makes them feel at home.'),
  o('chocolate', 'bebidas', 2, 1, '🍫', 'el chocolate', 'choh-koh-LAH-teh', 'chocolate',
    'Le preparo chocolate caliente', 'a {name}', 'I make hot chocolate for {name}.',
    'Hot chocolate is served with pan dulce. Chocolate comes from Mexico.'),
  o('refrescos', 'bebidas', 2, 1, '🥤', 'los refrescos', 'reh-FRES-kohs', 'sodas',
    'Le sirvo refrescos', 'a {name}', 'I pour sodas for {name}.',
    'The altar holds whatever they liked to drink, like their favorite sodas.'),
  o('coca', 'bebidas', 2, 2, 'coca', 'una coca', 'OO-nah KOH-kah', 'a Coke',
    'Le dejo una coca', 'a {name}', 'I leave a Coke for {name}.',
    'In Mexico people ask for "una coca". Coca-Cola is one of the most common drinks on Mexican altars.'),
  o('jamaica', 'bebidas', 2, 1, 'jamaica', 'el agua de jamaica', 'AH-gwah deh hah-MY-kah', 'hibiscus water',
    'Le preparo agua de jamaica', 'a {name}', 'I make hibiscus water for {name}.',
    'Aguas frescas are cold drinks made with fruit, flowers or seeds. Agua de jamaica is made from dried hibiscus flowers and is deep red.'),
  o('horchata', 'bebidas', 2, 1, 'horchata', 'el agua de horchata', 'AH-gwah deh or-CHAH-tah', 'rice and cinnamon water',
    'Le preparo agua de horchata', 'a {name}', 'I make horchata for {name}.',
    'Horchata is a sweet, creamy agua fresca made with rice and cinnamon.'),
  o('tamarindo', 'bebidas', 2, 1, 'tamarindo', 'el agua de tamarindo', 'AH-gwah deh tah-mah-REEN-doh', 'tamarind water',
    'Le preparo agua de tamarindo', 'a {name}', 'I make tamarind water for {name}.',
    'Made from the sweet and sour tamarind pod. Families make the agua fresca their loved one liked best.'),
  o('cerveza', 'bebidas', 2, 2, '🍺', 'la cerveza', 'sehr-VEH-sah', 'beer',
    'Le dejo una cerveza', 'a {name}', 'I leave a beer for {name}.',
    'Beer is one of the most common drinks on altars. If they enjoyed one, their favorite is left for them.'),
  o('tequila', 'bebidas', 1, 1, '🥃', 'el tequila', 'teh-KEE-lah', 'tequila',
    'Brindo con tequila', 'por {name}', 'I toast {name} with tequila.',
    'Tequila or mezcal is poured for adults who liked it, as a toast to their memory.'),
  o('vino', 'bebidas', 1, 1, '🍷', 'el vino', 'VEE-noh', 'wine',
    'Le sirvo una copa de vino', 'a {name}', 'I pour a glass of wine for {name}.',
    'Their favorite drink, whatever it was, welcomes them back.'),

  // what they enjoyed
  o('cigarros', 'gustos', 3, 1, '🚬', 'los cigarros', 'see-GAH-rrohs', 'cigarettes',
    'Le dejo sus cigarros', 'a {name}', 'I leave {name} their cigarettes.',
    'The ofrenda welcomes people as they were. If they smoked, their brand is left for them.'),
  o('guitarra', 'gustos', 4, 1, '🎸', 'la guitarra', 'gee-TAH-rrah', 'guitar',
    'Le traigo su guitarra', 'a {name}', 'I bring {name} their guitar.',
    'Objects from their hobbies and favorite songs help remember who they were.'),
  o('radio', 'gustos', 3, 1, '📻', 'la radio', 'RAH-dee-oh', 'radio',
    'Le pongo su música', 'a {name}', 'I play {name}\'s music.',
    'Many families play the songs their loved one enjoyed while the altar is up.'),
  o('libro', 'gustos', 1, 1, '📖', 'el libro', 'LEE-broh', 'book',
    'Le dejo su libro favorito', 'a {name}', 'I leave {name} their favorite book.',
    'Personal keepsakes, like a book, a necklace or a jacket, help recreate who they were.'),
  o('cartas', 'gustos', 3, 1, '🃏', 'las cartas', 'KAR-tahs', 'playing cards',
    'Le dejo sus cartas', 'a {name}', 'I leave {name} their cards.',
    'Games they loved, like cards or lotería, bring back evenings spent together.'),
  o('domino', 'gustos', 3, 1, 'domino', 'el dominó', 'doh-mee-NOH', 'dominoes',
    'Le dejo su dominó', 'a {name}', 'I leave {name} their dominoes.',
    'Dominoes on the patio table: hours of laughter, slammed tiles and friendly arguments.'),
  o('balon', 'gustos', 4, 1, '⚽', 'el balón', 'bah-LOHN', 'soccer ball',
    'Le traigo su balón', 'a {name}', 'I bring {name} their ball.',
    'Fans leave a ball or the jersey of their favorite team.'),
  o('sombrero', 'gustos', 3, 1, '👒', 'el sombrero', 'sohm-BREH-roh', 'hat',
    'Le dejo su sombrero', 'a {name}', 'I leave {name} their hat.',
    'Clothes they always wore, like a hat, make the altar feel like them.'),
  o('chamarra', 'gustos', 4, 1, '🧥', 'la chamarra', 'chah-MAH-rrah', 'jacket',
    'Le dejo su chamarra', 'a {name}', 'I leave {name} their jacket.',
    'In Mexico a jacket is a chamarra. Personal things help recreate their essence.'),
  o('lentes', 'gustos', 2, 1, '👓', 'los lentes', 'LEN-tehs', 'glasses',
    'Le dejo sus lentes', 'a {name}', 'I leave {name} their glasses.',
    'Everyday things they always had with them bring back their presence.'),
  o('reloj', 'gustos', 2, 1, '⌚', 'el reloj', 'reh-LOH', 'watch',
    'Le dejo su reloj', 'a {name}', 'I leave {name} their watch.',
    'A watch or a piece of jewelry they wore every day is a common keepsake.'),
  o('celular', 'gustos', 2, 1, '📱', 'el celular', 'seh-loo-LAR', 'cell phone',
    'Le dejo su celular', 'a {name}', 'I leave {name} their phone.',
    'Modern altars include modern favorites too. What matters is what they loved.'),
  o('videojuego', 'gustos', 3, 1, '🎮', 'el videojuego', 'bee-deh-oh-HWEH-goh', 'video game',
    'Le traigo su videojuego', 'a {name}', 'I bring {name} their video game.',
    'If they loved to play, their game belongs on the altar.'),
  o('juguete', 'gustos', 3, 2, '🧸', 'el juguete', 'hoo-GEH-teh', 'toy',
    'Le dejo un juguete', 'a {name}', 'I leave a toy for {name}.',
    'Toys are left for children who have passed, so they can play when they arrive.'),

  // for pets
  o('hueso', 'mascotas', 4, 1, '🦴', 'el hueso', 'WEH-soh', 'bone',
    'Le dejo un hueso', 'a {name}', 'I leave a bone for {name}.',
    'Pets are remembered too. Many families now include their animal companions.'),
  o('pelota', 'mascotas', 4, 1, '🎾', 'la pelota', 'peh-LOH-tah', 'ball',
    'Le traigo su pelota', 'a {name}', 'I bring {name} their ball.',
    'A favorite toy tells the pet they are home.'),
  o('croquetas', 'mascotas', 3, 1, '🥣', 'las croquetas', 'kroh-KEH-tahs', 'pet food',
    'Le sirvo croquetas', 'a {name}', 'I serve pet food to {name}.',
    'Their bowl of food, just like the dishes left for people.'),
  o('plato-agua', 'mascotas', 4, 1, 'platoAgua', 'el plato de agua', 'PLAH-toh deh AH-gwah', 'water bowl',
    'Le pongo su plato de agua', 'a {name}', 'I set out a water bowl for {name}.',
    'A bowl of fresh water for the long trip home, like the glass of water left for people.'),
  o('plato-comida', 'mascotas', 4, 1, 'platoComida', 'el plato de comida', 'PLAH-toh deh koh-MEE-dah', 'food bowl',
    'Le sirvo su plato de comida', 'a {name}', 'I serve a bowl of food to {name}.',
    'Their own bowl, filled with the food they loved most.'),
  o('raton', 'mascotas', 4, 1, 'raton', 'el ratón de peluche', 'rrah-TOHN deh peh-LOO-cheh', 'stuffed toy mouse',
    'Le dejo su ratón de peluche', 'a {name}', 'I leave a stuffed toy mouse for {name}.',
    'A soft toy they loved to chase, carry around and sleep next to.'),
  o('cuerda', 'mascotas', 4, 1, '🪢', 'la cuerda', 'KWEHR-dah', 'rope toy',
    'Le traigo su cuerda', 'a {name}', 'I bring {name} their rope toy.',
    'The rope for tug-of-war, a game you played together.'),
  o('favorito', 'mascotas', 3, 2, '⭐', 'su cosa favorita', 'soo KOH-sah fah-boh-REE-tah', 'their favorite thing',
    'Le dejo su cosa favorita', 'a {name}', 'I leave their favorite thing for {name}.',
    'Add a photo of the thing they loved most: their bed, a blanket, a sunny window, a favorite treat.'),
];

export const PHOTO = { id: 'foto', emoji: '🖼️', es: 'la foto', say: 'FOH-toh', en: 'photo',
  core: 'Pongo la foto', tail: 'de {name}', sentenceEn: 'I put out {name}\'s photo.',
  why: 'The photo shows who the altar is for. It helps the spirit recognize its home, shows that a place is saved for them, and keeps their memory alive for the next generations.' };

// Why each offering belongs on the altar, in simple Mexican Spanish (shown first; English is the reference)
const WHY_ES = {
  vela: 'La luz de las velas les muestra a las almas el camino a casa. Las velas blancas iluminan el camino y las moradas representan el luto. En algunas comunidades se pone una vela por cada alma que esperan.',
  cempasuchil: 'Todas las ofrendas llevan cempasúchil. Su color naranja y su olor fuerte guían a las almas a casa. Con estas flores se hace un arco, la puerta entre los vivos y los muertos, y un camino de pétalos.',
  terciopelo: 'Una flor roja y suave como el terciopelo. Después del cempasúchil, es la flor más popular en las ofrendas. Se dice que trae consuelo después de una pérdida.',
  papel: 'Papel de china con figuras recortadas. Nos recuerda que la vida es frágil. Las almas pasan por sus agujeros, y cuando el viento lo mueve, es que los ancestros ya llegaron.',
  agua: 'El agua es lo primero que buscan las almas después de su largo viaje. Algunos dicen que el nivel del agua baja después de la visita.',
  sal: 'La sal purifica. Protege al alma en su viaje para que pueda regresar el próximo año.',
  copal: 'Una resina de árbol que se quema como incienso desde antes de la llegada de los españoles. Su humo limpia el lugar y su aroma atrae a los seres queridos.',
  petate: 'Un tapete de palma tejida al pie de la ofrenda, donde las almas descansan después de su viaje.',
  cruz: 'Muchas ofrendas tienen una cruz de flores, semillas, velas o arena en el nivel más bajo, una señal de la fe católica de México.',
  virgen: 'Muchas familias ponen una imagen de la Virgen de Guadalupe o de un santo en el nivel más alto para cuidar la ofrenda.',
  rosario: 'Las cuentas para rezar de alguien que rezaba: un recuerdo personal y religioso.',
  mariposa: 'Las mariposas monarca llegan a México cada año cerca del Día de Muertos. Los purépechas de Michoacán creen que son las almas de los muertos que regresan.',
  xolo: 'Según la creencia azteca, el xoloitzcuintle cuida a las personas en vida y guía a las almas a cruzar el río hacia el Mictlán, la tierra de los muertos.',
  pan: 'El pan dulce de la panadería, como las conchas, es una ofrenda favorita que la familia comparte después de la visita.',
  calavera: 'Las calaveras de azúcar llevan el nombre de la persona en la frente. Las chicas son para los niños y las grandes para los adultos. La muerte se recibe con dulzura, no con miedo.',
  mole: 'En Oaxaca, Puebla y Michoacán, el mole negro con pollo y ajonjolí es el platillo de esta celebración.',
  tamales: 'Las familias cocinan los platillos favoritos de sus seres queridos. Las almas disfrutan el aroma; algunos dicen que después la comida ya no tiene sabor porque las almas ya la probaron.',
  tacos: 'Cualquier comida favorita va en la ofrenda, desde un platillo de fiesta hasta unos tacos de todos los días.',
  pizza: 'La ofrenda es personal. Si su comida favorita era la pizza, la pizza va en el altar.',
  hamburguesa: 'Lo importante es lo que le gustaba comer, sea tradicional o no.',
  fruta: 'La fruta de temporada, como naranjas, mandarinas, guayabas y caña, es un regalo de la cosecha.',
  dulces: 'Los dulces son una ofrenda favorita, sobre todo para los niños que ya murieron.',
  cafe: 'Una taza del café que tomaba cada mañana hace que se sienta en casa.',
  chocolate: 'El chocolate caliente se sirve con pan dulce. El chocolate viene de México.',
  refrescos: 'En la ofrenda se pone lo que le gustaba tomar, como sus refrescos favoritos.',
  coca: 'En México se pide «una coca». La Coca-Cola es una de las bebidas más comunes en las ofrendas mexicanas.',
  jamaica: 'Las aguas frescas son bebidas frías hechas con fruta, flores o semillas. El agua de jamaica se hace con flor de jamaica seca y es de color rojo intenso.',
  horchata: 'La horchata es un agua fresca dulce y cremosa hecha con arroz y canela.',
  tamarindo: 'Se hace con la vaina del tamarindo, dulce y ácida. Las familias preparan el agua fresca que más le gustaba a su ser querido.',
  cerveza: 'La cerveza es una de las bebidas más comunes en las ofrendas. Si le gustaba, se le deja su favorita.',
  tequila: 'Se sirve tequila o mezcal a los adultos a quienes les gustaba, como un brindis en su memoria.',
  vino: 'Su bebida favorita, la que fuera, le da la bienvenida.',
  cigarros: 'La ofrenda recibe a las personas como eran. Si fumaba, se le dejan sus cigarros.',
  guitarra: 'Las cosas de sus pasatiempos y sus canciones favoritas ayudan a recordar cómo era.',
  radio: 'Muchas familias ponen las canciones que le gustaban mientras la ofrenda está puesta.',
  libro: 'Los objetos personales, como un libro, un collar o una chamarra, ayudan a recordar cómo era.',
  cartas: 'Los juegos que le gustaban, como las cartas o la lotería, traen recuerdos de las noches juntos.',
  balon: 'Los aficionados dejan un balón o la camiseta de su equipo favorito.',
  sombrero: 'La ropa que siempre usaba, como un sombrero, hace que la ofrenda se sienta como esa persona.',
  chamarra: 'Las cosas personales, como su chamarra, ayudan a recordar quién era.',
  lentes: 'Las cosas de todos los días que siempre traía consigo nos recuerdan su presencia.',
  reloj: 'Un reloj o una joya que usaba todos los días es un recuerdo común.',
  celular: 'Las ofrendas modernas también incluyen cosas modernas. Lo importante es lo que le gustaba.',
  videojuego: 'Si le encantaba jugar, su videojuego va en la ofrenda.',
  juguete: 'Se dejan juguetes para los niños que ya murieron, para que puedan jugar cuando lleguen.',
  hueso: 'También se recuerda a las mascotas. Muchas familias ahora incluyen a sus compañeros animales.',
  pelota: 'Su juguete favorito le dice a la mascota que está en casa.',
  croquetas: 'Su plato de comida, igual que los platillos que se dejan para las personas.',
  takis: 'Totopos enrollados, picantes y con limón; una botana favorita de niños y adultos.',
  cheetos: 'Botanas rojas de queso y chile, muchas veces con limón; un clásico para después de la escuela.',
  menudo: 'Un caldo rojo y picante de pancita de res con maíz pozolero que se sirve los fines de semana y días de fiesta, y se comparte en familia.',
  mazapan: 'Un dulce de cacahuate que se desmorona; casi todos los niños en México crecieron con él.',
  domino: 'El dominó en la mesa del patio: horas de risas, fichas golpeando la mesa y discusiones amistosas.',
  'plato-agua': 'Un plato de agua fresca para el largo camino a casa, como el vaso de agua que se deja para las personas.',
  'plato-comida': 'Su propio plato, lleno de la comida que más le gustaba.',
  raton: 'Un juguete suave que le encantaba perseguir, llevar a todas partes y tener cerca para dormir.',
  cuerda: 'La cuerda para jalar, un juego que hacían juntos.',
  favorito: 'Sube una foto de lo que más quería: su cama, una cobija, una ventana con sol o su premio favorito.',
  foto: 'La foto muestra para quién es la ofrenda. Ayuda al alma a reconocer su casa, muestra que tiene un lugar reservado y mantiene viva su memoria para las nuevas generaciones.',
};
for (const item of [...OFFERINGS, PHOTO]) item.whyEs = WHY_ES[item.id];

export const OFFERING_BY_ID = Object.fromEntries([...OFFERINGS, PHOTO].map((o) => [o.id, o]));

// Who to remember: family members (the learner adds a name) and pets
export const RELATIONS = [
  { id: 'abuela', es: 'mi abuela', en: 'my grandmother', icon: '👵', kind: 'person' },
  { id: 'abuelo', es: 'mi abuelo', en: 'my grandfather', icon: '👴', kind: 'person' },
  { id: 'mama', es: 'mi mamá', en: 'my mom', icon: '👩', kind: 'person' },
  { id: 'papa', es: 'mi papá', en: 'my dad', icon: '👨', kind: 'person' },
  { id: 'tia', es: 'mi tía', en: 'my aunt', icon: '👩‍🦱', kind: 'person' },
  { id: 'tio', es: 'mi tío', en: 'my uncle', icon: '👨‍🦱', kind: 'person' },
  { id: 'hermana', es: 'mi hermana', en: 'my sister', icon: '👧', kind: 'person' },
  { id: 'hermano', es: 'mi hermano', en: 'my brother', icon: '👦', kind: 'person' },
  { id: 'amiga', es: 'mi amiga', en: 'my friend (woman)', icon: '🙋‍♀️', kind: 'person' },
  { id: 'amigo', es: 'mi amigo', en: 'my friend (man)', icon: '🙋‍♂️', kind: 'person' },
  { id: 'perro', es: 'mi perro', en: 'my dog', icon: '🐶', kind: 'pet' },
  { id: 'gato', es: 'mi gato', en: 'my cat', icon: '🐱', kind: 'pet' },
  // The chooser shows this one as a direct action (pick); es/en stay for the default name and saved altars
  { id: 'otro', es: 'alguien especial', en: 'someone special', icon: '💛', kind: 'person', pick: { es: 'sube una foto', en: 'upload a photo', icon: '📷' } },
];

// Well-known people often honored on public altars in Mexico. People still living are left out of
// the iPhone app (App Store rules on using a living person's name and photo); the website keeps them.
const IN_APP = import.meta.env?.MODE === 'app';
export const FAMOUS = [
  { id: 'frida', name: 'Frida Kahlo', es: 'la pintora', en: 'the painter', icon: '🎨', photo: 'people/frida.jpg' },
  { id: 'diego', name: 'Diego Rivera', es: 'el muralista', en: 'the muralist', icon: '🖌️', photo: 'people/diego.jpg' },
  { id: 'rulfo', name: 'Juan Rulfo', es: 'el escritor', en: 'the writer', icon: '📖', photo: 'people/rulfo.jpg' },
  { id: 'fuentes', name: 'Carlos Fuentes', es: 'el novelista', en: 'the novelist', icon: '✒️', photo: 'people/fuentes.jpg' },
  { id: 'maria', name: 'María Félix', es: 'la actriz', en: 'the actress', icon: '🎬', photo: 'people/maria.jpg' },
  { id: 'pedro', name: 'Pedro Infante', es: 'el cantante y actor', en: 'the singer and actor', icon: '🎤', photo: 'people/pedro.jpg' },
  { id: 'cantinflas', name: 'Cantinflas', es: 'el comediante', en: 'the comedian', icon: '🎩', photo: 'people/cantinflas.jpg' },
  { id: 'vicente', name: 'Vicente Fernández', es: 'el rey de la ranchera', en: 'the king of ranchera music', icon: '🤠', photo: 'people/vicente.jpg' },
  { id: 'juanga', name: 'Juan Gabriel', es: 'el cantautor', en: 'the singer-songwriter', icon: '🎶', photo: 'people/juanga.jpg' },
  { id: 'selena', name: 'Selena', es: 'la reina de la música tejana', en: 'the queen of Tejano music', icon: '🌹', photo: 'people/selena.jpg' },
  { id: 'celia', name: 'Celia Cruz', es: 'la reina de la salsa', en: 'the queen of salsa', icon: '💃', photo: 'people/celia.jpg' },
  { id: 'dolly', name: 'Dolly Parton', es: 'la reina del country', en: 'the queen of country music', icon: '🎸', photo: 'people/dolly.jpg', living: true },
].filter((f) => !(IN_APP && f.living));
// No longer offered, but altars saved earlier still open with the right icon.
const FAMOUS_RETIRED = [
  { id: 'sorjuana', name: 'Sor Juana Inés de la Cruz', es: 'la poeta', en: 'the poet', icon: '🪶' },
];

export const RELATION_BY_ID = Object.fromEntries(RELATIONS.map((r) => [r.id, r]));
export const FAMOUS_BY_ID = Object.fromEntries([...FAMOUS, ...FAMOUS_RETIRED].map((f) => [f.id, f]));

export function iconHTML(o) {
  return o.art ? ART[o.art] : '';
}

// What the recorded audio says for each offering (used by the voice script and the player)
export function spokenWord(o) {
  return `${o.es.charAt(0).toUpperCase()}${o.es.slice(1)}.`;
}

// Words that start a sentence ending: 'a {name}', 'para {name}', 'por {name}', 'de {name}'
export const TAIL_WORDS = ['a', 'para', 'por', 'de'];

export function spokenSentence(o) {
  return `${o.core}.`;
}
