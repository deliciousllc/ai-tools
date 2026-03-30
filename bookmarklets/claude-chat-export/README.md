# Claude Chat Export

One-click export of Claude.ai conversations as Markdown transcript files.

## Install

### Safari (via Userscripts)

1. Install [Userscripts](https://apps.apple.com/us/app/userscripts/id1463298887) from the Mac App Store (free)
2. Enable it in Safari > Settings > Extensions
3. Set the Userscripts save location to this directory (`bookmarklets/claude-chat-export/`)
4. Refresh any claude.ai conversation page — a purple **Export** button appears in the bottom-right corner

### Chrome, Brave, Edge, and other Chromium browsers (via bookmarklet)

1. Open `install.html` in your browser
2. Make sure your bookmarks bar is visible (View > Show Bookmarks Bar)
3. Drag the **Export Chat** button to your bookmarks bar

## Usage

1. Open any conversation on [claude.ai](https://claude.ai)
2. Click **Export** (Safari) or **Export Chat** (bookmarklet)
3. Confirm or edit the date and slug when prompted
4. A `.md` file downloads automatically

## Output

**Filename:** `YYYY-MM-DD_Chat_Transcript_Slug.md`

Each file contains:
- YAML frontmatter (`type`, `source`, `conversation_id`, `exported`, `date`, `slug`, `title`)
- Timestamped `## Human` / `## Assistant` message sections

Example:

```markdown
---
type: chat-transcript
source: claude.ai
conversation_id: abc-123
exported: 2026-03-30
date: 2026-03-29
slug: Chat_Export_Design
title: "Chat export design discussion"
---

## Human
*Mar 29, 2026, 3:42 PM*

Would it be possible to make an extension...

## Assistant
*Mar 29, 2026, 3:42 PM*

Great question — this touches on...
```

## Known Limitations

- Uses Claude.ai's internal API (undocumented, may break if Anthropic changes it)
- Thinking blocks are not included
- Images and file uploads are not included
- Tested on macOS Safari (via Userscripts) and Chromium-based browsers (via bookmarklet)
- **Brave:** If nothing happens, try lowering Shields for claude.ai

## Files

- `Claude Chat Export.user.js` — Userscripts source (Safari)
- `claude-chat-export.js` — Standalone source (for console use or bookmarklet minification)
- `install.html` — Drag-to-install page for Chromium-based browsers
