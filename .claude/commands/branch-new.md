---
allowed-tools: Bash(git *), Bash(gh api user), Bash(date *)
description: Create a new branch with standardized naming format [username]/[type]/[date]-[title]
---

# New Branch

Create a new branch following the standardized naming convention: `[GITHUB_USERNAME]/[TYPE]/[YYYY-MM-DD]-[title]`

**BEHAVIOR**: This command automatically detects the branch type from the title (feature, bugfix, hotfix, etc.), generates a properly formatted branch name using your GitHub username, current date, and a cleaned title, then creates and checks out the new branch.

## Instructions

Follow these steps to create a new branch:

### Phase 1: Extract Title Argument
1. The user will provide a TITLE as an argument to this command (e.g., `/new-branch Add user authentication`)
2. Extract the title from the command arguments
3. If no title is provided, ask the user: "Please provide a title for the branch (e.g., `/new-branch Add user authentication`)"

### Phase 2: Get GitHub Username
4. Run `gh api user --jq .login` to get the authenticated GitHub username
5. If `gh` is not installed or not authenticated:
   - Try to extract username from git remote URL: `git remote get-url origin | sed -n 's/.*github.com[:/]\([^/]*\)\/.*/\1/p'`
   - If that fails, ask the user: "Unable to determine GitHub username. Please authenticate with `gh auth login` or provide your username."

### Phase 3: Get Current Date
6. Run `date +%Y-%m-%d` to get the current date in YYYY-MM-DD format

### Phase 4: Detect Branch Type
7. Analyze the title to automatically detect the branch type based on keywords (see "Branch Type Detection" section for full list)
8. Check the title (case-insensitive) for type keywords:
   - If multiple types match, prioritize in this order: hotfix > bugfix > feature > others
   - If no type is detected, default to "feature"
9. Display the detected type to the user (e.g., "🏷️  Detected type: feature")

### Phase 5: Clean and Format Title
10. Process the title to make it suitable for a branch name:
    - Convert to lowercase
    - Remove special characters (keep only alphanumeric, spaces, and hyphens)
    - Replace spaces with hyphens
    - Remove consecutive hyphens
    - Trim to a reasonable length (max 40 characters)
    - Remove leading/trailing hyphens
11. If the user's title can be improved for clarity or conciseness:
    - Suggest the improved version
    - Use imperative mood (e.g., "add" not "adding", "fix" not "fixed")
    - Keep it descriptive but concise

### Phase 6: Generate Branch Name
12. Combine the components: `[username]/[type]/[date]-[cleaned-title]`
13. Display the generated branch name to the user
14. Example: `fractal-manifold/feature/2025-01-18-add-user-authentication`

### Phase 7: Verify and Create Branch
15. Run `git status` to check if there are uncommitted changes
16. If there are uncommitted changes, warn the user:
    "⚠️  You have uncommitted changes. Creating a new branch will carry these changes over. Do you want to:
    1. Stash changes and create branch
    2. Create branch with changes
    3. Cancel"
17. Run `git branch --list [branch-name]` to check if the branch already exists
18. If the branch exists, ask: "Branch already exists. Do you want to switch to it or choose a different name?"
19. Create and checkout the new branch: `git checkout -b [branch-name]`
20. Confirm success: "✅ Created and switched to branch: [branch-name]"

### Phase 8: Offer Next Steps
21. Ask the user if they want to:
    - Push the branch to remote: `git push -u origin [branch-name]`
    - Start working (no action needed)
    - See branch info: `git branch -vv`

## Title Cleaning Examples

User input → Cleaned output:
- `Add User Authentication` → `add-user-authentication`
- `Fix: Bug in payment processor` → `fix-bug-in-payment-processor`
- `Refactor / Code Cleanup!!!` → `refactor-code-cleanup`
- `Update API endpoints for v2 migration` → `update-api-endpoints-for-v2-migration`
- `This is a very long title that needs to be truncated` → `this-is-a-very-long-title-that-needs`

## Branch Type Detection

The command automatically detects the branch type based on keywords in the title:

| Type | Keywords | Description |
|------|----------|-------------|
| **feature** | add, implement, create, new | New features or functionality |
| **bugfix** | fix, bug, error, issue, resolve | Bug fixes and error corrections |
| **hotfix** | hotfix, urgent, critical, emergency | Critical fixes for production |
| **refactor** | refactor, restructure, reorganize, cleanup | Code refactoring without behavior change |
| **docs** | docs, documentation, readme, comment | Documentation updates |
| **test** | test, testing, spec, unit, integration | Test additions or modifications |
| **chore** | chore, update, upgrade, maintenance | Maintenance tasks and updates |
| **ci** | ci, pipeline, workflow, build, deploy | CI/CD and build configuration |
| **perf** | perf, performance, optimize, speed | Performance improvements |
| **experimental** | experimental, experiment, spike, poc, prototype | Experimental features or spikes |

**Priority**: If multiple types match, priority is: hotfix > bugfix > feature > others
**Default**: If no type is detected, defaults to "feature"

## IMPORTANT Rules
- ALWAYS use lowercase for the title portion
- ALWAYS use hyphens (kebab-case) for the title, not underscores
- Branch type is automatically detected from the title keywords
- If you want to override the detected type, include the explicit type keyword in your title
- Do NOT create the branch if it already exists
- Do NOT proceed if unable to determine GitHub username
- Username portion should preserve case as returned by GitHub API
- Date must be in YYYY-MM-DD format
- Suggest improvements to the title if it's too verbose or unclear
- Use imperative mood for the title (e.g., "add" not "adding")
- Maximum title length: 40 characters (after cleaning)
- Do NOT use the TodoWrite tool

## Error Handling
- If `gh` is not installed, try to extract username from git remote
- If not authenticated with GitHub, provide clear instructions
- If branch name would be invalid, suggest corrections
- If user provides empty title, prompt for input
- If there are uncommitted changes, give user options

## Command Usage Examples

```bash
/branch-new Add user authentication
# Detects: feature
# Creates: fractal-manifold/feature/2025-01-18-add-user-authentication

/branch-new fix payment bug
# Detects: bugfix
# Creates: fractal-manifold/bugfix/2025-01-18-fix-payment-bug

/branch-new Refactor API endpoints
# Detects: refactor
# Creates: fractal-manifold/refactor/2025-01-18-refactor-api-endpoints

/branch-new Update documentation for API
# Detects: docs
# Creates: fractal-manifold/docs/2025-01-18-update-documentation-for-api

/branch-new Optimize database queries
# Detects: perf
# Creates: fractal-manifold/perf/2025-01-18-optimize-database-queries

/branch-new Critical security patch
# Detects: hotfix
# Creates: fractal-manifold/hotfix/2025-01-18-critical-security-patch
```