"use client"

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Eye, Filter, Download, MoreHorizontal, Truck, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bill } from '@/types/bill';
import { mockDb } from '@/lib/mock-db';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

export default function AllBillsPage() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [search, setSearch] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadBills();
  }, []);

  const loadBills = () => {
    setBills(mockDb.getAll().reverse());
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this record?')) {
      mockDb.delete(id);
      toast({ title: "Deleted", description: "Bill record removed successfully" });
      loadBills();
    }
  };

  const filteredBills = bills.filter(bill => 
    bill.billNumber.toLowerCase().includes(search.toLowerCase()) ||
    bill.customerName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-primary">All Freight Bills</h2>
          <p className="text-muted-foreground">Total {bills.length} records found in database.</p>
        </div>
        <Button asChild>
          <Link href="/bills/new"><Plus className="w-4 h-4 mr-2" /> Create Bill</Link>
        </Button>
      </div>

      <div className="flex gap-4 items-center bg-white p-4 rounded-lg shadow-sm border">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search by Bill No or Customer..." 
            className="pl-10" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="outline"><Filter className="w-4 h-4 mr-2" /> Filters</Button>
        <Button variant="outline"><Download className="w-4 h-4 mr-2" /> Export</Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {filteredBills.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Truck className="w-16 h-16 mx-auto mb-4 opacity-10" />
            <p className="text-lg font-medium">No bills found</p>
            <p className="text-sm">Try adjusting your search query or create a new record.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b">
                <tr>
                  <th className="p-4 text-left font-bold">Bill No.</th>
                  <th className="p-4 text-left font-bold">Date</th>
                  <th className="p-4 text-left font-bold">Customer</th>
                  <th className="p-4 text-left font-bold">Lorry Count</th>
                  <th className="p-4 text-right font-bold">Amount</th>
                  <th className="p-4 text-center font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredBills.map((bill) => (
                  <tr key={bill.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <span className="font-bold text-primary">{bill.billNumber}</span>
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {new Date(bill.billDate).toLocaleDateString('en-GB')}
                    </td>
                    <td className="p-4">
                      <div className="font-semibold">{bill.customerName}</div>
                      <div className="text-[10px] text-muted-foreground truncate max-w-[200px]">{bill.customerAddress}</div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                        {bill.freightDetails.length} LORRIES
                      </span>
                    </td>
                    <td className="p-4 text-right font-black">
                      ₹ {bill.totalAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-1">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/bills/${bill.id}`} title="View Bill">
                            <Eye className="w-4 h-4" />
                          </Link>
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/bills/${bill.id}`} className="flex items-center">
                                <Eye className="w-4 h-4 mr-2" /> View/Print
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/bills/${bill.id}/edit`} className="flex items-center">
                                <Edit2 className="w-4 h-4 mr-2" /> Edit Record
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-destructive flex items-center"
                              onClick={() => handleDelete(bill.id)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" /> Delete Record
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
