#! /usr/bin/env node

import { resources } from './ressources.js';
import { tools } from './tools.js';
import { MCP } from 'mcp-js-server';

const infos = {
    name: 'mcp-clever-demo',
    version: '0.1.7'
};

const server = new MCP(infos, null, resources, tools);
