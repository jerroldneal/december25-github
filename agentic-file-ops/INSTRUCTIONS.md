### Understanding MCP and Its Role with Copilot (as of December 2025)

The Model Context Protocol (MCP) remains an open standard enabling AI models like GitHub Copilot to interact with external tools, services, and data via a unified interface. In Copilot's agent mode, MCP servers expose tools (e.g., file ops, GitHub APIs, custom logic) for enhanced workflows. A **local MCP server** runs on your machine (e.g., via Node.js, .NET, Python, or Docker) and is accessible via endpoints like `http://localhost:3000`.

**Key Updates as of December 2025**:
- GitHub's official MCP server now supports seamless remote/local hybrids, with OAuth for auth and read-only modes for security.
- VS Code MCP gallery is enabled by default (v1.102+), allowing one-click installs from the Extensions view.
- Copilot supports up to 128 tools per request; virtual tools are auto-enabled if exceeded.
- New SDKs: Enhanced C# and Python support; community servers like Awesome Copilot for prompt discovery.
- Enterprise policies: "MCP servers in Copilot" must be enabled for orgs/enterprises.
- Security: Servers now detect/block AI-generated secrets by default.

**Security Note**: Local servers can execute code—use trusted sources and approve trust prompts in IDEs.

### Prerequisites
- GitHub account with Copilot access (free tier works for basics; paid for advanced agents).
- VS Code 1.102+ (or Visual Studio 17.14+), GitHub Copilot extension.
- Node.js 20+ (for JS examples), Docker (for official servers), or equivalent for other langs.
- For orgs: Enable "MCP servers in Copilot" policy.

### Step 1: Implement a Local MCP Server
Use SDKs from [github.com/modelcontextprotocol](https://github.com/modelcontextprotocol) (updated Dec 2025 with better SSE transport). Here's a Node.js "todos" example (extensible; in-memory for demo).

1. Create project:
   ```
   mkdir local-mcp-server
   cd local-mcp-server
   npm init -y
   ```

2. Install deps:
   ```
   npm install express @modelcontextprotocol/sdk@latest
   ```

3. Create `server.js`:
   ```javascript
   const express = require('express');
   const { MCPRouter } = require('@modelcontextprotocol/sdk');

   const app = express();
   app.use(express.json());

   let todos = [{ id: 1, task: 'Buy groceries', done: false }];

   const mcpRouter = new MCPRouter({
     tools: [
       {
         name: 'list_todos',
         description: 'List all todos',
         inputs: [],
         outputs: [{ name: 'todos', type: 'array' }],
         handler: async () => ({ todos })
       },
       {
         name: 'add_todo',
         description: 'Add a new todo',
         inputs: [{ name: 'task', type: 'string' }],
         outputs: [{ name: 'id', type: 'number' }],
         handler: async (inputs) => {
           const id = todos.length + 1;
           todos.push({ id, task: inputs.task, done: false });
           return { id };
         }
       }
     ]
   });

   app.use('/api/mcp', mcpRouter);  // Supports SSE for streaming

   const PORT = 3000;
   app.listen(PORT, () => {
     console.log(`Local MCP server at http://localhost:${PORT}/api/mcp`);
   });
   ```

4. Run:
   ```
   node server.js
   ```

For GitHub's official server (repo management):
- Docker: `docker run -p 8080:8080 ghcr.io/mcp/io.github.github/github-mcp-server:latest`
- Endpoint: `http://localhost:8080` (supports read-only via config flag).

Other options: Azure MCP Server for cloud resources; Awesome Copilot via Docker for prompt tools.

### Step 2: Configure in VS Code for Copilot
1. In workspace root, create/edit `.vscode/mcp.json` (IntelliSense auto-completes):
   ```json
   {
     "servers": {
       "local-todos": {
         "type": "http",
         "url": "http://localhost:3000/api/mcp",
         "transport": "sse"  // Preferred for streaming; fallback "http"
       },
       "github-local": {  // Example for GitHub server
         "type": "http",
         "url": "http://localhost:8080",
         "auth": { "type": "oauth2" }  // Auto-handles GitHub auth
       }
     }
   }
   ```
   - Add `"inputs": [...]` for env vars if needed.
   - For gallery installs: Enable `chat.mcp.gallery.enabled` in settings, search "@mcp" in Extensions.

2. Start servers: A "Start" button appears in `.vscode/mcp.json`—click to launch/discover tools.

3. In Copilot Chat:
   - Open Chat (`Ctrl+Shift+P` > "GitHub Copilot: Open Chat").
   - Select **Agent mode**.
   - Click **Tools icon** (wrench) > **Add MCP Tools** > Select "local-todos".
   - Toggle tools (e.g., "list_todos").
   - Prompt: "Add todo: Walk dog" – Copilot invokes server.

**Troubleshooting**: Check "GitHub Copilot" output panel. Reduce tools if >128. Approve auth prompts.

### Step 3: Configure in Other Environments
- **Visual Studio**:
  1. Create `.mcp.json` in solution dir.
  2. Add server config as above.
  3. In Copilot Chat (Agent mode) > Tools > Add server.
  4. For coding agent: Use `azd` extension for Azure integrations.

- **GitHub Codespaces**:
  - Run server in terminal.
  - Use `.vscode/mcp.json`.
  - Test in built-in Chat.

- **Copilot CLI/Other**:
  - Wrap in MCP (e.g., Python SSE server for dual transport).
  - Config: `{ "mcpServers": { "copilot-remote": { "url": "http://localhost:8602/sse" } } }`

### Step 4: Testing and Best Practices
- Test: "List todos" in Agent Chat—expect server response.
- Extend: Add tools (e.g., Azure resource queries). Use read-only for demos.
- Limits: 128 tools max; enable virtual tools in settings.
- Production: Migrate to remote (GitHub-hosted) for OAuth/updates.
- Resources:
  - GitHub Docs: [Using MCP](https://docs.github.com/en/copilot/customizing-copilot/using-model-context-protocol).
  - MCP Site: [Spec & SDKs](https://modelcontextprotocol.io).
  - Blog: [GitHub MCP Guide](https://github.blog/ai-and-ml/generative-ai/a-practical-guide-on-how-to-use-the-github-mcp-server/).

This setup integrates your local MCP server with Copilot for context-aware tasks. For language-specific (e.g., C#) or advanced (e.g., agent-to-agent) examples, provide details!
