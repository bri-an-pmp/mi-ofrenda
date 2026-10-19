// What changes when Mi Ofrenda runs as the iPhone app (Capacitor) instead of a website.
// On the website every function here does nothing, or the browser's own way is used.
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Share } from '@capacitor/share';

export const isApp = Capacitor.isNativePlatform();

// iOS may clear a web view's storage when the phone runs low on space, so the app also keeps
// a copy of the saved altars in its own files, and puts them back before the page starts.
const SAVE_FILE = 'mi-ofrenda-guardado.json';
const KEYS = ['mi_ofrenda_altars', 'mi_ofrenda_english'];

export async function restoreSaved() {
  if (!isApp) return;
  try {
    const { data } = await Filesystem.readFile({ path: SAVE_FILE, directory: Directory.Data, encoding: Encoding.UTF8 });
    const saved = JSON.parse(data);
    for (const key of KEYS) {
      if (typeof saved?.[key] === 'string' && localStorage.getItem(key) === null) localStorage.setItem(key, saved[key]);
    }
  } catch {
    // first launch, or no copy yet: nothing to restore
  }
}

let writing = Promise.resolve();
export function keepCopy() {
  if (!isApp) return;
  const saved = {};
  for (const key of KEYS) {
    const v = localStorage.getItem(key);
    if (v !== null) saved[key] = v;
  }
  // one write at a time, so an older copy never lands after a newer one
  writing = writing.then(() => Filesystem.writeFile({
    path: SAVE_FILE, directory: Directory.Data, encoding: Encoding.UTF8, data: JSON.stringify(saved),
  })).catch(() => {});
}

// A soft tap when an offering lands on the altar
export function tap() {
  if (isApp) Haptics.impact({ style: ImpactStyle.Light }).catch(() => {});
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result).split(',')[1]);
    r.onerror = () => reject(r.error);
    r.readAsDataURL(blob);
  });
}

// The iPhone share sheet with the altar picture ("Save Image" puts it in Photos).
// Returns false if the person closed the sheet without sharing.
export async function sharePicture(blob, name, title, text) {
  const { uri } = await Filesystem.writeFile({ path: name, directory: Directory.Cache, data: await blobToBase64(blob) });
  try {
    await Share.share({ title, text, files: [uri] });
    return true;
  } catch (err) {
    if (/cancel/i.test(String(err?.message || err))) return false;
    throw err;
  }
}
