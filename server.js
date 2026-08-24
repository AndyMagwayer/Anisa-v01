import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { anisaAssistant } from './assistant-config.js';
import { generateReply } from './ai-service.js';
import { projectRoot, serverConfig } from './server-config.js';

const contentTypes = { '.css': 'text/css', '.html': 'text/html', '.js': 'text/javascript' };
const allowedRoles = new Set(['user', 'assistant']);

function sendJson(response, status, body) {
    response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
    response.end(JSON.stringify(body));
}

function readBody(request) {
    return new Promise((resolve, reject) => {
        let body = '';
        request.on('data', (chunk) => {
            body += chunk;
            if (body.length > 100_000) reject(new Error('Request body is too large'));
        });
        request.on('end', () => resolve(body));
        request.on('error', reject);
    });
}

async function handleChat(request, response) {
    try {
        let payload;
        try {
            payload = JSON.parse(await readBody(request));
        } catch {
            sendJson(response, 400, { error: 'Request body must be valid JSON.' });
            return;
        }
        const userMessage = typeof payload.message === 'string' ? payload.message.trim() : '';
        const messages = Array.isArray(payload.messages) ? payload.messages : [];
        if (!userMessage || userMessage.length > 10_000) {
            sendJson(response, 400, { error: 'Message must be between 1 and 10,000 characters.' });
            return;
        }
        if (messages.length > 50 || messages.some((message) =>
            !message || !allowedRoles.has(message.role) || typeof message.content !== 'string' || !message.content.trim() || message.content.length > 10_000
        )) {
            sendJson(response, 400, { error: 'Conversation history is invalid.' });
            return;
        }
        const reply = await generateReply({ messages, userMessage, config: serverConfig });
        sendJson(response, 200, { message: { role: 'assistant', content: reply }, assistant: anisaAssistant.identity.name });
    } catch (error) {
        console.error('Chat request failed:', error.message);
        const status = error.message.includes('authentication') ? 502 : error.message.includes('rate limit') ? 429 : 502;
        sendJson(response, status, { error: 'Anisa could not respond right now. Please try again.' });
    }
}

function serveFile(request, response) {
    const requestedPath = request.url === '/' ? '/index.html' : new URL(request.url, 'http://localhost').pathname;
    const filePath = path.resolve(projectRoot, `.${requestedPath}`);
    const relativePath = path.relative(projectRoot, filePath);
    if (relativePath.startsWith('..') || path.isAbsolute(relativePath) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        response.writeHead(404);
        response.end('Not found');
        return;
    }
    response.writeHead(200, { 'Content-Type': `${contentTypes[path.extname(filePath)] || 'text/plain'}; charset=utf-8` });
    fs.createReadStream(filePath).pipe(response);
}

const server = http.createServer(async (request, response) => {
    if (request.method === 'POST' && request.url === '/api/chat') return handleChat(request, response);
    if (request.method === 'GET') return serveFile(request, response);
    return sendJson(response, 405, { error: 'Method not allowed' });
});

server.listen(serverConfig.port, () => console.log(`Anisa is running at http://localhost:${serverConfig.port}`));