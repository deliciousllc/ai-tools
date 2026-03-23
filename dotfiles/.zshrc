#############################
# ALIASES
#############################

# Navigation
alias cd..='cd ..'
alias ..='cd ..'
alias ...='cd ../..'
alias ..2='cd ../..'
alias ..3='cd ../../..'
alias ..4='cd ../../../..'
alias ~='cd ~'

# General
alias path='echo -e ${PATH//:/\\n}'
alias wget='wget -c'

# Git
alias g-a="git add"
alias g-b="git branch"
alias g-bc="git checkout -b"
alias g-c="git commit -m"
alias g-i="git init"
alias g-po="git push origin"
alias g-st="git status"

g-ignore() {
	if [ "$1" != "" ]; then
		wget -O .gitignore "https://raw.githubusercontent.com/github/gitignore/master/$1.gitignore"
	else
		echo "Ignore type required!"
		echo "See https://github.com/github/gitignore"
	fi
}

# LS (macOS uses -G for color; on Linux, replace -G with --color=auto)
alias ls='ls -AFG'
alias ll='ls -AlhFG'
alias dir=ll

# Find
ff() {
	if [ -n "$1" ]; then
		echo "Finding \"$1\" in /"
		find / -name "$1" -print 2>/dev/null
	fi
}

# Claude Code: clear scrollback before resuming a session
alias cr='clear && tmux clear-history 2>/dev/null; claude --resume'


#############################
# SHELL PROMPT
#############################
#
# How to customize:
#
#   The prompt is built from 3 segments + a newline, using zsh prompt escapes:
#
#   PS_USER  — username block        e.g.  joshumami@
#   PS_PATH  — current directory      e.g.  Projects/
#   PS_PROMPT — venv indicator + $/#  e.g.  (venv) % ▶
#
#   Color reference (%K = background, %F = foreground, %f/%k = reset):
#     %K{240}  dark gray bg     %K{37}   teal bg
#     %K{237}  darker gray bg   %K{126}  magenta bg (venv)
#     %F{15}   white text       %F{248}  light gray text
#
#   Useful zsh prompt escapes:
#     %n       username          %m       hostname
#     %1~      current dir       %~       full path from ~
#     %#       shows % (user) or # (root)
#     %F{N}    foreground color   %K{N}    background color
#     %f / %k  reset fg / bg
#
#   256-color codes: https://en.wikipedia.org/wiki/ANSI_escape_code#8-bit
#
#   To change colors, swap the numbers in %K{...} and %F{...}.
#   To add hostname, put %m in PS_USER:  PS_USER="%K{237}%F{248} %n@%m %f%k"
#   To show full path instead of just the current dir, use %~ instead of %1~.
#

# Display virtual environment info in prompt
function virtualenv_info() {
    if [[ -n "$VIRTUAL_ENV" ]]; then
        venv="${VIRTUAL_ENV##*/}"
    else
        venv=''
    fi
    [[ -n "$venv" ]] && echo "%K{126} v:$venv %k"
}
export VIRTUAL_ENV_DISABLE_PROMPT=1

VENV="\$(virtualenv_info)"

setopt PROMPT_SUBST

# Print a blank line before each command output (visual breathing room).
# This is a zsh hook — it runs automatically before every command executes.
# Remove this function if you prefer compact output.
preexec() {
    print ""
}

PS_N=$'\n'
PS_PATH="%K{240} %1~/ %k"
PS_USER="%K{237}%F{248} %n@ %f%k"
PS_PROMPT="${VENV}%K{37}%F{15} %# %f%k%F{37}▶%f"

PS1="%F{15}${PS_N}${PS_USER}${PS_PATH}${PS_PROMPT}%f "


#############################
# FUNCTIONS
#############################

cheat() {
  echo "
  ─── Navigation ───────────────────────
  Ctrl+A      Jump to start of line
  Ctrl+E      Jump to end of line
  Ctrl+F      Move forward one character
  Ctrl+B      Move back one character
  Option+→    Move forward one word
  Option+←    Move back one word

  ─── Editing ──────────────────────────
  Ctrl+U      Delete to start of line
  Ctrl+K      Delete to end of line
  Ctrl+W      Delete word backward
  Ctrl+Y      Paste back deleted text
  Ctrl+T      Swap two characters
  Option+T    Swap two words
  Ctrl+_      Undo last edit

  ─── History ──────────────────────────
  ↑ / ↓       Cycle through past commands
  Ctrl+R      Search command history
  Ctrl+G      Cancel history search
  Cmd+↑       Jump to previous prompt
  Cmd+↓       Jump to next prompt
  !!          Repeat last command
  !$          Reuse last argument

  ─── Terminal ─────────────────────────
  Cmd+K       Clear screen (full)
  Ctrl+L      Clear screen (light)
  Ctrl+C      Cancel running command
  Ctrl+D      Exit terminal
  Ctrl+Z      Suspend process (fg to resume)
  Tab         Autocomplete
  "
}
