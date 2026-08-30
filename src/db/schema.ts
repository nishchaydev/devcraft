import Dexie, { type Table } from 'dexie';
import { OrderRecord } from '../parser/types';

export type OrderStatus = 'DRAFT' | 'SYNCED' | 'CONFLICTED' | 'NEEDS_CLARIFICATION' | 'DELIVERED' | 'PENDING';

export interface StoredOrder extends OrderRecord {
  id: string; // Order ID e.g. ORD-1042
  status: OrderStatus;
  device_id: string;
  updated_at: string;
  is_deleted?: boolean;
  is_paid?: boolean;
  paid_at?: string | null;
}

export interface StoredRawMessage {
  id: string;
  domain: string;
  received_at: string;
  message: string;
  created_at: string;
}

export interface OpLogEntry {
  op_id: string; // UUID v4
  order_id: string;
  device_id: string;
  lamport_clock: number;
  timestamp: string; // ISO-8601
  op_type: 'CREATE' | 'UPDATE_FIELD' | 'DELETE_ITEM' | 'DELETE_ORDER';
  target_path: string; // e.g. "amount", "due_date", "items[it-1].quantity"
  value: any;
  tombstone?: boolean;
}

export interface ConflictRecord {
  conflict_id: string;
  order_id: string;
  scenario: 'SCENARIO_1_DISJOINT' | 'SCENARIO_2_CONCURRENT_SCALAR' | 'SCENARIO_3_DELETE_VS_UPDATE';
  winning_op: OpLogEntry;
  losing_op: OpLogEntry;
  resolved_automatically: boolean;
  surfaced_to_operator: boolean;
  operator_action?: 'DISMISS' | 'RESTORE_LOSING_VAL' | 'MANUAL_OVERRIDE';
  timestamp: string;
}

export class DevCraftDatabase extends Dexie {
  orders!: Table<StoredOrder, string>;
  raw_messages!: Table<StoredRawMessage, string>;
  op_log!: Table<OpLogEntry, string>;
  conflicts!: Table<ConflictRecord, string>;

  constructor() {
    super('DevCraftDB');
    this.version(2).stores({
      orders: 'id, customer, due_date, status, updated_at, is_deleted, is_paid',
      raw_messages: 'id, domain, received_at, created_at',
      op_log: 'op_id, order_id, device_id, lamport_clock, timestamp, op_type',
      conflicts: 'conflict_id, order_id, scenario, timestamp, surfaced_to_operator'
    });
  }
}

export const db = new DevCraftDatabase();
