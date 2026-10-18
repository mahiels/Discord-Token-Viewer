# Discord Token Viewer

A Firefox addon that retrieves and copies your Discord authentication token from an active Discord tab.

## Requirements

- Firefox **133.0 or later**
- Works on other browsers

## Installation

1. Download and unzip `token-viewer.zip`
2. Open Firefox and go to `about:debugging`
3. Click **This Firefox** in the left sidebar
4. Click **Load Temporary Add-on...**
5. Navigate to the unzipped folder and select `manifest.json`

> **Note:** Temporary add-ons are removed when Firefox is closed. To keep it permanently, the extension would need to be signed via [addons.mozilla.org](https://addons.mozilla.org).

## Usage

1. Open [discord.com](https://discord.com) in a tab and log in
2. Click the extension icon in the Firefox toolbar
3. Click **Get Token** — your token will appear in the input field
4. Click **Copy** to copy it to your clipboard

## Files

```
token-viewer/
├── manifest.json   # Extension configuration
├── popup.html      # Popup UI
└── popup.js        # Token retrieval logic
```

## How It Works

The addon injects a script into the Discord page's main JavaScript context to search for the authentication token via:

1. `localStorage` (older Discord clients)
2. Discord's webpack module registry via `getToken()` (modern Discord)
3. Embedded iframes as a fallback

## Permissions

| Permission | Reason |
|---|---|
| `activeTab` | Access the currently open Discord tab |
| `scripting` | Inject the token retrieval script |
| `clipboardWrite` | Copy the token to your clipboard |

## Disclaimer

Your token grants full access to your Discord account. Do not share it with anyone. This tool is intended for personal use only.
