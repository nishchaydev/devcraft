import fs from 'fs';
import path from 'path';

function main() {
  const goldPath = path.join(process.cwd(), 'messages_train.json');
  const predPath = path.join(process.cwd(), 'predictions.json');

  const gold: any[] = JSON.parse(fs.readFileSync(goldPath, 'utf-8'));
  const pred: any[] = JSON.parse(fs.readFileSync(predPath, 'utf-8'));

  const predMap = new Map(pred.map(p => [p.id, p]));

  let count = 0;
  console.log('=== CLARIFICATION MISMATCHES ===\n');

  for (const gRecord of gold) {
    const g = gRecord.expected || gRecord;
    const p = predMap.get(gRecord.id);
    if (!p) continue;

    if (Boolean(g.needs_clarification) !== Boolean(p.needs_clarification)) {
      count++;
      console.log(`[${gRecord.id}] Msg: "${gRecord.message}"`);
      console.log(`   Domain: ${gRecord.domain}`);
      console.log(`   Gold clarify: ${g.needs_clarification}, Pred clarify: ${p.needs_clarification}`);
      console.log(`   Gold items: ${JSON.stringify(g.items)}`);
      console.log(`   Pred items: ${JSON.stringify(p.items)}\n`);
    }
  }

  console.log(`Total clarification mismatches: ${count} / ${gold.length}`);
}

main();
