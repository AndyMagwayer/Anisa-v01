import { resetMockAssistant } from './mock-assistant.js';

const form = document.querySelector('#composer-form');
const input = document.querySelector('#message-input');
const sendButton = document.querySelector('.send-button');
const messages = document.querySelector('#message-list');
const welcome = document.querySelector('#welcome-block');
const newChatButton = document.querySelector('#new-chat');
const assistantSpace = document.querySelector('.assistant-space');

let isResponding = false;
const conversationMessages = [];

function scrollToLatest() {
    assistantSpace.scrollTo({ top: assistantSpace.scrollHeight, behavior: 'smooth' });
    messages.lastElementChild?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function addMessage(text, type) {
    const message = document.createElement('div');
    message.className = `message ${type}-message`;
    if (type === 'assistant') {
        const mark = document.createElement('span');
        mark.className = 'message-mark';
        mark.setAttribute('aria-hidden', 'true');
        mark.textContent = 'A';
        message.append(mark);
    }
    const content = document.createElement('span');
    content.textContent = text;
    message.append(content);
    messages.append(message);
    scrollToLatest();
    return message;
}

function addTypingMessage() {
    const message = document.createElement('div');
    message.className = 'message assistant-message typing-message';
    message.innerHTML = '<span class="message-mark" aria-hidden="true">A</span><span class="typing-dots" aria-label="Anisa is typing"><i></i><i></i><i></i></span>';
    messages.append(message);
    scrollToLatest();
    return message;
}

function setRespondingState(responding) {
    isResponding = responding;
    input.disabled = responding;
    sendButton.disabled = responding;
    sendButton.setAttribute('aria-label', responding ? 'Anisa is responding' : 'Send message');
    document.querySelector('.conversation-name span:last-child').textContent = responding ? 'Anisa is thinking...' : 'New conversation';
}

async function sendMessage(text) {
    const cleanText = text.trim();
    if (!cleanText || isResponding) return;

    welcome.hidden = true;
    addMessage(cleanText, 'user');
    input.value = '';
    input.style.height = 'auto';
    setRespondingState(true);
    const typingMessage = addTypingMessage();

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: cleanText, messages: conversationMessages })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Request failed');
        typingMessage.remove();
        addMessage(data.reply, 'assistant');
        conversationMessages.push({ role: 'user', content: cleanText }, { role: 'assistant', content: data.reply });
        setRespondingState(false);
        input.focus();
    } catch (error) {
        typingMessage.remove();
        addMessage(error.message === 'Failed to fetch' ? 'I cannot reach my local backend right now. Please start the server and try again.' : 'I could not complete that request. Please try again.', 'assistant');
        setRespondingState(false);
        input.focus();
    }
}

form.addEventListener('submit', (event) => {
    event.preventDefault();
    sendMessage(input.value);
});

input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        form.requestSubmit();
    }
});

input.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = `${Math.min(input.scrollHeight, 150)}px`;
});

document.querySelectorAll('[data-prompt]').forEach((button) => {
    button.addEventListener('click', () => sendMessage(button.dataset.prompt));
});

newChatButton.addEventListener('click', () => {
    messages.replaceChildren();
    welcome.hidden = false;
    conversationMessages.length = 0;
    resetMockAssistant();
    setRespondingState(false);
    input.value = '';
    input.style.height = 'auto';
    input.focus();
});
