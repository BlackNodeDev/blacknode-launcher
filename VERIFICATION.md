# Factory verification

Verified on the shared Linux box with Godot **4.7.2.stable.official.ed1daf0bf**.

- Headless `--import`: passed, zero script errors.
- Headless main-scene smoke run (`--quit-after 120`): passed, zero script errors.
- Integration suite: **38 checks, 0 failures**, zero script errors. Loads all five scenes; verifies appearance persistence, navigation, both back paths, read-only logs, file-root confinement, updater version/schema/offline/HTTP handling and patch notes.
- Web release export: passed, single-threaded Compatibility build in `build/web/`; `programs.json` and `version.json` confirmed in the pack. Build output is ignored by Git.
- Home + Settings viewport captures: **1080 × 1920 PNGs**, visually inspected. Xvfb/llvmpipe reports an unsupported V-Sync-mode warning; no rendering or script errors.
- Android: preset supplied, not exported. No Android SDK or configured keystore was available on this box. Physical Oppo testing not performed.
- Browser runtime test and deployment not performed. A successful Web export is not a live hosted site.
- Updater HTTP branches are deterministic simulated responses in the integration test. The private GitHub manifest is expected to reject unauthenticated requests until a safe update channel is configured; no credentials are bundled. Patch installation is deliberately a placeholder.

Logs and screenshots (outside the repository): `/workspace/blacknode-launcher-shots/`.
