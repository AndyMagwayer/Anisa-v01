const form = document.querySelector('#composer-form');
const input = document.querySelector('#message-input');
const sendButton = document.querySelector('.send-button');
const messages = document.querySelector('#message-list');
const welcome = document.querySelector('#welcome-block');
const newChatButton = document.querySelector('#new-chat');
const assistantSpace = document.querySelector('.assistant-space');

const mockResponses = [
    'I am here and ready to help. Tell me a little more about what you want to accomplish.',
    'That sounds like a useful direction. We can break it into a clear next step together.',
    'I have noted that. This local response is a placeholder for the assistant connection we will add later.'
];

let responseIndex = 0;
let isResponding = false;

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

function getMockResponse() {
    const response = mockResponses[responseIndex % mockResponses.length];
    responseIndex += 1;
    return response;
}

function sendMessage(text) {
    const cleanText = text.trim();
    if (!cleanText || isResponding) return;

    welcome.hidden = true;
    addMessage(cleanText, 'user');
    input.value = '';
    input.style.height = 'auto';
    setRespondingState(true);
    const typingMessage = addTypingMessage();

    window.setTimeout(() => {
        typingMessage.remove();
        addMessage(getMockResponse(), 'assistant');
        setRespondingState(false);
        input.focus();
    }, 850);
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
    responseIndex = 0;
    setRespondingState(false);
    input.value = '';
    input.style.height = 'auto';
    input.focus();
});
