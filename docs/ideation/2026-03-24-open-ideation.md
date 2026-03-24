---
date: 2026-03-24
topic: open-ideation
focus: open-ended
---

# Ideation: ai-tools Plugin Improvements

## Codebase Context

**Project shape:** Pure Markdown/JSON Claude Code plugin — no application code, no build system, no tests. Distributed via Claude Code marketplace (`.claude-plugin/plugin.json`, `marketplace.json`).

**Layout:**
- `skills/` — 4 SKILL.md files: `start-session`, `wrap-up` (Claude Code), `start-session-codex`, `wrap-up-codex` (Codex CLI)
- `dotfiles/` — `.zshrc`, `ghostty/config`
- `.claude-plugin/plugin.json` — plugin manifest (v1.0.0, hardcoded)
- `marketplace.json` — marketplace registration
- `README.md` — install and usage docs
- No CLAUDE.md, no tests, no CI, no changelog

**Notable patterns:**
- Each workflow concept has two parallel implementations (Claude + Codex) with ~80% prose overlap
- Skills are declarative Markdown instructions — no executable code
- Cross-LLM collaboration is a first-class concern

**Key pain points:**
- Skills in the repo are **copies** of working skills in `~/.claude/skills/` — manual sync burden, already drifted (repo missing Cross-LLM step in start-session)
- No CLAUDE.md for the repo itself
- `.zshrc` has macOS-only flags with "replace on Linux" comment — silent breakage on WSL
- Plugin version frozen at 1.0.0 with no release strategy
- Marketplace install path (README Option A) may never have been tested end-to-end
- `docs/` directory exists but is empty — cross-LLM framework docs live outside the repo

**Past learnings:**
- Cross-LLM design changes should involve Codex in the review (feedback memory)
- Plugin registry files use absolute paths — not portable across machines
- `/setup-multi-llm` skill is planned but unbuilt
- The `~/.agents/skills/` directory is the shared skill layer used by both Claude and Codex via symlinks

## Ranked Ideas

### 1. Symlink-Based Install — Make the Repo the Source of Truth
**Description:** Replace the copy-sync model with symlinks. The ai-tools repo becomes the canonical install source — skills are symlinked into `~/.agents/skills/` (or directly into `~/.claude/skills/` and `~/.codex/skills/`). Edits to repo files are instantly live. No sync step needed.
**Rationale:** Eliminates the root cause of the project's biggest pain point. Drift between repo and working copies is already real (start-session is missing the Cross-LLM step in the repo). Symlinks are the established pattern — every other skill in `~/.claude/skills/` is already a symlink to `~/.agents/skills/`.
**Downsides:** Needs verification that Claude Code's skill loader follows symlinks (likely yes, given existing symlinks work). Ties the live install to a specific filesystem path.
**Confidence:** 90%
**Complexity:** Low
**Status:** Explored (brainstorm 2026-03-24)

### 2. Verify and Fix the Marketplace Install Path
**Description:** Test whether Option A in the README (`/plugin marketplace add deliciousllc/ai-tools`) actually works end-to-end. The `marketplace.json` uses `"source": "."` (relative path) and no ai-tools entry exists in `installed_plugins.json` even on the author's machine. Either fix it or remove it.
**Rationale:** A correctness issue, not an enhancement. A broken primary install path actively misleads anyone who follows the README. The marketplace approach is a stronger distribution model than manual copies if it works.
**Downsides:** May require understanding Claude Code's marketplace resolution internals. If the path is unfixable, Option A gets removed and the README simplifies.
**Confidence:** 85%
**Complexity:** Low
**Status:** Unexplored

### 3. Add CLAUDE.md to the Repo
**Description:** Create a CLAUDE.md documenting: the repo's structure, the sync relationship between working skills and repo skills, authoring conventions for skills, and what to check before committing.
**Rationale:** Every other active project has one. Without it, Claude operating on ai-tools has no in-repo context about how the repo works — the knowledge lives only in external memory files. Ironic for a plugin that teaches other projects to maintain CLAUDE.md files.
**Downsides:** None meaningful. One-time effort, low maintenance.
**Confidence:** 95%
**Complexity:** Low
**Status:** Unexplored

