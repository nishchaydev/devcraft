# via-P.A.A.R. — Progressive Adaptive Automation & Order Parsing System

> **via-P.A.A.R.** is a production-grade, offline-first Progressive Web Application (PWA) and Order Management System engineered for Indian micro-businesses (tailors, kirana stores, electricians, and home bakers). It seamlessly converts unstructured Hinglish/Devanagari WhatsApp messages into structured, actionable order records with AI-powered multi-domain intelligence, real-time two-way synchronization, and deterministic offline conflict resolution.

---

## 🌟 Key Highlights & Value Proposition

- **Fin AI Intelligent Order Parsing:** Leverages high-throughput LLM parsing (`openai/gpt-oss-120b` via Groq) combined with a deterministic offline NLP fallback engine (0.46ms latency). Resolves relative date references (*"parso tak"*, *"kal shaam"*) anchored to `Asia/Kolkata` timestamps.
- **Intercom-Inspired Lite UI/UX:** Built with a warm editorial aesthetic—creamy canvas ground (`#f5f1ec`), pure white cards with crisp hairline borders (`#d3cec6`), and signature Fin Orange (`#ff5600`) action accents.
- **Dual Role Architecture:**
  - **Customer Portal:** Browse verified micro-merchants, send voice/text order queries in natural Hinglish, and monitor order fulfillment in real-time.
  - **Vendor Workstation:** Unified customer inbox, one-click forward to Fin AI Parser, JSON inspector, 1-click **Save to Order Ledger**, and instant vendor reply chips.
- **Offline-First Resilience:** 100% functional without internet connectivity via **Dexie.js (IndexedDB)** and **Workbox PWA Service Workers** (<1.0s cold start).
- **Deterministic Multi-Device Synchronization:** Powered by an Operation-Log CRDT model with Lamport Clocks and stable device ID tie-breaking, ensuring zero silent data loss across reconnection sequences.

---

## 🏗️ System Architecture

```
+---------------------------------------------------------------------------------------------------+
|                                  via-P.A.A.R. REACT + VITE PWA                                    |
|                                                                                                   |
|  +---------------------------+  +-------------------------------+  +---------------------------+  |
|  |     Customer Portal       |  |       Vendor Workstation      |  |     Operational Analytics |  |
|  | - Store Discovery         |  | - Two-Way Customer Chats      |  | - Zero-Scroll Queries     |  |
|  | - Hinglish/Voice Intake   |  | - Forward to Fin AI Parser    |  | - Overdue & Unpaid Ledgers|  |
|  | - Live Order Updates      |  | - 1-Click Save to Ledger      |  | - Customer History Search |  |
|  +-------------+-------------+  +---------------+---------------+  +-------------+-------------+  |
|                |                                |                                |                |
|                +------------------------+-------+--------------------------------+                |
|                                         |                                                         |
|                                         v                                                         |
|  +---------------------------------------------------------------------------------------------+  |
|  |                             LOCAL DATA LAYER (Dexie.js / IndexedDB)                         |  |
|  |  - orders        - raw_messages        - op_log              - conflicts                     |  |
|  +----------------------------------------------+----------------------------------------------+  |
+-------------------------------------------------|-------------------------------------------------+
                                                  |
                         +------------------------+------------------------+
                         |                                                 |
                         v                                                 v
+--------------------------------------------------+    +--------------------------------------------------+
|             HYBRID PARSER PIPELINE               |    |          DETERMINISTIC SYNC ENGINE               |
|                                                  |    |                                                  |
|  +--------------------------------------------+  |    |  +--------------------------------------------+  |
|  | ONLINE ROUTE: Fin AI LLM Parser            |  |    |  | Lamport Timestamps + Stable Device ID        |  |
|  | - openai/gpt-oss-120b (Groq API)           |  |    |  | Monotonic Op-Log Delta Merging               |  |
|  | - Structured JSON output schema mode       |  |    |  | Cross-Tab BroadcastChannel & Local Bus        |  |
|  +---------------------+----------------------+  |    |  +---------------------+----------------------+  |
|                        | (Fallback / Offline)    |                             |                         |
|                        v                         |                             v                         |
|  +--------------------------------------------+  |    |  +--------------------------------------------+  |
|  | OFFLINE ROUTE: Zero-Dep Regex/NLP Engine   |  |    |  | Supabase Realtime Postgres Sync               |  |
|  | - Devanagari & Hinglish Number Normalizers |  |    |  | Non-Destructive Conflict Queue               |  |
|  | - Asia/Kolkata Date Anchoring              |  |    |  | Multi-Device Convergence (A -> B == B -> A)  |  |
|  | - Closed Vocabulary Enforcer (schema.json) |  |    |  +--------------------------------------------+  |
|  +--------------------------------------------+  |    +--------------------------------------------------+
+--------------------------------------------------+
```

---

## 💻 Tech Stack

- **Frontend Core:** React 18, TypeScript, Tailwind CSS v3
- **Icons & UI Primitives:** Lucide React, Custom Intercom Design Tokens
- **Local Persistence:** Dexie.js (IndexedDB wrapper)
- **PWA & Offline Service Worker:** `vite-plugin-pwa`, Workbox
- **Cloud & Realtime Sync:** Supabase (PostgreSQL, Realtime subscriptions, Auth)
- **AI / LLM Parsing Engine:** Groq Cloud API (`openai/gpt-oss-120b`), Google Gemini 1.5 Flash
- **Build Toolchain:** Vite 6, TypeScript Compiler (`tsc`)

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or later
- **npm**: v9.0.0 or later

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/guptasankalp/devcraft.git
   cd devcraft
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory (or use default development fallbacks):
   ```env
   VITE_LLM_API_KEY=your_groq_or_gemini_api_key
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Launch Development Server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

5. **Build for Production:**
   ```bash
   npm run build
   ```

6. **Preview Production Build:**
   ```bash
   npm run preview
   ```

---

## 🧪 Evaluation & Verification Commands

### Test A — Parsing Accuracy Evaluation
Run the automated evaluation harness against the ground truth dataset:
```bash
npx tsx src/cli/run_eval.ts --input messages_train.json
```
- **Date Resolution Accuracy:** `>96%`
- **Needs Clarification Precision:** `>84%`
- **Offline NLP Latency:** `<1.0ms` per message

### Test B — Offline PWA & Storage Resilience
1. Launch the application in Chrome / Edge.
2. Open DevTools → **Network** tab → Check **Offline** (or toggle Airplane Mode).
3. Create, edit, and filter orders locally.
4. Refresh the page to verify full IndexedDB data retention and instantaneous Service Worker cache load.

### Test C — Multi-Device Conflict Invariance
Run the automated sync simulation suite verifying commutative conflict resolution:
```bash
npx tsx src/cli/run_sync_eval.ts
```
- **Scenario 1:** Disjoint field edits converge cleanly (`PASS ✅`)
- **Scenario 2:** Concurrent scalar edits resolve deterministically via Lamport Timestamps (`PASS ✅`)
- **Scenario 3:** Tombstone deletions preserve audit trail without data corruption (`PASS ✅`)

---

## 📱 Progressive Web App (PWA) Capabilities

- **Installable Desktop & Mobile App:** Add to home screen with custom `via-P.A.A.R.` branding and icons.
- **Background Sync & Pre-caching:** Static assets and database schemas are pre-cached on first install for zero-latency execution.
- **Cross-Device Broadcast:** Changes made in one window or device automatically reflect across all active sessions.

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
