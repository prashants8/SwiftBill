"use client"

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Bill } from '@/types/bill';
import { mockDb } from '@/lib/mock-db';
import { BillForm } from '@/components/bill/BillForm';
import { Loader2 } from 'lucide-react';

export default function EditBillPage() {
  const { id } = useParams();
  const [bill, setBill] = useState<Bill | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const data = mockDb.getById(id as string);
      setBill(data || null);
      setLoading(false);
    }
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
