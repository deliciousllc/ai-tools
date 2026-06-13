---
name: wrap-up
description: Use when ending a session after meaningful work, before handing off context to the user or another tool. Skip for trivial chats with no workspace impact.
model: sonnet
---

# Wrap Up Session

> Codex note: the Codex-native version of this command lives in `skills/wrap-up-codex/`.

End-of-session skill. Verifies what happened, captures durable learnings, proposes instruction-file edits, and produces a compact handoff. Designed to stay cheap — does **not** re-read the whole memory tree by default.

## Step 1: Verify What Happened

Don't trust your memory of the session. Re-check the workspace.

Run and summarize:

1. `git status --short`
2. The most relevant verification command(s) for the work — re-run them if they should pass now, or note they were never run.

Record facts only: what changed, what was verified, what was *not* verified, what's blocked or waiting on the user.

## Step 2: Capture New Memories

Review the conversation for information worth persisting across sessions. Categories:

- **user**: New insights about the user's role, preferences, or knowledge?
- **feedback**: Did the user correct your approach in a way that should carry forward? Include **Why** and **How to apply**.
- **project**: New facts about ongoing work, decisions, or deadlines? Convert relative dates to absolute.
- **reference**: New external resources or system locations discovered?

For each candidate memory:

1. Scan **MEMORY.md** (already in your context — no extra read needed) for a related entry by topic or title.
2. **If MEMORY.md shows no near-duplicate**, write a new memory file under the project memory path and add a one-line pointer to MEMORY.md.
3. **If MEMORY.md shows a near-duplicate**, open *only that one* linked file and update it.

**Do NOT** open linked memory files speculatively, audit the full tree, or chase pointers "just to be safe." That's the optional cleanup mode below.

**Do NOT save:**

- Code patterns, architecture, or file paths derivable from the codebase
- Git history or recent changes (use `git log`)
- Debugging solutions (the fix is in the code)
- Anything already in CLAUDE.md
- Ephemeral task details only relevant to this session

## Step 3: Update Shared Learnings

If `docs/shared-learnings.md` exists in the workspace, append cross-tool discoveries that would help future Claude, Codex, or Gemini sessions. Good entries: deployment quirks, environment gotchas, debugging discoveries not obvious from the codebase, corrections to assumptions any tool might make. Use the file's header template. Do not edit or reorganize existing entries.

Skip this step if the file doesn't exist. Skip discoveries that are only relevant to Claude — those go in memory.

## Step 4: Propose CLAUDE.md Edits

Scan the session for durable workflow or environment rules — discovered commands, environment quirks, code-style decisions, gotchas likely to recur.

If you find any, locate the right CLAUDE.md (workspace, project, or subdirectory) and propose **one line per concept** as a diff. Do not silently edit. Ask the user to approve before applying.

**Do NOT add:**

- Verbose explanations or obvious information
- One-off fixes unlikely to recur
- Anything already covered by memory files

## Step 5: Compact Handoff

End the session with this block:

```markdown
## Wrap-Up

**State**: [one-line status]

**Changed**
- [high-signal file or behavior changes]

**Verified**
- [commands run and what they proved]

**Pending**
- [open risk, blocked item, or "none"]

**Next**
- [single best next action]
```

If work is complete, say which: implemented but not committed / committed but not pushed / pushed but not deployed / deployed but awaiting confirmation.

## Optional: Stale Memory Audit

**Run only if the user explicitly asks for memory cleanup** (e.g., "audit my memories", "clean up MEMORY.md", "/wrap-up --clean"). Otherwise skip — this step exists, but it is not part of a default wrap-up.

Read MEMORY.md and the linked files. Look for:

- **Outdated info**: merged branches, completed TODOs, resolved temporary state
- **Duplicates**: multiple memories covering the same topic
- **Contradictions**: memories that conflict with current CLAUDE.md or each other
- **Violations**: code patterns, architecture, or paths that belong in the codebase, not memory

Present proposed deletions or updates as a list and ask before applying.
