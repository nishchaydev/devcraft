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
  opsDeviceA: OpLogEntry[];
  opsDeviceB: OpLogEntry[];
  jsonA: string;
  jsonB: string;
  stateHash: string;
}

export interface SimulationScenarioResult {
  scenarioNumber: number;
  title: string;
  hashA: string;
  hashB: string;
  isExactMatch: boolean;
}

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return '0x' + Math.abs(hash).toString(16).padStart(8, '0');
}

export function runScenario1(): ScenarioTestResult {
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

  const baseOrder = JSON.parse(JSON.stringify(INITIAL_ORDER_STATE));
  const resA_Then_B = mergeAndApplyOps(baseOrder, [...opsDeviceA, ...opsDeviceB]);
  const resB_Then_A = mergeAndApplyOps(baseOrder, [...opsDeviceB, ...opsDeviceA]);

  const jsonA = JSON.stringify(resA_Then_B.finalOrder, null, 2);
  const jsonB = JSON.stringify(resB_Then_A.finalOrder, null, 2);
  const isExactMatch = jsonA === jsonB;

  return {
    scenarioName: 'Scenario 1: Disjoint Field Edits',
    reconnectionA_Then_B: resA_Then_B.finalOrder,
    reconnectionB_Then_A: resB_Then_A.finalOrder,
    isDeterministic: isExactMatch,
    surfacedConflictsCount: resA_Then_B.conflicts.length,
    opsDeviceA,
    opsDeviceB,
    jsonA,
    jsonB,
    stateHash: simpleHash(jsonA)
  };
}

export function runScenario2(): ScenarioTestResult {
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

  const baseOrder = JSON.parse(JSON.stringify(INITIAL_ORDER_STATE));
  const resA_Then_B = mergeAndApplyOps(baseOrder, [...opsDeviceA, ...opsDeviceB]);
  const resB_Then_A = mergeAndApplyOps(baseOrder, [...opsDeviceB, ...opsDeviceA]);

  const jsonA = JSON.stringify(resA_Then_B.finalOrder, null, 2);
  const jsonB = JSON.stringify(resB_Then_A.finalOrder, null, 2);
  const isExactMatch = jsonA === jsonB;

  return {
    scenarioName: 'Scenario 2: Concurrent Scalar Edit',
    reconnectionA_Then_B: resA_Then_B.finalOrder,
    reconnectionB_Then_A: resB_Then_A.finalOrder,
    isDeterministic: isExactMatch,
    surfacedConflictsCount: resA_Then_B.conflicts.length,
    opsDeviceA,
    opsDeviceB,
    jsonA,
    jsonB,
    stateHash: simpleHash(jsonA)
  };
}

export function runScenario3(): ScenarioTestResult {
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

  const baseOrder = JSON.parse(JSON.stringify(INITIAL_ORDER_STATE));
  const resA_Then_B = mergeAndApplyOps(baseOrder, [...opsDeviceA, ...opsDeviceB]);
  const resB_Then_A = mergeAndApplyOps(baseOrder, [...opsDeviceB, ...opsDeviceA]);

  const jsonA = JSON.stringify(resA_Then_B.finalOrder, null, 2);
  const jsonB = JSON.stringify(resB_Then_A.finalOrder, null, 2);
  const isExactMatch = jsonA === jsonB;

  return {
    scenarioName: 'Scenario 3: Delete vs Update',
    reconnectionA_Then_B: resA_Then_B.finalOrder,
    reconnectionB_Then_A: resB_Then_A.finalOrder,
    isDeterministic: isExactMatch,
    surfacedConflictsCount: resA_Then_B.conflicts.length,
    opsDeviceA,
    opsDeviceB,
    jsonA,
    jsonB,
    stateHash: simpleHash(jsonA)
  };
}

export function runAllScenarios(): SimulationScenarioResult[] {
  const s1 = runScenario1();
  const s2 = runScenario2();
  const s3 = runScenario3();

  return [
    { scenarioNumber: 1, title: s1.scenarioName, hashA: s1.stateHash, hashB: s1.stateHash, isExactMatch: s1.isDeterministic },
    { scenarioNumber: 2, title: s2.scenarioName, hashA: s2.stateHash, hashB: s2.stateHash, isExactMatch: s2.isDeterministic },
    { scenarioNumber: 3, title: s3.scenarioName, hashA: s3.stateHash, hashB: s3.stateHash, isExactMatch: s3.isDeterministic }
  ];
}

export function testAllScenarios(): boolean {
  const s1 = runScenario1();
  const s2 = runScenario2();
  const s3 = runScenario3();

  return s1.isDeterministic && s2.isDeterministic && s3.isDeterministic;
}
