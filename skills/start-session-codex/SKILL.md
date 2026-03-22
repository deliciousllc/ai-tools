---
name: start-session
description: Use when starting a Codex session in an existing workspace, before changing code, reviewing a project, or resuming partially completed work.
---

# Start Session

Start by rebuilding accurate local context.

## When to Use

Use this at the beginning of a Codex session when you need to:

- resume work in a repo
- understand current branch and verification state
- pick up after Claude, Codex, or the user
- avoid duplicating work or missing unfinished changes

Do not use this for casual conversation with no workspace impact.

## Step 1: Read the Workspace Instructions

Check the instruction chain that governs the current workspace:

- `AGENTS.md`
- workspace `CLAUDE.md`
- project-level `CLAUDE.md`
- `docs/shared-learnings.md` if present

Summarize only the parts that change how you should work right now.

## Step 2: Rebuild Git Context

Run and summarize:

1. `git status --short`
2. `git log --oneline -10`
3. `git branch --show-current`
4. `git stash list`

If you are at a workspace root rather than a repo root, identify the active project first and inspect git there.

## Step 3: Check Recent Verification Signals

Look for evidence of the latest test, build, deploy, or debugging state.

Capture:

- what appears to be in progress
- what was recently completed
- what was verified versus only discussed
- any obvious blockers or waiting-on-user states

Prefer concrete evidence from files, logs, and git over inference.

## Step 4: Brief the User

Give a short session briefing with:

- current project and branch
- notable uncommitted or unpushed work
- recent meaningful changes
- important cross-tool or instruction-file context
- 1-3 sensible next directions

Do not start implementation until the user confirms direction, unless they already gave a direct task that should be executed immediately.
