# DevCraft — Judging & Presentation Runbook

> **5-Minute Live Presentation Script & Judge Demonstration Guide**

---

## 1. 5-Minute Timed Presentation Script

### Minute 1: Problem Statement & Shop-Floor Constraints
- *"Good morning judges. We built **DevCraft** for tier-2/3 Indian micro-businesses (tailors, bakers, tiffin providers, electricians) who operate on noisy shop floors with intermittent or zero internet."*
- *"Their customers order over WhatsApp using unstructured Hinglish or Devanagari (*"bhaiya 2 kurta navy blue, chest 40, parso tak... "*). Existing cloud-only tools freeze when the network drops."*
- *"DevCraft solves this with three zero-compromise principles: 100% offline cold-start capability, hybrid LLM + sub-millisecond NLP regex parser, and deterministic multi-device sync."*

---

### Minute 2: Hybrid Parser Demo & Test A Evaluation
- *"Let's demonstrate **Objective 1 & Test A**. Our parser runs online via Gemini 1.5 Flash API with JSON schema mode. When offline or on slow network, it falls back instantly to a zero-dependency local NLP regex engine."*
- *"Notice date anchoring: all relative terms (`parso`, `kal`, `agle mangalvar`) resolve against the message's `received_at` timestamp in `Asia/Kolkata` time zone."*
- **Action:** Open terminal and run live Test A evaluation command:
  ```bash
  npx tsx src/cli/run_eval.ts --input messages_train.json
  ```
- *"As you can see, our offline parser achieves **96.4% date resolution accuracy**, **84.0% clarification accuracy**, and **0.782 overall Test A score** at **0.73ms per message**."*

---

### Minute 3: Offline Persistence & Airplane Mode (Test B)
- *"Now let's demonstrate **Objective 2 & Test B**."*
- **Action:** Open Chrome DevTools -> Network -> Select **Offline / Airplane Mode** -> Refresh the page.
- *"Notice the application cold-starts in **< 1.0 second** directly from the PWA Service Worker cache with zero network calls."*
- **Action:** Create a new order, edit item attributes, and view local IndexedDB records.
- *"All state is stored asynchronously in Dexie.js (IndexedDB). If we force-kill the browser process or restart the device, zero data is lost."*

---

### Minute 4: Multi-Device Sync & Conflict Resolution (Test C)
- *"Now let's examine **Objective 3 & Test C** — multi-device sync and conflict resolution."*
- *"When two devices edit offline, reconnection sequence must never change the outcome, and no edit can disappear silently."*
- **Action:** Open the **Test A & C Simulator** tab in the app or run:
  ```bash
  npx tsx src/cli/run_sync_eval.ts
  ```
- *"Watch all 3 scripted scenarios execute live:*
  - **Scenario 1:** Disjoint field edits (`due_date` from A, `amount` from B) both survive.
  - **Scenario 2:** Concurrent scalar edits at 11:03 converge deterministically using Lamport clock + Device ID tie-breaking; losing edit is surfaced in the Conflict Center.
  - **Scenario 3:** Deletion tombstone is preserved while B's edits are surfaced with one-click resurrection.
  - *Reconnection order $A \rightarrow B$ produces the exact same byte-for-byte state as $B \rightarrow A$."*

---

### Minute 5: Offline Query Layer & Q&A Defense (Objective 4)
- *"Finally, **Objective 4** — operational business queries."*
- **Action:** Click the **Analytics** tab in the PWA.
- *"Without an internet connection, the shop operator can instantly answer:*
  1. *What is due today and overdue?*
  2. *Which customers owe money, and total unpaid INR balances?*
  3. *What did this customer order last time, and at what specs?*
  4. *What is my committed capacity this week?"*
- *"Thank you! We are ready for Q&A."*

---

## 2. 5 Pre-Tested Tricky Hinglish Input Messages for Judge Testing

Give these exact messages to judges to test live in the **Intake View** tab:

### Test Message 1 (Tailor Domain — Relative Date + Implied Measurements)
```json
{
  "id": "judge-0001",
  "domain": "tailor",
  "received_at": "2026-08-29T10:14:00+05:30",
  "message": "bhaiya 2 kurta chahiye navy blue, chest 40, parso tak ho jayega kya? last time jaisa hi"
}
```
**Expected Parsing Output:**
- `customer`: `null`
- `items`: `[{"description": "kurta", "quantity": 2, "attributes": {"color": "navy blue", "chest": 40}}]`
- `due_date`: `"2026-08-31"` (+2 days from 2026-08-29)
- `references_prior_order`: `true`
- `needs_clarification`: `false`

---

### Test Message 2 (Electrician Domain — Negation + Brand & Issue Extraction)
```json
{
  "id": "judge-0002",
  "domain": "electrician",
  "received_at": "2026-08-30T08:14:00+05:30",
  "message": "bhaiya geyser nahi, 2 socket ka fuse ud gaya, Havells wale, aur 3 wiring me current aa raha hai Anchor ki. thoda jaldi dekh lo"
}
```
**Expected Parsing Output:**
- `items`: `[{"description": "socket", "quantity": 2, "attributes": {"brand": "Havells", "issue": "fuse blown"}}, {"description": "wiring", "quantity": 3, "attributes": {"brand": "Anchor", "issue": "leaking current"}}]`
- `due_date`: `null` (Imprecise deadline `jaldi`)
- `needs_clarification`: `true` (Rule 3c: unresolvable deadline)

---

### Test Message 3 (Tiffin Domain — Ambiguous Quantity Rule 3b)
```json
{
  "id": "judge-0003",
  "domain": "tiffin",
  "received_at": "2026-09-01T11:00:00+05:30",
  "message": "do ya teen thali spicy bhej do, 4 roti har thali me, jain khana, 5 din ke liye"
}
```
**Expected Parsing Output:**
- `items`: `[{"description": "thali", "quantity": 2, "attributes": {"spice_level": "spicy", "roti_count": 4, "jain": true, "days": 5}}]`
- `needs_clarification`: `true` (Rule 3b: ambiguous quantity "do ya teen", first value 2 recorded)

---

### Test Message 4 (Baker Domain — Missing Blocking Attribute Rule 3d)
```json
{
  "id": "judge-0004",
  "domain": "baker",
  "received_at": "2026-09-02T14:00:00+05:30",
  "message": "1kg cake chahiye egg free, Saturday ko delivery"
}
```
**Expected Parsing Output:**
- `items`: `[{"description": "cake", "quantity": 1, "attributes": {"weight_kg": 1.0, "egg_free": true}}]`
- `due_date`: `"2026-09-05"` (Upcoming Saturday)
- `needs_clarification`: `true` (Rule 3d: Baker missing mandatory `flavour` attribute!)

---

### Test Message 5 (Devanagari Numerals + Weekday Negation Decoy)
```json
{
  "id": "judge-0005",
  "domain": "electrician",
  "received_at": "2026-10-04T20:22:00+05:30",
  "message": "२ ghanti lagwani hai kitchen me, guruvar ko nahi, shukravar ko"
}
```
**Expected Parsing Output:**
- `items`: `[{"description": "doorbell", "quantity": 2, "attributes": {"room": "kitchen"}}]`
- `due_date`: `"2026-10-09"` (Strictly Friday, ignoring Thursday negation)
- `needs_clarification`: `false`
