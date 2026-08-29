# DevCraft System Architecture & Technical Specification

## 1. System Overview & Architecture Diagram

DevCraft is designed around an **Offline-First PWA Core** that guarantees instant responsiveness and full local operational capability regardless of network status.

```
+---------------------------------------------------------------------------------------------------+
|                                     REACT + VITE PWA CLIENT                                       |
|                                                                                                   |
|  +---------------------------+  +-------------------------------+  +---------------------------+  |
|  |     UI Layer (Tailwind)   |  |   Offline Analytical Queries  |  |   Conflict & Audit UI     |  |
|  | - Order Feed & Forms      |  | - Unpaid Ledger Balances      |  | - Conflict Resolution     |  |
|  | - Hinglish Input Bar      |  | - Due / Overdue Dashboard     |  | - Operation Log Visualizer|  |
|  +-------------+-------------+  +---------------+---------------+  +-------------+-------------+  |
|                |                                |                                |                |
|                +------------------------+-------+--------------------------------+                |
|                                         |                                                         |
|                                         v                                                         |
|  +---------------------------------------------------------------------------------------------+  |
|  |                             LOCAL DATA LAYER (Dexie.js / IndexedDB)                         |  |
|  |  - orders        - raw_messages        - operation_log        - conflict_queue           |  |
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
|  | ONLINE PATH: Gemini 1.5 Flash API          |  |    |  | Lamport Timestamps + Stable Device ID        |  |
|  | - Structured JSON Prompting                |  |    |  | Field-level Delta Merging                    |  |
|  | - Dynamic domain context & reference lookup|  |    |  | Reconnection-order Invariant State Machine   |  |
|  +---------------------+----------------------+  |    |  +---------------------+----------------------+  |
|                        | (Fallback on Timeout)   |    |                        |                         |
|                        v                         |    |                        v                         |
|  +--------------------------------------------+  |    |  +--------------------------------------------+  |
|  | OFFLINE PATH: Fast Regex / Dictionary NLP  |  |    |  | Conflict Queue & Tombstone Ledger            |  |
|  | - Devanagari & Hinglish Number Parsers     |  |    |  | Scenario 1: Disjoint Merging                 |  |
|  | - Date Anchoring against received_at       |  |    |  | Scenario 2: LWW + Tie-Break + Surfacing Edit |  |
|  | - Domain attribute closed-set vocabulary   |  |    |  | Scenario 3: Tombstone Delete vs Field Update  |  |
|  +--------------------------------------------+  |    |  +--------------------------------------------+  |
+--------------------------------------------------+    +--------------------------------------------------+
```

---

## 2. Component Specifications

### 2.1 Technology Stack & Decisions

| Layer | Technology | Selection Rationale & Constraints |
|---|---|---|
| **Framework & Build** | React 18 + Vite | Lightweight, ultra-fast cold start, small footprint (< 1.5MB gzip). |
| **Language** | TypeScript (Strict Mode) | Guarantees type safety across schema objects and sync operations. |
| **Local Database** | IndexedDB via Dexie.js | Asynchronous, transactional local storage capable of holding tens of thousands of orders offline. |
| **PWA Service Worker** | Vite PWA Plugin (Workbox) | Caches HTML/JS/CSS assets for 100% offline cold-start support. |
| **Online Parsing** | Gemini 1.5 Flash API (`@google/genai`) | Low-latency LLM execution with native structured JSON output capability. |
| **Offline Parsing** | Custom Zero-Dependency TS NLP Engine | Instant rule-based parsing engine using regex, dictionary maps, and date math. |
| **Styling** | Vanilla CSS + High-Contrast Tokens | Accessible high-contrast mobile tokens optimized for dim/bright shop floors. |

---

## 3. Parser Pipeline Architecture

The Parser Engine receives an input payload matching `x-devcraft-input-format`:
```json
{
  "id": "train-0007",
  "domain": "tailor",
  "received_at": "2026-08-29T10:14:00+05:30",
  "message": "bhaiya 2 kurta chahiye navy blue, chest 40, parso tak ho jayega kya? last time jaisa hi"
}
```

```
                        Input Message Record
                                 |
                                 v
                     Network Available & Healthy?
                       /                   \
                 (Yes)/                     \(No or Timeout)
                     v                       v
       +--------------------------+  +--------------------------+
       |   Gemini 1.5 Flash API    |  |  Offline Rule-based NLP  |
       |  - Schema JSON mode      |  |  - Hinglish Number Map   |
       |  - Strict system prompt   |  |  - Regex Attribute Extract|
       |  - Explicit vocabulary   |  |  - Date Math (Asia/Kolk) |
       +------------+-------------+  +------------+-------------+
                    |                             |
                    +--------------+--------------+
                                   |
                                   v
                   +------------------------------+
                   |  Schema Validation & Audit   |
                   |  - Sanitize vocabulary keys  |
                   |  - Enforce decision rules    |
                   |  - Output 7 schema fields    |
                   +------------------------------+
```

