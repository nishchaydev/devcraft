import fs from 'fs';
import path from 'path';

function main() {
  const truthPath = path.join(process.cwd(), 'messages_train.json');
  const predPath = path.join(process.cwd(), 'predictions.json');

  const truth: any[] = JSON.parse(fs.readFileSync(truthPath, 'utf-8'));
  const preds: any[] = JSON.parse(fs.readFileSync(predPath, 'utf-8'));
  const predMap = new Map(preds.map(p => [p.id, p]));

  const stats = {
    customer_mismatch: 0,
    item_count_mismatch: 0,
    item_desc_mismatch: 0,
    item_qty_mismatch: 0,
    item_attr_mismatch: 0,
    clarification_mismatch: 0,
    date_mismatch: 0
  };

  truth.forEach((t, i) => {
    const id = t.id || `train-${i + 1}`;
    const p = predMap.get(id) || {};
    const exp = t.expected || t;

    if ((exp.customer || null) !== (p.customer || null)) stats.customer_mismatch++;
    if (Boolean(exp.needs_clarification) !== Boolean(p.needs_clarification)) stats.clarification_mismatch++;
    if ((exp.due_date || null) !== (p.due_date || null)) stats.date_mismatch++;

    const tItems = exp.items || [];
    const pItems = p.items || [];

    if (tItems.length !== pItems.length) {
      stats.item_count_mismatch++;
    } else {
      tItems.forEach((tItem: any, idx: number) => {
        const pItem = pItems[idx] || {};
        if (tItem.description !== pItem.description) stats.item_desc_mismatch++;
        if (tItem.quantity !== pItem.quantity) stats.item_qty_mismatch++;
        if (JSON.stringify(tItem.attributes || {}) !== JSON.stringify(pItem.attributes || {})) stats.item_attr_mismatch++;
      });
    }
  });

  console.log("=== FIELD MISMATCH BREAKDOWN ===");
  console.table(stats);
}

main();
