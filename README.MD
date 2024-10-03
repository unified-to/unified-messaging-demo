# Unified.to Messaging API example

This repo represents a sample application that displays a messaging user interface. It uses the Vue 3 framework, but should give the developer enough examples that it could be rewritten in React, Angular, or any other front-end framework.

The application calls the Unified.to Messaging API to retrieve a list of messages. It does so from the front-end, so the API key is exposed to the browser, which MUST NEVER be done in a real-world application. A production application would use a back-end server to call the Unified.to API, and thus store the API key securely.

## Running the application

```
cd vuejs
npm install
npm run dev
```
