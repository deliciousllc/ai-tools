---
name: wrap-up
description: Use when ending a Codex session after meaningful work, before handing off, switching contexts, or leaving partially completed changes behind.
---

# Wrap Up

Close a session in a way that leaves the workspace easy to resume.

## When to Use

Use this before ending a session where you:

- changed code or docs
- ran tests or debugging steps worth recording
- discovered environment or deployment gotchas
- need to hand work back to the user or another tool

Do not use this for trivial chats with no workspace impact.

## Step 1: Verify What Actually Happened

Do not rely on memory. Re-check the workspace.

Run and summarize:

1. `git status --short`
2. the most relevant verification command(s) for the work, if they were run or should be rerun
3. any key runtime or deployment checks needed to support your handoff

Record facts only:

- what changed
- what was verified
- what was not verified
- what is still blocked or waiting on the user

## Step 2: Capture Durable Learnings

If `docs/shared-learnings.md` exists, append new cross-tool learnings that would help future Claude, Codex, or Gemini sessions.

Good shared learnings:

- deployment quirks
- environment gotchas
- debugging discoveries not obvious from the codebase
- corrections to assumptions that any tool might make

Do not add:

- routine code changes already visible in git
- one-off task chatter
- personal reminders only relevant to the current session

## Step 3: Review Instruction Files

Check whether the session revealed a durable workflow or environment rule that belongs in:

- `AGENTS.md`
- workspace `CLAUDE.md`
- project `CLAUDE.md`

Do not silently edit these. Propose concise changes and ask the user before applying them.

## Step 4: Prepare the Handoff

Leave the next session easy to start.

Summarize:

- current objective
- current branch and git state
- exact files changed
- exact verification evidence
- next recommended action
- any user-facing follow-up still needed

If the work is incomplete, state the next concrete command or check to run.

If the work is complete, state whether it was:

- implemented but not committed
- committed but not pushed
- pushed but not deployed
- deployed but awaiting confirmation

## Output

End with a compact wrap-up in this shape:

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
