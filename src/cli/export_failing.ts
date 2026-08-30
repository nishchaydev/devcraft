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
    const expected = t.expected || t;

    const tStr = JSON.stringify({ customer: expected.customer, items: expected.items, needs_clarification: expected.needs_clarification });
    const pStr = JSON.stringify({ customer: p.customer, items: p.items, needs_clarification: p.needs_clarification });

    if (tStr !== pStr) {
      diffs.push({
        id,
        raw_text: t.message || t.raw_text,
        ground_truth: expected,
        predicted: p
      });
    }
  });

  fs.writeFileSync(path.join(process.cwd(), 'failing_cases.json'), JSON.stringify(diffs, null, 2), 'utf-8');
  console.log('Total failing cases exported:', diffs.length);
}

main();
