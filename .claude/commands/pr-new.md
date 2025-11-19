---
allowed-tools: Bash(git status:*), Bash(git log:*), Bash(git diff:*), Bash(git branch:*), Bash(git rev-parse:*), Bash(gh pr create:*), Bash(gh pr list:*), Grep
description: Create a draft pull request and assign it to yourself
---

# Create Pull Request

Create a draft pull request with a comprehensive summary and automatically assign it to yourself.

**BEHAVIOR**: This command analyzes all commits in the current branch (since it diverged from the base branch), creates a detailed PR summary, and opens a draft pull request assigned to you.

## Instructions

Follow these steps to create a pull request:

### Phase 1: Verify Branch State
1. Run `git status` to check the current branch and working directory state
2. If there are uncommitted changes, STOP and ask the user:
   "You have uncommitted changes. Would you like me to commit them first using /commit-push, or proceed with the PR as-is?"
3. Run `git branch -r` to identify the main/master branch (use `origin/main` or `origin/master` as base)
4. Check if the current branch tracks a remote branch
5. If not tracking remote, ask the user if they want to push the branch first

### Phase 2: Analyze Changes
6. Determine the base branch (usually `main` or `master`)
7. Run `git log [base-branch]...HEAD --oneline` to see all commits that will be included in the PR
8. Run `git diff [base-branch]...HEAD --stat` to see file change statistics
9. Run `git diff [base-branch]...HEAD` to see the full diff of all changes

### Phase 3: Generate PR Summary
10. Analyze ALL commits and changes (not just the latest commit):
    - Identify the overall purpose of the changes
    - Categorize the type of changes (feature, bug fix, refactor, etc.)
    - Note any breaking changes or important considerations
    - List key files modified and their purpose
11. Draft a clear, descriptive PR title that:
    - Is concise (50-70 characters)
    - Uses imperative mood (e.g., "Add feature" not "Added feature")
    - Accurately reflects the overall change
12. Draft a comprehensive PR body that includes:
    - **## Summary**: 2-4 bullet points describing what changed and why
    - **## Changes**: Detailed list of key changes organized by category
    - **## Test Plan**: Checklist of items to verify the changes work correctly
    - Any relevant context, links, or notes

### Phase 4: Create Draft PR
13. Push the current branch to remote if needed (with `-u` flag if not tracking)
14. Create the draft PR using gh with a HEREDOC for proper formatting:
```bash
gh pr create --draft --title "PR title here" --assign @me --body "$(cat <<'EOF'
## Summary
- Bullet point 1
- Bullet point 2

## Changes
- Change 1
- Change 2

## Test Plan
- [ ] Test item 1
- [ ] Test item 2
EOF
)"
```
15. After creation, display the PR URL to the user

### Phase 5: Verify Success
16. Run `gh pr list --author @me --limit 5` to confirm the PR was created
17. Report success with the PR number and URL

## PR Body Format

The PR body should follow this structure:

```markdown
## Summary
- High-level description of the change
- Why this change is needed
- Any relevant context

## Changes
- Specific change 1 with details
- Specific change 2 with details
- Organized by category if helpful

## Test Plan
- [ ] Test scenario 1
- [ ] Test scenario 2
- [ ] Verify no regressions
```

## IMPORTANT Rules
- Do NOT proceed if there are uncommitted changes without user permission
- Always create PRs as DRAFT by default
- Always assign to `@me` (the current user)
- Analyze ALL commits in the branch, not just the most recent one
- Make PR titles concise and descriptive
- Include a detailed test plan in the PR body
- Do NOT use the TodoWrite tool
- Do NOT read additional code files beyond what's needed for the PR summary
- Pass the PR body via HEREDOC to ensure proper formatting
- If the branch has no commits ahead of the base branch, STOP and report this to the user

## Error Handling
- If `gh` is not installed, inform the user and provide installation instructions
- If not authenticated with GitHub, tell the user to run `gh auth login`
- If the branch has no upstream, offer to push it first
- If a PR already exists for this branch, inform the user and ask if they want to update it instead