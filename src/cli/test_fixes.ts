import { parseOfflineRecord } from '../parser/offlineParser';

console.log('==================================================');
console.log('TEST 1: Tailor Unit Mismatch & Collar Size');
console.log('==================================================');
const r1 = parseOfflineRecord({
  id: 'test-1',
  domain: 'tailor',
  received_at: '2026-08-30T10:00:00+05:30',
  message: 'Ramesh ji ke liye 1 kg shirt silna hai collar size 16 inches, parso shaam tak chahiye.'
});
console.log('Customer:', r1.customer);
console.log('Needs Clarification:', r1.needs_clarification);
console.log('Rule Explanation:', r1.ruleExplanation);
console.log('WhatsApp Reply:', r1.whatsappReply);
console.log('Items:', JSON.stringify(r1.items, null, 2));

console.log('\n==================================================');
console.log('TEST 2: Baker Cake Quote Inscription, Quantity 3, Advance 500');
console.log('==================================================');
const r2 = parseOfflineRecord({
  id: 'test-2',
  domain: 'baker',
  received_at: '2026-08-30T10:00:00+05:30',
  message: '३ chocolate truffle cake eggless half kg likhna hai "Happy Anniversary", Sunday tak deliver kar dena, 500 advance paid.'
});
console.log('Due Date:', r2.due_date);
console.log('Amount:', r2.amount);
console.log('Items:', JSON.stringify(r2.items, null, 2));
