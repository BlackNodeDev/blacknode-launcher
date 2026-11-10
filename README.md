# BlackNode Launcher · Factory

**0.1.0 / factory** — a fresh Godot system shell and the foundation for Josh’s dev workspace. Five system programs. **No apps, games, generator imports or inherited Lumen code.** Everything here is original and separate from Lumen Launcher, Lumen OS and RoboBlast.

## Run

Open `project.godot` in **Godot 4.7.2**, or:

```sh
godot --path .
```

Compatibility / OpenGL rendering, portrait 1080 × 1920 design canvas, `canvas_items` stretch with `expand`. The desktop preview is 432 × 768; Android is locked to portrait. Touch scrolls the home/program panels; large controls are intended for phone use. Android’s system Back gesture/key, Escape (`ui_cancel`), and the on-screen Home button return home. Back does not quit the launcher. The OS task switcher can close it.

## Factory programs

| Program | What works now |
| --- | --- |
| Settings | Four accent colours; 85%, 100%, 115% UI text scale; saved automatically to `user://settings.cfg` |
| Updater | Current version; manual HTTPS manifest check; version comparison; patch-note display; offline, timeout, malformed-response and HTTP-error handling |
| Files | Read-only `user://` directory navigation and text previews (32 KiB limit); no access to Android shared storage |
| System Info | OS, device model, screen/viewport dimensions, Godot, configured renderer and available memory statistics |
| Terminal / Log | Read-only launcher events, capped at 500 lines; **not a shell** |

Web storage belongs to the browser/site. Private browsing, clearing site data or changing origin can erase/reset it. This is a launcher UI, not an Android home-screen replacement: it has no HOME intent role, OS app enumeration or arbitrary process execution.

## Structure

```text
core/app.gd                 # App autoload: appearance, local log, version metadata
ui/launcher.{gd,tscn}       # Splash, registry-driven home, shared navigation
ui/ui.gd, icon.svg          # Original shared styling and identity
programs/<id>/             # One scene + typed script per system program
programs.json              # Sole home-screen registration point
version.json               # Local version, codename and patch notes
export_presets.cfg         # Web + Android (arm64) presets; no credentials
tests/test_suite.gd        # Integration checks (not in exports)
```

`user://` is a dedicated `BlackNodeLauncher` sandbox. Files there are never committed. `launcher.log` is bounded to the last 500 events and uses the device’s local clock. There are no third-party assets, account integrations or telemetry.

### Add a system program

1. Create `programs/<id>/<id>.tscn`, rooted in a `Control` (a `VBoxContainer` is convenient), and its typed GDScript.
2. Register it in `programs.json`:

```json
{"id":"example","name":"Example","glyph":"06","description":"A system tool","scene":"res://programs/example/example.tscn"}
```

3. Use the shared `UI` helpers and `App` autoload. The host supplies the scrollable content area and Home navigation. **No home-screen code edits are needed.**

Only trusted local scenes under `res://programs/` are loaded. A remote update manifest cannot add or execute programs.

## Updates and patches

The updater’s `App.MANIFEST_URL` currently points to:

```
https://raw.githubusercontent.com/BlackNodeDev/blacknode-launcher/main/version.json
```

**This repository is private. Unauthenticated GitHub raw requests normally return HTTP 404.** That is an expected, handled state, not a working private update channel. Later, use a public metadata-only manifest or a properly authenticated server/proxy. Private access needs authentication, but **never put a GitHub personal access token into a distributed client or public Web build**. No token is bundled here.

Manifest shape:

```json
{
  "manifest_schema": 1,
  "version": "0.1.0",
  "codename": "factory",
  "patch_notes": ["A short release note"]
}
```

Checks use a 12-second timeout, 256 KiB response limit and HTTPS; version comparison accepts numeric `major.minor.patch`. Notes are plain text. **Patch installation is intentionally not implemented**: no downloads, code replacement, signature validation, APK install or automatic update execution. A future patch mechanism needs signing, hashes, rollback and an explicit user flow.

## Verify

```sh
godot --headless --path . --import
godot --headless --path . --quit-after 120
godot --headless --path . -- --self-test
```

The integration suite loads every registered scene, checks navigation and Android back handling, verifies saved settings and read-only logs, and exercises updater success/offline/HTTP/schema/version branches without relying on a network connection. It restores prior appearance settings; it leaves test events in the local log.

For reproducible portrait screenshots on Linux (with a display or Xvfb), the development-only `--screenshot-home` and `--screenshot-settings` flags save the viewport to `/workspace/blacknode-launcher-shots/`. Create that directory first. Debug screenshot/self-test entry points are not run by normal startup.

## Export

Install the **4.7.2.stable** export templates through Godot’s template manager, then:

```sh
mkdir -p build/web build/android
godot --headless --path . --export-release Web build/web/index.html
# After configuring an Android SDK, JDK and local debug/release keystore:
godot --headless --path . --export-debug Android build/android/blacknode-launcher.apk
```

Web is single-threaded Compatibility/WebGL 2: it does not require cross-origin isolation headers. Serve `build/web/` through HTTP for local testing (e.g. `python3 -m http.server --directory build/web 8000`), and HTTPS in production; do not open `index.html` with `file://`. Host the entire output directory together, with `.wasm` served as `application/wasm`. WebGPU is not required. This repository does not enable GitHub Pages or publish the build.

Android preset: `dev.blacknode.launcher`, arm64, portrait, internet permission for manual update checks. Set Android SDK/JDK paths in Godot Editor Settings → Export → Android; configure signing locally. Release distribution requires a release keystore. No SDK or keystore is shipped, and build products/signing credentials are ignored by Git. Physical Oppo testing and Android packaging remain separate acceptance steps when the SDK/device are available.
