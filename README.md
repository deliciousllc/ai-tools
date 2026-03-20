# ai-tools

A collection of [Claude Code](https://docs.anthropic.com/en/docs/claude-code) skills and dev environment configs. Designed to be installed as a Claude Code plugin or cherry-picked manually.

## What's Inside

### Claude Code Skills

**wrap-up** — End-of-session housekeeping. Run `/wrap-up` before closing a session where meaningful work was done. It:

1. **Updates memory** — Reviews the conversation for insights about the user, feedback on approach, project context, or external references worth persisting
2. **Revises CLAUDE.md** — Proposes concise additions for gotchas, env quirks, or workflow patterns discovered during the session
3. **Cleans stale memory** — Finds outdated, duplicate, or contradictory memories and proposes deletions

All changes are presented for approval before applying — nothing is modified silently.

### Dotfiles

#### Zsh (`.zshrc`)

A curated set of shell aliases, functions, and a customizable prompt theme:

- **Navigation** — `..`, `...`, `..3`, `..4` for quick directory traversal
- **Python** — `py`, `py-v` (create + activate venv), `py-freeze`, `py-test`
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

### Option A: Claude Code Plugin (recommended)

This installs the skills so Claude can use them in any project.

```bash
# Add the marketplace (one time):
/plugin marketplace add deliciousllc/ai-tools

# Install the plugin:
/plugin install ai-tools@ai-tools
```

Skills will be available as `/ai-tools:wrap-up`.

To update later, the marketplace refreshes automatically on Claude Code startup.

### Option B: Clone and reference locally

```bash
git clone https://github.com/deliciousllc/ai-tools.git
/plugin marketplace add ./ai-tools
```

### Option C: Just grab the dotfiles

No Claude Code required — clone the repo and copy what you want:

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

## Requirements

- **Skills**: [Claude Code](https://docs.anthropic.com/en/docs/claude-code) CLI with plugin support
- **Zsh config**: zsh shell (default on macOS, common on Linux)
- **Ghostty config**: [Ghostty](https://ghostty.org) terminal emulator
