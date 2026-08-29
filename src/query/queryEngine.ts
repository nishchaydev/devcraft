import { db, StoredOrder } from '../db/schema';
import { formatDateUTC } from '../parser/dateResolver';

export interface CustomerBalance {
  customer: string;
  totalUnpaid: number;
  orderCount: number;
  latestDueDate: string | null;
}

export interface CapacitySummary {
  totalOrders: number;
  totalItems: number;
  itemCountsByDescription: Record<string, number>;
  ordersByDate: Record<string, number>;
}

export class QueryEngine {
  /**
   * Get orders due today and overdue orders
   */
  public static async getDueOrders(referenceDate?: string): Promise<{ overdue: StoredOrder[]; dueToday: StoredOrder[]; upcoming: StoredOrder[] }> {
    const todayStr = referenceDate || formatDateUTC(new Date());
    const allOrders = await db.orders.filter(o => !o.is_deleted).toArray();

    const overdue: StoredOrder[] = [];
    const dueToday: StoredOrder[] = [];
    const upcoming: StoredOrder[] = [];

    for (const order of allOrders) {
      if (!order.due_date) continue;
      if (order.due_date < todayStr) {
        overdue.push(order);
      } else if (order.due_date === todayStr) {
        dueToday.push(order);
      } else {
        upcoming.push(order);
      }
    }

    return { overdue, dueToday, upcoming };
  }

  /**
   * Get customers who owe money with aggregated total receivables
   */
  public static async getUnpaidBalances(): Promise<{ totalReceivables: number; customerLedger: CustomerBalance[] }> {
    const allOrders = await db.orders.filter(o => !o.is_deleted && o.amount !== null && o.amount > 0).toArray();

    const ledgerMap = new Map<string, { total: number; count: number; maxDate: string | null }>();
    let grandTotal = 0;

    for (const order of allOrders) {
      const cust = order.customer || 'Unspecified Customer';
      const amt = order.amount || 0;
      grandTotal += amt;

      const existing = ledgerMap.get(cust) || { total: 0, count: 0, maxDate: null };
      existing.total += amt;
      existing.count += 1;
      if (order.due_date && (!existing.maxDate || order.due_date > existing.maxDate)) {
        existing.maxDate = order.due_date;
      }
      ledgerMap.set(cust, existing);
    }

    const customerLedger: CustomerBalance[] = Array.from(ledgerMap.entries()).map(([cust, data]) => ({
      customer: cust,
      totalUnpaid: data.total,
      orderCount: data.count,
      latestDueDate: data.maxDate
    })).sort((a, b) => b.totalUnpaid - a.totalUnpaid);

    return { totalReceivables: grandTotal, customerLedger };
  }

  /**
   * Get past orders and specifications for a specific customer ("last time jaisa")
   */
  public static async getCustomerHistory(customerName: string): Promise<StoredOrder[]> {
    if (!customerName || customerName.trim() === '') return [];
    const search = customerName.toLowerCase().trim();

    const orders = await db.orders
      .filter(o => !o.is_deleted && o.customer !== null && o.customer.toLowerCase().includes(search))
      .toArray();

    return orders.sort((a, b) => b.updated_at.localeCompare(a.updated_at));
  }

  /**
   * Get committed capacity and item tallies for a date range (e.g. current week)
   */
  public static async getCommittedCapacity(startDateStr?: string, endDateStr?: string): Promise<CapacitySummary> {
    const allOrders = await db.orders.filter(o => !o.is_deleted && o.due_date !== null).toArray();

    const filtered = allOrders.filter(o => {
      if (!o.due_date) return false;
      if (startDateStr && o.due_date < startDateStr) return false;
      if (endDateStr && o.due_date > endDateStr) return false;
      return true;
    });

    let totalItemsCount = 0;
    const itemCounts: Record<string, number> = {};
    const ordersByDate: Record<string, number> = {};

    for (const order of filtered) {
      if (order.due_date) {
        ordersByDate[order.due_date] = (ordersByDate[order.due_date] || 0) + 1;
      }

      for (const item of order.items || []) {
        const desc = item.description || 'unnamed item';
        const qty = item.quantity || 1;
        totalItemsCount += qty;
        itemCounts[desc] = (itemCounts[desc] || 0) + qty;
      }
    }

    return {
      totalOrders: filtered.length,
      totalItems: totalItemsCount,
      itemCountsByDescription: itemCounts,
      ordersByDate
    };
  }
}
