"use client"

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Bill } from '@/types/bill';
import { getBillById } from '@/lib/supabaseBillsRepository';
import { BillDocument } from '@/components/bill/BillDocument';
import { Loader2, Edit2, ArrowLeft, Printer, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function BillViewPage() {
  const { id } = useParams();
  const router = useRouter();
  const [bill, setBill] = useState<Bill | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      if (!id) return;
      try {
        const data = await getBillById(id as string);
        if (!active) return;
        setBill(data || null);
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!bill) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold">Bill Not Found</h2>
        <p className="text-muted-foreground mt-2">The bill you are looking for does not exist or has been deleted.</p>
        <Button variant="outline" className="mt-4" onClick={() => router.push('/bills')}>
          Back to Bills
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center no-print bg-white p-4 rounded-lg shadow-sm border">
        <Button variant="ghost" onClick={() => router.push('/bills')}>
          <ArrowLeft className="w-4 h-4 mr-2" /> All Bills
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push(`/bills/${bill.id}/edit`)}>
            <Edit2 className="w-4 h-4 mr-2" /> Edit Bill
          </Button>
          <Button variant="outline" onClick={() => window.print()}>
            <Printer className="w-4 h-4 mr-2" /> Print
          </Button>
          <Button onClick={() => window.print()}>
            <Download className="w-4 h-4 mr-2" /> Download
          </Button>
        </div>
      </div>
      <BillDocument bill={bill} />
    </div>
  );
}
