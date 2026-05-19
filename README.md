# Vercel AI SDK Fundamentals

A hands-on project that walks through the core capabilities of the [Vercel AI SDK](https://sdk.vercel.ai) — from one-shot text generation, to structured output with Zod, to a streaming chatbot with tool calling. Built as a companion to the [Vercel AI SDK Academy course](https://vercel.com/academy/ai-sdk).

## What's Inside

The project mixes **command-line lessons** (run as standalone scripts) with **interactive web lessons** (rendered through a Next.js 15 app). Every lesson uses the AI SDK's `generateText` / `streamText` primitives and, where useful, `Output.object()` for typed structured responses.

| #   | Lesson                  | Mode | What it shows                                                                                  |
| --- | ----------------------- | ---- | ---------------------------------------------------------------------------------------------- |
| 1   | Extraction              | CLI  | Reading a file and asking the model for a 50-word takeaway via `generateText`.                 |
| 2   | Classification          | CLI  | Tagging support requests with `category`, `urgency`, and `language` using `Output.array()`.    |
| 2b  | Invisible AI            | CLI  | Side-by-side comparison of plain text vs. structured output, and demos of "invisible AI" UX.   |
| 3   | Summarization           | Web  | Server Action that summarizes a thread into `headline / context / discussionPoints / takeaways`. |
| 4   | Extraction (Calendar)   | Web  | Form that turns natural language ("Coffee with John Tuesday 2pm") into a typed appointment.    |
| 5   | Chatbot                 | Web  | Streaming chat (`useChat`) with a `getWeather` tool that calls the Open-Meteo API.             |

All lessons default to `openai/gpt-5-mini` through the Vercel AI Gateway. Some files note `openai/gpt-5` as a swap-in for reasoning-heavy tasks.

## Tech Stack

- **Next.js 15** (App Router) + **React 19.2**
- **AI SDK v6** — `ai`, `@ai-sdk/gateway`, `@ai-sdk/openai`, `@ai-sdk/react`
- **Vercel AI Gateway** for unified model access and OIDC auth
- **Zod** for schema-validated structured output
- **Tailwind CSS v4** + **shadcn/ui** + **ai-elements** components
- **TypeScript**, **tsx** for CLI lessons
- **Yarn 4** (PnP) is the configured package manager (`packageManager` in `package.json`)

## Prerequisites

- Node.js v20+
- A Vercel account (free tier is fine) to obtain a Gateway token
- Yarn 4 — Corepack handles this automatically (`corepack enable`)

## Getting Started

### 1. Install dependencies

```bash
corepack enable
yarn install
```

### 2. Configure the AI Gateway

This project authenticates against Vercel AI Gateway via a short-lived `VERCEL_OIDC_TOKEN` (12h expiry). The easiest path:

```bash
yarn dlx vercel link
yarn dlx vercel env pull
```

This writes `.env.local` with the OIDC token. Alternatively, set `AI_GATEWAY_API_KEY` in `.env.local` to skip OIDC.

Verify your setup:

```bash
yarn tsx env-check.ts
```

### 3. Run it

```bash
# Web lessons (3, 4, 5) — http://localhost:3000
yarn dev

# Or use `vercel dev` for automatic OIDC token refresh
yarn dlx vercel dev
```

## Running the CLI Lessons

The npm scripts in `package.json` wire `tsx` to each lesson file:

```bash
yarn extraction              # Lesson 1: essay → 50-word takeaway
yarn classification          # Lesson 2: classify support_requests_multilanguage.json
yarn invisible-ai:compare    # Lesson 2b: generateText vs Output.object()
yarn invisible-ai:demo       # Lesson 2b: form-fill + email-triage demos
```

## Project Structure

```
app/
├── (1-extraction)/             CLI — generateText on an essay
│   ├── essay.txt
│   └── extraction.ts
├── (2-classification)/         CLI — Output.array() over support tickets
│   ├── classification.ts
│   └── support_requests*.json
├── (2-invisible-ai)/           CLI — structured-output comparison & UX demos
│   ├── test-structured.ts
│   └── invisible-ai-demo.ts
├── (3-summarization)/          Web — Server Action returning a typed summary
│   └── summarization/
│       ├── actions.ts          generateSummary() server action
│       ├── page.tsx
│       ├── message-list.tsx
│       ├── summary-card.tsx
│       └── messages.json
├── (4-extraction)/             Web — natural language → calendar appointment
│   └── extraction/
│       ├── actions.ts          extractAppointment() server action
│       ├── schemas.ts          Zod appointment schema
│       ├── page.tsx
│       └── calendar-appointment.tsx
├── (5-chatbot)/                Web — useChat() streaming UI
│   └── chat/
│       ├── page.tsx
│       └── weather.tsx         Renders the getWeather tool output
├── api/
│   └── chat/
│       ├── route.ts            streamText + tool wiring
│       └── tools.ts            getWeather tool (Open-Meteo)
├── layout.tsx
└── page.tsx                    Navigation home
components/
├── ai-elements/                Pre-built chat UI primitives
└── ui/                         shadcn/ui components
lib/
└── utils.ts
env-check.ts                    Sanity-checks AI Gateway credentials
model-comparison.ts             Standalone fast-vs-reasoning model benchmark
```

## Key AI SDK Patterns Used

- **`generateText({ model, prompt })`** — one-shot text generation (Lesson 1).
- **`generateText({ ..., output: Output.object({ schema }) })`** — typed single object (Lessons 3, 4, and the invisible-AI comparison).
- **`generateText({ ..., output: Output.array({ element: schema }) })`** — typed array (Lesson 2).
- **`streamText({ model, messages, tools, stopWhen: stepCountIs(5) })`** — streaming chat with tool calls (Lesson 5).
- **`tool({ description, inputSchema, execute })`** — defining a callable tool (`getWeather`).
- **`useChat()`** from `@ai-sdk/react` — client-side message state and streaming UI.

## About Vercel AI Gateway

The Gateway sits in front of multiple model providers and gives you:

- One API for OpenAI, Anthropic, and others — swap models with a string change
- Automatic retries and provider failover
- Usage & spend tracking per team
- Secure key storage scoped to your Vercel team

Provider keys are managed in the Vercel dashboard under **AI Gateway → Integrations**.

## Learn More

- [Vercel AI SDK Academy course](https://vercel.com/academy/ai-sdk)
- [AI SDK documentation](https://sdk.vercel.ai/docs)
- [Vercel AI Gateway docs](https://vercel.com/docs/ai-gateway)
- [AI SDK Playground](https://sdk.vercel.ai/playground)
