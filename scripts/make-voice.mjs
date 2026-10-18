// Makes the spoken Spanish clips with ElevenLabs, once, and saves them in public/audio.
// The app plays these files; it never talks to ElevenLabs itself, so the key stays on this Mac.
//
//   npm run voice          make any clips that don't exist yet
//   npm run voice -- --all make every clip again (after changing the voice)
//   npm run voice -- --list print what each clip says (for recording a real person instead)
//
// Needs a file called .env in this folder with two lines:
//   ELEVENLABS_API_KEY=your key
//   ELEVENLABS_VOICE_ID=the voice ID from your ElevenLabs voice library

import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { OFFERINGS, PHOTO, spokenWord, spokenSentence } from '../src/data.js';

const OUT = new URL('../public/audio/', import.meta.url);
const clips = [...OFFERINGS, PHOTO].flatMap((o) => [
  { file: `words/${o.id}.mp3`, text: spokenWord(o) },
  { file: `sentences/${o.id}.mp3`, text: spokenSentence(o) },
]);

if (process.argv.includes('--list')) {
  for (const c of clips) console.log(`${c.file.padEnd(28)} ${c.text}`);
  process.exit(0);
}

const key = process.env.ELEVENLABS_API_KEY;
const voice = process.env.ELEVENLABS_VOICE_ID;
if (!key || !voice) {
  console.error('Missing ELEVENLABS_API_KEY or ELEVENLABS_VOICE_ID. Add both to the .env file in this folder (see README).');
  process.exit(1);
}

const redo = process.argv.includes('--all');
let made = 0;
for (const c of clips) {
  const target = new URL(c.file, OUT);
  if (!redo && existsSync(target)) continue;
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voice)}?output_format=mp3_44100_128`, {
    method: 'POST',
    headers: { 'xi-api-key': key, 'Content-Type': 'application/json', Accept: 'audio/mpeg' },
    body: JSON.stringify({
      text: c.text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: { stability: 0.6, similarity_boost: 0.8, speed: 0.9 },
    }),
  });
  if (!res.ok) {
    const detail = await res.text();
    console.error(`\nElevenLabs refused "${c.text}" (${res.status}). ${detail.slice(0, 300)}`);
    if (res.status === 401) console.error('The API key looks wrong. Copy it again from ElevenLabs → Profile → API keys.');
    if (res.status === 404) console.error('The voice ID was not found. Add the voice to "My Voices" and copy its ID again.');
    process.exit(1);
  }
  mkdirSync(new URL('.', target), { recursive: true });
  writeFileSync(target, Buffer.from(await res.arrayBuffer()));
  made++;
  console.log(`✓ ${c.file}  ${c.text}`);
}
console.log(made ? `\nDone: ${made} clips made in public/audio.` : 'All clips already exist. Use --all to make them again.');
