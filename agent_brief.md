# DevCraft Agent Master Brief & System Invariants

## 1. Master Context for AI Agents

You are working on **DevCraft**, an offline-first order management Progressive Web Application (PWA) built for tier-2/3 Indian micro-businesses (tailors, tiffin services, electricians, bakers).

The system parses unstructured Hinglish/Devanagari WhatsApp order messages into strict structured JSON records, operates 100% offline via IndexedDB (Dexie.js), resolves multi-device edit conflicts deterministically, and provides offline business query analytics.

---

## 2. Core Technical Invariants & Rules

### 2.1 Output Contract (`schema.json`)
Every order extraction output MUST strictly match the following 7 fields:
1. `customer`: `string` or `null`.
2. `items`: Array of `{ description: string, quantity: number, attributes: object }`.
   - `description`: Lowercase singular string (evaluated by token-set F1 $\ge 0.80$).
   - `quantity`: Integer $\ge 1$. Unmarked items default to `1`.
   - `attributes`: Object whose keys MUST COME EXCLUSIVELY from `x-devcraft-vocabulary` for that domain:
     - `tailor`: `color, fabric, chest, waist, length, sleeve, size, fit`
     - `tiffin`: `portion, spice_level, meal, roti_count, jain, days`
     - `electrician`: `appliance, issue, room, brand, wattage`
     - `baker`: `flavour, weight_kg, egg_free, tier, message_on_cake, shape`
3. `due_date`: ISO-8601 calendar date (`YYYY-MM-DD`) or `null`.
4. `amount`: Number (INR) or `null`.
5. `references_prior_order`: `boolean` (`true` for *"last time jaisa"*, *"pichli baar wala"*).
6. `confidence`: Number between `0.0` and `1.0`.
7. `needs_clarification`: `boolean`.

### 2.2 Date Anchoring Baseline
- **Critical Rule:** Every relative date term (`aaj`, `kal`, `parso`, `agle mangalvar`, `10 tarikh`) MUST resolve against the record's `received_at` timestamp in the `Asia/Kolkata` time zone, **NOT against the current system clock**.
- `kal` is always **tomorrow** (+1 day).

### 2.3 Normative `needs_clarification` Rules
Set `needs_clarification: true` **if and only if**:
- **(a)** No identifiable item ordered.
- **(b)** Unreadable / ambiguous quantity (e.g. *"do ya teen kurta"* $\rightarrow$ set `quantity: 2` AND `needs_clarification: true`).
- **(c)** Unresolvable deadline (`jaldi`, `asap`, `urgent`, `jab ho jaye`, `diwali se pehle`, etc.) $\rightarrow$ set `due_date: null` AND `needs_clarification: true`. *(Absent deadline is `due_date: null` and `needs_clarification: false`).*
- **(d)** Missing blocking attribute: `baker` missing `flavour`, or `electrician` missing `issue` across all items. *(Tailor missing chest is NOT blocking).*

### 2.4 Performance & Offline Constraints
- PWA bundle size MUST remain $< 5.0\text{ MB}$.
- Cold-start time MUST remain $< 3.0\text{ seconds}$.
- Zero blocking network calls on the main UI thread.
- Full local CRUD functionality when offline.

---

## 3. Evaluation & Testing Commands

### Test A: Scoring Script
Run official Test A evaluation on predicted outputs:
```bash
python score.py --gold messages_train.json --pred output.json --out breakdown.json
```

### Test A Batch Runner
Run batch parser script to generate predictions:
```bash
npx tsx src/cli/parse_batch.ts --input messages_train.json --output output.json
```

### Test B & C UI Simulators
- **Test B (Offline Persistence):** Toggle Airplane mode in Chrome DevTools / phone; refresh application; verify IndexedDB persistence.
- **Test C (Conflict Resolution):** Open `SyncSimulatorModal` in UI; trigger Scenario 1, Scenario 2, and Scenario 3 edit sequences; verify $Sync(A \rightarrow B) == Sync(B \rightarrow A)$ determinism.

---

## 4. Architectural File Index

| File Path | Description |
|---|---|
| [prd.md](file:///d:/Satyam/Hackathons/DevCraft/d1/prd.md) | Product Requirement Document & Acceptance Criteria |
| [architecture.md](file:///d:/Satyam/Hackathons/DevCraft/d1/architecture.md) | High-Level Architecture, Hybrid Parser & Sync Engine Specs |
| [rules.md](file:///d:/Satyam/Hackathons/DevCraft/d1/rules.md) | Technical Constraints, Code Standards & AI Boundaries |
| [phases.md](file:///d:/Satyam/Hackathons/DevCraft/d1/phases.md) | 8-Hour Execution Roadmap & Sprint Tasks |
| [design.md](file:///d:/Satyam/Hackathons/DevCraft/d1/design.md) | UI/UX Design System, Color Tokens & Status Badges |
| [memory.md](file:///d:/Satyam/Hackathons/DevCraft/d1/memory.md) | Live Task Tracker, Known Limitations & Score Metrics |
| [schema.json](file:///d:/Satyam/Hackathons/DevCraft/d1/schema.json) | Official JSON Output Contract & Domain Vocabulary |
| [conflict_scenarios.md](file:///d:/Satyam/Hackathons/DevCraft/d1/conflict_scenarios.md) | Test C Multi-Device Conflict Edit Sequences |
| [score.py](file:///d:/Satyam/Hackathons/DevCraft/d1/score.py) | Official Test A Scorer Script |
