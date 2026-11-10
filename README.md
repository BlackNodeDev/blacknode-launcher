# BlackNode Launcher

Version 1.1.0, based on Lumen Launcher. System programs: Notes, Settings and BlackNode Engine (opens https://blacknodedev.github.io/blacknode-engine/ in a new tab, since the engine needs its own cross-origin-isolated page).

Build: `node build.js`. Serve `dist/` under `/blacknode-launcher/`. The updater refreshes the scoped offline PWA cache; it does not use a patch manifest.

IndexedDB: `blacknode-launcher`. Settings keys: `blacknode.*`. Update URL: https://blacknodedev.github.io/blacknode-launcher/