### 3.1 Online Path (Gemini 1.5 Flash)
- **Prompt Architecture:** The model is fed the precise JSON schema, domain vocabulary restrictions (`x-devcraft-vocabulary`), `received_at` date anchor, and normative `needs_clarification` rules.
- **Strict Output:** Output format set to `application/json` conforming strictly to `schema.json`.

### 3.2 Offline Path (Deterministic Rule-Based NLP Engine)
The offline parser operates with zero external network dependencies in under 5ms:
1. **Hinglish & Devanagari Number Normalizer:**
   - Devanagari digits (`०-९` $\rightarrow$ `0-9`).
   - Textual numbers: `ek` $\rightarrow 1$, `do` $\rightarrow 2$, `teen` $\rightarrow 3$, `char` $\rightarrow 4$, `paanch` $\rightarrow 5$, `chalis` $\rightarrow 40$, `saath` $\rightarrow 60$, `assi` $\rightarrow 80$, `sau` $\rightarrow 100$, `hazaar` $\rightarrow 1000$.
2. **Date Resolution Engine:**
   - Parses `received_at` string as `Asia/Kolkata` time zone baseline date ($D_{base}$).
   - `aaj` $\rightarrow D_{base} + 0$ days.
   - `kal` $\rightarrow D_{base} + 1$ day (Convention: `kal` is always tomorrow).
   - `parso` $\rightarrow D_{base} + 2$ days.
   - `narsu` / `tarso` $\rightarrow D_{base} + 3$ days.
   - `agle <weekday>` / `next <weekday>` $\rightarrow$ Strictly next occurrence of day (e.g., if today is Tuesday, `agle mangalvar` is +7 days).
   - `is weekend` $\rightarrow$ Upcoming Saturday.
   - `<N> tarikh` / `<N> ko` $\rightarrow$ Nth day of current month if $N \ge D_{base}.\text{day}$, else Nth of next month.
   - Imprecise expressions (`jaldi`, `asap`, `urgent`, `jab ho jaye`, `diwali se pehle`, etc.) $\rightarrow$ `due_date: null` AND `needs_clarification: true`.
3. **Domain Vocabulary Matcher:**
   - Filters item attributes strictly against closed vocabulary keys per domain (`tailor`, `tiffin`, `electrician`, `baker`). Unmatched keys are dropped or flagged.
4. **Clarification Decision Validator:**
   - Evaluates rules (a), (b), (c), and (d) systematically.

---

## 4. Sync & Conflict Resolution Model

DevCraft utilizes an **Operation-Log (Op-Log) CRDT-inspired architecture** with **Lamport Timestamps** to guarantee **Deterministic Convergence** and **Zero Silent Data Loss**.

### 4.1 Data Structures

#### 1. Operation Record (`OpLogEntry`)
```typescript
interface OpLogEntry {
  op_id: string;             // UUID v4
  order_id: string;          // Target Order ID
  device_id: string;         // Unique device identifier
  lamport_clock: number;     // Monotonically increasing Lamport clock
  timestamp: string;         // ISO-8601 local timestamp
  op_type: 'CREATE' | 'UPDATE_FIELD' | 'DELETE_ITEM' | 'DELETE_ORDER';
  target_path: string;       // e.g. "amount", "due_date", "items[it-1].quantity"
  value: any;                // New value being set or payload
  tombstone?: boolean;       // For deletion tracking
}
```

#### 2. Conflict Record (`ConflictEntry`)
```typescript
interface ConflictEntry {
  conflict_id: string;
  order_id: string;
  scenario: 'DISJOINT' | 'CONCURRENT_SCALAR' | 'DELETE_VS_UPDATE';
  winning_op: OpLogEntry;
  losing_op: OpLogEntry;
  resolved_automatically: boolean;
  surfaced_to_operator: boolean;
  operator_action?: 'DISMISS' | 'RESTORE_LOSING_VAL' | 'MANUAL_OVERRIDE';
}
```

### 4.2 State Machine & Conflict Resolution Policy

When Device A and Device B sync, their operation logs are merged and evaluated in deterministic order sorted by:
$$\text{Sort Key} = (\text{lamport\_clock}, \text{timestamp}, \text{device\_id})$$

```
                   Incoming Remote Operations Log
                                 |
                                 v
               Sort Ops by (Lamport, Timestamp, DeviceID)
                                 |
                                 v
              Iterate Operations & Apply to Local State
                                 |
        +------------------------+------------------------+
        |                        |                        |
        v                        v                        v
  Target Paths             Target Paths             Target Path deleted
   Disjoint?               Same Scalar?              vs Updated?
        |                        |                        |
        v                        v                        v
 [SCENARIO 1]              [SCENARIO 2]              [SCENARIO 3]
Merge both fields          Last-Write-Wins based     Retain Tombstone delete.
seamlessly.                on Sort Key.              Surface B's edits in
`due_date` from A,         Surface losing edit in    Conflict Drawer for
`amount` from B survive.   Conflict Queue UI.        operator undo/resurrect.
```

