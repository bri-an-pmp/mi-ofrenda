# Mi Ofrenda

**▶ Try it: [bri-an-pmp.github.io/mi-ofrenda](https://bri-an-pmp.github.io/mi-ofrenda/)**

Build a Día de los Muertos altar for someone you love and learn Spanish. Everything is in Spanish first, with English underneath as a reference (it can be switched off with the "Inglés" button).

1. Choose who to remember: a family member, a friend, a pet, or a well-known person.
2. Drag offerings onto the altar (or tap them). They fall onto the step below where you let go; drag one out of the room to take it off. Candles light up the dark room.
3. Each offering shows its Spanish word, how to say it (and says it aloud), a sentence using it with the person's name, and why it belongs on an ofrenda.
4. Practice the words you placed with a short quiz.

Altars are saved in the browser on this device.

## Run it

- Node 22 (`nvm use 22`), then `npm install`.
- `npm run dev` starts it locally.
- `npm run build` writes the website to `dist/`.

## Real voice recordings

The app plays recorded clips from `public/audio/words/` and `public/audio/sentences/` when they exist, and uses the device's built-in voice when they don't. Each sentence clip says the sentence without the person's name ("Le enciendo una vela."), because names are typed by the user.

To make the clips with ElevenLabs:

1. Make a file named `.env` in this folder (it is never uploaded) with two lines:
   ```
   ELEVENLABS_API_KEY=your key
   ELEVENLABS_VOICE_ID=the voice ID
   ```
2. Run `npm run voice` (needs Node 22: `nvm use 22`). It makes only the clips that are missing. `npm run voice -- --all` remakes all of them after changing the voice.

To record a real person instead, run `npm run voice -- --list` to see every file name and what it should say.

## Code map

- `index.html`: the three screens (welcome, choose a person, altar), the word card and the quiz.
- `src/data.js`: all content. Offerings, people, pets and famous figures. Add a new offering here.
- `src/main.js`: how it works (drag and drop, candlelight, saving, speech, quiz).
- `scripts/make-voice.mjs`: makes the voice clips with ElevenLabs.
- `src/style.css`: the look.
- `vite.config.js`: adds the security policy to the built page.
