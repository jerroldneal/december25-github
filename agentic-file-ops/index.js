import express from "express";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import fs from "fs";
import path from "path";

const app = express();

// Initialize MCP Server
const server = new Server(
  {
    name: "local-file-ops",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Helper for atomic write logic
function atomicWrite(targetPath, content) {
  const tempDir = process.env.TEMP || process.env.TMP || "/tmp";
  const fileName = path.basename(targetPath);
  const tempPath = path.join(
    tempDir,
    `atomic_${Date.now()}_${Math.random().toString(36).substring(7)}_${fileName}`
  );
  const metaPath = `${tempPath}.meta.json`;

  // 1. Create in Temp
  fs.writeFileSync(tempPath, content);

  // 2. Create Meta
  const meta = {
    target: targetPath,
    operation: fs.existsSync(targetPath) ? "edit" : "create",
    timestamp: Date.now(),
  };
  fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2));

  // 3. Copy to Target
  const targetDir = path.dirname(targetPath);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  fs.copyFileSync(tempPath, targetPath);

  // 4. Cleanup
  if (fs.existsSync(tempPath)) fs.rmSync(tempPath, { force: true });
  if (fs.existsSync(metaPath)) fs.rmSync(metaPath, { force: true });

  return `Successfully wrote ${content.length} bytes to ${targetPath}`;
}

// List Tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "atomic_write_file",
        description:
          "Write a file atomically to bypass VS Code file watchers/UI triggers. Use this for all file creation and modification.",
        inputSchema: {
          type: "object",
          properties: {
            path: {
              type: "string",
              description: "Absolute path to the file",
            },
            content: {
              type: "string",
              description: "Content to write (plain text)",
            },
          },
          required: ["path", "content"],
        },
      },
    ],
  };
});

// Call Tool
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  switch (request.params.name) {
    case "atomic_write_file": {
      const { path: filePath, content } = request.params.arguments;
      try {
        const result = atomicWrite(filePath, content);
        return {
          content: [
            {
              type: "text",
              text: result,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    }
    default:
      throw new Error("Unknown tool");
  }
});

let transport;

app.get("/sse", async (req, res) => {
  console.log("New SSE connection");
  transport = new SSEServerTransport("/messages", res);
  await server.connect(transport);
});

app.post("/messages", async (req, res) => {
  console.log("Received message");
  if (transport) {
    await transport.handlePostMessage(req, res);
  }
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('exit', (code) => {
  console.log('Process exiting with code:', code);
});

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Local MCP server running on http://localhost:${PORT}/sse`);
});
