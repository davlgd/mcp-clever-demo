#! /usr/bin/env node

import { tools } from './tools.js';
import { MCP } from 'mcp-js-server';

const infos = {
    name: 'mcp-clever-demo',
    version: '0.1.6'
};

const server = new MCP(infos, null, null, tools);
