import { Bill } from '@/types/bill';

const STORAGE_KEY = 'swiftbill_freight_records';
const CURRENT_USER_KEY = 'swiftbill_current_user';

function getCurrentUserId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(CURRENT_USER_KEY);
}

export const mockDb = {
  getAll: (): Bill[] => {
    if (typeof window === 'undefined') return [];
    const uid = getCurrentUserId();
    if (!uid) return [];

    const stored = localStorage.getItem(STORAGE_KEY);
    const allBills: Bill[] = stored ? JSON.parse(stored) : [];

    // One-time migration: claim any legacy bills (without ownerId) for the
    // currently logged-in user so they stop appearing for others.
    let changed = false;
    for (const bill of allBills) {
      if (!bill.ownerId) {
        bill.ownerId = uid;
        changed = true;
      }
    }
    if (changed) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allBills));
    }

    return allBills.filter((bill) => bill.ownerId === uid);
  },

  getById: (id: string): Bill | undefined => {
    const bills = mockDb.getAll();
    return bills.find((b) => b.id === id);
  },

  getByBillNumber: (billNumber: string): Bill | undefined => {
    const bills = mockDb.getAll();
    return bills.find((b) => b.billNumber === billNumber);
  },

  save: (bill: Bill): Bill => {
    if (typeof window === 'undefined') return bill;
    const uid = getCurrentUserId();
    if (!uid) {
      throw new Error('You must be logged in to save bills.');
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    const allBills: Bill[] = stored ? JSON.parse(stored) : [];

    const existingIndex = allBills.findIndex((b) => b.id === bill.id && b.ownerId === uid);

    if (existingIndex > -1) {
      allBills[existingIndex] = {
        ...bill,
        ownerId: uid,
        updatedAt: new Date().toISOString(),
      };
    } else {
      // Check for duplicate bill number only within this user's bills
      if (allBills.some((b) => b.ownerId === uid && b.billNumber === bill.billNumber)) {
        throw new Error('Bill Number already exists');
      }
      allBills.push({
        ...bill,
        ownerId: uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(allBills));
    return bill;
  },

  delete: (id: string): void => {
    if (typeof window === 'undefined') return;
    const uid = getCurrentUserId();
    if (!uid) return;

    const stored = localStorage.getItem(STORAGE_KEY);
    const allBills: Bill[] = stored ? JSON.parse(stored) : [];
    const filtered = allBills.filter((b) => !(b.id === id && b.ownerId === uid));

    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  },
};