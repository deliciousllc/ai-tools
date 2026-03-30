# ai-tools

A collection of AI coding assistant skills and dev environment configs. Includes skills for [Claude Code](https://docs.anthropic.com/en/docs/claude-code) and [Codex CLI](https://github.com/openai/codex), plus standalone dotfiles you can cherry-pick.

## What's Inside

### Skills

Both tools share two workflow concepts, but each version is tailored to its tool's strengths:

**start-session** — Rebuilds context at the beginning of a session and produces a briefing before any work starts.

- **Claude Code** (`/start-session`): Loads persistent memory (user prefs, feedback, project context), scans cross-LLM learnings, and checks git state.
- **Codex** (`start-session` skill): Reads workspace instructions (`AGENTS.md`, `CLAUDE.md`), rebuilds git context, checks recent verification signals, and summarizes what's in progress.

Both output a structured briefing and wait for the user to confirm direction.

**wrap-up** — Captures learnings and leaves the workspace easy to resume.

- **Claude Code** (`/wrap-up`): Updates persistent memory, appends cross-tool discoveries to `docs/shared-learnings.md`, proposes CLAUDE.md revisions, and cleans stale memory. All changes require approval.
- **Codex** (`wrap-up` skill): Verifies what actually changed (re-checks git and tests rather than relying on conversation), appends shared learnings, proposes instruction-file updates, and prepares a structured handoff summary with state, verified/pending items, and next action.

### Bookmarklets

**Claude Chat Export** (`bookmarklets/claude-chat-export/`) — One-click export of Claude.ai conversations as Markdown transcript files with YAML frontmatter and timestamps. Works via [Userscripts](https://apps.apple.com/us/app/userscripts/id1463298887) extension on Safari, or as a drag-to-install bookmarklet on Chrome, Brave, Edge, and other Chromium browsers. See the [README](bookmarklets/claude-chat-export/README.md) for setup.

### Dotfiles

#### Zsh (`.zshrc`)

A curated set of shell aliases, functions, and a customizable prompt theme:

- **Navigation** — `..`, `...`, `..3`, `..4` for quick directory traversal
- **Git** — `g-a`, `g-c`, `g-po`, `g-st`, plus `g-ignore` to fetch `.gitignore` templates from GitHub
- **Claude Code** — `cr` clears scrollback and resumes the last session
- **Prompt theme** — Segmented prompt with directory, username, and Python venv indicator. Uses 256-color codes with inline docs explaining how to customize colors, add hostname, switch to full paths, etc.
- **`cheat`** — Type `cheat` to print a terminal keyboard shortcuts reference
- **`preexec` hook** — Adds a blank line before each command's output for visual breathing room

> **Note:** The `ls` aliases use macOS flags (`-G`). On Linux, replace `-G` with `--color=auto`.

#### Ghostty

Minimal [Ghostty](https://ghostty.org) terminal config:

- Dims unfocused split panes to 75% opacity with a black fill
- Black split dividers for a clean look

## Installation

Skills are installed via **symlinks** from each tool's skill directory to this repo. This means edits to skill files in the repo are immediately live — no copy or sync step needed.

### Option A: Claude Code Skills

Clone the repo, then create symlinks. Adjust the repo path to match your setup.

**macOS:**
```bash
git clone https://github.com/deliciousllc/ai-tools.git
cd ai-tools

# Remove any existing entries, then symlink
rm -rf ~/.claude/skills/start-session ~/.claude/skills/wrap-up
ln -s "$(pwd)/skills/start-session" ~/.claude/skills/start-session
ln -s "$(pwd)/skills/wrap-up" ~/.claude/skills/wrap-up
```

**WSL / Linux:**
```bash
git clone https://github.com/deliciousllc/ai-tools.git
cd ai-tools

# Remove any existing entries, then symlink
rm -rf ~/.claude/skills/start-session ~/.claude/skills/wrap-up
ln -s "$(pwd)/skills/start-session" ~/.claude/skills/start-session
ln -s "$(pwd)/skills/wrap-up" ~/.claude/skills/wrap-up
```

Skills will be available as `/start-session` and `/wrap-up`.

### Option B: Codex Skills

Clone the repo (if not already done), then symlink the Codex-native skill folders. Note: the repo uses a `-codex` suffix for Codex variants, but they're symlinked as `start-session` and `wrap-up` in Codex's skill directory.

**macOS:**
```bash
rm -rf ~/.codex/skills/start-session ~/.codex/skills/wrap-up
ln -s /path/to/ai-tools/skills/start-session-codex ~/.codex/skills/start-session
ln -s /path/to/ai-tools/skills/wrap-up-codex ~/.codex/skills/wrap-up
```

**WSL / Linux:**
```bash
rm -rf ~/.codex/skills/start-session ~/.codex/skills/wrap-up
ln -s /path/to/ai-tools/skills/start-session-codex ~/.codex/skills/start-session
ln -s /path/to/ai-tools/skills/wrap-up-codex ~/.codex/skills/wrap-up
```

Replace `/path/to/ai-tools` with the actual path to your clone.

### Option C: Just the Dotfiles

No Claude Code or Codex setup required. Clone the repo and copy what you want:

```bash
git clone https://github.com/deliciousllc/ai-tools.git
cd ai-tools

# Zsh — review and merge into your existing .zshrc:
cat dotfiles/.zshrc

# Ghostty — copy to config location:
#   macOS:
cp dotfiles/ghostty/config ~/Library/Application\ Support/com.mitchellh.ghostty/config
#   Linux:
cp dotfiles/ghostty/config ~/.config/ghostty/config
```

## Uninstall

To remove skills, delete the symlinks (this removes the link, not the repo files):

```bash
# Claude Code
rm ~/.claude/skills/start-session ~/.claude/skills/wrap-up

# Codex
rm ~/.codex/skills/start-session ~/.codex/skills/wrap-up
```

## Updating

Since skills are symlinked to the repo, updating is just a `git pull`:

```bash
cd /path/to/ai-tools
git pull
```

Changes are immediately live — no reinstall needed.

## Requirements

- **Claude Code skills**: [Claude Code](https://docs.anthropic.com/en/docs/claude-code) CLI with `~/.claude/skills/` directory
- **Codex skills**: Codex CLI with support for local skills in `~/.codex/skills/`
- **Zsh config**: zsh shell (default on macOS, common on Linux)
- **Ghostty config**: [Ghostty](https://ghostty.org) terminal emulator
