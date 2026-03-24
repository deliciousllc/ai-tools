---
title: "refactor: Switch to symlink-based skill installation"
type: refactor
status: completed
date: 2026-03-24
origin: docs/brainstorms/2026-03-24-symlink-install-requirements.md
---

# Switch to Symlink-Based Skill Installation

## Overview

Replace the unused plugin/marketplace infrastructure with direct symlinks from each tool's skill directory to the ai-tools repo. This eliminates copy-sync drift and makes repo edits immediately live.

## Problem Statement / Motivation

The ai-tools repo maintains skills as physical copies that must be manually synced to working locations. The plugin/marketplace install path (Option A) was never actually used — no entries exist in `installed_plugins.json` or `known_marketplaces.json` on either machine. Skills have already drifted between the repo and working copies. Every other skill on the system uses symlinks; ai-tools is the outlier. (see origin: `docs/brainstorms/2026-03-24-symlink-install-requirements.md`)

## Proposed Solution

Direct symlinks from each tool's skill directory to the repo's skill directories. No `~/.agents/skills/` intermediary — the repo has tool-specific variants that don't fit the one-SKILL.md-per-concept model of the shared layer. (see origin: Key Decisions)

**Symlink targets:**

| Tool | Skill dir symlink | Points to (repo) |
|------|-------------------|-------------------|
| Claude | `~/.claude/skills/start-session` | `<repo>/skills/start-session/` |
| Claude | `~/.claude/skills/wrap-up` | `<repo>/skills/wrap-up/` |
| Codex | `~/.codex/skills/start-session` | `<repo>/skills/start-session-codex/` |
| Codex | `~/.codex/skills/wrap-up` | `<repo>/skills/wrap-up-codex/` |

**Symlink style:** Absolute paths for both tools. Simpler to reason about, already the Codex convention. The README documents platform-specific paths since Mac and WSL differ.

## Acceptance Criteria

- [ ] Plugin infrastructure removed (`.claude-plugin/`, `marketplace.json`)
- [ ] Repo skill content reviewed and updated if stale (R4)
- [ ] Symlinks created on Mac for all 4 skill targets
- [ ] `/start-session` and `/wrap-up` invocable in Claude Code (no namespace prefix)
- [ ] `start-session` and `wrap-up` invocable in Codex
- [ ] README accurately describes symlink install for Mac and WSL/Linux (WSL commands marked as untested until verified on WSL)
- [ ] `skills/README.md` updated to reflect symlink model
- [ ] Editing a SKILL.md in the repo is immediately reflected when invoking the skill

## Implementation Phases

### Phase 1: Verify and Sync Skill Content (R4)

WSL is the primary dev machine and may have live working copies that are ahead of the repo. Before the repo becomes the canonical source, we must verify it has the correct content.

**Tasks:**
- [ ] Check WSL for live skill copies: `ssh Workbox-WSL 'ls -la ~/.claude/skills/ ~/.codex/skills/ 2>/dev/null | grep -E "start-session|wrap-up"'`
- [ ] If live copies exist on WSL, diff them against the repo versions and merge any newer content into the repo
- [ ] If no live copies exist on either machine, treat the repo as the baseline
- [ ] Read all 4 SKILL.md files in the repo and confirm they are correct
- [ ] Fix any obvious issues found during review — but do not rewrite skill content (out of scope)
- [ ] **Do not proceed to Phase 2 until skill content is confirmed correct on both machines** — symlinks will point here

**Files:** `skills/start-session/SKILL.md`, `skills/wrap-up/SKILL.md`, `skills/start-session-codex/SKILL.md`, `skills/wrap-up-codex/SKILL.md`

### Phase 2: Remove Plugin Infrastructure (R2)

**Tasks:**
- [ ] Delete `.claude-plugin/` directory (contains `plugin.json`)
- [ ] Delete `marketplace.json`
- [ ] Remove plugin references from README intro (line 3: "Includes Claude Code plugin support")
- [ ] Remove Requirements section reference to "Claude Code CLI with plugin support"

**Files to delete:** `.claude-plugin/plugin.json`, `marketplace.json`

### Phase 3: Create Symlinks on Mac (R1)

**Preflight:** Before creating symlinks, check for and remove any existing entries (copies, broken symlinks, or conflicting dirs) at the target paths. This ensures the install works for both fresh setups and migrations from copied skills.

**Tasks:**
- [ ] Preflight check and cleanup:
  ```bash
  # Check for existing entries at all 4 target paths
  for target in ~/.claude/skills/start-session ~/.claude/skills/wrap-up ~/.codex/skills/start-session ~/.codex/skills/wrap-up; do
    if [ -e "$target" ] || [ -L "$target" ]; then
      echo "EXISTS: $target ($(file "$target"))"
    fi
  done
  # Remove any existing entries (back up first if they are real dirs with content)
  ```
