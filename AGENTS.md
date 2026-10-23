# Guide for AI coding agents (Claude Code, Cursor, Copilot and others)

Mi Ofrenda: a Día de Muertos altar game for learning Spanish. The player chooses someone to remember (family, a pet, a well-known person), drags offerings onto an altar in a warm candlelit room, and learns each word, how to say it and a sentence with the person's name. It runs as a website (GitHub Pages) and as an iPhone app (Capacitor, on the App Store). The owner is not a developer: explain things in plain language, step by step.

Live site: https://bri-an-pmp.github.io/mi-ofrenda/ · Repo: bri-an-pmp/mi-ofrenda · App Store: https://apps.apple.com/us/app/mi-ofrenda/id6824747905 (1.0 = build 6 = tag `v1.0-build6`).

## Setup and commands

- Node 22 (`.nvmrc`). The Mac's nvm default is older, so first: `source ~/.nvm/nvm.sh && nvm use 22`.
- `npm ci` installs; `npm run dev` previews locally; `npm run build` writes the website to `dist/`.
- Pushing to `main` publishes the website (`.github/workflows/deploy.yml`, actions pinned to SHAs).
- `npm run voice` makes missing ElevenLabs clips from the owner's private `.env` (`ELEVENLABS_API_KEY`, `ELEVENLABS_VOICE_ID`). Never print, copy or commit the key. `npm run voice -- --list` lists what each clip says.
- `npm audit` should show 0 vulnerabilities.

## iPhone app: build and upload

Signing is done by Apple in the cloud, so no keychain password or certificate is needed on the Mac.

1. Raise `CURRENT_PROJECT_VERSION` in `ios/App/App.xcodeproj/project.pbxproj` (both lines) for every upload.
2. `npm run ios` (builds with `--mode app`, which leaves out living people, and copies into `ios/App`).
3. From `ios/App`:
   ```
   xcodebuild -project App.xcodeproj -scheme App -configuration Release -destination "generic/platform=iOS" -archivePath ~/Library/Developer/Xcode/Archives/MiOfrenda-BUILD.xcarchive CODE_SIGNING_ALLOWED=NO archive
   xcodebuild -exportArchive -archivePath ~/Library/Developer/Xcode/Archives/MiOfrenda-BUILD.xcarchive -exportPath /tmp/mi-ofrenda-upload -exportOptionsPlist ../../docs/app-store/UploadOptions.plist -allowProvisioningUpdates
   ```
   `UploadOptions.plist` uploads straight to App Store Connect; `ExportOptions.plist` only makes the `.ipa`. Team ID `HR3HH7NX4H`, bundle ID `com.brianathey.miofrenda`.
4. Keep the `.xcarchive` (crash-report symbols), tag the commit (`v1.1-build7` style) and add a row to the Releases table in `SECURITY.md`.

Store listing, review notes and screenshots (1206×2622): `docs/app-store/`. Privacy and help pages linked from the store: `public/privacidad.html`, `public/ayuda.html` (support email soporte.miofrenda@gmail.com).

## Code map

- `index.html`: welcome (intro + bilingual FAQ), choose a person, the altar room, word card, quiz, share dialog.
- `src/data.js`: all content (offerings, categories, people, pets, famous people, drawings). Add offerings here.
- `src/main.js`: the game (saving and `cleanAltar()`, drag and drop, candlelight, photos, guests, speech, quiz, share).
- `src/snapshot.js`: draws the altar as a picture (Publicación 4:5, Historia 9:16, Cuadrada 1:1).
- `src/boot.js`, `src/native.js`: iPhone-only features (file copy of saved altars, haptics, share sheet).
- `src/frame-guard.js`: refuses to run inside another site's frame (clickjacking).
- `vite.config.js`: Content Security Policy; `--mode app` build for the iPhone.
- `CREDITS.md`: every outside photo, the voice, the icon, with licenses. `SECURITY.md`: protections, releases, checks.

## Rules

- **Spanish first, English as reference.** All text is natural Mexican Spanish ("tú"), written the way a Mexican speaker would say it, not translated. English goes in a smaller `.en` line (`english()` in main.js) that the "Inglés: sí/no" switch hides. Share text and UI copy must sound native.
- **Every offering** needs `es`, `say` (pronunciation), `en`, `core` + `tail` sentence (the tail holds `{name}`), `whyEs` and `why`, and new voice clips (`npm run voice`). Renamed ids get an alias in `RENAMED` so old altars still open.
- **Untrusted saved data.** Everything loaded goes through `cleanAltar()`: own-key lookups only (`own()`), ID format, clamped numbers, capped sizes. Use `textContent`, never `innerHTML` with saved or typed text. Constants used by `cleanAltar()` must be declared above `let altars = loadAltars()` (a temporal-dead-zone bug once broke loading).
- **Security policy.** Only the site's own scripts and styles; no `'unsafe-inline'`. Any new outside service must be added to the CSP in `vite.config.js`. The app makes no network requests to run.
- **Photos of people.** Only public domain or Creative Commons with credit, listed in `CREDITS.md` and credited on screen. Living people are website-only (`living: true`). Avoid colorized or AI-"enhanced" portraits.
- **Voice.** The ElevenLabs voice is a woman's. The device voice is used only for typed names and must be a natural woman's Spanish voice (`voiceScore()`); never novelty or men's voices.
- **Accessibility.** Tap targets ≥ 44px, text ≥ 13px, 4.5:1 contrast, keyboard focus kept after actions, `aria-live` for status, nothing cut off at 320px or in landscape, respect reduced motion.
- **Privacy label is "Data Not Collected".** Adding analytics, crash reporting, ads or accounts requires updating the App Store privacy label first.

## Checking changes

No automated test suite. Before committing: `npm run build`, open `npx vite preview`, and try the flow on desktop and at 390px phone width (and 320px). Headless Chrome hangs on `img.decode()` of uploaded images, so test photo features by seeding `localStorage` with a canvas-made JPEG data URL.
