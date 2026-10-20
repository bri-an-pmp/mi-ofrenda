# Security

Mi Ofrenda: a static website (Vite, GitHub Pages) and an iPhone app (Capacitor) for building a Día de Muertos altar and learning Spanish. There is no server and no account. Altars, names, memories and photos are saved only on the visitor's own device: in the browser, or inside the iPhone app.

## Reporting a vulnerability

Please report security issues privately through GitHub: **Security → Report a vulnerability** on this repository (private vulnerability reporting is enabled). Don't open a public issue for security problems.

## Automated protections (always on)

| Protection | Status |
|---|---|
| GitHub secret scanning | Enabled |
| Push protection (blocks commits that contain secrets) | Enabled |
| Dependabot vulnerability alerts and security updates | Enabled |
| Dependabot version checks for npm and the pinned GitHub Actions (`.github/dependabot.yml`) | Weekly |
| Private vulnerability reporting | Enabled |

## How the app protects visitors

- **No code injection:** names, memories and all saved text are shown with `textContent`. The only HTML the app inserts is its own fixed drawings in `src/data.js`.
- **Content Security Policy** (`vite.config.js`): only the site's own scripts and styles run (no `'unsafe-inline'`), the page connects only to itself, and frames, plugins, workers and form posts are blocked.
- **Clickjacking:** GitHub Pages can't send `frame-ancestors` or `X-Frame-Options`, so `src/frame-guard.js` refuses to run inside another site's frame and shows only a link to open the app directly.
- **Saved data is untrusted:** `cleanAltar()` in `src/main.js` accepts only known offerings and people (own keys only, so `__proto__`-style keys are ignored), IDs in a fixed format, clamped positions, capped text lengths, at most 100 altars, and photos only as small JPEG data.
- **Photos:** only JPEG, PNG, WebP, GIF and HEIC files up to 25 MB and 40 megapixels are accepted. They are redrawn on the device at 640 px, which also removes camera data such as GPS location, and they never leave the device unless the visitor shares an image.
- **Voice key:** the ElevenLabs key is used only by `scripts/make-voice.mjs` on the owner's computer, from a gitignored `.env` file (readable only by the owner). The website never contacts ElevenLabs; it plays pre-made audio files. The key is restricted to Text to Speech with a credit cap.
- **iPhone app:** the app loads only its own bundled files and makes no network requests to run (the help and privacy links open in Safari). Saved altars are also copied to a file in the app's own private storage (`src/native.js`), read back through the same `cleanAltar()` checks. The camera and photo library are used only when the player picks a photo; App Store privacy label: Data Not Collected. The app is signed with Apple's cloud-managed distribution certificate, so no signing keys, certificates or provisioning profiles are stored in this repository or needed on disk.
- **Build pipeline:** the deploy workflow uses a least-privilege token and GitHub Actions pinned to exact commit SHAs.

## Checks run on 2026-10-18

| Check | Result |
|---|---|
| Secret patterns (AWS, GitHub, OpenAI, Anthropic, ElevenLabs, Slack, Google, Hugging Face keys; private keys) in every file **and every past commit** | ✅ None found |
| The real ElevenLabs key in the history, the built site or any published file | ✅ Not present |
| Credential files ever committed (`.env`, `*.pem`, `*.key`, `id_rsa`, credentials) | ✅ None found |
| GitHub secret-scanning alerts | ✅ 0 open alerts |
| `npm audit` | ✅ 0 known vulnerabilities (the only dependency is the Vite build tool) |
| Hostile saved data: HTML/script in names and memories, `__proto__`/`constructor` keys, selector-breaking IDs, SVG and `javascript:` "photos", non-numbers, 5,000 altars, 100,000 offerings, broken JSON | ✅ No code ran, no crashes, limits applied |
| SVG file uploaded as a photo | ✅ Rejected |
| Page framed by another site | ✅ App does not run; only a link to open it is shown |
| Full app flow under the strict Content Security Policy | ✅ Nothing blocked |
| CI workflow review (`deploy.yml`) | ✅ Least-privilege token; actions pinned to SHAs; no `pull_request_target` triggers |

## Not covered

These checks are automated and point-in-time. They are not a formal penetration test or audit.

## Checks run on 2026-10-19 (iPhone app)

| Check | Result |
|---|---|
| Secret patterns and credential files (`.env`, keys, `.p12`, `.cer`, `.mobileprovision`) in the repository, including the new `ios/` project | ✅ None found; `.env` stays gitignored |
| `npm audit --omit=dev` (Capacitor runtime plugins) | ✅ 0 known vulnerabilities |
| `npm audit` (including build tools) | ✅ 0 after forcing `uuid` ^11.1.1 (it was pulled in at 7.0.3 by the Capacitor CLI's `xcode` package; development-only, never shipped) |
| App build under the Content Security Policy in the iOS simulator: altars, audio, share sheet, saved-data copy | ✅ Nothing blocked |

