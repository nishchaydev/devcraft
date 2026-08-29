import { runScenario1, runScenario2, runScenario3 } from '../sync/simulator';

function main() {
  console.log(`\n==================================================`);
  console.log(`  DevCraft Test C Sync Engine Evaluator`);
  console.log(`==================================================`);

  const s1 = runScenario1();
  console.log(`\n[Scenario 1: Disjoint Field Edits]`);
  console.log(`  Reconnection A -> B:`, JSON.stringify(s1.reconnectionA_Then_B));
  console.log(`  Reconnection B -> A:`, JSON.stringify(s1.reconnectionB_Then_A));
  console.log(`  Deterministic Invariance: ${s1.isDeterministic ? 'PASS ✅' : 'FAIL ❌'}`);

  const s2 = runScenario2();
  console.log(`\n[Scenario 2: Concurrent Scalar Edit]`);
  console.log(`  Reconnection A -> B quantity:`, s1.reconnectionA_Then_B.items?.[0]?.quantity);
  console.log(`  Reconnection B -> A quantity:`, s1.reconnectionB_Then_A.items?.[0]?.quantity);
  console.log(`  Deterministic Invariance: ${s2.isDeterministic ? 'PASS ✅' : 'FAIL ❌'}`);

  const s3 = runScenario3();
  console.log(`\n[Scenario 3: Delete vs Update]`);
  console.log(`  Reconnection A -> B items count:`, s3.reconnectionA_Then_B.items?.length);
  console.log(`  Reconnection B -> A items count:`, s3.reconnectionB_Then_A.items?.length);
  console.log(`  Surfaced Conflicts Count:`, s3.surfacedConflictsCount);
  console.log(`  Deterministic Invariance: ${s3.isDeterministic ? 'PASS ✅' : 'FAIL ❌'}`);

  const allPassed = s1.isDeterministic && s2.isDeterministic && s3.isDeterministic;
  console.log(`\n==================================================`);
  console.log(`  Overall Test C Result: ${allPassed ? 'ALL SCENARIOS PASSED 100% ✅' : 'FAILED ❌'}`);
  console.log(`==================================================\n`);

  if (!allPassed) process.exit(1);
}

main();
