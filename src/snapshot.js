// Draws the finished altar as a picture for saving and sharing.
// The scene is redrawn on a canvas (not a screenshot), so it comes out sharp at the size each
// social app recommends: the candlelit room, the altar, the offerings, the photo, a title and a
// small footer.

import { OFFERING_BY_ID, iconHTML, WAX } from './data.js';

export const SIZES = {
  historia: { w: 1080, h: 1920, altar: 0.62 },
  publicacion: { w: 1080, h: 1350, altar: 0.74 },
  cuadrada: { w: 1080, h: 1080, altar: 0.72 },
};

const SITE = 'bri-an-pmp.github.io/mi-ofrenda';
const EMOJI_FONT = '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';
const SERIF = 'Georgia,"Iowan Old Style","Times New Roman",serif';
const SANS = '"Avenir Next","Segoe UI",system-ui,-apple-system,sans-serif';

const images = new Map();

// Turn SVG markup into an image the canvas can draw
function svgImage(markup, w, h) {
  if (images.has(markup)) return images.get(markup);
  const svg = markup.replace(/^<svg/, `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"`);
  const img = new Image();
  img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  const ready = img.decode().then(() => img);
  images.set(markup, ready);
  return ready;
}

function loadImage(src) {
  const img = new Image();
  img.src = src;
  return img.decode().then(() => img);
}

function artImage(o, wax, defs) {
  const [, vw, vh] = iconHTML(o).match(/viewBox="0 0 (\d+) (\d+)"/);
  const markup = iconHTML(o)
    .replace(/(<svg[^>]*>)/, `$1<defs>${defs}</defs>`)
    .replace('class="wax"', `fill="${wax}"`);
  return svgImage(markup, Number(vw), Number(vh)).then((img) => ({ img, vw: Number(vw), vh: Number(vh) }));
}

function wrap(ctx, text, maxWidth, maxLines) {
  const lines = [];
  let line = '';
  for (const word of text.split(/\s+/)) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
      if (lines.length === maxLines) break;
    } else line = test;
  }
  if (lines.length < maxLines && line) lines.push(line);
  return lines;
}

/**
 * @param {object} o
 * @param {object} o.altar     the saved altar (name, memory, photo, items)
 * @param {string} o.icon      emoji shown in the frame when there is no photo
 * @param {string} o.sizeKey   one of SIZES
 * @param {string} o.roomSvg   markup of the room drawing
 * @param {string} o.altarSvg  markup of the altar drawing (steps, arch, banner, petals)
 * @param {string} o.defs      shared gradient definitions for the candle drawing
 */
