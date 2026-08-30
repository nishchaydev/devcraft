import { parseOfflineRecord } from '../parser/offlineParser';

console.log('==================================================');
console.log('UNIT TEST 1: Devanagari Samosa & Jalebi with Today Date');
console.log('==================================================');
const r1 = parseOfflineRecord({
  id: 'test-1',
  domain: 'tiffin',
  received_at: '2026-08-30T10:00:00+05:30',
  message: 'नमस्ते, मुझे ३ समोसा और २ जलेबी चाहिए आज शाम ५ बजे तक'
});
console.log(JSON.stringify({ items: r1.items, due_date: r1.due_date, needs_clarification: r1.needs_clarification }, null, 2));

console.log('\n==================================================');
console.log('UNIT TEST 2: Baker Fractional Weight & Time Collision');
console.log('==================================================');
const r2 = parseOfflineRecord({
  id: 'test-2',
  domain: 'baker',
  received_at: '2026-08-30T10:00:00+05:30',
  message: '1.5 kg chocolate cake chahiye 2 tier ka eggless, likho Happy Birthday Aarav, Sunday shaam 6 baje tak'
});
console.log(JSON.stringify({ items: r2.items, due_date: r2.due_date, needs_clarification: r2.needs_clarification }, null, 2));
