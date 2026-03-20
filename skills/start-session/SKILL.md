# Start Session

Beginning-of-session skill that restores context and orients you to the current state of work.

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

If this isn't a git repo (e.g. the Projects root), check git state across active sub-projects instead.

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

### Suggested Starting Points
- [1-3 concrete things to pick up or address]
```

Ask the user what they'd like to work on. Do not start any work until they confirm direction.