export async function renderAltar({ altar, icon, sizeKey, roomSvg, altarSvg, defs }) {
  const size = SIZES[sizeKey];
  const W = size.w;
  const H = size.h;
  const k = W / 1080;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  const footerH = Math.round(88 * k);
  const ah = Math.min(H * size.altar, (W * 0.96 * 520) / 400);
  const aw = (ah * 400) / 520;
  const ax = (W - aw) / 2;
  const ay = H - footerH - ah - 6 * k;
  const X = (x) => ax + (x / 400) * aw;
  const Y = (y) => ay + (y / 520) * ah;

  // everything the drawing needs, loaded up front
  const items = [...altar.items].sort((a, b) => a.y - b.y || a.x - b.x);
  let candle = 0;
  const looks = await Promise.all(items.map((it) => {
    const o = OFFERING_BY_ID[it.id];
    const wax = o.id === 'vela' ? WAX[candle++ % WAX.length] : '';
    return o.art ? artImage(o, wax, defs) : null;
  }));
  const [room, altarImg, photo] = await Promise.all([
    svgImage(roomSvg, 1000, 700),
    svgImage(altarSvg, 400, 520),
    altar.photo ? loadImage(altar.photo) : null,
  ]);

  // the room: wall above, the drawn room anchored to the bottom, then the wooden floor
  ctx.fillStyle = '#2b1a22';
  ctx.fillRect(0, 0, W, H);
  const s = (W / 1000) * 1.35;
  const roomX = (W - 1000 * s) / 2;
  const roomY = H - 700 * s;
  ctx.drawImage(room, roomX, roomY, 1000 * s, 700 * s);
  const floorTop = Y(472);
  ctx.fillStyle = '#45291a';
  ctx.fillRect(0, floorTop, W, H - floorTop);
  ctx.fillStyle = '#2a170c';
  for (let x = 0; x < W; x += 88 * k) ctx.fillRect(x, floorTop, 2 * k, H - floorTop);
  const floorShade = ctx.createLinearGradient(0, floorTop, 0, H);
  floorShade.addColorStop(0, 'rgba(0,0,0,.55)');
  floorShade.addColorStop(0.4, 'rgba(0,0,0,.1)');
  floorShade.addColorStop(1, 'rgba(0,0,0,.5)');
  ctx.fillStyle = floorShade;
  ctx.fillRect(0, floorTop, W, H - floorTop);
  ctx.fillStyle = '#1a0d07';
  ctx.fillRect(0, floorTop, W, 3 * k);

  ctx.drawImage(altarImg, ax, ay, aw, ah);

  // the photo frame on the top step
  const fx = ax + aw * 0.4125;
  const fy = ay + ah * 0.152;
  const fw = aw * 0.175;
  const fh = ah * 0.173;
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,.6)';
  ctx.shadowBlur = 18 * k;
  ctx.shadowOffsetY = 8 * k;
  const wood = ctx.createLinearGradient(fx, fy, fx + fw, fy + fh);
  wood.addColorStop(0, '#7a4e2a');
  wood.addColorStop(0.6, '#3e2513');
  wood.addColorStop(1, '#5a3820');
  ctx.fillStyle = wood;
  ctx.fillRect(fx, fy, fw, fh);
  ctx.restore();
  const pad = fw * 0.08;
  const labelH = fh * 0.17;
  const ix = fx + pad;
  const iy = fy + pad;
  const iw = fw - pad * 2;
  const ih = fh - pad * 2 - labelH;
  ctx.strokeStyle = '#c9a45c';
  ctx.lineWidth = 2.5 * k;
  ctx.strokeRect(fx + 1.5 * k, fy + 1.5 * k, fw - 3 * k, fh - 3 * k);
  if (photo) {
    // fill the frame, cropping the photo's edges as needed
    const scale = Math.max(iw / photo.width, ih / photo.height);
    const sw = iw / scale;
    const sh = ih / scale;
    ctx.drawImage(photo, (photo.width - sw) / 2, (photo.height - sh) / 2, sw, sh, ix, iy, iw, ih);
  } else {
    const bg = ctx.createRadialGradient(ix + iw / 2, iy + ih * 0.4, 0, ix + iw / 2, iy + ih * 0.4, iw);
    bg.addColorStop(0, '#d8c3a0');
    bg.addColorStop(1, '#8c6f4c');
    ctx.fillStyle = bg;
    ctx.fillRect(ix, iy, iw, ih);
    ctx.font = `${ih * 0.55}px ${EMOJI_FONT}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(icon, ix + iw / 2, iy + ih / 2);
  }
  const glass = ctx.createLinearGradient(ix, iy, ix + iw, iy + ih);
  glass.addColorStop(0, 'rgba(255,255,255,.22)');
  glass.addColorStop(0.25, 'rgba(255,255,255,0)');
  ctx.fillStyle = glass;
  ctx.fillRect(ix, iy, iw, ih);
  ctx.fillStyle = '#f3ebdf';
  ctx.fillRect(ix, iy + ih + pad * 0.4, iw, labelH);
  ctx.fillStyle = '#2a1638';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  let nameSize = labelH * 0.72;
  ctx.font = `700 ${nameSize}px ${SANS}`;
  while (ctx.measureText(altar.name).width > iw * 0.94 && nameSize > 8) {
    nameSize -= 1;
    ctx.font = `700 ${nameSize}px ${SANS}`;
  }
  ctx.fillText(altar.name, ix + iw / 2, iy + ih + pad * 0.4 + labelH / 2);

  // the offerings, back to front like on screen
  const box = aw * 0.11;
  items.forEach((it, i) => {
    const o = OFFERING_BY_ID[it.id];
    if (o.tier === 0) return; // the banner is part of the altar drawing
    const cx = X(it.x);
    const bottom = Y(it.y);
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,.7)';
    ctx.shadowBlur = 6 * k;
    ctx.shadowOffsetY = 4 * k;
    if (looks[i]) {
      const { img, vw, vh } = looks[i];
      const bw = o.id === 'vela' ? aw * 0.09 : box;
      const bh = o.id === 'vela' ? aw * 0.12 : box;
      const fit = Math.min(bw / vw, bh / vh);
      ctx.drawImage(img, cx - (vw * fit) / 2, bottom - bh / 2 - (vh * fit) / 2, vw * fit, vh * fit);
    } else {
      ctx.font = `${aw * 0.085}px ${EMOJI_FONT}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'alphabetic';
      ctx.fillText(o.emoji, cx, bottom - aw * 0.012);
    }
    ctx.restore();
    if (o.id === 'copal') {
      ctx.fillStyle = 'rgba(225,218,235,.18)';
      for (let j = 0; j < 4; j++) {
        ctx.beginPath();
        ctx.arc(cx + Math.sin(j * 1.7) * 8 * k, bottom - box * (0.8 + j * 0.55), box * (0.15 + j * 0.1), 0, Math.PI * 2);
        ctx.fill();
      }
    }
  });

  // candlelight: a dark room with warm pools of light around each flame
  const lights = altar.items.filter((i) => i.id === 'vela').map((i) => ({ x: X(i.x), y: Y(i.y - 44) }));
  const r = aw * 0.48;
  const dark = document.createElement('canvas');
  dark.width = W;
  dark.height = H;
  const d = dark.getContext('2d');
  d.fillStyle = `rgba(6,3,8,${Math.max(0.6, 0.88 - lights.length * 0.035) * 0.85})`;
  d.fillRect(0, 0, W, H);
  d.globalCompositeOperation = 'destination-out';
  const hole = (x, y, radius, stops) => {
    const g = d.createRadialGradient(x, y, 0, x, y, radius);
    for (const [at, a] of stops) g.addColorStop(at, `rgba(0,0,0,${a})`);
    d.fillStyle = g;
    d.fillRect(x - radius, y - radius, radius * 2, radius * 2);
  };
  hole(roomX + 165 * s, roomY + 245 * s, 210 * s, [[0, 0.65], [1, 0]]);
  hole(ax + aw / 2, ay + ah * 0.45, aw * 0.7, [[0, 0.38], [1, 0]]);
  for (const l of lights) hole(l.x, l.y, r, [[0, 1], [0.4, 0.7], [1, 0]]);
  ctx.drawImage(dark, 0, 0);

  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  for (const l of lights) {
    const g = ctx.createRadialGradient(l.x, l.y, 0, l.x, l.y, r * 0.8);
    g.addColorStop(0, 'rgba(255,172,70,.32)');
    g.addColorStop(0.45, 'rgba(255,130,40,.1)');
    g.addColorStop(0.75, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(l.x - r, l.y - r, r * 2, r * 2);
  }
  ctx.restore();
  const vignette = ctx.createRadialGradient(W / 2, H * 0.55, Math.min(W, H) * 0.35, W / 2, H * 0.55, Math.max(W, H) * 0.75);
  vignette.addColorStop(0, 'rgba(0,0,0,0)');
  vignette.addColorStop(1, 'rgba(0,0,0,.55)');
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, W, H);

  // title and memory
  const margin = 56 * k;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.shadowColor = 'rgba(0,0,0,.9)';
  ctx.shadowBlur = 12 * k;
  const titleSize = (sizeKey === 'historia' ? 64 : 52) * k;
  ctx.font = `italic 600 ${titleSize}px ${SERIF}`;
  const lead = 'La ofrenda para';
  const leadW = ctx.measureText(`${lead} `).width;
  ctx.font = `700 ${titleSize}px ${SERIF}`;
  const sameLine = leadW + ctx.measureText(altar.name).width <= W - margin * 2;
  let y = margin + titleSize;
  ctx.font = `italic 600 ${titleSize}px ${SERIF}`;
  ctx.fillStyle = '#f59b23';
  ctx.fillText(lead, margin, y);
  ctx.font = `700 ${titleSize}px ${SERIF}`;
  ctx.fillStyle = '#f6efe6';
  if (sameLine) ctx.fillText(altar.name, margin + leadW, y);
  else {
    y += titleSize * 1.15;
    ctx.fillText(wrap(ctx, altar.name, W - margin * 2, 1)[0], margin, y);
  }
  if (altar.memory) {
    const memSize = 30 * k;
    ctx.font = `italic ${memSize}px ${SERIF}`;
    ctx.fillStyle = '#e6dbe9';
    for (const line of wrap(ctx, `“${altar.memory}”`, W - margin * 2, sizeKey === 'historia' ? 3 : 2)) {
      y += memSize * 1.35;
      ctx.fillText(line, margin, y);
    }
  }

  // the story format has room for the words on the altar
  if (sizeKey === 'historia' && altar.items.length) {
    const words = [...new Set(items.map((i) => OFFERING_BY_ID[i.id].es))];
    const chip = 30 * k;
    y += 70 * k;
    ctx.shadowBlur = 0;
    ctx.font = `700 ${26 * k}px ${SANS}`;
    ctx.fillStyle = '#f59b23';
    ctx.fillText('EN MI OFRENDA', margin, y);
    y += 22 * k;
    ctx.font = `600 ${chip}px ${SANS}`;
    let x = margin;
    let row = 0;
    const limit = ay + ah * 0.05;
    for (const word of words) {
      const wWord = ctx.measureText(word).width + chip * 1.1;
      if (x + wWord > W - margin) {
        x = margin;
        row++;
      }
      const top = y + row * chip * 1.9;
      if (top + chip * 1.6 > limit) break;
      ctx.fillStyle = 'rgba(246,239,230,.14)';
      ctx.beginPath();
      ctx.roundRect(x, top, wWord, chip * 1.55, chip * 0.78);
      ctx.fill();
      ctx.fillStyle = '#f6efe6';
      ctx.fillText(word, x + chip * 0.55, top + chip * 1.1);
      x += wWord + chip * 0.4;
    }
  }

  // footer
  ctx.shadowBlur = 0;
  ctx.fillStyle = 'rgba(12,6,10,.86)';
  ctx.fillRect(0, H - footerH, W, footerH);
  ctx.fillStyle = '#f59b23';
  ctx.fillRect(0, H - footerH, W, 2 * k);
  const fyText = H - footerH / 2;
  ctx.textBaseline = 'middle';
  ctx.font = `${30 * k}px ${EMOJI_FONT}`;
  ctx.fillText('🌼', margin, fyText);
  ctx.font = `700 ${32 * k}px ${SERIF}`;
  ctx.fillStyle = '#f6efe6';
  ctx.fillText('Mi Ofrenda', margin + 44 * k, fyText);
  ctx.textAlign = 'right';
  ctx.font = `${22 * k}px ${SANS}`;
  ctx.fillStyle = '#cdbfdc';
  ctx.fillText(`Aprende español · ${SITE}`, W - margin, fyText);

  return canvas;
}

// A file name like mi-ofrenda-rosa-historia.jpg
export function fileName(name, sizeKey, ext) {
  const slug = name.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'ofrenda';
  return `mi-ofrenda-${slug}-${sizeKey}.${ext}`;
}
