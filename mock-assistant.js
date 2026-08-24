import { anisaAssistant } from './assistant-config.js';

function detectLanguage(text) {
    if (/[а-яё]/i.test(text)) return 'ru';
    if (/[ўқғҳ]/i.test(text) || /\b(salom|men|menga|qanday|uchun|bilan|yordam)\b/i.test(text)) return 'uz';
    return 'en';
}

function getRecentUserMessage(messages) {
    return [...messages].reverse().find((message) => message.role === 'user')?.content || '';
}

function hasAny(text, words) {
    return words.some((word) => text.includes(word));
}

function getMockResponse({ messages = [], userMessage }) {
    const normalizedMessage = userMessage.trim().toLowerCase();
    const language = detectLanguage(userMessage);
    const previousUserMessage = getRecentUserMessage(messages);
    const hasHistory = Boolean(previousUserMessage);
    const isGreeting = hasAny(normalizedMessage, ['hello', 'hi', 'hey', 'привет', 'здравствуй', 'салом', 'salom']);
    const asksIdentity = hasAny(normalizedMessage, ['who are you', 'what are you', 'кто ты', 'кто вы', 'sen kimsan', 'siz kimsiz']);
    const asksIdea = hasAny(normalizedMessage, ['idea', 'project', 'идею', 'идея', 'проект', 'gʻoya', 'loyiha']);
    const isFollowUp = hasHistory && hasAny(normalizedMessage, ['да', 'так', 'это', 'этот', 'продолж', 'yes', 'that', 'it', 'еще', 'yana', 'ha']);

        if (language === 'ru') {
            if (isGreeting) return 'Привет. Я здесь и готова помочь. Что сейчас важнее всего?';
            if (asksIdentity) return `Я ${anisaAssistant.identity.name}, Ваш личный помощник. Помогаю думать, планировать, создавать, исследовать и разбираться с кодом. Сейчас я работаю в локальном режиме, поэтому не подключена к внешним сервисам.`;
            if (asksIdea) return 'Давайте начнем с сути: какую задачу должен решать проект и для кого он нужен? От этого можно быстро перейти к нескольким сильным идеям.';
            if (isFollowUp) return `Поняла. Вы продолжаете тему «${previousUserMessage.slice(0, 120)}». Давайте уточним следующий шаг: что именно хотите изменить или развить?`;
            return 'Поняла Вас. Опишите желаемый результат, и я помогу превратить его в конкретный следующий шаг.';
        }

        if (language === 'uz') {
            if (isGreeting) return 'Salom. Men shu yerdaman va yordam berishga tayyorman. Hozir nimadan boshlaymiz?';
            if (asksIdentity) return `Men ${anisaAssistant.identity.name}man, sizning shaxsiy yordamchingizman. Rejalashtirish, fikrlash, yaratish, tadqiqot va kod bilan ishlashda yordam beraman. Hozir mahalliy rejimda ishlayapman.`;
            if (asksIdea) return 'Avval asosiy maqsadni aniqlaylik: loyiha qaysi muammoni hal qiladi va kim uchun kerak? Shundan keyin yaxshi g‘oyalarni tanlaymiz.';
            if (isFollowUp) return `Tushundim. Siz «${previousUserMessage.slice(0, 120)}» mavzusini davom ettiryapsiz. Keyingi qadamda nimani aniqlashtiramiz?`;
            return 'Tushundim. Maqsadingizni yozing, men uni aniq va bajariladigan keyingi qadamga aylantirishga yordam beraman.';
        }

        if (isGreeting) return 'Hello. I am here and ready to help. What matters most right now?';
        if (asksIdentity) return `I am ${anisaAssistant.identity.name}, your personal assistant. I can help you think, plan, create, research, and work through code. I am currently running in local development mode.`;
        if (asksIdea) return 'Let us start with the core: what problem should the project solve, and who is it for? From there, we can shape a few useful ideas.';
        if (isFollowUp) return `I follow you. You are continuing the thread about "${previousUserMessage.slice(0, 120)}". What would you like to change or develop next?`;
        return 'I understand. Tell me the result you want, and I will help turn it into a clear next step.';
}

function resetMockAssistant() {}

export { getMockResponse, resetMockAssistant };