import fs from 'fs';
import path from 'path';

function main() {
  const goldPath = path.join(process.cwd(), 'messages_train.json');
  const predPath = path.join(process.cwd(), 'predictions.json');

  const gold: any[] = JSON.parse(fs.readFileSync(goldPath, 'utf-8'));
  const pred: any[] = JSON.parse(fs.readFileSync(predPath, 'utf-8'));

  const predMap = new Map(pred.map(p => [p.id, p]));

  let diffCount = 0;
  console.log('=== REAL FIELD MISMATCH DIAGNOSIS ===\n');

  for (const gRecord of gold) {
    const g = gRecord.expected || gRecord;
    const p = predMap.get(gRecord.id);
    if (!p) continue;

    const diffs: string[] = [];

    // Customer
    const gCust = g.customer || null;
    const pCust = p.customer || null;
    if (gCust !== pCust) {
      diffs.push(`Customer: Gold="${gCust}", Pred="${pCust}"`);
    }

    // Amount
    const gAmt = g.amount !== undefined && g.amount !== null ? g.amount : null;
    const pAmt = p.amount !== undefined && p.amount !== null ? p.amount : null;
    if (gAmt !== pAmt) {
      diffs.push(`Amount: Gold=${gAmt}, Pred=${pAmt}`);
    }

    // Items
    const gItems = g.items || [];
    const pItems = p.items || [];

    if (gItems.length !== pItems.length) {
      diffs.push(`Items count: Gold=${gItems.length} [${gItems.map((x: any)=>x.description).join(', ')}], Pred=${pItems.length} [${pItems.map((x: any)=>x.description).join(', ')}]`);
    } else {
      for (let k = 0; k < gItems.length; k++) {
        const gi = gItems[k];
        const pi = pItems[k];
        if (gi.description !== pi.description) {
          diffs.push(`Item desc: Gold="${gi.description}", Pred="${pi.description}"`);
        }
        if (gi.quantity !== pi.quantity) {
          diffs.push(`Item qty for "${gi.description}": Gold=${gi.quantity}, Pred=${pi.quantity}`);
        }
        const gAttrs = gi.attributes || {};
        const pAttrs = pi.attributes || {};
        if (JSON.stringify(gAttrs) !== JSON.stringify(pAttrs)) {
          diffs.push(`Item attrs for "${gi.description}": Gold=${JSON.stringify(gAttrs)}, Pred=${JSON.stringify(pAttrs)}`);
        }
      }
    }

    if (diffs.length > 0) {
      diffCount++;
      if (diffCount <= 30) {
        console.log(`[${gRecord.id}] "${gRecord.message}"`);
        diffs.forEach(d => console.log(`   -> ${d}`));
      }
    }
  }

  console.log(`\nTotal mismatched records: ${diffCount} / ${gold.length}`);
}

main();
