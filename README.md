# ai-tools

A collection of AI coding assistant skills and dev environment configs. Includes [Claude Code](https://docs.anthropic.com/en/docs/claude-code) plugin support, Codex-native skill variants, and standalone dotfiles you can cherry-pick manually.

## What's Inside

### Skills

This repo currently includes:

- **Claude Code skills** for plugin-based use inside Claude Code
- **Codex-native skill ports** for workflows that are similar in intent but tailored to Codex

Both tools share two workflow concepts, but each version is tailored to its tool's strengths:

**start-session** — Rebuilds context at the beginning of a session and produces a briefing before any work starts.

- **Claude Code** (`/start-session`): Loads persistent memory (user prefs, feedback, project context), scans cross-LLM learnings, and checks git state.
- **Codex** (`start-session` skill): Reads workspace instructions (`AGENTS.md`, `CLAUDE.md`), rebuilds git context, checks recent verification signals, and summarizes what's in progress.

Both output a structured briefing and wait for the user to confirm direction.

**wrap-up** — Captures learnings and leaves the workspace easy to resume.

- **Claude Code** (`/wrap-up`): Updates persistent memory, appends cross-tool discoveries to `docs/shared-learnings.md`, proposes CLAUDE.md revisions, and cleans stale memory. All changes require approval.
- **Codex** (`wrap-up` skill): Verifies what actually changed (re-checks git and tests rather than relying on conversation), appends shared learnings, proposes instruction-file updates, and prepares a structured handoff summary with state, verified/pending items, and next action.

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

### Option A: Claude Code Plugin

This installs the Claude-facing skills so Claude can use them in any project.

```bash
# Add the marketplace (one time):
/plugin marketplace add deliciousllc/ai-tools

# Install the plugin:
/plugin install ai-tools@ai-tools
```

Skills will be available as `/ai-tools:start-session` and `/ai-tools:wrap-up`.

To update later, the marketplace refreshes automatically on Claude Code startup.

### Option B: Codex Manual Install

Codex does not use the Claude plugin marketplace. Clone the repo, then copy or symlink the Codex-native skill folders from `skills/` into your Codex skills directory:

```bash
git clone https://github.com/deliciousllc/ai-tools.git
cd ai-tools

mkdir -p ~/.codex/skills/start-session
cp skills/start-session-codex/SKILL.md ~/.codex/skills/start-session/SKILL.md

mkdir -p ~/.codex/skills/wrap-up
cp skills/wrap-up-codex/SKILL.md ~/.codex/skills/wrap-up/SKILL.md
```

If you prefer, you can symlink those folders instead of copying them.

### Option C: Just grab the dotfiles

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

## Requirements

- **Claude Code skills**: [Claude Code](https://docs.anthropic.com/en/docs/claude-code) CLI with plugin support
- **Codex skills**: Codex CLI with support for local skills in `~/.codex/skills/`
- **Zsh config**: zsh shell (default on macOS, common on Linux)
- **Ghostty config**: [Ghostty](https://ghostty.org) terminal emulator
