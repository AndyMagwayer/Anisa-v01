# AI Chatbot

> A modular AI chatbot project focused on natural conversation, flexible response logic, and a scalable architecture.

## 📌 Overview

This project is a customizable AI chatbot designed with a modular architecture.
The current version contains a local/mock assistant layer that allows us to develop and test the chatbot's behavior before connecting it to a production AI provider.

The project is currently **under active development**.

## ✨ Current Features

* 💬 Chat-based interaction
* 🧠 Modular assistant logic
* 🔌 Separate AI service layer
* ⚙️ Centralized server configuration
* 🧩 Helper utilities for assistant behavior
* 🛠️ Local/mock AI responses for development
* 🔄 Easy replacement of the mock assistant with a real AI provider
* 🧪 Runtime checks and basic validation

## 🏗️ Project Structure

```text
project/
│
├── mock-assistant.js     # Local assistant / development response layer
├── ai-service.js         # AI service abstraction
├── server-config.js      # Server configuration
│
├── package.json          # Project dependencies and scripts
├── README.md             # Project documentation
│
└── ...
```

> The project structure may change as development continues.

## ⚙️ Architecture

The chatbot is designed around separated layers:

```text
User
  │
  ▼
Chat Interface
  │
  ▼
AI Service
  │
  ├── Mock Assistant
  │
  └── Future AI Provider
  │
  ▼
Response
```

This approach allows the chatbot's core logic to remain independent from a specific AI provider.

## 🚧 Development Status

### Current stage

**In development**

The current focus is on:

* improving conversation logic;
* refining assistant behavior;
* cleaning and stabilizing the codebase;
* preparing the architecture for a real AI integration;
* improving context and response management.

### Planned

* [ ] Connect a production AI model
* [ ] Improve conversation memory
* [ ] Add persistent user context
* [ ] Improve system prompt architecture
* [ ] Add configurable assistant personalities
* [ ] Add better error handling
* [ ] Add authentication
* [ ] Add database support
* [ ] Add automated tests
* [ ] Improve frontend/chat interface
* [ ] Deploy production version

## 🛠️ Tech Stack

The project currently uses:

* **JavaScript**
* **Node.js**
* **Git / GitHub**

Additional technologies may be introduced as the project evolves.

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd <project-folder>
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the project

```bash
npm start
```

If the project uses a different startup command, update this section accordingly.

## 🧪 Development

During development, the project can operate using the local mock assistant.

This makes it possible to test:

* request handling;
* response generation;
* server behavior;
* assistant logic;
* integration between different modules;

without requiring a production AI API.

## 🔐 Environment Variables

If external services are added, sensitive configuration should be stored in environment variables.

Example:

```env
AI_API_KEY=your_api_key
PORT=3000
```

**Never commit API keys or other private credentials to the repository.**

## 📈 Roadmap

The long-term goal is to transform the current prototype into a fully modular AI chatbot with:

1. Reliable conversational context
2. Persistent memory
3. Configurable personality
4. External AI model integration
5. Scalable backend architecture
6. Production-ready error handling
7. Modern chat interface

## 🤝 Contributing

The project is currently maintained as an active development project.

Suggestions, improvements, and technical contributions are welcome as the architecture evolves.

## 📄 License

License information will be added when the project reaches the appropriate release stage.

---

**Status:** 🟡 Active Development
**Version:** `0.x`
