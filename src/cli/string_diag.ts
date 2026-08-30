import fs from 'fs';
import path from 'path';

function main() {
  const truthPath = path.join(process.cwd(), 'messages_train.json');
  const predPath = path.join(process.cwd(), 'predictions.json');

  const truth: any[] = JSON.parse(fs.readFileSync(truthPath, 'utf-8'));
  const preds: any[] = JSON.parse(fs.readFileSync(predPath, 'utf-8'));
  const predMap = new Map(preds.map(p => [p.id, p]));

  const custDiffs: any[] = [];
  const itemDiffs: any[] = [];

  truth.forEach((t, i) => {
    const id = t.id || `train-${i + 1}`;
    const p = predMap.get(id) || {};
    const exp = t.expected || t;

    const gCust = exp.customer || null;
    const pCust = p.customer || null;

    if (gCust !== pCust) {
      custDiffs.push({
        id,
        raw: (t.message || t.raw_text || '').substring(0, 45),
        expected: gCust,
        got: pCust
      });
    }

    const tItems = exp.items || [];
    const pItems = p.items || [];

    tItems.forEach((ti: any, idx: number) => {
      const pi = pItems[idx] || {};
      if (ti.description !== pi.description) {
        itemDiffs.push({
          id,
          expected: ti.description,
          got: pi.description || 'MISSING'
        });
      }
    });
  });

  console.log("=== TOP 15 CUSTOMER MISMATCHES ===");
  console.table(custDiffs.slice(0, 15));

  console.log("\n=== TOP 15 ITEM DESCRIPTION MISMATCHES ===");
  console.table(itemDiffs.slice(0, 15));
}

main();
