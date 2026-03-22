# Wrap Up Session

> Codex note: the Codex-native version of this command lives in `skills/wrap-up-codex/`.

End-of-session skill that captures learnings and keeps memory clean. Run this before ending any session where meaningful work was done.

## Step 1: Update Memory

Review the conversation for new information worth persisting across sessions. Check each category:

- **user**: New insights about the user's role, preferences, or knowledge?
- **feedback**: Did the user correct your approach in a way that should carry forward?
- **project**: New facts about ongoing work, decisions, or deadlines? Convert relative dates to absolute.
- **reference**: New external resources or system locations discovered?

For each memory worth saving:
1. Check `MEMORY.md` — does a related memory already exist? Update it rather than creating a duplicate.
2. Write the memory file to the appropriate project memory path (find it under `~/.claude/projects/`) with proper frontmatter.
3. Add or update the pointer in `MEMORY.md`.

**Do NOT save:**
- Code patterns, architecture, or file paths derivable from the codebase
- Git history or recent changes (use `git log`)
- Debugging solutions (the fix is in the code)
- Anything already in CLAUDE.md
- Ephemeral task details only relevant to this session

## Step 2: Update Shared Learnings

If `docs/shared-learnings.md` exists in the workspace, review the session for discoveries that would be useful to other LLM tools (Codex, Gemini). Cross-tool learnings include:

- Gotchas that any tool would hit (build quirks, deployment issues, environment setup)
- Corrections to assumptions that aren't tool-specific
- Facts about project state that aren't captured in CLAUDE.md or code

**Append** new entries using the template in the file header. Do not edit or reorganize existing entries. If a discovery is only relevant to Claude, keep it in Claude's memory system instead.

Skip this step if `docs/shared-learnings.md` doesn't exist.

## Step 3: Revise CLAUDE.md

Review the session for context that would help future Claude sessions be more effective:

1. Scan for: bash commands discovered, environment quirks, gotchas encountered, workflow patterns, code style decisions
2. Find all CLAUDE.md files: project-level (`./CLAUDE.md`) and any subdirectory ones
3. Draft additions — **one line per concept**, concise enough for a prompt
4. Present proposed changes as diffs and ask the user to approve before applying

**Do NOT add:**
- Verbose explanations or obvious information
- One-off fixes unlikely to recur
- Anything already covered by memory files

## Step 4: Clean Up Stale Memory

Read through `MEMORY.md` and the linked memory files. Look for:

- **Outdated info**: branches that have been merged, TODOs that are done, temporary state that's resolved
- **Duplicates**: multiple memories covering the same topic
- **Contradictions**: memories that conflict with current CLAUDE.md or each other
- **Violations**: memories that store code patterns, architecture, or file paths (these belong in the codebase, not memory)

Present any proposed deletions or updates and ask the user to approve before applying.

## Output

After completing all four steps, summarize what was done:
- Memories added/updated/removed
- Shared learnings appended (if any)
- CLAUDE.md changes applied
- Any items you flagged but the user deferred
