import { initInstallApp } from "./app.js";

// Entry point. index.html is intentionally just a mount point.
const rootEl = document.getElementById("appCtn");
if (rootEl) {
  initInstallApp(rootEl);
} else {
  console.error("appCtn missing");
}
