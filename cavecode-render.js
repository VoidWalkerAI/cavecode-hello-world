// CaveCode Renderer Engine v0.1
// Reads a CaveCode artifact and extracts tuning knobs + public text.

function extractValue(line) {
  const idx = line.indexOf(":");
  if (idx === -1) return null;
  let value = line.slice(idx + 1).trim();

  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1);
  }
  return value;
}

// Parse BLOCK 3 + BLOCK 4 into a config object
function parseCaveCode(text) {
  const cfg = {
    helloText: "Hello, CaveCode.",
    interactionText: "You just interacted with a CaveCode artifact.",
    titleText: "CaveCode — Hello World",
    footerCredits: "Forged with the CaveCode Protocol."
  };

  const lines = text.split("\n");
  for (let raw of lines) {
    const line = raw.trim();

    if (line.startsWith("HELLO_TEXT")) {
      const v = extractValue(line);
      if (v) cfg.helloText = v;

    } else if (line.startsWith("INTERACTION_TEXT")) {
      const v = extractValue(line);
      if (v) cfg.interactionText = v;

    } else if (line.startsWith("TITLE_TEXT")) {
      const v = extractValue(line);
      if (v) cfg.titleText = v;

    } else if (line.startsWith("FOOTER_CREDITS")) {
      const v = extractValue(line);
      if (v) cfg.footerCredits = v;
    }
  }
  return cfg;
}

// Apply config to the UI
function applyCaveCodeToUI(caveText) {
  const cfg = parseCaveCode(caveText);
  window.currentCaveConfig = cfg;

  document.getElementById("app-title").textContent = cfg.titleText;
  document.getElementById("app-message").textContent = cfg.helloText;
  document.getElementById("app-footer").textContent = cfg.footerCredits;

  const status = document.getElementById("app-status");
  if (status) status.textContent = "Loaded from CaveCode artifact.";

  return cfg;
}

// Interaction handler
function fireInteraction() {
  const cfg =
    window.currentCaveConfig ||
    parseCaveCode(document.getElementById("cavecode-input").value);

  document.getElementById("app-message").textContent =
    cfg.interactionText;

  const status = document.getElementById("app-status");
  if (status)
    status.textContent = "Interaction event fired from CaveCode behavior.";
}

// Reset handler
function resetCaveArtifact(defaultText) {
  const input = document.getElementById("cavecode-input");
  input.value = defaultText;
  applyCaveCodeToUI(defaultText);

  const status = document.getElementById("app-status");
  if (status)
    status.textContent = "Reset to canonical Hello World artifact.";
}
