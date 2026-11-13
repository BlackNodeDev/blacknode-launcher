# Blacknode Launcher

Simple offline launcher, ported from the Lumen launcher single-file build
(`scratch/message-attachments/lumen-launcher.zip` → `scratch/lumen-launcher.html`).

What was kept / changed:

- Kept: clock + date, favourites (max 8, long-press/right-click to manage),
  recents, A–Z grouped app list with a vertical side index, inline search
  + calculator, add/edit/delete programs (HTML file / URL / pasted code), JSON export/import, Notes system
  app, Settings sheet, install-as-app button, sandboxed iframe launching
  (max 4 open).
- Stripped: all 6 bundled non-system demo apps (Lumen OS, Greybox Themes,
  Painterly Shader, Photo Room 2.5D, Lumen Splat, Glow Canvas — about 1.4 MB
  of embedded base64). Only system apps ship: Notes + Settings.
- Stripped: neon/starfield styling. This page uses the simple style —
  system fonts, `color-scheme: light dark`, plain borders, no glow,
  gradients, wallpaper canvas, hue/glow/lefty settings, or status chips
  (Idea/WIP/Beta/Done). Statuses from old backups are preserved in storage
  but no longer shown.
- Storage lives under fresh keys so it never clashes with Lumen:
  IndexedDB `blacknode-launcher`, localStorage `blacknode.sysfav` and
  `blacknode.notes`. First run migrates anything saved under the previous
  `ange-eric-*` keys. Old Lumen backups still import (programs array).

`index.html` is intentionally just a mount point plus loader. Real code:

- `src/main.js` — entry, mounts the app
- `src/app.js` — launcher UI + install-button logic (dynamic rows use
  escaped strings via `esc()`, never raw user HTML)
- `src/settings.js` — user-visible copy + limits
- `src/styles.css` — all styling, system fonts only

Security notes:

- No secrets here — `main.pjs`, `index.html`, and everything under `src/` ships publicly.
- No `eval` of app content except the calculator's arithmetic parser (digits
  and operators only, same guard as Lumen). Launched HTML apps run in
  sandboxed iframes.
- If you later need keys/tokens, keep them out of this repo.