- [ ] Create Claude symlinks:
  ```bash
  ln -s /Users/joshumami/Projects/ai-tools/skills/start-session /Users/joshumami/.claude/skills/start-session
  ln -s /Users/joshumami/Projects/ai-tools/skills/wrap-up /Users/joshumami/.claude/skills/wrap-up
  ```
- [ ] Create Codex symlinks:
  ```bash
  ln -s /Users/joshumami/Projects/ai-tools/skills/start-session-codex /Users/joshumami/.codex/skills/start-session
  ln -s /Users/joshumami/Projects/ai-tools/skills/wrap-up-codex /Users/joshumami/.codex/skills/wrap-up
  ```
- [ ] Verify symlinks resolve: `ls -la ~/.claude/skills/ | grep -E "start-session|wrap-up"` and same for `~/.codex/skills/`
- [ ] Test Claude invocation: open a Claude Code session, run `/start-session`, confirm it loads the skill
- [ ] Test Codex invocation: open a Codex session, invoke `start-session`, confirm it loads the skill

**Note:** Codex symlink maps `start-session-codex/` in the repo to `start-session` in `~/.codex/skills/` — the `-codex` suffix is a repo convention, not the invocation name.

### Phase 4: Update README (R3 + R5)

**Tasks:**
- [ ] Rewrite intro paragraph — no longer a "plugin"; it's a skill + dotfile repo
- [ ] Replace Option A (plugin install) with new Option A (Claude Code symlink install)
  - Show Mac and Linux/WSL commands separately
  - Use absolute paths with clear "adjust to your repo location" note
- [ ] Replace Option B (Codex manual copy) with new Option B (Codex symlink install)
  - Same platform split
  - Note the `-codex` → `start-session` name mapping
- [ ] Keep Option C (dotfiles) largely as-is, renumbered if needed
- [ ] Update Requirements section to reflect symlink model
- [ ] Add brief "Uninstall" section: `rm ~/.claude/skills/start-session` etc. (note: `rm` on a symlink removes the link, not the target)
- [ ] README install commands should include a preflight removal step (`rm -f <target>` before `ln -s`) so they work for both fresh installs and migrations from copied skills

**README path differences:**

| Platform | Repo path | Claude skills | Codex skills |
|----------|-----------|---------------|--------------|
| macOS | `/Users/<user>/Projects/ai-tools/` | `~/.claude/skills/` | `~/.codex/skills/` |
| WSL/Linux | `/home/<user>/projects/ai-tools/` | `~/.claude/skills/` | `~/.codex/skills/` |

- [ ] Update `skills/README.md` to mention symlink model and remove any plugin references

### Phase 5: Cleanup and Commit

**Tasks:**
- [ ] Verify no remaining references to plugin/marketplace in any file
- [ ] Update memory file `ai-tools.md` to reflect new install model
- [ ] Commit all changes
- [ ] Push to GitHub

**Deferred to follow-up:**
- WSL symlink creation, state cleanup, and verification of WSL-specific README commands
- Codex review of Codex-specific install instructions (per feedback memory: involve other tools in cross-LLM design)
- Remove "untested" caveat from WSL README commands once verified on WSL

## Dependencies & Prerequisites

- The ai-tools repo must be cloned to a stable path on each machine (symlinks break if repo moves)
- Both `~/.claude/skills/` and `~/.codex/skills/` accept symlinked directories (confirmed: all existing skills use this pattern)
- No existing ai-tools skills to migrate on this Mac (confirmed: fresh install)

## Scope Boundaries

- Not merging Claude and Codex skill variants into a single file (see origin: Scope Boundaries)
- Not adding an install script — symlink commands in README are sufficient (see origin: Key Decisions)
- Not changing skill content beyond what's needed to fix drift
- Not restructuring the repo's directory layout
- WSL symlink creation and full verification deferred to follow-up — but Phase 1 checks WSL for live skill copies before declaring the repo baseline

## Sources

- **Origin document:** [docs/brainstorms/2026-03-24-symlink-install-requirements.md](docs/brainstorms/2026-03-24-symlink-install-requirements.md) — key decisions: direct symlinks over ~/.agents/ layer, drop plugin infrastructure, no install script
- **Ideation:** [docs/ideation/2026-03-24-open-ideation.md](docs/ideation/2026-03-24-open-ideation.md) — idea #1 ranked highest
- **Existing symlink convention:** `~/.claude/skills/` and `~/.codex/skills/` on this Mac
- **Feedback memory:** `feedback_cross_llm_design.md` — involve Codex in cross-LLM design changes
