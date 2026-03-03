import { Bill } from '@/types/bill';

const STORAGE_KEY = 'swiftbill_freight_records';

export const mockDb = {
  getAll: (): Bill[] => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  },
  
  getById: (id: string): Bill | undefined => {
    const bills = mockDb.getAll();
    return bills.find(b => b.id === id);
  },
  
  getByBillNumber: (billNumber: string): Bill | undefined => {
    const bills = mockDb.getAll();
    return bills.find(b => b.billNumber === billNumber);
  },
  
  save: (bill: Bill): Bill => {
    const bills = mockDb.getAll();
    const existingIndex = bills.findIndex(b => b.id === bill.id);
    
    if (existingIndex > -1) {
      bills[existingIndex] = { ...bill, updatedAt: new Date().toISOString() };
    } else {
      // Check for duplicate bill number
      if (bills.some(b => b.billNumber === bill.billNumber)) {
        throw new Error('Bill Number already exists');
      }
      bills.push({ 
        ...bill, 
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bills));
    return bill;
  },
  
  delete: (id: string): void => {
    const bills = mockDb.getAll();
    const filtered = bills.filter(b => b.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  }
};