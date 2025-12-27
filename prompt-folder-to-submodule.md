# Prompt: Convert Folder to Git Submodule

**Goal**: Convert an existing folder within a git repository into a standalone git submodule with its own remote repository on GitHub, while preserving the local development environment.

**Prerequisites**:
-   GitHub CLI (`gh`) installed and authenticated.
-   Git installed.
-   PowerShell or Bash terminal.

**Steps**:

1.  **Environment Check**:
    -   Verify `gh` is authenticated (`gh auth status`).
    -   Verify the target folder exists.

2.  **Create Remote Repository**:
    -   Use `gh repo create` to create a new private repository.
    -   Name convention: `<owner>/<parent-repo>-<folder-name>` (e.g., `jerroldneal/device-proxy-audio-pipe`).
    -   Add a description.

3.  **Initialize & Push Code**:
    -   Navigate into the target folder.
    -   Initialize a new git repo (`git init`).
    -   Add all files (`git add .`).
    -   Commit (`git commit -m "Initial commit"`).
    -   Rename branch to main (`git branch -M main`).
    -   Add the new remote (`git remote add origin <new-repo-url>`).
    -   Push to the new remote (`git push -u origin main`).

4.  **Cleanup & Gitignore**:
    -   Create a `.gitignore` in the folder to exclude build artifacts (e.g., `node_modules/`, `dist/`).
    -   Remove these artifacts from git tracking if they were accidentally added (`git rm -r --cached ...`).
    -   Commit and push these cleanup changes.

5.  **Replace Folder with Submodule**:
    -   **Crucial Step**: Back up `node_modules` if present to avoid re-installing.
    -   Remove the original folder from the parent repo (`git rm -r --cached <folder>`, then delete the folder from disk).
    -   Add the submodule: `git submodule add <new-repo-url> <folder-name>`.
    -   Restore `node_modules` from backup.

6.  **Commit Parent Repo**:
    -   Stage the `.gitmodules` file and the new submodule reference.
    -   Commit the changes to the parent repository (`git commit -m "Refactor: Convert <folder> to submodule"`).

**Example Usage**:
"Using git mcp, convert the `audio-pipe` folder to a submodule with its own independent repo on github."
