# Start Session

Beginning-of-session skill that restores context and orients you to the current state of work. Run this when picking up where you left off or returning to a project after time away.

## Step 1: Review Memory

Read `MEMORY.md` and scan linked memory files for relevant context:

- **user**: Who is the user? What are their preferences, role, and knowledge level?
- **feedback**: Any approach corrections or confirmed patterns to follow?
- **project**: Ongoing work, decisions, deadlines, or blockers?
- **reference**: External systems or resources that may be relevant?

Summarize what you found in a few bullet points. Flag anything that looks stale or contradictory — but don't act on it yet (that's wrap-up's job).

## Step 2: Check Git State

Run the following and summarize what you find:

1. **`git status`** — Any uncommitted changes, staged files, or untracked work?
2. **`git log --oneline -10`** — What was worked on recently? When was the last commit?
3. **`git branch -a`** — What branch are we on? Any feature branches that look in-progress?
4. **`git stash list`** — Anything stashed and forgotten?

If this isn't a git repo, skip this step.

## Step 3: Check Open PRs and Issues

Run the following (skip if `gh` is not authenticated or the repo has no remote):

1. **`gh pr list --author @me`** — Any open PRs? Waiting on review?
2. **`gh pr list --search "review-requested:@me"`** — Anyone waiting on the user?
3. **`gh issue list --assignee @me`** — Any assigned issues?

Summarize anything that looks actionable.

## Step 4: Check CLAUDE.md

Read the project's `CLAUDE.md` (and any subdirectory ones). Look for:

- Recent additions that set context for current work
- Deployment notes or environment gotchas that might be relevant today
- Any TODOs or temporary notes left for future sessions

## Step 5: Scan for In-Progress Work

Look for signs of unfinished work:

- **TODO/FIXME/HACK comments** in recently modified files (`git diff --name-only HEAD~5` then scan those files)
- **Draft or WIP indicators** in PR titles
- **Incomplete migrations** (e.g., Alembic heads that haven't been applied)

## Output

Present a concise session briefing:

```
## Session Briefing

**Project**: [name and branch]
**Last activity**: [when and what]

### Memory Highlights
- [relevant user/feedback/project context]

### Git State
- [branch, uncommitted work, recent commits]

### Open Work
- [PRs, issues, stashed changes, TODOs]

### Suggested Starting Points
- [1-3 concrete things to pick up or address]
```

Ask the user what they'd like to work on. Do not start any work until they confirm direction.
