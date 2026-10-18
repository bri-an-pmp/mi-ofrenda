// Everything the learner can choose: who to remember and what to leave on the altar.
// Each offering carries its Spanish word, a pronunciation guide, an example sentence and why it
// belongs on an ofrenda. The sentence is `core` (a full sentence on its own, which is what the
// recorded audio says) plus `tail` with the remembered person's name, e.g. "a {name}".
// `max` is how many of that offering can go on one altar.

// Small drawings for offerings that have no good emoji. Static strings only (never user text).
// Shared gradients (flame, glassShade) live once in index.html.
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
};

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
  id, cat, tier, max, ...(look.length > 3 ? { art: look } : { emoji: look }), es, say, en, core, tail, sentenceEn, why,
});

export const OFFERINGS = [
  // the essentials
  o('vela', 'esenciales', 2, 9, 'vela', 'la vela', 'VEH-lah', 'the candle',
    'Le enciendo una vela', 'a {name}', 'I light a candle for {name}.',
    'Candlelight shows the spirits the way home. White candles light the path; purple ones stand for mourning. In some communities, families light one candle for each soul they expect.'),
  o('cempasuchil', 'esenciales', 4, 4, '🌼', 'el cempasúchil', 'sem-pah-SOO-cheel', 'the marigold',
    'Le traigo cempasúchil', 'a {name}', 'I bring marigolds for {name}.',
    'Every altar has marigolds. Their bright orange color and strong scent guide the spirits home. Families build an arch of them, the doorway between the living and the dead, and lay petals in a path.'),
  o('terciopelo', 'esenciales', 3, 2, '🌺', 'la flor de terciopelo', 'FLOR deh tehr-see-oh-PEH-loh', 'the cockscomb flower',
    'Le traigo flores de terciopelo', 'a {name}', 'I bring velvet flowers for {name}.',
    'A deep red, velvety flower. After the marigold it is the most popular flower on altars, and it is said to bring comfort after a loss.'),
  o('papel', 'esenciales', 0, 1, 'papel', 'el papel picado', 'pah-PEL pee-KAH-doh', 'the cut-paper banner',
    'Cuelgo papel picado', 'para {name}', 'I hang papel picado for {name}.',
    'Tissue paper with cut-out designs, a sign that life is delicate. The souls travel through its holes, and when the wind moves it, the ancestors have arrived.'),
  o('agua', 'esenciales', 1, 1, 'agua', 'el vaso de agua', 'VAH-soh deh AH-gwah', 'the glass of water',
    'Le dejo un vaso de agua', 'a {name}', 'I leave a glass of water for {name}.',
    'Water is the first thing the spirits look for after their long journey. Some say the water level drops after the visit.'),
  o('sal', 'esenciales', 1, 1, '🧂', 'la sal', 'SAHL', 'the salt',
    'Le pongo sal', 'a {name}', 'I put out salt for {name}.',
    'Salt purifies. It keeps the spirit safe on its journey so it can come back again next year.'),
  o('copal', 'esenciales', 4, 1, 'copal', 'el copal', 'koh-PAHL', 'the copal incense',
    'Quemo copal', 'para {name}', 'I burn copal for {name}.',
    'A tree resin burned as incense since before the Spanish arrived. Its smoke cleanses the space and its aroma draws loved ones to the family.'),
  o('petate', 'esenciales', 4, 1, 'petate', 'el petate', 'peh-TAH-teh', 'the woven palm mat',
    'Le pongo un petate', 'a {name}', 'I lay out a mat for {name}.',
    'A mat of woven palm at the foot of the altar, where the arriving souls can rest after their journey.'),

  // tradition
  o('cruz', 'tradicion', 3, 1, '✝️', 'la cruz', 'KROOS', 'the cross',
    'Hago una cruz de flores', 'para {name}', 'I make a cross of flowers for {name}.',
    'Many altars have a cross of flowers, seeds, candles or sand on the lowest step, a sign of Mexico\'s Catholic faith.'),
  o('virgen', 'tradicion', 1, 1, 'virgen', 'la Virgen de Guadalupe', 'VEER-hen deh gwah-dah-LOO-peh', 'the Virgin of Guadalupe',
    'Pongo a la Virgen de Guadalupe', 'para {name}', 'I put out the Virgin of Guadalupe for {name}.',
    'Many families place an image of the Virgin of Guadalupe or a patron saint on the top step to watch over the altar.'),
  o('rosario', 'tradicion', 2, 1, '📿', 'el rosario', 'roh-SAH-ree-oh', 'the rosary',
    'Le dejo su rosario', 'a {name}', 'I leave {name} their rosary.',
    'Prayer beads for someone who prayed: a keepsake that is both personal and religious.'),
  o('mariposa', 'tradicion', 2, 3, 'mariposa', 'la mariposa monarca', 'mah-ree-POH-sah moh-NAR-kah', 'the monarch butterfly',
    'Pongo una mariposa monarca', 'para {name}', 'I put out a monarch butterfly for {name}.',
    'Monarch butterflies reach Mexico each year around the Day of the Dead. The Purépecha people of Michoacán believe they are the souls of the dead returning.'),
  o('xolo', 'tradicion', 1, 1, '🐕', 'el xoloitzcuintle', 'show-loh-eets-KWEEN-tleh', 'the Mexican hairless dog',
    'Pongo un xoloitzcuintle', 'para {name}', 'I put out a xolo dog for {name}.',
    'In Aztec belief, the xolo dog guards people in life and guides souls across the river to the land of the dead, Mictlán.'),

  // food
  o('pan', 'comida', 2, 3, 'pan', 'el pan de muerto', 'PAHN deh MWEHR-toh', 'the bread of the dead',
    'Le dejo pan de muerto', 'a {name}', 'I leave bread of the dead for {name}.',
    'A sweet bread made with orange peel and anise, topped with dough "bones", baked only for this season.'),
  o('calavera', 'comida', 1, 3, 'calavera', 'la calavera de azúcar', 'kah-lah-VEH-rah deh ah-SOO-kar', 'the sugar skull',
    'Le hago una calavera de azúcar', 'a {name}', 'I make a sugar skull for {name}.',
    'Sugar skulls carry the name of the person on the forehead. Small skulls are for children, large ones for adults. Death is met with sweetness, not fear.'),
  o('mole', 'comida', 2, 1, '🍲', 'el mole', 'MOH-leh', 'the mole',
    'Le sirvo mole', 'a {name}', 'I serve mole to {name}.',
    'In Oaxaca, Puebla and Michoacán, mole negro with chicken and sesame is the dish for this celebration.'),
  o('tamales', 'comida', 2, 1, '🫔', 'los tamales', 'tah-MAH-lehs', 'the tamales',
    'Le preparo tamales', 'a {name}', 'I make tamales for {name}.',
    'Families cook the dishes their loved ones enjoyed most. The spirits enjoy the aroma; some say the food loses its flavor afterward because the spirits already tasted it.'),
  o('tacos', 'comida', 2, 1, '🌮', 'los tacos', 'TAH-kohs', 'the tacos',
    'Le preparo tacos', 'a {name}', 'I make tacos for {name}.',
    'Any favorite food belongs on the altar, from a holiday dish to everyday tacos.'),
  o('pizza', 'comida', 2, 1, '🍕', 'la pizza', 'PEET-sah', 'the pizza',
    'Le traigo pizza', 'a {name}', 'I bring pizza for {name}.',
    'An ofrenda is personal. If pizza was their favorite, pizza goes on the altar.'),
  o('hamburguesa', 'comida', 2, 1, '🍔', 'la hamburguesa', 'ahm-boor-GEH-sah', 'the hamburger',
    'Le traigo una hamburguesa', 'a {name}', 'I bring a hamburger for {name}.',
    'What matters is what they loved to eat, traditional or not.'),
  o('fruta', 'comida', 3, 3, '🍊', 'la fruta', 'FROO-tah', 'the fruit',
    'Le dejo fruta', 'a {name}', 'I leave fruit for {name}.',
    'Seasonal fruit such as oranges, tangerines, guavas and sugarcane is a gift from the harvest.'),
  o('dulces', 'comida', 3, 3, '🍬', 'los dulces', 'DOOL-sehs', 'the candy',
    'Le traigo dulces', 'a {name}', 'I bring candy for {name}.',
    'Candy is a favorite offering, especially for children who have passed.'),

  // drinks
  o('cafe', 'bebidas', 1, 1, '☕', 'el café', 'kah-FEH', 'the coffee',
    'Le sirvo un café', 'a {name}', 'I pour a coffee for {name}.',
    'A cup of the coffee they drank every morning makes them feel at home.'),
  o('chocolate', 'bebidas', 2, 1, '🍫', 'el chocolate', 'choh-koh-LAH-teh', 'the chocolate',
    'Le preparo chocolate caliente', 'a {name}', 'I make hot chocolate for {name}.',
    'Hot chocolate is served with pan de muerto. Chocolate comes from Mexico.'),
  o('refresco', 'bebidas', 2, 1, '🥤', 'el refresco', 'reh-FRES-koh', 'the soda',
    'Le sirvo un refresco', 'a {name}', 'I pour a soda for {name}.',
    'Altars hold whatever they liked to drink. Coca-Cola is one of the most common drinks on Mexican altars.'),
  o('cerveza', 'bebidas', 2, 2, '🍺', 'la cerveza', 'sehr-VEH-sah', 'the beer',
    'Le dejo una cerveza', 'a {name}', 'I leave a beer for {name}.',
    'Beer is one of the most common drinks on altars. If they enjoyed one, their favorite is left for them.'),
  o('tequila', 'bebidas', 1, 1, '🥃', 'el tequila', 'teh-KEE-lah', 'the tequila',
    'Brindo con tequila', 'por {name}', 'I toast {name} with tequila.',
    'Tequila or mezcal is poured for adults who liked it, as a toast to their memory.'),
  o('vino', 'bebidas', 1, 1, '🍷', 'el vino', 'VEE-noh', 'the wine',
    'Le sirvo una copa de vino', 'a {name}', 'I pour a glass of wine for {name}.',
    'Their favorite drink, whatever it was, welcomes them back.'),

  // what they enjoyed
  o('cigarros', 'gustos', 3, 1, '🚬', 'los cigarros', 'see-GAH-rrohs', 'the cigarettes',
    'Le dejo sus cigarros', 'a {name}', 'I leave {name} their cigarettes.',
    'The ofrenda welcomes people as they were. If they smoked, their brand is left for them.'),
  o('guitarra', 'gustos', 4, 1, '🎸', 'la guitarra', 'gee-TAH-rrah', 'the guitar',
    'Le traigo su guitarra', 'a {name}', 'I bring {name} their guitar.',
    'Objects from their hobbies and favorite songs help remember who they were.'),
  o('radio', 'gustos', 3, 1, '📻', 'la radio', 'RAH-dee-oh', 'the radio',
    'Le pongo su música', 'a {name}', 'I play {name}\'s music.',
    'Many families play the songs their loved one enjoyed while the altar is up.'),
  o('libro', 'gustos', 1, 1, '📖', 'el libro', 'LEE-broh', 'the book',
    'Le dejo su libro favorito', 'a {name}', 'I leave {name} their favorite book.',
    'Personal keepsakes, like a book, a necklace or a jacket, help recreate who they were.'),
  o('cartas', 'gustos', 3, 1, '🃏', 'las cartas', 'KAR-tahs', 'the playing cards',
    'Le dejo sus cartas', 'a {name}', 'I leave {name} their cards.',
    'Games they loved, like cards or lotería, bring back evenings spent together.'),
  o('balon', 'gustos', 4, 1, '⚽', 'el balón', 'bah-LOHN', 'the soccer ball',
    'Le traigo su balón', 'a {name}', 'I bring {name} their ball.',
    'Fans leave a ball or the jersey of their favorite team.'),
  o('sombrero', 'gustos', 3, 1, '👒', 'el sombrero', 'sohm-BREH-roh', 'the hat',
    'Le dejo su sombrero', 'a {name}', 'I leave {name} their hat.',
    'Clothes they always wore, like a hat, make the altar feel like them.'),
  o('chamarra', 'gustos', 4, 1, '🧥', 'la chamarra', 'chah-MAH-rrah', 'the jacket',
    'Le dejo su chamarra', 'a {name}', 'I leave {name} their jacket.',
    'In Mexico a jacket is a chamarra. Personal things help recreate their essence.'),
  o('lentes', 'gustos', 2, 1, '👓', 'los lentes', 'LEN-tehs', 'the glasses',
    'Le dejo sus lentes', 'a {name}', 'I leave {name} their glasses.',
    'Everyday things they always had with them bring back their presence.'),
  o('reloj', 'gustos', 2, 1, '⌚', 'el reloj', 'reh-LOH', 'the watch',
    'Le dejo su reloj', 'a {name}', 'I leave {name} their watch.',
    'A watch or a piece of jewelry they wore every day is a common keepsake.'),
  o('celular', 'gustos', 2, 1, '📱', 'el celular', 'seh-loo-LAR', 'the cell phone',
    'Le dejo su celular', 'a {name}', 'I leave {name} their phone.',
    'Modern altars include modern favorites too. What matters is what they loved.'),
  o('videojuego', 'gustos', 3, 1, '🎮', 'el videojuego', 'bee-deh-oh-HWEH-goh', 'the video game',
    'Le traigo su videojuego', 'a {name}', 'I bring {name} their video game.',
    'If they loved to play, their game belongs on the altar.'),
  o('juguete', 'gustos', 3, 2, '🧸', 'el juguete', 'hoo-GEH-teh', 'the toy',
    'Le dejo un juguete', 'a {name}', 'I leave a toy for {name}.',
    'Toys are left for children who have passed, so they can play when they arrive.'),

  // for pets
  o('hueso', 'mascotas', 4, 1, '🦴', 'el hueso', 'WEH-soh', 'the bone',
    'Le dejo un hueso', 'a {name}', 'I leave a bone for {name}.',
    'Pets are remembered too. Many families now include their animal companions.'),
  o('pelota', 'mascotas', 4, 1, '🎾', 'la pelota', 'peh-LOH-tah', 'the ball',
    'Le traigo su pelota', 'a {name}', 'I bring {name} their ball.',
    'A favorite toy tells the pet they are home.'),
  o('croquetas', 'mascotas', 3, 1, '🥣', 'las croquetas', 'kroh-KEH-tahs', 'the pet food',
    'Le sirvo croquetas', 'a {name}', 'I serve pet food to {name}.',
    'Their bowl of food, just like the dishes left for people.'),
];

