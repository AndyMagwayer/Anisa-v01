import { anisaAssistant } from './assistant-config.js';

const responsePatterns = [
    {
        matches: ['plan', 'day', 'schedule'],
        response: 'I can help you make that practical. What is the one thing that needs to be done today, and what else is competing for your attention?'
    },
    {
        matches: ['idea', 'think', 'decide'],
        response: 'Let us give the idea some shape. Tell me what you are considering, what outcome you want, and what feels uncertain right now.'
    },
    {
        matches: ['code', 'project', 'bug'],
        response: 'Good, let us make it concrete. I can help break the project into a small first step. What are you building, and where are you currently stuck?'
    }
];

const fallbackResponses = [
    'I am with you. Tell me what you want to accomplish, and we will turn it into a clear next step.',
    'That sounds worth unpacking. What part would be most useful to think through first?',
    'I can help you work through that. A little more context will let me give you a more useful answer.'
];

let responseIndex = 0;

function getMockResponse(userMessage) {
    const normalizedMessage = userMessage.toLowerCase();
    const matchedPattern = responsePatterns.find((pattern) =>
        pattern.matches.some((keyword) => normalizedMessage.includes(keyword))
    );

    if (matchedPattern) return matchedPattern.response;

    const response = fallbackResponses[responseIndex % fallbackResponses.length];
    responseIndex += 1;
    return `${anisaAssistant.identity.name}: ${response}`;
}

function resetMockAssistant() {
    responseIndex = 0;
}

export { getMockResponse, resetMockAssistant };