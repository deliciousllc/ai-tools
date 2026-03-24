---
date: 2026-03-24
topic: symlink-install
---

# Symlink-Based Install for ai-tools

## Problem Frame

The ai-tools plugin maintains skills as physical copies in the repo that must be manually synced to working locations. This has already caused drift — the repo's `start-session` is missing the Cross-LLM step that exists in the live working copy. The current plugin/marketplace install model (Option A) adds complexity without clear benefit for a small sharing group. Every other skill on the system uses symlinks; ai-tools is the outlier.

## Requirements

- R1. Skills are installed via symlinks from each tool's skill directory directly to the repo's skill directories. No intermediate `~/.agents/skills/` layer.
  - `~/.claude/skills/start-session` -> `<repo>/skills/start-session/`
  - `~/.claude/skills/wrap-up` -> `<repo>/skills/wrap-up/`
  - `~/.codex/skills/start-session` -> `<repo>/skills/start-session-codex/`
  - `~/.codex/skills/wrap-up` -> `<repo>/skills/wrap-up-codex/`
- R2. Remove the plugin/marketplace infrastructure (`.claude-plugin/`, `marketplace.json`, Option A install instructions). The repo is no longer a Claude Code plugin — it's a skill + dotfile repo installed via symlinks.
- R3. Update README install instructions to reflect the new model: clone the repo, run symlink commands (or a simple setup snippet). Separate sections for Claude, Codex, and dotfiles.
- R4. Sync the repo's skill content with the current live working copies before creating symlinks. The repo versions are stale — update them first so the symlinks point to current content.
- R5. Cross-platform: document the symlink commands for both macOS and WSL/Linux (paths differ).

## Success Criteria

- Editing a SKILL.md in the repo is immediately reflected when invoking the skill — no copy or sync step
- Skills are invocable as `/start-session` and `/wrap-up` (Claude) and `start-session`/`wrap-up` (Codex) — no namespace prefix
- The README accurately describes the install model and works on a fresh clone

## Scope Boundaries

- Not merging Claude and Codex skill variants into a single file (different tool conventions)
- Not adding an install script — symlink commands in the README are sufficient for this audience
- Not changing skill content beyond syncing to current live versions
- Not restructuring the repo's directory layout (keeping `start-session/`, `start-session-codex/`, etc.)

## Key Decisions

- **Direct symlinks over ~/.agents/ layer**: The shared `~/.agents/skills/` layer assumes one SKILL.md per concept. ai-tools has tool-specific variants, so direct symlinks per tool avoid that constraint.
- **Drop plugin infrastructure**: The marketplace/plugin model adds distribution complexity without matching the actual usage pattern (small group, git clone workflow). Symlinks are simpler and more reliable.
- **No install script**: The audience is small and technical. Symlink commands in the README are clear enough. An install script would be a new maintenance surface for marginal benefit.

## Dependencies / Assumptions

- The repo must be cloned to a stable filesystem path on each machine (symlinks break if the repo moves)
- Both `~/.claude/skills/` and `~/.codex/skills/` accept symlinked directories (confirmed: all existing skills use this pattern)

## Outstanding Questions

### Deferred to Planning
- [Affects R4][Needs research] What exactly has drifted between the repo skills and the live working copies? Need to diff and determine the correct merge direction.
- [Affects R5][Technical] Should the README include both relative and absolute symlink examples, or pick one style? (Claude uses relative, Codex uses absolute on this machine.)

## Next Steps

-> `/ce:plan` for structured implementation planning
