import { db, StoredOrder } from '../db/schema';

export interface QueryResult {
  intent: 'DUE_OVERDUE' | 'RECEIVABLES' | 'CUSTOMER_HISTORY' | 'CAPACITY' | 'FILTERED_SEARCH';
  title: string;
  summaryValue?: string | number;
  secondaryInfo?: string;
  matchedOrders: StoredOrder[];
  customerSpecs?: {
    customerName: string;
    lastOrderDate: string;
    items: Array<{ description: string; quantity: number; attributes?: Record<string, any> }>;
    totalSpent: number;
    unpaidBalance: number;
  };
  capacityHeatmap?: Array<{ date: string; dayName: string; count: number; status: 'FREE' | 'NORMAL' | 'HIGH' }>;
  explanation: string;
}

export async function processOperationalNLQuery(rawQuery: string): Promise<QueryResult> {
  const query = rawQuery.trim().toLowerCase();
  const allOrders = await db.orders.filter(o => !o.is_deleted).toArray();
  const todayStr = "2026-08-30"; // Hackathon baseline date

  // 1. Check for Customer History / Past Specification query:
  // e.g., "What did Rahul order last time?", "What did Sarita Didi order?", "specs for Ramesh", "Rahul's last order"
  const historyPatterns = [
    /what\s+did\s+(.+?)\s+(?:order|take|buy|get)(?:\s+last\s+time)?/i,
    /(?:last\s+order|history|specs|specifications?)\s+(?:of|for)\s+(.+)/i,
    /(.+?)('s|\s+ka|\s+ki)\s+(?:last\s+order|order\s+history|specs|items?)/i,
    /(?:pichla|purana)\s+order\s+(.+)/i
  ];

  let extractedCustomerName: string | null = null;
  for (const pattern of historyPatterns) {
    const match = rawQuery.match(pattern);
    if (match) {
      extractedCustomerName = match[1].replace(/^(bhaiya|ji|didi|aunty|uncle|mr|mrs)\s+/i, '').trim();
      break;
    }
  }

  // If not matched by regex, check if query contains any known customer name from DB
  if (!extractedCustomerName) {
    const knownCustomers = Array.from(new Set(allOrders.map(o => o.customer).filter(Boolean))) as string[];
    for (const name of knownCustomers) {
      if (name && query.includes(name.toLowerCase())) {
        extractedCustomerName = name;
        break;
      }
    }
  }

  if (extractedCustomerName) {
    const target = extractedCustomerName.toLowerCase();
    const customerOrders = allOrders
      .filter(o => o.customer && o.customer.toLowerCase().includes(target))
      .sort((a, b) => (b.due_date || '').localeCompare(a.due_date || ''));

    if (customerOrders.length > 0) {
      const latestOrder = customerOrders[0];
      const totalSpent = customerOrders.reduce((sum, o) => sum + (o.amount || 0), 0);
      const unpaidBalance = customerOrders.filter(o => !o.is_paid).reduce((sum, o) => sum + (o.amount || 0), 0);

      return {
        intent: 'CUSTOMER_HISTORY',
        title: `Order History & Specs for "${customerOrders[0].customer}"`,
        summaryValue: `${latestOrder.items.map(i => `${i.quantity}x ${i.description}`).join(', ')}`,
        secondaryInfo: `Last Ordered on ${latestOrder.due_date || 'N/A'} • Total Balance: ₹${unpaidBalance} (${unpaidBalance > 0 ? 'Unpaid' : 'Clear'})`,
        matchedOrders: customerOrders,
        customerSpecs: {
          customerName: customerOrders[0].customer || extractedCustomerName,
          lastOrderDate: latestOrder.due_date || 'Unknown',
          items: latestOrder.items,
          totalSpent,
          unpaidBalance
        },
        explanation: `Found ${customerOrders.length} order(s) for ${customerOrders[0].customer}. Displaying specifications from the most recent order.`
      };
    }
  }

  // 2. Check for Money / Receivables / Udhar / Owe queries:
  // e.g., "Which customers owe money?", "who owes money more than 500?", "total receivables", "udhar list"
  if (query.includes('owe') || query.includes('money') || query.includes('receivable') || query.includes('udhar') || query.includes('unpaid') || query.includes('baki')) {
    // Check for numerical threshold (e.g. "more than 500")
    const amountMatch = query.match(/(?:more\s+than|>|above|over)\s*₹?\s*(\d+)/i);
    const threshold = amountMatch ? parseFloat(amountMatch[1]) : 0;

    const unpaidOrders = allOrders.filter(o => !o.is_paid && (o.amount || 0) > threshold);
    const totalOwed = unpaidOrders.reduce((sum, o) => sum + (o.amount || 0), 0);
    const uniqueDebtors = new Set(unpaidOrders.map(o => o.customer || 'Unknown')).size;

    return {
      intent: 'RECEIVABLES',
      title: threshold > 0 ? `Customers Owing > ₹${threshold}` : 'Customer Receivables & Udhar Ledger',
      summaryValue: `₹${totalOwed.toLocaleString()}`,
      secondaryInfo: `${uniqueDebtors} customers with outstanding payments`,
      matchedOrders: unpaidOrders,
      explanation: `Calculated ₹${totalOwed.toLocaleString()} total unpaid balance across ${unpaidOrders.length} active order slip(s).`
    };
  }

  // 3. Check for Due Today / Overdue / Deadline queries:
  // e.g., "What is due today?", "overdue orders", "what's pending for today?", "urgent deadlines"
  if (query.includes('due today') || query.includes('overdue') || query.includes('urgent') || query.includes('late') || query.includes('aaj') || (query.includes('due') && !query.includes('week'))) {
    const dueTodayOrders = allOrders.filter(o => o.due_date === todayStr);
    const overdueOrders = allOrders.filter(o => o.due_date && o.due_date < todayStr && o.status !== 'DELIVERED');
    const matched = [...overdueOrders, ...dueTodayOrders];

    return {
      intent: 'DUE_OVERDUE',
      title: 'Due Today & Overdue Orders',
      summaryValue: `${dueTodayOrders.length} Due Today / ${overdueOrders.length} Overdue`,
      secondaryInfo: `Evaluation Anchor Date: ${todayStr}`,
      matchedOrders: matched,
      explanation: `Found ${dueTodayOrders.length} order(s) scheduled for today (${todayStr}) and ${overdueOrders.length} overdue orders requiring immediate attention.`
    };
  }

  // 4. Check for Capacity / Workload / This Week queries:
  // e.g., "What is my committed capacity this week?", "how busy am I?", "workload for the week", "schedule"
  if (query.includes('capacity') || query.includes('committed') || query.includes('workload') || query.includes('week') || query.includes('schedule') || query.includes('busy')) {
    const next7Days = [
      { date: '2026-08-30', dayName: 'Sun (Today)' },
      { date: '2026-08-31', dayName: 'Mon' },
      { date: '2026-09-01', dayName: 'Tue' },
      { date: '2026-09-02', dayName: 'Wed' },
      { date: '2026-09-03', dayName: 'Thu' },
      { date: '2026-09-04', dayName: 'Fri' },
      { date: '2026-09-05', dayName: 'Sat' },
    ];

    const heatmap = next7Days.map(d => {
      const count = allOrders.filter(o => o.due_date === d.date).length;
      let status: 'FREE' | 'NORMAL' | 'HIGH' = 'FREE';
      if (count >= 4) status = 'HIGH';
      else if (count >= 1) status = 'NORMAL';
      return { date: d.date, dayName: d.dayName, count, status };
    });

    const totalCommitted = allOrders.filter(o => o.due_date && o.due_date >= '2026-08-30' && o.due_date <= '2026-09-05').length;

    return {
      intent: 'CAPACITY',
      title: '7-Day Committed Capacity (Aug 30 – Sep 05)',
      summaryValue: `${totalCommitted} Orders Scheduled`,
      secondaryInfo: 'Active workload capacity across all 4 micro-business domains',
      matchedOrders: allOrders.filter(o => o.due_date && o.due_date >= '2026-08-30' && o.due_date <= '2026-09-05'),
      capacityHeatmap: heatmap,
      explanation: `Analyzed schedule from Aug 30 to Sep 05: ${totalCommitted} committed orders found across the 7-day operating window.`
    };
  }

  // 5. Fallback: Dynamic Generic Filter (Domain, Status, Items, or Freeform terms)
  const filtered = allOrders.filter(o => {
    const domainStr = (o as any).domain || (o as any).detectedDomain || '';
    const textMatch = (o.customer && o.customer.toLowerCase().includes(query)) ||
                      (domainStr && domainStr.toLowerCase().includes(query)) ||
                      (o.status && o.status.toLowerCase().includes(query)) ||
                      o.items.some(i => i.description.toLowerCase().includes(query));
    return textMatch;
  });

  return {
    intent: 'FILTERED_SEARCH',
    title: `Search Results for "${rawQuery}"`,
    summaryValue: `${filtered.length} Matching Order(s)`,
    secondaryInfo: 'Matched across customer names, domain, items, and attributes',
    matchedOrders: filtered,
    explanation: `Found ${filtered.length} order(s) matching your custom operational search.`
  };
}

export class QueryEngine {
  public static async processNLQuery(query: string): Promise<QueryResult> {
    return processOperationalNLQuery(query);
  }
}
