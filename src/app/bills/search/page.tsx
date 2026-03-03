"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Loader2, FileWarning } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { mockDb } from '@/lib/mock-db';
import { useToast } from '@/hooks/use-toast';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    const bill = mockDb.getByBillNumber(query.trim());
    
    setTimeout(() => {
      setIsSearching(false);
      if (bill) {
        router.push(`/bills/${bill.id}`);
      } else {
        toast({
          variant: "destructive",
          title: "Not Found",
          description: `No bill found with number: ${query}`
        });
      }
    }, 600);
  };

  return (
    <div className="max-w-2xl mx-auto py-12">
      <Card className="border-2 border-primary/20 shadow-lg">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Bill Retrieval</CardTitle>
          <CardDescription>Enter the Bill Number to instantly retrieve and view records.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input 
              placeholder="e.g. BILL-123456" 
              value={query} 
              onChange={(e) => setQuery(e.target.value)}
              className="text-lg py-6"
              autoFocus
            />
            <Button type="submit" size="lg" disabled={isSearching} className="px-8">
              {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : "Search"}
            </Button>
          </form>

          <div className="mt-8 pt-8 border-t space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Recent Searches / Shortcuts</h4>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={() => router.push('/bills')}>
                View All Records
              </Button>
              <Button variant="outline" size="sm" onClick={() => router.push('/bills/new')}>
                Create New Bill
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}