### 4. Platform-Conditional Dotfiles
**Description:** Replace the macOS-only `ls -AFG` alias (with its "replace on Linux" comment) with `$OSTYPE` detection that selects the right flags automatically. Same for `ll` and any other platform-split lines.
**Rationale:** WSL is the primary dev machine, but the dotfile defaults to macOS flags. Anyone sourcing the `.zshrc` on Linux gets silently broken color output. The fix is ~3 lines of shell.
**Downsides:** Minimal. Slightly more complex `.zshrc`, but the conditional pattern is standard.
**Confidence:** 95%
**Complexity:** Low
**Status:** Unexplored

### 5. Ship Cross-LLM Framework as Templates
**Description:** Populate the empty `docs/` directory (or a `templates/` directory) with the collaboration framework files: an AGENTS.md template, a shared-learnings.md starter, and the cross-llm-collaboration.md reference doc. Inert, copyable files — not a skill, not a build step.
**Rationale:** The cross-LLM framework is the repo's most novel and transferable asset, but it exists nowhere in the actual deliverable. The `docs/` directory is empty. The framework docs live in `/Users/joshumami/Projects/docs/` — outside the repo. Shipping them as templates makes the repo's differentiator actually accessible.
**Downsides:** Templates may drift from the live framework docs (same copy problem, but templates change less frequently than skills).
**Confidence:** 75%
**Complexity:** Low
**Status:** Unexplored

### 6. `~/.agents/skills/` Registration
**Description:** Register ai-tools skills in the shared `~/.agents/skills/` directory that both Claude Code and Codex already use via symlinks. One registration, both tools get access — and any future tool that adopts the convention gets it for free.
**Rationale:** The convention already exists and is active — every installed skill in `~/.claude/skills/` and `~/.codex/skills/` is a symlink to `~/.agents/skills/`. ai-tools is the only set of skills that bypasses this layer. Directly compounds idea #1.
**Downsides:** Ties into a convention that may not be officially documented or stable. Overlaps significantly with idea #1 — may be the same idea in practice.
**Confidence:** 70%
**Complexity:** Low
**Status:** Unexplored

## Rejection Summary

| # | Idea | Reason Rejected |
|---|------|-----------------|
| 1 | Single-source skill with tool sections | Fights the platform — Claude and Codex have different loader formats; coupling creates awkward conditionals |
| 2 | Build /setup-multi-llm skill | Backlog item needing a spec, not an improvement idea; tiny audience |
| 3 | Semantic versioning + changelog | Process ceremony that outweighs value at 7 commits and a small sharing group |
| 4 | Skill frontmatter for Claude variants | Claude's loader doesn't require it — decorative metadata with no runtime impact |
| 5 | SessionStart hook for auto-context | Auto-injecting into every session is ambient pollution; explicit invocation is a feature |
| 6 | Install script (install.sh) | Superseded by symlinks — if symlinks work, install is a one-liner |
| 7 | Multi-tool manifests (Gemini, Cursor) | Premature — haven't solved the two-tool problem yet |
| 8 | Automated drift detection (CI) | Symptom treatment — symlinks eliminate drift by design |
| 9 | session-state.md convention | Adds another persistence layer competing with git log and memory system |
| 10 | Machine-readable handoff (JSON) | Distributed systems trust problem at personal-dev scale — not justified |
| 11 | Async wrap-up staging file | Adds async coordination protocol to a synchronous workflow |
| 12 | Project-specific context injection | Belongs in each project's CLAUDE.md, not in a shared plugin skill |
| 13 | Skill drift detector | Moot if symlinks are adopted |
| 14 | Invert sync (pull from live) | Wrong data flow — edits in managed directories with no review step |

## Session Log
- 2026-03-24: Initial ideation — 48 raw candidates generated across 6 frames, 20 unique after dedupe, 6 survivors after adversarial filtering
- 2026-03-24: Idea #1 (Symlink-based install) selected for brainstorm
