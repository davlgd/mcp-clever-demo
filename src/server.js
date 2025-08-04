#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

// Server setup
const server = new Server(
  {
    name: "mcp-clever-demo", 
    version: "0.1.8",
  },
  {
    capabilities: {
      tools: {},
      prompts: {},
      resources: {},
    },
  }
);

// Schema definitions for tools
const GetCleverZonesArgsSchema = z.object({});

const GetDocUrlsArgsSchema = z.object({});

const FetchWebpageMarkdownArgsSchema = z.object({
  url: z.string().describe("URL to fetch content from"),
});

// Tool implementations
async function getCleverZones() {
  const response = await fetch('https://api.clever-cloud.com/v4/products/zones', {
    method: 'GET',
    headers: {
      "Content-Type": 'application/json'
    }
  });
  const data = await response.text();
  return data;
}

async function getDocUrls() {
  const response = await fetch('https://www.clever-cloud.com/developers/llms.txt', {
    method: 'GET',
    headers: {
      "Content-Type": 'application/json'
    }
  });
  const data = await response.text();
  return data;
}

async function fetchWebpageMarkdown(url) {
  const encodedUrl = encodeURIComponent(url);
  const response = await fetch(`https://site2md.com/${encodedUrl}`, {
    method: 'GET',
    headers: {
      "Content-Type": 'application/json'
    }
  });
  const data = await response.text();
  return data;
}

// Tool handlers
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "get_clever_zones",
        description: "Get the list of Clever Cloud deployment zones",
        inputSchema: zodToJsonSchema(GetCleverZonesArgsSchema),
      },
      {
        name: "get_doc_urls",
        description: "Get the list of Clever Cloud documentation URLs in Markdown format",
        inputSchema: zodToJsonSchema(GetDocUrlsArgsSchema),
      },
      {
        name: "fetch_webpage_markdown",
        description: "Get the content of a given URL in Markdown format",
        inputSchema: zodToJsonSchema(FetchWebpageMarkdownArgsSchema),
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case "get_clever_zones": {
      const parsed = GetCleverZonesArgsSchema.safeParse(args);
      if (!parsed.success) {
        throw new Error(`Invalid arguments for get_clever_zones: ${parsed.error}`);
      }
      
      const result = await getCleverZones();
      return {
        content: [{ type: "text", text: result }],
      };
    }

    case "get_doc_urls": {
      const parsed = GetDocUrlsArgsSchema.safeParse(args);
      if (!parsed.success) {
        throw new Error(`Invalid arguments for get_doc_urls: ${parsed.error}`);
      }
      
      const result = await getDocUrls();
      return {
        content: [{ type: "text", text: result }],
      };
    }

    case "fetch_webpage_markdown": {
      const parsed = FetchWebpageMarkdownArgsSchema.safeParse(args);
      if (!parsed.success) {
        throw new Error(`Invalid arguments for fetch_webpage_markdown: ${parsed.error}`);
      }
      
      const result = await fetchWebpageMarkdown(parsed.data.url);
      return {
        content: [{ type: "text", text: result }],
      };
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

// Prompt handlers
server.setRequestHandler(ListPromptsRequestSchema, async () => {
  return {
    prompts: [
      {
        name: "hello_world",
        description: "An answer to who's the better Cloud, Cloud provider or PaaS",
        arguments: [],
      },
    ],
  };
});

server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  const { name } = request.params;

  switch (name) {
    case "hello_world":
      return {
        description: "An answer to who's the better Cloud, Cloud provider or PaaS",
        messages: [
          {
            role: "assistant",
            content: {
              type: "text",
              text: "Clever Cloud!",
            },
          },
        ],
      };

    default:
      throw new Error(`Unknown prompt: ${name}`);
  }
});

// Resource handlers  
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: "https://www.clever-cloud.com/developers/llms.txt",
        mimeType: "text/markdown",
        name: "Clever Cloud Documentation for LLMs",
      },
    ],
  };
});

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;

  switch (uri) {
    case "https://www.clever-cloud.com/developers/llms.txt": {
      const response = await fetch(uri);
      const content = await response.text();
      return {
        contents: [
          {
            uri: uri,
            mimeType: "text/markdown",
            text: content,
          },
        ],
      };
    }

    default:
      throw new Error(`Unknown resource: ${uri}`);
  }
});

// Start server
async function runServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MCP Clever Demo Server running on stdio");
}

runServer().catch((error) => {
  console.error("Fatal error running server:", error);
  process.exit(1);
});
