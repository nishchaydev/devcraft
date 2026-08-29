import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { InputRecord, OutputRecord } from '../parser/types';
import { parseMessageRecord } from '../parser/hybridParser';

async function main() {
  const rootDir = process.cwd();
  const inputPath = process.argv[2] ? path.resolve(process.argv[2]) : path.join(rootDir, 'messages_train.json');
  const outputPath = process.argv[3] ? path.resolve(process.argv[3]) : path.join(rootDir, 'my_output.json');

  console.log(`\n==================================================`);
  console.log(`  DevCraft Test A Evaluator`);
  console.log(`==================================================`);
  console.log(`Reading input dataset from: ${inputPath}`);

  if (!fs.existsSync(inputPath)) {
    console.error(`Error: File not found at ${inputPath}`);
    process.exit(1);
  }

  const rawData = fs.readFileSync(inputPath, 'utf-8');
  const records: InputRecord[] = JSON.parse(rawData);

  console.log(`Processing ${records.length} records through Hybrid Parser Engine...`);

  const startTime = Date.now();
  const predictions: OutputRecord[] = [];

  for (let i = 0; i < records.length; i++) {
    const rec = records[i];
    const parsed = await parseMessageRecord(rec);
    predictions.push({
      id: rec.id,
      ...parsed
    });
  }

  const durationMs = Date.now() - startTime;
  console.log(`Processed ${records.length} records in ${durationMs}ms (${(durationMs / records.length).toFixed(2)}ms per message).`);

  fs.writeFileSync(outputPath, JSON.stringify(predictions, null, 2), 'utf-8');
  console.log(`Saved predictions to: ${outputPath}`);

  // Run python score.py
  const scorePyPath = path.join(rootDir, 'score.py');
  if (fs.existsSync(scorePyPath)) {
    console.log(`\nRunning official Test A scorer script (score.py)...`);
    const breakdownPath = path.join(rootDir, 'breakdown.json');
    try {
      const output = execSync(`python score.py --gold "${inputPath}" --pred "${outputPath}" --out "${breakdownPath}"`, {
        encoding: 'utf-8'
      });
      console.log(output);
    } catch (err: any) {
      console.error('Error running score.py:', err.message);
      if (err.stdout) console.log(err.stdout);
      if (err.stderr) console.error(err.stderr);
    }
  } else {
    console.warn(`score.py not found at ${scorePyPath}`);
  }
}

main().catch((err) => {
  console.error('Fatal error in run_eval:', err);
  process.exit(1);
});
