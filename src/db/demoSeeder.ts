import { db, StoredOrder } from './schema';
import trainData from '../../messages_train.json';
import { parseOfflineRecord } from '../parser/offlineParser';

export async function seedInitialDemoOrders(forceReset = false): Promise<number> {
  const currentCount = await db.orders.count();
  if (currentCount > 0 && !forceReset) {
    return 0;
  }

  if (forceReset) {
    await db.orders.clear();
    await db.op_log.clear();
    await db.conflicts.clear();
  }

  const sampleMessages = [
    {
      id: 'ORD-1001',
      domain: 'tiffin',
      received_at: '2026-08-25T10:00:00+05:30',
      message: 'Sarita didi 4 rajma aur 5 roti chahiye aaj dopahar 1 baje tak',
      override_due: '2026-08-25',
      override_customer: 'Sarita Didi',
      amount: 450,
      is_paid: false
    },
    {
      id: 'ORD-1002',
      domain: 'tailor',
      received_at: '2026-08-28T14:30:00+05:30',
      message: 'Ramesh ji 2 navy blue kurta chest 40 parso tak chahiye',
      override_due: '2026-08-30',
      override_customer: 'Ramesh Ji',
      amount: 1500,
      is_paid: false
    },
    {
      id: 'ORD-1003',
      domain: 'electrician',
      received_at: '2026-08-29T09:00:00+05:30',
      message: 'Anil ji ke ghar ceiling fan noise problem check kar do kal dopahar tak',
      override_due: '2026-08-30',
      override_customer: 'Anil Ji',
      amount: 650,
      is_paid: false
    },
    {
      id: 'ORD-1004',
      domain: 'baker',
      received_at: '2026-08-29T16:00:00+05:30',
      message: 'Kavita 1.5 kg chocolate cake 2 tier eggless likho Happy Birthday Aarav, Sunday shaam tak',
      override_due: '2026-08-31',
      override_customer: 'Kavita',
      amount: 1200,
      is_paid: true
    },
    {
      id: 'ORD-1005',
      domain: 'tiffin',
      received_at: '2026-08-24T11:00:00+05:30',
      message: 'Meena aunty 5 special thali aur 2 dahi kal shaam tak',
      override_due: '2026-08-25',
      override_customer: 'Meena Aunty',
      amount: 850,
      is_paid: false
    },
    {
      id: 'ORD-1006',
      domain: 'tailor',
      received_at: '2026-08-30T09:00:00+05:30',
      message: 'Ramesh ji 3 white shirt formal fit collar size 38 urgent chahiye',
      override_due: '2026-08-30',
      override_customer: 'Ramesh Ji',
      amount: 2100,
      is_paid: false
    },
    {
      id: 'ORD-1007',
      domain: 'electrician',
      received_at: '2026-08-27T10:00:00+05:30',
      message: 'Sarita didi kitchen switch board wiring repair, Crompton brand',
      override_due: '2026-08-28',
      override_customer: 'Sarita Didi',
      amount: 500,
      is_paid: true
    },
    {
      id: 'ORD-1008',
      domain: 'baker',
      received_at: '2026-08-29T18:00:00+05:30',
      message: 'Anil ji 1 kg pineapple cake heart shape bina anda',
      override_due: '2026-09-01',
      override_customer: 'Anil Ji',
      amount: 900,
      is_paid: false
    }
  ];

  let inserted = 0;
  for (const s of sampleMessages) {
    const parsed = parseOfflineRecord({
      id: s.id,
      domain: s.domain as any,
      received_at: s.received_at,
      message: s.message
    });

    const stored: StoredOrder = {
      id: s.id,
      customer: s.override_customer || parsed.customer,
      items: parsed.items,
      due_date: s.override_due || parsed.due_date || '2026-08-30',
      amount: s.amount !== undefined ? s.amount : parsed.amount,
      references_prior_order: parsed.references_prior_order,
      confidence: parsed.confidence,
      needs_clarification: parsed.needs_clarification,
      status: parsed.needs_clarification ? 'NEEDS_CLARIFICATION' : 'SYNCED',
      is_paid: s.is_paid,
      paid_at: s.is_paid ? new Date().toISOString() : null,
      device_id: 'device_demo',
      updated_at: new Date().toISOString()
    };

    await db.orders.put(stored);
    inserted++;
  }

  // Load 12 additional training records from messages_train.json
  const remaining = (trainData as any[]).slice(8, 20);
  for (let i = 0; i < remaining.length; i++) {
    const rec = remaining[i];
    const parsed = parseOfflineRecord(rec);
    const orderId = `ORD-DEMO-${1010 + i}`;
    const isPaid = i % 3 === 0;

    const stored: StoredOrder = {
      id: orderId,
      customer: parsed.customer || `Customer ${1010 + i}`,
      items: parsed.items,
      due_date: parsed.due_date || (i % 2 === 0 ? '2026-08-30' : '2026-09-02'),
      amount: parsed.amount || (400 + (i * 150)),
      references_prior_order: parsed.references_prior_order,
      confidence: parsed.confidence,
      needs_clarification: parsed.needs_clarification,
      status: parsed.needs_clarification ? 'NEEDS_CLARIFICATION' : 'SYNCED',
      is_paid: isPaid,
      paid_at: isPaid ? new Date().toISOString() : null,
      device_id: 'device_demo',
      updated_at: new Date().toISOString()
    };

    await db.orders.put(stored);
    inserted++;
  }

  return inserted;
}
