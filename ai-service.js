import { getSystemInstructions } from './assistant-config.js';
import { getMockResponse } from './mock-assistant.js';

async function generateReply({ messages = [], userMessage, config }) {
    if (config.provider !== 'openai') return getMockResponse({ messages, userMessage });
    if (!config.providerUrl || !config.providerKey || !config.model) throw new Error('OpenAI provider is not configured');
    const response = await fetch(config.providerUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${config.providerKey}` },
        body: JSON.stringify({
            model: config.model,
            messages: [{ role: 'system', content: getSystemInstructions() }, ...messages, { role: 'user', content: userMessage }]
        })
    });
    if (response.status === 401) throw new Error('AI provider authentication failed');
    if (response.status === 429) throw new Error('AI provider rate limit reached');
    if (!response.ok) throw new Error(`AI provider returned ${response.status}`);
    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content;
    if (typeof reply !== 'string' || !reply.trim()) throw new Error('AI provider returned an empty response');
    return reply.trim();
}

export { generateReply };