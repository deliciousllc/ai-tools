# Skills Layout

This folder contains skill variants for two tools:

- **Unsuffixed** folders (`start-session/`, `wrap-up/`) — Claude Code skills
- **`*-codex/`** folders (`start-session-codex/`, `wrap-up-codex/`) — Codex CLI skills

Each workflow concept has a separate implementation per tool, tailored to that tool's strengths (Claude leverages persistent memory; Codex re-verifies workspace state).

## Installation

Skills are installed via **symlinks** from each tool's skill directory to this repo. See the root README for setup instructions. Edits to these files are immediately live — no copy or sync step needed.
