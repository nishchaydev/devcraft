import fs from 'fs';
import path from 'path';

function main() {
  const truthPath = path.join(process.cwd(), 'messages_train.json');
  const predPath = path.join(process.cwd(), 'predictions.json');

  const truth: any[] = JSON.parse(fs.readFileSync(truthPath, 'utf-8'));
  const preds: any[] = JSON.parse(fs.readFileSync(predPath, 'utf-8'));
  const predMap = new Map(preds.map(p => [p.id, p]));

  const diffs: any[] = [];

  truth.forEach((t, i) => {
    const id = t.id || `train-${i + 1}`;
    const p = predMap.get(id) || {};
    const exp = t.expected || t;

    const tKey = JSON.stringify({ c: exp.customer, i: exp.items, nc: exp.needs_clarification, d: exp.due_date });
    const pKey = JSON.stringify({ c: p.customer, i: p.items, nc: p.needs_clarification, d: p.due_date });

    if (tKey !== pKey) {
      diffs.push({
        id,
        text: t.message || t.raw_text,
        expected: {
          customer: exp.customer,
          items: exp.items,
          needs_clarification: exp.needs_clarification,
          due_date: exp.due_date
        },
        got: {
          customer: p.customer,
          items: p.items,
          needs_clarification: p.needs_clarification,
          due_date: p.due_date
        }
      });
    }
  });

  fs.writeFileSync(path.join(process.cwd(), 'compact_failing_cases.json'), JSON.stringify(diffs, null, 2), 'utf-8');
  console.log('Exported remaining failing cases:', diffs.length);
}

main();
