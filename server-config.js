import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

function loadDotEnv() {
    const envPath = path.join(projectRoot, '.env');
    if (!fs.existsSync(envPath)) return;
    for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
        const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
        if (match && !process.env[match[1]]) process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, '');
    }
}

loadDotEnv();

const serverConfig = Object.freeze({
    port: Number(process.env.PORT) || 3000,
    providerUrl: process.env.AI_API_URL || '',
    providerKey: process.env.AI_API_KEY || '',
    model: process.env.AI_MODEL || ''
});

export { projectRoot, serverConfig };