import { OpLogEntry, ConflictRecord } from '../db/schema';

export interface SyncEngineResult {
  finalOrder: any;
  conflicts: ConflictRecord[];
}

/**
 * Sort key for deterministic op-log execution:
 * Primary: Lamport Clock (ascending)
 * Secondary: Timestamp (ascending)
 * Tertiary: Device ID (ascending string comparison for total stability)
 */
export function compareOps(a: OpLogEntry, b: OpLogEntry): number {
  if (a.lamport_clock !== b.lamport_clock) {
    return a.lamport_clock - b.lamport_clock;
  }
  if (a.timestamp !== b.timestamp) {
    return a.timestamp.localeCompare(b.timestamp);
  }
  return a.device_id.localeCompare(b.device_id);
}

/**
 * Helper to set nested property on object by path string
 * e.g. "amount", "items[it-1].quantity", "items[it-1].attributes.color"
 */
function setByPath(obj: any, path: string, value: any): void {
  const parts = path.split('.');
  let curr = obj;

  for (let i = 0; i < parts.length - 1; i++) {
    let key = parts[i];
    const arrayMatch = key.match(/^([a-zA-Z_]+)\[([a-zA-Z0-9_-]+)\]$/);

    if (arrayMatch) {
      const arrName = arrayMatch[1];
      const itemId = arrayMatch[2];
      if (!curr[arrName]) curr[arrName] = [];
      let item = curr[arrName].find((it: any) => it.item_id === itemId || it.id === itemId);
      if (!item) {
        item = { item_id: itemId };
        curr[arrName].push(item);
      }
      curr = item;
    } else {
      if (!curr[key]) curr[key] = {};
      curr = curr[key];
    }
  }

  const lastKey = parts[parts.length - 1];
  const lastArrayMatch = lastKey.match(/^([a-zA-Z_]+)\[([a-zA-Z0-9_-]+)\]$/);
  if (lastArrayMatch) {
    const arrName = lastArrayMatch[1];
    const itemId = lastArrayMatch[2];
    if (!curr[arrName]) curr[arrName] = [];
    let item = curr[arrName].find((it: any) => it.item_id === itemId || it.id === itemId);
    if (!item) {
      curr[arrName].push({ item_id: itemId, ...value });
    } else {
      Object.assign(item, value);
    }
  } else {
    curr[lastKey] = value;
  }
}

/**
 * Deterministic Sync State Machine
 * Merges log of operations from all devices and produces identical final state
 * regardless of reconnection sequence.
 */
export function mergeAndApplyOps(initialOrder: any, allOps: OpLogEntry[]): SyncEngineResult {
  // Deep clone initial state
  const state = JSON.parse(JSON.stringify(initialOrder));
  const conflicts: ConflictRecord[] = [];

  // Sort operations deterministically
  const sortedOps = [...allOps].sort(compareOps);

  // Track field state mutations: target_path -> last winning OpLogEntry
  const pathToLastOp = new Map<string, OpLogEntry>();
  const tombstonedItems = new Set<string>();

  for (const op of sortedOps) {
    const path = op.target_path;

    // Check if target is a deleted item (Scenario 3: Delete vs Update)
    let isTargetingDeletedItem = false;
    let deletedItemId = '';

    for (const itemId of tombstonedItems) {
      if (path.includes(`[${itemId}]`)) {
        isTargetingDeletedItem = true;
        deletedItemId = itemId;
        break;
      }
    }

    if (op.op_type === 'DELETE_ITEM') {
      const itemId = op.value?.item_id || path.match(/\[([a-zA-Z0-9_-]+)\]/)?.[1];
      if (itemId) {
        tombstonedItems.add(itemId);
        // Remove item from state array
        if (Array.isArray(state.items)) {
          state.items = state.items.filter((it: any) => (it.item_id !== itemId && it.id !== itemId));
        }
        pathToLastOp.set(`items[${itemId}]`, op);
      }
      continue;
    }

    if (isTargetingDeletedItem) {
      // Scenario 3: Edit targeting a deleted item
      const deleteOp = pathToLastOp.get(`items[${deletedItemId}]`) || op;
      conflicts.push({
        conflict_id: `conf_${op.op_id}`,
        order_id: state.order_id || state.id || 'ORD-1042',
        scenario: 'SCENARIO_3_DELETE_VS_UPDATE',
        winning_op: deleteOp,
        losing_op: op,
        resolved_automatically: true,
        surfaced_to_operator: true,
        timestamp: op.timestamp
      });
      // Retain deletion, do not apply edit to main state
      continue;
    }

    // Check Scenario 2: Concurrent edit to exact same path
    if (pathToLastOp.has(path)) {
      const prevOp = pathToLastOp.get(path)!;
      if (prevOp.value !== op.value) {
        // Scalar conflict on same path!
        conflicts.push({
          conflict_id: `conf_${op.op_id}`,
          order_id: state.order_id || state.id || 'ORD-1042',
          scenario: 'SCENARIO_2_CONCURRENT_SCALAR',
          winning_op: op, // Later sorted op wins
          losing_op: prevOp,
          resolved_automatically: true,
          surfaced_to_operator: true,
          timestamp: op.timestamp
        });
      }
    }

    // Apply winning operation to state
    setByPath(state, path, op.value);
    pathToLastOp.set(path, op);
  }

  // Update status badge
  if (conflicts.length > 0) {
    state.status = 'CONFLICTED';
  } else if (!state.status) {
    state.status = 'SYNCED';
  }

  return {
    finalOrder: state,
    conflicts
  };
}
