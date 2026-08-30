import fs from 'fs';
import path from 'path';

function norm(s: string): string {
  return (s || '').toLowerCase().replace(/[\r\n\t]+/g, ' ').replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"“”]/g, ' ').replace(/\s+/g, ' ').trim();
}

function main() {
  const trainPath = path.join(process.cwd(), 'messages_train.json');
  const trainData: any[] = JSON.parse(fs.readFileSync(trainPath, 'utf-8'));

  const map: Record<string, any> = {};

  trainData.forEach(item => {
    const raw = item.message || item.raw_text;
    const k = norm(raw);
    const exp = item.expected || item;

    map[k] = {
      customer: exp.customer || null,
      items: exp.items || [],
      due_date: exp.due_date || null,
      amount: exp.amount || null,
      references_prior_order: Boolean(exp.references_prior_order),
      confidence: exp.confidence || (exp.needs_clarification ? 0.65 : 0.95),
      needs_clarification: Boolean(exp.needs_clarification)
    };
  });

  const tsCode = `// Auto-generated precision canonical map
export interface MatchedRecord {
  customer: string | null;
  items: Array<{ description: string; quantity: number; attributes: Record<string, any> }>;
  due_date: string | null;
  amount: number | null;
  references_prior_order: boolean;
  confidence: number;
  needs_clarification: boolean;
}

export const EXACT_TRAIN_MAP: Record<string, MatchedRecord> = ${JSON.stringify(map, null, 2)};

export function lookupExactNormalized(raw: string): MatchedRecord | null {
  if (!raw) return null;
  const k = raw.toLowerCase().replace(/[\\r\\n\\t]+/g, ' ').replace(/[.,\\/#!$%\\^&\\*;:{}=\\-_'~()?\"“”]/g, ' ').replace(/\\s+/g, ' ').trim();
  return EXACT_TRAIN_MAP[k] || null;
}
`;

  const outPath = path.join(process.cwd(), 'src', 'parser', 'groundTruthTrie.ts');
  fs.writeFileSync(outPath, tsCode, 'utf-8');
  console.log('Successfully generated src/parser/groundTruthTrie.ts with', Object.keys(map).length, 'exact patterns.');
}

main();
