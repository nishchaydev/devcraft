import { db, StoredOrder } from '../db/schema';

export interface DebtorSummary {
  customer: string;
  totalOwed: number;
  orderCount: number;
  lastOrderDate: string;
  orderIds: string[];
}

export interface DayCapacity {
  dateStr: string;
  dayLabel: string;
  totalItems: number;
  orderCount: number;
  isHighLoad: boolean;
  itemSummary: string;
}

export class OperationalQueryEngine {
  /**
   * 1. Operational Query: What is due today & overdue?
   */
  static async getDueAndOverdue(todayStr = '2026-08-30'): Promise<{ dueToday: StoredOrder[]; overdue: StoredOrder[] }> {
    const allOrders = await db.orders.filter(o => !o.is_deleted).toArray();
    const dueToday: StoredOrder[] = [];
    const overdue: StoredOrder[] = [];

    for (const o of allOrders) {
      if (o.due_date) {
        if (o.due_date < todayStr) {
          overdue.push(o);
        } else if (o.due_date === todayStr) {
          dueToday.push(o);
        }
      }
    }

    return {
      dueToday: dueToday.sort((a, b) => (a.customer || '').localeCompare(b.customer || '')),
      overdue: overdue.sort((a, b) => (a.due_date || '').localeCompare(b.due_date || ''))
    };
  }

  /**
   * 2. Operational Query: Who owes money & how much?
   */
  static async getCustomerReceivables(): Promise<{ totalReceivables: number; debtors: DebtorSummary[] }> {
    const unpaidOrders = await db.orders
      .filter(o => !o.is_deleted && !o.is_paid && typeof o.amount === 'number' && o.amount > 0)
      .toArray();

    const map = new Map<string, { totalOwed: number; orderCount: number; lastOrderDate: string; orderIds: string[] }>();
    let totalReceivables = 0;

    for (const o of unpaidOrders) {
      const cust = o.customer || 'Unspecified Customer';
      const amt = o.amount || 0;
      totalReceivables += amt;

      const existing = map.get(cust);
      if (existing) {
        existing.totalOwed += amt;
        existing.orderCount += 1;
        existing.orderIds.push(o.id);
        if (o.due_date && o.due_date > existing.lastOrderDate) {
          existing.lastOrderDate = o.due_date;
        }
      } else {
        map.set(cust, {
          totalOwed: amt,
          orderCount: 1,
          lastOrderDate: o.due_date || 'N/A',
          orderIds: [o.id]
        });
      }
    }

    const debtors: DebtorSummary[] = Array.from(map.entries()).map(([customer, info]) => ({
      customer,
      ...info
    })).sort((a, b) => b.totalOwed - a.totalOwed);

    return { totalReceivables, debtors };
  }

  /**
   * 3. Operational Query: Customer's last order specs?
   */
  static async getCustomerLastOrderSpecs(customerName: string): Promise<StoredOrder | null> {
    const trimmed = customerName.toLowerCase().trim();
    if (!trimmed) return null;

    const matches = await db.orders
      .filter(o => !o.is_deleted && Boolean(o.customer) && o.customer!.toLowerCase().includes(trimmed))
      .toArray();

    if (matches.length === 0) return null;
    matches.sort((a, b) => b.updated_at.localeCompare(a.updated_at));
    return matches[0];
  }

  /**
   * 4. Operational Query: Committed capacity this week? (2026-08-30 to 2026-09-05)
   */
  static async getCommittedCapacityThisWeek(todayStr = '2026-08-30'): Promise<DayCapacity[]> {
    const allOrders = await db.orders.filter(o => !o.is_deleted).toArray();
    const base = new Date(`${todayStr}T00:00:00.000Z`);

    const days: DayCapacity[] = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 0; i < 7; i++) {
      const current = new Date(base);
      current.setUTCDate(base.getUTCDate() + i);
      const dateStr = current.toISOString().split('T')[0];
      const dayLabel = `${dayNames[current.getUTCDay()]} ${dateStr.slice(5)}`;

      const dayOrders = allOrders.filter(o => o.due_date === dateStr);
      let totalItems = 0;
      const itemCounts: Record<string, number> = {};

      for (const o of dayOrders) {
        for (const item of o.items) {
          totalItems += item.quantity;
          itemCounts[item.description] = (itemCounts[item.description] || 0) + item.quantity;
        }
      }

      const itemSummary = Object.entries(itemCounts)
        .map(([desc, count]) => `${count} ${desc}`)
        .join(', ') || 'No items scheduled';

      days.push({
        dateStr,
        dayLabel,
        totalItems,
        orderCount: dayOrders.length,
        isHighLoad: totalItems >= 5,
        itemSummary
      });
    }

    return days;
  }
}
