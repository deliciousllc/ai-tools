# Claude Chat Export Bookmarklet

Exports the current Claude.ai conversation as a Markdown file with YAML frontmatter.

## Install

1. Open `install.html` in your browser (open the file locally — no server needed)
2. Make sure your bookmarks bar is visible:
   - **Safari:** View > Show Bookmarks Bar
   - **Brave:** View > Show Bookmarks Bar (or `Ctrl+Shift+B` / `Cmd+Shift+B`)
3. Drag the **Export Chat** button to your bookmarks bar

## Usage

1. Open any conversation on [claude.ai](https://claude.ai)
2. Click the **Export Chat** bookmark
3. Confirm or edit the date (`YYYY-MM-DD`) and slug when prompted
4. The `.md` file downloads automatically

## Output

**Filename format:** `YYYY-MM-DD_Chat_Transcript_Slug.md`

Each file contains:
- YAML frontmatter with `type`, `source`, `conversation_id`, `exported`, `date`, `slug`, and `title`
- Conversation body as `## Human` / `## Assistant` sections in Markdown

## Known Limitations

- Uses an internal Claude.ai API — may break if Anthropic changes the API
- Internal `thinking` blocks are filtered out (not included in the export)
- Artifacts appear as placeholder text (`[tool_use block]` / `[tool_result block]`)
- Inline images are not included
- Tested on Safari and Brave; other browsers may vary
- **Brave Shields:** If nothing happens in Brave, try lowering Shields for claude.ai

## Source

- Readable source: `claude-chat-export.js`
- Minified bookmarklet URL: embedded in `install.html`
