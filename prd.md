# Product Requirement Document (PRD) — DevCraft Offline-First Order Management PWA

## 1. Executive Summary & Vision
**DevCraft** is an offline-first, mobile-first Order Management Progressive Web Application (PWA) tailored specifically for Indian micro-businesses (single-operator mechanics, tailors, tiffin providers, electricians, and home bakers). 

In tier-2/3 Indian markets, customers place orders over unstructured WhatsApp or SMS text messages written in Hinglish, Devanagari, or mixed scripts ("bhaiya 2 kurta chahiye navy blue, chest 40, parso tak ho jayega kya?"). Internet connectivity on the shop floor is unreliable or frequently offline.

DevCraft bridges this gap by combining:
1. **A Hybrid Natural Language Parser Engine** that parses chaotic Indian text messages into structured JSON order records, powered by Gemini 1.5 Flash when online and an instant, zero-dependency rule-based NLP regex fallback when offline.
2. **Offline-First Persistence** using IndexedDB (Dexie.js), guaranteeing cold-start availability in <3 seconds and 100% full CRUD capability in airplane mode.
3. **Deterministic Multi-Device Sync & Conflict Engine**, utilizing Lamport timestamps, operation logs, and deterministic tie-breaking (device ID) to resolve conflicts without silent data loss across multi-device operations.
4. **Offline Operational Analytics & Query Engine** allowing operators to ask critical business questions (overdue items, total customer balances, weekly capacity) instantly without active network connectivity.

---

## 2. Target User Personas

| Persona | Domain | Typical Work Environment & Constraints | Common Message Patterns |
|---|---|---|---|
| **Ramesh (Master Tailor)** | `tailor` | Busy garment shop, noisy environment, intermittent 3G network. Uses single phone for WhatsApp customer orders. | *"bhaiya 2 kurta chahiye navy blue, chest 40, parso tak ho jayega kya? last time jaisa hi"* |
| **Sunita (Home Tiffin Service)** | `tiffin` | Cooking environment, hands covered in flour/water, instant updates needed. Customer orders change daily over text. | *"aaj 2 thali spicy bhej do, 4 roti har thali me, jain khana banega"* |
| **Vikram (Local Electrician)** | `electrician` | On the move, checking client homes, low bandwidth. Parts and issues must be recorded before visiting. | *"room 2 ka fan slow hai aur geyser spark kar raha hai, kal subah aana"* |
| **Ananya (Boutique Baker)** | `baker` | Baking workshop, precise recipe schedules, deadlines tied to events. Mandatory flavour specification. | *"1kg chocolate cake egg free, Saturday ko shaam 5 baje delivery"* |

### Key User Pain Points
- **Loss of connectivity on shop floors:** Cloud-only apps crash or freeze when network drops.
- **Unstructured multi-lingual order notes:** Text messages mix English, Hindi, Devanagari numerals (`१०`), relative dates (`parso`, `agle mangalvar`), and implied measurements (`chest 40`).
- **Conflict between staff phones:** Operator and delivery partner edit the same order while offline, resulting in silent overwrites or missing orders.
- **Scattered receivables:** Hard to calculate total money owed by a single customer or total orders due today without manual ledger scanning.

---

## 3. Core Feature Requirements

### Feature 1: Hybrid Hinglish/Devanagari Message Parser
- **Dual Pipeline:**
  - **Primary (Online):** Gemini 1.5 Flash LLM via Google AI Studio API for complex context, multi-item disambiguation, and implicit customer extraction.
  - **Fallback (Offline):** High-speed deterministic regex/dictionary parser handling Hinglish numbers (`chalis` → 40, `thali` → 1), relative dates (`parso` → `received_at + 2 days`), Devanagari digits (`१०` → 10), and closed-set domain attribute extractions.
- **Date Anchoring:** All relative date keywords (`aaj`, `kal`, `parso`, `narsu`, `tarso`, `agle <weekday>`, `is weekend`, `<N> tarikh`, `<N> din me`) MUST resolve against the record's `received_at` timestamp in the `Asia/Kolkata` timezone.
- **Schema Enforcement:** Strict validation against `schema.json` output contract:
  - `customer`: `string` or `null`.
  - `items`: array of `{ description, quantity, attributes }`. Description normalized to lowercase singular (F1 $\ge$ 0.80).
  - `due_date`: ISO-8601 calendar date (`YYYY-MM-DD`) or `null`.
  - `amount`: numeric INR value or `null`.
  - `references_prior_order`: `boolean` (`true` for *"last time jaisa"*, *"pichli baar wala"*).
  - `confidence`: `number` ($0.0 \le c \le 1.0$).
  - `needs_clarification`: `boolean` set strictly according to normative rules.

#### Normative `needs_clarification` Decision Rules:
Set `needs_clarification: true` **if and only if**:
1. **(a) No identifiable item:** The message places an order but fails to name the item.
2. **(b) Ambiguous/Unreadable Quantity:** Message says *"do ya teen kurta"*. Record the first stated quantity (`2`), and set `needs_clarification: true`.
3. **(c) Unresolvable Deadline:** Deadline referenced by imprecise temporal phrases like `jaldi`, `asap`, `urgent`, `jab ho jaye`, `festival se pehle`, `next week kabhi bhi`, `agle mahine`, `mahine ke end tak`, `diwali se pehle`, `shaadi se pehle`, `exam ke baad`, `jab time mile`. Set `due_date: null` and `needs_clarification: true`. *(Note: An absent deadline with no reference is `due_date: null` and `needs_clarification: false`).*
4. **(d) Missing Domain-Specific Blocking Attributes:**
   - `baker`: Missing `flavour` across ALL items.
   - `electrician`: Missing `issue` across ALL items.
   - *(Note: Tailor missing `chest` or Tiffin missing `meal` are NOT blocking; set `needs_clarification: false`).*

