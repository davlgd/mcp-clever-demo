#! /usr/bin/env node

import { prompts } from './prompts.js';
import { resources } from './ressources.js';
import { tools } from './tools.js';
import { MCP } from 'mcp-js-server';

const infos = {
    name: 'mcp-clever-demo',
    version: '0.1.8'
};

const server = new MCP(infos, prompts, resources, tools);
