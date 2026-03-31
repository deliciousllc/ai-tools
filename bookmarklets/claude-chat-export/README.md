# AI Chat Export

One-click export of Claude.ai and ChatGPT conversations as Markdown transcript files.

## Install

### Safari (via Userscripts)

1. Install [Userscripts](https://apps.apple.com/us/app/userscripts/id1463298887) from the Mac App Store (free)
2. Enable it in Safari > Settings > Extensions
3. Set the Userscripts save location to this directory (`bookmarklets/claude-chat-export/`)
4. Refresh any claude.ai or chatgpt.com conversation page — a purple **Export** button appears in the bottom-right corner

### Chrome, Brave, Edge, and other Chromium browsers (via bookmarklet)

1. Open `install.html` in your browser
2. Make sure your bookmarks bar is visible (View > Show Bookmarks Bar)
3. Drag the **Export Chat** button to your bookmarks bar

## Supported Platforms

| Platform | URL Pattern | Auth |
|----------|-------------|------|
| Claude.ai | `claude.ai/chat/{id}` or `claude.ai/organization/{org}/chat/{id}` | Session cookie |
| ChatGPT | `chatgpt.com/c/{id}` | Session cookie + bearer token (automatic) |

## Usage

1. Open any conversation on [claude.ai](https://claude.ai) or [chatgpt.com](https://chatgpt.com)
2. Click **Export** (Safari) or **Export Chat** (bookmarklet)
3. Confirm or edit the date and slug when prompted
4. A `.md` file downloads automatically

## Output

**Filename:** `YYYY-MM-DD_Chat_Transcript_Slug.md`

Each file contains:
- YAML frontmatter (`type`, `source`, `conversation_id`, `exported`, `date`, `slug`, `title`)
- Timestamped `## Human` / `## Assistant` message sections

The `source` field reflects the originating platform (`claude.ai` or `chatgpt.com`).

## Known Limitations

- Uses undocumented internal APIs — may break if Claude or OpenAI change them
- Thinking blocks (Claude) are not included
- Images, file uploads, and artifacts are not included
- ChatGPT conversations with branches export only the currently visible branch
- Tested on macOS Safari (via Userscripts) and Chromium-based browsers (via bookmarklet)
- **Brave:** If nothing happens, try lowering Shields for the site
- Safari userscript now watches SPA navigation, so the button should reappear as Claude or ChatGPT changes routes without a full page reload

## Files

- `Claude Chat Export.user.js` — Userscripts source (Safari)
- `claude-chat-export.js` — Standalone source (for console use or bookmarklet minification)
- `install.html` — Drag-to-install page for Chromium-based browsers
