import { OpLogEntry } from '../db/schema';
import { mergeAndApplyOps } from './conflictEngine';

export const INITIAL_ORDER_STATE = {
  order_id: 'ORD-1042',
  customer: 'Meena aunty',
  items: [
    { item_id: 'it-1', description: 'kurta', quantity: 2, attributes: { color: 'navy blue', chest: 40 } },
    { item_id: 'it-2', description: 'pajama', quantity: 1, attributes: { color: 'cream', waist: 34 } }
  ],
  due_date: '2026-09-05',
  amount: 1200,
  references_prior_order: false,
  confidence: 1.0,
  needs_clarification: false,
  status: 'SYNCED'
};

export interface ScenarioTestResult {
  scenarioName: string;
  reconnectionA_Then_B: any;
  reconnectionB_Then_A: any;
  isDeterministic: boolean;
  surfacedConflictsCount: number;
}

export function runScenario1(): ScenarioTestResult {
  // Scenario 1: Disjoint field edits
  // Device A (10:12): due_date -> "2026-09-08"
  // Device B (10:15): amount -> 1500
  const opsDeviceA: OpLogEntry[] = [
    {
      op_id: 'op_a1',
      order_id: 'ORD-1042',
      device_id: 'device_A',
      lamport_clock: 1,
      timestamp: '2026-08-29T10:12:00.000Z',
      op_type: 'UPDATE_FIELD',
      target_path: 'due_date',
      value: '2026-09-08'
    }
  ];

  const opsDeviceB: OpLogEntry[] = [
    {
      op_id: 'op_b1',
      order_id: 'ORD-1042',
      device_id: 'device_B',
      lamport_clock: 2,
      timestamp: '2026-08-29T10:15:00.000Z',
      op_type: 'UPDATE_FIELD',
      target_path: 'amount',
      value: 1500
    }
  ];

  const resA_Then_B = mergeAndApplyOps(INITIAL_ORDER_STATE, [...opsDeviceA, ...opsDeviceB]);
  const resB_Then_A = mergeAndApplyOps(INITIAL_ORDER_STATE, [...opsDeviceB, ...opsDeviceA]);

  const jsonA = JSON.stringify(resA_Then_B.finalOrder);
  const jsonB = JSON.stringify(resB_Then_A.finalOrder);

  return {
    scenarioName: 'Scenario 1: Disjoint Field Edits',
    reconnectionA_Then_B: resA_Then_B.finalOrder,
    reconnectionB_Then_A: resB_Then_A.finalOrder,
    isDeterministic: jsonA === jsonB,
    surfacedConflictsCount: resA_Then_B.conflicts.length
  };
}

export function runScenario2(): ScenarioTestResult {
  // Scenario 2: Concurrent edit to same scalar with identical timestamp (11:03)
  // Device A (11:03): items[it-1].quantity -> 3
  // Device B (11:03): items[it-1].quantity -> 5
  const opsDeviceA: OpLogEntry[] = [
    {
      op_id: 'op_a2',
      order_id: 'ORD-1042',
      device_id: 'device_A',
      lamport_clock: 3,
      timestamp: '2026-08-29T11:03:00.000Z',
      op_type: 'UPDATE_FIELD',
      target_path: 'items[it-1].quantity',
      value: 3
    }
  ];

  const opsDeviceB: OpLogEntry[] = [
    {
      op_id: 'op_b2',
      order_id: 'ORD-1042',
      device_id: 'device_B',
      lamport_clock: 3,
      timestamp: '2026-08-29T11:03:00.000Z',
      op_type: 'UPDATE_FIELD',
      target_path: 'items[it-1].quantity',
      value: 5
    }
  ];

  const resA_Then_B = mergeAndApplyOps(INITIAL_ORDER_STATE, [...opsDeviceA, ...opsDeviceB]);
  const resB_Then_A = mergeAndApplyOps(INITIAL_ORDER_STATE, [...opsDeviceB, ...opsDeviceA]);

  const jsonA = JSON.stringify(resA_Then_B.finalOrder);
  const jsonB = JSON.stringify(resB_Then_A.finalOrder);

  return {
    scenarioName: 'Scenario 2: Concurrent Scalar Edit',
    reconnectionA_Then_B: resA_Then_B.finalOrder,
    reconnectionB_Then_A: resB_Then_A.finalOrder,
    isDeterministic: jsonA === jsonB,
    surfacedConflictsCount: resA_Then_B.conflicts.length
  };
}

export function runScenario3(): ScenarioTestResult {
  // Scenario 3: Delete versus Update
  // Device A (14:20): delete items[it-2]
  // Device B (14:22): items[it-2].attributes.color -> "black"
  // Device B (14:23): items[it-2].quantity -> 4
  const opsDeviceA: OpLogEntry[] = [
    {
      op_id: 'op_a3',
      order_id: 'ORD-1042',
      device_id: 'device_A',
      lamport_clock: 4,
      timestamp: '2026-08-29T14:20:00.000Z',
      op_type: 'DELETE_ITEM',
      target_path: 'items[it-2]',
      value: { item_id: 'it-2' }
    }
  ];

  const opsDeviceB: OpLogEntry[] = [
    {
      op_id: 'op_b3_1',
      order_id: 'ORD-1042',
      device_id: 'device_B',
      lamport_clock: 5,
      timestamp: '2026-08-29T14:22:00.000Z',
      op_type: 'UPDATE_FIELD',
      target_path: 'items[it-2].attributes.color',
      value: 'black'
    },
    {
      op_id: 'op_b3_2',
      order_id: 'ORD-1042',
      device_id: 'device_B',
      lamport_clock: 6,
      timestamp: '2026-08-29T14:23:00.000Z',
      op_type: 'UPDATE_FIELD',
      target_path: 'items[it-2].quantity',
      value: 4
    }
  ];

  const resA_Then_B = mergeAndApplyOps(INITIAL_ORDER_STATE, [...opsDeviceA, ...opsDeviceB]);
  const resB_Then_A = mergeAndApplyOps(INITIAL_ORDER_STATE, [...opsDeviceB, ...opsDeviceA]);

  const jsonA = JSON.stringify(resA_Then_B.finalOrder);
  const jsonB = JSON.stringify(resB_Then_A.finalOrder);

  return {
    scenarioName: 'Scenario 3: Delete vs Update',
    reconnectionA_Then_B: resA_Then_B.finalOrder,
    reconnectionB_Then_A: resB_Then_A.finalOrder,
    isDeterministic: jsonA === jsonB,
    surfacedConflictsCount: resA_Then_B.conflicts.length
  };
}

export function testAllScenarios(): boolean {
  const s1 = runScenario1();
  const s2 = runScenario2();
  const s3 = runScenario3();

  console.log(`\n--- Test C Scenario Verification ---`);
  console.log(`${s1.scenarioName}: Deterministic=${s1.isDeterministic}`);
  console.log(`${s2.scenarioName}: Deterministic=${s2.isDeterministic}, Surfaced Conflicts=${s2.surfacedConflictsCount}`);
  console.log(`${s3.scenarioName}: Deterministic=${s3.isDeterministic}, Surfaced Conflicts=${s3.surfacedConflictsCount}`);

  return s1.isDeterministic && s2.isDeterministic && s3.isDeterministic;
}