1. **Scenario 1 (Disjoint field edits):**
   - Device A changes `due_date` to `"2026-09-08"`.
   - Device B changes `amount` to `1500`.
   - **Resolution:** Paths do not overlap. Both operations are applied. Order converges to `{ due_date: "2026-09-08", amount: 1500 }` regardless of sync order.
2. **Scenario 2 (Concurrent scalar edit with identical timestamp):**
   - Device A (clock 11:03) sets `items[it-1].quantity` = `3`.
   - Device B (clock 11:03) sets `items[it-1].quantity` = `5`.
   - **Resolution:** Timestamps match. Device ID comparison acts as tie-breaker (e.g., `"device_B"` > `"device_A"`). `quantity: 5` wins deterministically. Device A's edit `quantity: 3` is stored in the Conflict Audit Ledger and surfaced via UI badge.
3. **Scenario 3 (Delete versus Update):**
   - Device A deletes `items[it-2]`.
   - Device B updates `items[it-2].attributes.color` = `"black"` and `quantity` = `4`.
   - **Resolution:** Item stays deleted (tombstoned). Device B's updates are recorded in `ConflictEntry` as surfaced lost intent, giving the shop operator a one-click button in the UI to resurrect `items[it-2]` with B's edits applied.

---

## 5. Complete Directory Structure

```
d1/
├── index.html                      # PWA HTML Entry Point
├── package.json                    # Dependencies & Scripts
├── tsconfig.json                   # Strict TypeScript Config
├── vite.config.ts                  # Vite + PWA Service Worker Config
├── schema.json                     # Official Output Schema Contract
├── DATASET_CARD.md                 # Dataset Card & Scoring Rules
├── conflict_scenarios.md           # Test C Scenarios
├── score.py                        # Official Test A Scorer
├── sample_submission.json          # Output Sample Contract
├── messages_train.json             # 250 Train Records
├── DevCraft.docx                   # Hackathon Brief
├── prd.md                          # Product Requirement Document
├── architecture.md                 # Architecture Specification
├── rules.md                        # Technical & AI Governance Rules
├── phases.md                       # 8-Hour Execution Sprint Plan
├── design.md                       # Mobile-First Design System & Tokens
├── memory.md                       # Project Tracker & Metrics
├── agent_brief.md                  # Master Brief for Agent Sessions
├── public/                         # PWA Static Assets & Icons
│   └── favicon.ico
└── src/
    ├── main.tsx                    # React Root Entry Point
    ├── App.tsx                     # Main Layout & Navigation
    ├── index.css                   # Design Tokens & Utilities
    ├── db/                         # Offline Data Layer
    │   ├── schema.ts               # Dexie IndexedDB Schema Definition
    │   ├── db.ts                   # Dexie Database Instance
    │   └── repo.ts                 # Order & OpLog Repository Methods
    ├── parser/                     # Hybrid Parser Engine
    │   ├── types.ts                # Order & Parser Type Definitions
    │   ├── onlineParser.ts         # Gemini 1.5 Flash API Handler
    │   ├── offlineParser.ts        # Zero-dep Regex/NLP Parser
    │   ├── dateResolver.ts         # Asia/Kolkata Relative Date Resolver
    │   ├── vocabMatcher.ts         # Domain Attribute Closed-Set Validator
    │   └── hybridParser.ts         # Parser Entry Point (Online + Fallback)
    ├── sync/                       # Sync & Conflict Resolution Engine
    │   ├── lamport.ts              # Lamport Clock Manager
    │   ├── opLog.ts                # Operation Log Generators & Mergers
    │   ├── conflictEngine.ts       # Deterministic Scenario 1, 2, 3 Resolver
    │   └── simulator.ts            # Multi-Device Test C Simulator
    ├── components/                 # UI Component Layer
    │   ├── Header.tsx              # Status Bar (Online/Offline/Sync Badge)
    │   ├── OrderFeed.tsx           # Order List with Filter & Search
    │   ├── OrderCard.tsx           # Individual Order View & Actions
    │   ├── OrderModal.tsx          # Order Create / Manual Edit Form
    │   ├── MessageParserBox.tsx    # Raw Message Input & Parse Trigger
    │   ├── ConflictDrawer.tsx      # Surfaced Conflicts Review UI
    │   ├── AnalyticsDashboard.tsx  # Unpaid Ledger & Due Date Queries
    │   └── SyncSimulatorModal.tsx  # Interactive Test C Scenario Tester
    └── cli/                        # Evaluation & Batch Processing
        └── parse_batch.ts          # CLI Script producing sample_submission.json
```
