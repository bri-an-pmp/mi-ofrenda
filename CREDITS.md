# Credits and licenses

Everything in Mi Ofrenda that came from outside the project, with its license and where it is credited. Keep this file up to date whenever a photo, sound or other asset is added or replaced.

## Photos of well-known people (`public/people/`)

Source: Wikimedia Commons. All are **public domain**, except Vicente Fernández.

| File | Person | License | Notes |
|---|---|---|---|
| `cantinflas.jpg` | Cantinflas | Public domain | |
| `celia.jpg` | Celia Cruz | Public domain (PD-Cuba) | From "Celia Cruz y Pedro Knight.jpg" (c. 1962); Pedro Knight is visible beside her. Avoid Commons' "Celia Cruz.jpg", which is derived from a fair-use image. |
| `diego.jpg` | Diego Rivera | Public domain | |
| `dolly.jpg` | Dolly Parton | Public domain | **Website only.** She is living, so the iPhone app leaves her out (`living: true` in `FAMOUS`, dropped by `vite build --mode app`). |
| `frida.jpg` | Frida Kahlo | Public domain | |
| `fuentes.jpg` | Carlos Fuentes | Public domain | |
| `juanga.jpg` | Juan Gabriel | Public domain | |
| `maria.jpg` | María Félix | Public domain | |
| `pedro.jpg` | Pedro Infante | Public domain | |
| `rulfo.jpg` | Juan Rulfo | Public domain | |
| `selena.jpg` | Selena | Public domain (published without a copyright notice) | From "Selena in 1988.jpg". |
| `vicente.jpg` | Vicente Fernández | **CC BY 2.0**, photo by Julio Enriquez | Attribution required. Credited under the people grid (`index.html`, `.photo-credits`) and on `ayuda.html`. |

## Photos of real ofrendas in the FAQ (`public/faq/`)

`casa.jpg`, `patzcuaro.jpg`, `puebla.jpg`, `queretaro.jpg`: Wikimedia Commons, **CC BY-SA 4.0**, by AlexgarcesM, SerchForVideos, NopalTropical and A01376766. Attribution required (and share-alike if the photos themselves are modified). Credited under the FAQ (`index.html`, `.faq-credits`).

## Voice recordings (`public/audio/`)

Made by the owner with **ElevenLabs** (Mexican Spanish woman's voice, `eleven_multilingual_v2`) on a paid plan, which includes a commercial license for audio generated while subscribed. Keep the ElevenLabs receipt for the month the clips were made as proof. Script: `scripts/make-voice.mjs`.

Typed names are spoken by the device's own voice (Apple, Google or Microsoft system voices); nothing is recorded or sent anywhere.

## App icon (`ios/App/App/Assets.xcassets/AppIcon.appiconset/`)

Candle shaped like the letter "O" with three marigolds, made by the owner with **OpenAI Sora**. OpenAI's terms assign ownership of generated output to the user. Source files are kept in `icon-inbox/` (not published).

## Drawings, text and code

The room, altar, candles, papel picado, sugar skull, pan dulce, copal, petate, Virgen de Guadalupe, monarch butterfly, aguas frescas and soda bottle are original SVG drawings written for this project (`index.html`, `src/data.js`). The bottle has no brand logo on purpose. All Spanish and English text and all code are original.

Offering meanings were researched with help from [How to Build a Day of the Dead Altar](https://mexicoinmypocket.com/blogs/blog/how-to-build-a-day-of-the-dead-altar) (Mexico in My Pocket); the explanations in the app are written in our own words.

## Emoji and fonts

Offerings without a custom drawing use emoji, which are drawn by each device's own emoji font (Apple Color Emoji, Noto Color Emoji, Segoe UI Emoji). No emoji images are bundled. The app uses system fonts only; no font files are included.

## Software

- [Vite](https://vite.dev/) (MIT): build tool.
- [Capacitor](https://capacitorjs.com/) and its plugins (MIT): iPhone app.