export const PHOTO = { id: 'foto', emoji: '🖼️', es: 'la foto', say: 'FOH-toh', en: 'the photo',
  core: 'Pongo la foto', tail: 'de {name}', sentenceEn: 'I put out {name}\'s photo.',
  why: 'The photo shows who the altar is for. It helps the spirit recognize its home, shows that a place is saved for them, and keeps their memory alive for the next generations.' };

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
  { id: 'otro', es: 'alguien especial', en: 'someone special', icon: '💛', kind: 'person' },
];

// Well-known people often honored on public altars in Mexico
export const FAMOUS = [
  { id: 'frida', name: 'Frida Kahlo', es: 'la pintora', en: 'the painter', icon: '🎨' },
  { id: 'pedro', name: 'Pedro Infante', es: 'el cantante y actor', en: 'the singer and actor', icon: '🎤' },
  { id: 'cantinflas', name: 'Cantinflas', es: 'el comediante', en: 'the comedian', icon: '🎩' },
  { id: 'juanga', name: 'Juan Gabriel', es: 'el cantautor', en: 'the singer-songwriter', icon: '🎶' },
  { id: 'selena', name: 'Selena', es: 'la reina de la música tejana', en: 'the queen of Tejano music', icon: '🌹' },
];

export const RELATION_BY_ID = Object.fromEntries(RELATIONS.map((r) => [r.id, r]));
export const FAMOUS_BY_ID = Object.fromEntries(FAMOUS.map((f) => [f.id, f]));

export function iconHTML(o) {
  return o.art ? ART[o.art] : '';
}

// What the recorded audio says for each offering (used by the voice script and the player)
export function spokenWord(o) {
  return `${o.es.charAt(0).toUpperCase()}${o.es.slice(1)}.`;
}

export function spokenSentence(o) {
  return `${o.core}.`;
}
