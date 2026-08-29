# 8-Hour Execution Sprint Plan & Implementation Roadmap

```
+---------------------------------------------------------------------------------------------------+
|                                 DEVCRAFT 8-HOUR SPRINT TIMELINE                                  |
+---------------------------------------------------------------------------------------------------+
| [H0.0 - H1.5] Phase 1: Core Data Layer, IndexedDB Schema & Test A CLI Runner                     |
| [H1.5 - H3.5] Phase 2: Hybrid Parser Pipeline (Gemini API + Offline Regex/NLP Engine)             |
| [H3.5 - H5.0] Phase 3: Offline-First React UI & Service Worker (PWA Cold-Start)                   |
| [H5.0 - H6.5] Phase 4: Deterministic Sync Engine & Test C Conflict Simulator                     |
| [H6.5 - H8.0] Phase 5: Operational Query Analytics, Polish, Audit & Deployment Configuration      |
+---------------------------------------------------------------------------------------------------+
```

---

## Sprint Breakdown

### Phase 1: Core Data Layer & Test A Batch CLI Runner (Hours 0.0 - 1.5)
**Goal:** Establish local IndexedDB storage, TypeScript interfaces, and the critical batch CLI script required to execute `score.py`.

- **Sprint Deliverables:**
  - Setup Vite + React + TypeScript workspace structure.
  - Configure `src/db/schema.ts` and `src/db/db.ts` using Dexie.js for tables: `orders`, `raw_messages`, `op_log`, `conflicts`.
  - Build `src/cli/parse_batch.ts` CLI entry point capable of:
    1. Reading `messages_train.json`.
    2. Passing each input record through parser stubs.
    3. Generating valid `sample_submission.json` formatted outputs.
    4. Automatically running `python score.py --gold messages_train.json --pred my_output.json --out breakdown.json` to verify zero missing predictions.

---

### Phase 2: Hybrid Parser Pipeline (Hours 1.5 - 3.5)
**Goal:** Build and tune the parser to maximize Test A accuracy score ($\ge 0.90$) while maintaining instant offline execution capability.

- **Sprint Deliverables:**
  - Build `src/parser/dateResolver.ts`: Handlers for `aaj`, `kal` (+1 day), `parso` (+2 days), `narsu` (+3 days), `agle <weekday>`, `is weekend`, `<N> tarikh`, `<N> din me`, anchored strictly to `received_at` in `Asia/Kolkata`.
  - Build `src/parser/vocabMatcher.ts`: Implement closed-set domain vocabulary rules (`tailor`, `tiffin`, `electrician`, `baker`).
  - Build `src/parser/offlineParser.ts`: High-speed zero-dependency NLP parser handling Hinglish numbers (`chalis`, `assi`, `sau`), Devanagari numerals (`१०`), item descriptions, quantities, and normative `needs_clarification` rules (a, b, c, d).
  - Build `src/parser/onlineParser.ts`: Gemini 1.5 Flash API client with structured JSON output schema system prompt.
  - Build `src/parser/hybridParser.ts`: Orchestrator that attempts online parsing (with 2500ms timeout) and falls back seamlessly to `offlineParser`.
  - **Milestone Check:** Run `parse_batch.ts` against `messages_train.json` and confirm `score.py` score $\ge 0.88$.

---

### Phase 3: Offline-First React UI & PWA Service Workers (Hours 3.5 - 5.0)
**Goal:** Implement high-contrast, shop-floor ready PWA client with zero blocking remote calls and $< 3$s cold start.

- **Sprint Deliverables:**
  - Configure `vite-plugin-pwa` in `vite.config.ts` for offline caching of static assets.
  - Implement design system tokens in `src/index.css` (High-contrast, mobile-first, tactile buttons).
  - Build core UI components:
    - `Header.tsx`: Online/Offline status indicator, pending sync badge, conflict count.
    - `MessageParserBox.tsx`: Interactive text box for pasting WhatsApp messages and parsing them live.
    - `OrderFeed.tsx`: Accessible list of current orders with status filters (Draft, Conflicted, Synced, Needs Clarification).
    - `OrderModal.tsx`: Order details, item attribute editor, and manual override form.
  - **Milestone Check:** Test cold start in airplane mode; verify PWA loads interactively in $< 3.0$ seconds.

---

### Phase 4: Sync Engine & Conflict Simulator (Hours 5.0 - 6.5)
**Goal:** Build deterministic operation-log sync engine satisfying Test C scenarios from `conflict_scenarios.md`.

- **Sprint Deliverables:**
  - Build `src/sync/lamport.ts`: Lamport clock generator and local device state tracking.
  - Build `src/sync/opLog.ts`: Transaction logger capturing field deltas (`CREATE`, `UPDATE_FIELD`, `DELETE_ITEM`, `DELETE_ORDER`).
  - Build `src/sync/conflictEngine.ts`: Deterministic state machine:
    - **Scenario 1:** Disjoint field edit merge (`due_date` + `amount`).
    - **Scenario 2:** Concurrent edit LWW tie-break via device ID + conflict surfacing.
    - **Scenario 3:** Tombstone delete vs edit update + resurrection queue.
  - Build `src/components/SyncSimulatorModal.tsx` & `src/sync/simulator.ts`: Interactive test harness to execute Scenarios 1, 2, and 3 on dual device states and verify $Sync(A \rightarrow B) == Sync(B \rightarrow A)$.
  - Build `src/components/ConflictDrawer.tsx`: UI drawer allowing operators to inspect and resolve surfaced conflicts.

---

### Phase 5: Analytics Query Layer, Deployment & Final Audit (Hours 6.5 - 8.0)
**Goal:** Operationalize business query dashboard, finalize deployment, and verify judging readiness.

- **Sprint Deliverables:**
  - Build `src/components/AnalyticsDashboard.tsx`: Offline queries for:
    - Overdue and due today orders.
    - Customer receivables ledger (total unpaid INR balances).
    - Customer order history & specification search ("last time jaisa").
    - Weekly capacity commitment breakdown.
  - Optimize production build (`npm run build`), ensuring total bundle $< 5\text{ MB}$.
  - Deploy to Vercel/Netlify public URL and prepare local offline fallback server.
  - Final Codebase Audit: Verify code formatting, inline explanations, and documentation completeness.
