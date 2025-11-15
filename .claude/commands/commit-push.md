---
allowed-tools: Bash(git status:*), Bash(git add:*), Bash(git commit:*), Bash(git push:*), Bash(git log:*), Bash(git diff:*), Grep
description: Create a git commit and push it (automatically stages modified files)
---

# Commit and Push

Create a git commit and push it to the remote repository with comprehensive code quality checks.

**BEHAVIOR**: This command automatically stages all modified and deleted files (tracked files only) with `git add -u` before committing. Untracked files are NOT automatically added.

## Instructions

Follow these steps to commit and push changes:

### Phase 1: Inspect and Stage Changes
1. Run git status to see all untracked and modified files
2. If there are modified or deleted files (tracked files), automatically stage them with `git add -u`
3. Run git diff --staged to see staged changes
4. Run git log --oneline -10 to see recent commit message style

### Phase 2: Documentation Consistency Check
4. Review documentation for consistency with code changes:
   - Identify which Python files and modules are being modified
   - Check if there are corresponding README.md or CLAUDE.md files in the same directory
   - Read the relevant documentation files to understand what they describe
   - Analyze if the code changes introduce:
     * New features or functions that should be documented
     * Changes to CLI commands or command signatures
     * Changes to feature groups, file structures, or data flows
     * New dependencies or configuration requirements
     * Changes to existing documented functionality
   - Compare the documentation content with the actual code changes
   - Flag any inconsistencies where documentation doesn't reflect the new code

### Phase 3: Code Quality Checks
5. Check for incomplete code markers in changed files:
   - Search for TODO comments
   - Search for FIXME comments
   - Search for XXX or HACK comments
   - Search for incomplete patterns (e.g., "# ...", "pass  # incomplete", empty function bodies)
6. Check for FALLBACK code patterns:
   - Search for "FALLBACK", "fallback", "fall back" in comments or variable names
   - Look for try-except blocks that use generic fallback values
   - Identify any temporary workarounds that should be permanent solutions
7. Check for unused/isolated code:
   - Look for functions or classes that are defined but never imported or called
   - Check for commented-out code blocks
   - Identify isolated code that has no integration with the rest of the codebase

### Phase 4: Report Findings
7. If ANY of the following are found, STOP and ask the user for explicit permission:
   - TODO/FIXME/XXX/HACK comments
   - Incomplete code patterns
   - FALLBACK code or temporary workarounds
   - Unused/isolated code that appears to be dead code
   - Files with secrets (.env, credentials, etc.)

   Present a clear summary of findings with file paths and line numbers. Ask:
   "I found the following issues in the code to be committed. Do you want to proceed with the commit anyway?"

### Phase 4: Commit and Push (only if no issues or user approves)
8. Analyze all staged changes and draft a concise commit message that:
   - Follows the repository's commit message style
   - Focuses on the "why" rather than the "what"
   - Accurately reflects the changes (use "add" for new features, "update" for enhancements, "fix" for bugs)
   - Is 1-2 sentences maximum
9. Create the commit with the drafted message using a HEREDOC for proper formatting
10. Push to the remote repository
11. Run git status after pushing to verify success

## Search Patterns

Use grep/rg to search in staged/modified files for:
- `TODO|FIXME|XXX|HACK`
- `FALLBACK|fallback|fall back`
- `# \.\.\.|pass  # incomplete|raise NotImplementedError`

## IMPORTANT Rules
- AUTOMATICALLY stage modified/deleted tracked files with `git add -u` at the beginning
- Do NOT stage untracked files (only use `git add -u`, not `git add .` or `git add -A`)
- Do NOT use the TodoWrite tool
- Do NOT read additional code files beyond what's needed for quality checks
- Do NOT skip hooks (never use --no-verify)
- Do NOT proceed with commit if issues are found WITHOUT user permission
- If there are no modified files to stage and commit, report this to the user
- Pass commit messages via HEREDOC like this:
```bash
git commit -m "$(cat <<'EOF'
Your commit message here.
EOF
)"
```
