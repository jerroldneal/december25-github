# Standard Operating Procedure: Convert Folder to Submodule (MCP-Native)

**Goal**: Convert a local folder to a git submodule using a robust, agentic workflow that leverages GitHub CLI and GitKraken MCP tools.

**Prerequisites**:
-   `gh` CLI installed and authenticated.
-   `mcp-gitkraken` server active.

**Workflow**:

1.  **Remote Creation (Terminal)**
    -   **Action**: Create the empty repository on GitHub.
    -   **Command**: `gh repo create <owner>/<repo-name> --private --description "<description>"`
    -   **Note**: Do not use `--source` or `--push` yet; we want to control the initial commit.

2.  **Initialization (Terminal)**
    -   **Action**: Initialize the git repository in the target folder.
    -   **Command**: `cd <folder>; git init; git remote add origin <new-repo-url>`

3.  **Staging & Committing (MCP)**
    -   **Action**: Stage all files and create the initial commit.
    -   **Tool**: `mcp_gitkraken_git_add_or_commit`
        -   `directory`: `<absolute-path-to-folder>`
        -   `action`: `add`
        -   `files`: `["."]`
    -   **Tool**: `mcp_gitkraken_git_add_or_commit`
        -   `directory`: `<absolute-path-to-folder>`
        -   `action`: `commit`
        -   `message`: `Initial commit`
    -   **Benefit**: Verifies that files are actually staged and committed correctly before proceeding.

4.  **Pushing (MCP)**
    -   **Action**: Push the branch to the new remote.
    -   **Tool**: `mcp_gitkraken_git_push`
        -   `directory`: `<absolute-path-to-folder>`
    -   **Benefit**: Confirms connectivity and permissions explicitly.

5.  **Cleanup & Submodule (Terminal)**
    -   **Action**: Remove the folder and add it back as a submodule.
    -   **Command**:
        ```powershell
        Remove-Item -Recurse -Force <folder>
        git submodule add <new-repo-url> <folder>
        git add .gitmodules <folder>
        git commit -m "Refactor: Convert <folder> to submodule"
        ```

**Why this is "Elegant"**:
-   **Atomic Steps**: Each major state change is handled by a dedicated tool call.
-   **Verification**: The agent receives structured feedback from GitKraken tools, preventing "silent failures" common in chained shell scripts.
-   **Separation of Concerns**: `gh` handles the API/Cloud side, `mcp_gitkraken` handles the local Git logic.
