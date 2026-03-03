"use client"

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Search, FileText, TrendingUp, Users, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bill } from '@/types/bill';
import { mockDb } from '@/lib/mock-db';

export default function Dashboard() {
  const [recentBills, setRecentBills] = useState<Bill[]>([]);
  const [stats, setStats] = useState({
    totalBills: 0,
    totalRevenue: 0,
    uniqueCustomers: 0,
  });

  useEffect(() => {
    const bills = mockDb.getAll();
    setRecentBills(bills.slice(-5).reverse());
    
    const revenue = bills.reduce((sum, bill) => sum + bill.totalAmount, 0);
    const customers = new Set(bills.map(b => b.customerName)).size;
    
    setStats({
      totalBills: bills.length,
      totalRevenue: revenue,
      uniqueCustomers: customers
    });
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to SwiftBill Management System.</p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/bills/new">
              <Plus className="w-4 h-4 mr-2" /> New Freight Bill
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/bills/search">
              <Search className="w-4 h-4 mr-2" /> Search
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Bills</CardTitle>
            <FileText className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBills}</div>
            <p className="text-xs text-muted-foreground">Lifetime bills generated</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹ {stats.totalRevenue.toLocaleString('en-IN')}</div>
            <p className="text-xs text-muted-foreground">Total earnings</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.uniqueCustomers}</div>
            <p className="text-xs text-muted-foreground">Unique client entities</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Bills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBills.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Truck className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p>No bills found. Create your first bill to see it here.</p>
                </div>
              ) : (
                <div className="rounded-md border overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="p-4 text-left font-semibold">Bill No</th>
                        <th className="p-4 text-left font-semibold">Date</th>
                        <th className="p-4 text-left font-semibold">Customer</th>
                        <th className="p-4 text-right font-semibold">Amount</th>
                        <th className="p-4 text-center font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {recentBills.map((bill) => (
                        <tr key={bill.id} className="hover:bg-muted/30 transition-colors">
                          <td className="p-4 font-bold text-primary">{bill.billNumber}</td>
                          <td className="p-4">{new Date(bill.billDate).toLocaleDateString()}</td>
                          <td className="p-4 font-medium">{bill.customerName}</td>
                          <td className="p-4 text-right font-bold">₹{bill.totalAmount.toLocaleString()}</td>
                          <td className="p-4 text-center">
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/bills/${bill.id}`}>View</Link>
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            {recentBills.length > 0 && (
              <div className="mt-4 text-center">
                <Button variant="link" asChild>
                  <Link href="/bills">View All Bills</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}