---

### Feature 2: Offline-First Persistence & PWA Capability
- **Local Storage Engine:** IndexedDB powered by Dexie.js for storing Orders, Raw Messages, Operation Logs, and Conflict Records.
- **PWA Service Worker:** Workbox cache-first strategy for static assets (HTML, CSS, JS, Fonts).
- **Performance Constraints:**
  - Initial PWA bundle download size $< 5\text{ MB}$.
  - Cold start to interactive UI in $< 3\text{ seconds}$ on mid-range Android devices.
  - Zero blocking remote network calls on critical path rendering or local CRUD.

---

### Feature 3: Multi-Device Sync & Deterministic Conflict Engine
- **State Model:** Operation-log based conflict-free replication with Lamport Timestamps and unique `device_id` tie-breaking.
- **Deterministic Convergence:** Reconnection order of Device A then B MUST yield the exact same final state as B then A ($A \oplus B = B \oplus A$).
- **No Silent Data Loss:** Every conflict is recorded in an auditable Conflict Queue and surfaced on the operator UI badge/banner.
- **Scenario Handling (Aligned with `conflict_scenarios.md`):**
  - **Scenario 1 (Disjoint field edits):** Merge edits seamlessly (`due_date` from A, `amount` from B both survive).
  - **Scenario 2 (Concurrent scalar edit with identical timestamp):** Deterministic tie-break using stable `device_id` comparison (`quantity: 5` wins if B's device ID > A's device ID; losing edit `quantity: 3` logged in Conflict Audit Queue).
  - **Scenario 3 (Delete vs Update):** Deletion tombstones record while updating attributes/quantity on another device. Retains tombstone deletion while surfacing discarded/resurrected edits in the operator's Conflict Review Drawer for one-click restoration/undo.

---

### Feature 4: Offline Operational Analytics & Query Layer
An intuitive offline dashboard providing instant structured answers to key business questions:
- **Due & Overdue Orders:** Filter orders where `due_date <= today` or `due_date < today`.
- **Receivables Ledger:** Aggregate outstanding unpaid balances (`amount` sum per customer and global pending INR total).
- **Customer Order History:** Fast lookup of prior orders, specifications (`attributes`), and quantities for repeated orders (*"last time jaisa"*).
- **Capacity Commitment:** Group active orders by due date week/day to visualize shop-floor workload.

---

## 4. Acceptance Criteria & Evaluation Test Alignment

```
                                  +---------------------------------------+
                                  |        DevCraft Platform PRD          |
                                  +---------------------------------------+
                                                      |
         +--------------------------------------------+--------------------------------------------+
         |                                            |                                            |
         v                                            v                                            v
+----------------------------------+     +----------------------------------+     +----------------------------------+
|    Test A: Parsing Accuracy      |     |  Test B: Offline Persistence     |     |   Test C: Conflict Resolution    |
| (Weight: 25% of Total Score)     |     | (Weight: 25% of Total Score)     |     | (Weight: 25% of Total Score)     |
+----------------------------------+     +----------------------------------+     +----------------------------------+
| * 60% Field-Level Extraction F1  |     | * Cold start < 3 seconds         |     | * Reconnection order invariance  |
| * 20% Date Resolution (Asia/Kolk)|     | * PWA Bundle < 5 MB              |     | * Zero silent edit drops         |
| * 20% Correct needs_clarification|     | * 100% functional in Airplane    |     | * Aligned to Scenarios 1, 2, & 3 |
| * Batch CLI score.py runner      |     | * State survives app/device kill |     | * UI Conflict Review Drawer      |
+----------------------------------+     +----------------------------------+     +----------------------------------+
```

### Test A Acceptance Criteria (Parsing Accuracy)
- Batch CLI script `parse_batch.ts` / `run_test_a.py` executes predictions against `messages_train.json` (or held-out `messages_test_inputs.json`) and produces `sample_submission.json` formatted outputs.
- Running `python score.py --gold messages_train.json --pred output.json` yields target metrics:
  - Field-level extraction accuracy $\ge 0.88$
  - Date resolution accuracy $\ge 0.92$
  - `needs_clarification` accuracy $\ge 0.94$
  - Overall Test A score $\ge 0.90$

### Test B Acceptance Criteria (Offline Behavior & Persistence)
- Cold start in airplane mode opens app interactive state in $< 3.0$ seconds on low/mid-range devices.
- Local CRUD operations function 100% offline with zero console network errors.
- Force-killing PWA process or rebooting device preserves all stored orders, pending edits, and sync logs in IndexedDB.

### Test C Acceptance Criteria (Conflict Resolution)
- Multi-device simulator tests Scenarios 1, 2, and 3 from `conflict_scenarios.md`.
- Deterministic verification: `Sync(A -> B)` produces exact byte-for-byte identical database state as `Sync(B -> A)`.
- Zero silent loss: Discarded edits appear with clear notification badges in the UI Conflict Drawer.
