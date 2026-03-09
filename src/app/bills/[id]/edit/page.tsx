"use client"

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Bill } from '@/types/bill';
import { getBillById } from '@/lib/supabaseBillsRepository';
import { BillForm } from '@/components/bill/BillForm';
import { Loader2 } from 'lucide-react';

export default function EditBillPage() {
  const { id } = useParams();
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
        <p className="text-muted-foreground mt-2">The record you are trying to edit does not exist.</p>
      </div>
    );
  }

  return <BillForm initialData={bill} />;
}
