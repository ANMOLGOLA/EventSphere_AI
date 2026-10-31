# EventSphere AI — Autonomous Multi-Event Planning & Management Suite

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Google GenAI](https://img.shields.io/badge/Google%20GenAI-Gemini%203.8%20Flash-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest-Suite%20Passed-729B1B?logo=vitest&logoColor=white)](https://vitest.dev/)

---

## 🌟 Executive Summary & Problem Statement Alignment

Planning mid-to-large-scale celebrations—such as bespoke weddings, milestone anniversaries, and community galas—is notoriously stressful, fragmented, and prone to budget overruns and schedule conflicts. Planners and hosts routinely juggle dozens of spreadsheets, disconnected vendor emails, and manual day-of schedules without actionable intelligence.

**EventSphere AI** solves this end-to-end through an autonomous, context-aware management suite powered by **Google Gemini 3.8 Flash**. It unites:
1. **Autonomous Event Copilot ("Event Whisperer"):** A persistent, context-aware AI partner that analyzes active event budget balances, guest headcount, and schedule milestones to recommend immediate next steps and negotiation scripts.
2. **AI Concept & Moodboard Synthesizer:** Real-time design ideation generating structured color palettes (hex triplets), tactile styling descriptions, and decor highlights.
3. **Smart Budget & Contingency Tracker:** Real-time computation of committed vs. actual spend, automatic variance detection, and contingency buffer alerts.
4. **Conflict-Aware Run-of-Show Timelines:** Granular minute-by-minute cue management that highlights overlapping milestones and vendor buffer gaps.
5. **Vendor Management & Comparison Engine:** Head-to-head AI evaluation comparing quotes, ratings, and deliverables alongside automated vendor inquiry drafting.
6. **Guest List & Seating Allocations:** RSVP tracking, dietary restrictions logging, and table allocations.

---

## 🤖 Gen AI Architecture & Services

EventSphere AI leverages the official **Google GenAI SDK (`@google/genai`)** with the high-performance **`gemini-3.8-flash`** model:

* **Event Copilot (`/api/gemini/copilot`):** Ingests live event state (active tab, guest count, location, remaining contingency) with custom editorial system instructions to produce formatted checklists, advice, and scripts.
* **Structured Concept Generator (`/api/gemini/generate-concept`):** Leverages Gemini's structured JSON output mode (`responseMimeType: 'application/json'`) to return validated design concepts with exact hex color triplets and sensory descriptions.
* **Custom Vendor Inquiry Drafter (`/api/gemini/vendor-inquiry`):** Generates polished, personalized inquiry emails containing venue logistics, guest metrics, and package requirements.
* **Vendor Trade-Off Comparison (`/api/gemini/compare-vendors`):** Evaluates competing vendor quotes with multi-factor price variance, rating credibility, and executive recommendations.

---

## 🔒 Security Hardening & Data Protection

* **Secret Isolation:** API keys reside exclusively in server-side environment variables (`GEMINI_API_KEY`) and are never exposed to browser bundles.
* **Defense-in-Depth Headers:** Express server configured with **Helmet** Content Security Policy (CSP), restricting script sources, connect origins, and styles.
* **Strict CORS Whitelisting:** Configured for local development and authorized production origins.
* **Rate Limiting & DoS Protection:** Dual-tier rate limiting via `express-rate-limit` (100 reqs/15 min global; 15 reqs/min on AI endpoints) preventing prompt flooding and quota exhaustion.
* **Input Validation & Sanitization:** All incoming API payloads are parsed with **Zod** runtime schemas. Client and server inputs undergo XSS character escaping via `src/utils/security.ts`.
* **Safe External Links:** Enforces `target="_blank"` with `rel="noopener noreferrer"`.

---

## ♿ Accessibility & Universal Design (WCAG 2.1 AA)

* **WAI-ARIA Dialog Standards:** All modals implement `role="dialog"`, `aria-modal="true"`, and explicit `aria-labelledby` matching header IDs.
* **Accessible Controls:** Interactive icon buttons include explicit `aria-label` descriptions (e.g., `aria-label="Close dialog"`).
* **Live Regions for AI Streaming:** Copilot drawer employs `role="log"`, `aria-live="polite"`, and `aria-atomic="true"` for screen-reader announcements.
* **Focus States & High Contrast:** Visible focus indicators (`focus-visible:ring-2 focus-visible:ring-[#9D3E1A]`) and high-contrast color choices meeting contrast ratios.

---

## ⚡ Performance & Efficiency

* **Instant Bundling:** Built with Vite 8 and Tailwind CSS v4, achieving production builds in under 9 seconds.
* **In-Memory AI Response Caching:** LRU cache with 5-minute TTL preventing duplicate AI calls for identical user queries.
* **Optimized Test Suite:** Vitest configured with worker thread isolation (`pool: 'threads'`), executing parallel test suites in milliseconds.

---

## 🧪 Testing & Verification

Comprehensive test suites covering unit utilities, calculations, security validators, and interactive React components:

```bash
# Run type checking and test suite
npm run check

# Run tests in watch mode
npm run test:watch

# Generate test coverage report
npm run test:coverage
```

### Verified Test Suites:
* `src/utils/__tests__/calculations.test.ts` — Budget variance, contingency, and timeline overlap detection.
* `src/utils/__tests__/security.test.ts` — XSS escaping, monetary clamping, input truncation, and link hardening.
* `src/components/__tests__/BudgetTab.test.tsx` — Budget summary rendering, category breakdowns, and expense additions.
* `src/components/__tests__/CopilotDrawer.test.tsx` — Optimistic messaging, accessibility attributes, and AI response updates.

---

## 🚀 Getting Started

### Prerequisites
* Node.js 18+ (tested up to Node 25)
* npm or pnpm

### Quickstart
1. **Clone the repository:**
   ```bash
   git clone https://github.com/ANMOLGOLA/EventSphere_AI.git
   cd EventSphere_AI
   ```

2. **Install dependencies:**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Configure environment:**
   Create a `.env` file in the project root:
   ```env
   GEMINI_API_KEY="your-google-gemini-api-key"
   PORT=3000
   ```

4. **Launch development server:**
   ```bash
   npm run dev
   ```
   Open **http://localhost:3000** in your browser.

---

## ☁️ Deployment

Configured for one-click deployment on **Vercel** serverless architecture:
* Build Command: `npm run build`
* Output Directory: `dist`
* Serverless Entry Point: `api/index.ts`
* Routes: Automatically configured via `vercel.json`
