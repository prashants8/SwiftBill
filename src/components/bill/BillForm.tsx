"use client"

import React, { useState, useEffect, useMemo } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, Trash2, Save, RotateCcw, ShieldCheck, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { amountToWordsInr } from '@/lib/amount-to-words';
import { Bill } from '@/types/bill';
import { mockDb } from '@/lib/mock-db';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

const freightDetailSchema = z.object({
  lrNumber: z.string().min(1, "LR No is required"),
  lrDate: z.string().min(1, "LR Date is required"),
  lorryNumber: z.string().min(1, "Lorry No is required"),
  particulars: z.string().min(1, "Particulars are required"),
  fromLocation: z.string().min(1, "From is required"),
  toLocation: z.string().min(1, "To is required"),
  weight: z.string().default(''),
  rate: z.string().default(''),
  freightAmount: z.number().min(0),
});

const billSchema = z.object({
  billNumber: z.string().min(1, "Bill No is required"),
  billDate: z.string().min(1, "Date is required"),
  customerName: z.string().min(1, "Customer Name is required"),
  customerAddress: z.string().min(1, "Address is required"),
  freightDetails: z.array(freightDetailSchema),
  charges: z.object({
    transitInsurance: z.number().min(0),
    transitInsuranceNA: z.boolean().optional(),
    otherCharges: z.number().min(0),
  }),
  panNo: z.string().default(''),
  gstin: z.string().default(''),
});

type FormValues = z.infer<typeof billSchema>;

export function BillForm({ initialData }: { initialData?: Bill }) {
  const router = useRouter();
  const { toast } = useToast();
  const [amountInWords, setAmountInWords] = useState('');
  const [isConverting, setIsConverting] = useState(false);

  const { register, control, handleSubmit, watch, setValue, getValues, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(billSchema),
    defaultValues: initialData ? {
      billNumber: initialData.billNumber,
      billDate: initialData.billDate,
      customerName: initialData.customerName,
      customerAddress: initialData.customerAddress,
      freightDetails: initialData.freightDetails,
      charges: initialData.charges,
      panNo: initialData.panNo,
      gstin: initialData.gstin,
    } : {
      billNumber: `BILL-${Date.now().toString().slice(-6)}`,
      billDate: new Date().toISOString().split('T')[0],
      freightDetails: [{ lrNumber: '', lrDate: new Date().toISOString().split('T')[0], lorryNumber: '', particulars: '', fromLocation: '', toLocation: '', weight: '', rate: '', freightAmount: 0 }],
      charges: { transitInsurance: 0, transitInsuranceNA: false, otherCharges: 0 },
      panNo: '',
      gstin: '',
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "freightDetails"
  });

  const watchedFreightDetails = watch("freightDetails") ?? [];
  const watchedCharges = watch("charges");

  React.useEffect(() => {
    if (watchedCharges?.transitInsuranceNA) {
      setValue("charges.transitInsurance", 0);
    }
  }, [watchedCharges?.transitInsuranceNA, setValue]);

  // Grand Total = Total Freight + Transit Insurance (0 when NA; Other Charges excluded)
  // Derived during render so it always stays in sync with form values
  const totalAmount = useMemo(() => {
    const freightTotal = (Array.isArray(watchedFreightDetails) ? watchedFreightDetails : []).reduce(
      (sum, item) => sum + (Number(item?.freightAmount) || 0),
      0
    );
    const isNA = watchedCharges?.transitInsuranceNA === true;
    const insurance = isNA ? 0 : (Number(watchedCharges?.transitInsurance) || 0);
    return freightTotal + insurance;
  }, [watchedFreightDetails, watchedCharges]);

  useEffect(() => {
    if (totalAmount > 0) {
      const timer = setTimeout(() => {
        setIsConverting(true);
        try {
          setAmountInWords(amountToWordsInr(totalAmount));
        } finally {
          setIsConverting(false);
        }
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setAmountInWords('');
    }
  }, [totalAmount]);

  const onSubmit = (data: FormValues) => {
    try {
      const newBill: Bill = {
        ...data,
        id: initialData?.id || crypto.randomUUID(),
        totalAmount,
        amountInWords,
        createdAt: initialData?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockDb.save(newBill);
      toast({ title: "Success", description: "Bill record updated successfully" });
      router.push(`/bills/${newBill.id}`);
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  const addToInsurance = (amount: number) => {
    const current = getValues("charges.transitInsurance") || 0;
    setValue("charges.transitInsurance", Number((current + amount).toFixed(2)));
    toast({ title: "Added", description: `₹${amount} added to Transit Insurance` });
  };

  const addToOtherCharges = (amount: number) => {
    const current = getValues("charges.otherCharges") || 0;
    setValue("charges.otherCharges", Number((current + amount).toFixed(2)));
    toast({ title: "Added", description: `₹${amount} added to Other Charges` });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-5xl mx-auto pb-20">
      <div className="flex justify-between items-center no-print">
        <div>
          <h2 className="text-2xl font-bold text-primary">{initialData ? 'Edit Freight Bill' : 'New Freight Bill Entry'}</h2>
          <p className="text-muted-foreground">Fill in the details matching the physical ARC bill format.</p>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            <RotateCcw className="w-4 h-4 mr-2" /> Cancel
          </Button>
          <Button type="submit">
            <Save className="w-4 h-4 mr-2" /> {initialData ? 'Update Bill' : 'Save Bill'}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Header Section</CardTitle>
          <CardDescription>Bill identity and numbering</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="billNumber">Bill No.</Label>
            <Input id="billNumber" {...register("billNumber")} />
            {errors.billNumber && <p className="text-xs text-destructive">{errors.billNumber.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="billDate">Date</Label>
            <Input id="billDate" type="date" {...register("billDate")} />
            {errors.billDate && <p className="text-xs text-destructive">{errors.billDate.message}</p>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Customer Section</CardTitle>
          <CardDescription>Consignee / Billing party details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customerName">M/s (Customer Name)</Label>
            <Input id="customerName" placeholder="Enter company name" {...register("customerName")} />
            {errors.customerName && <p className="text-xs text-destructive">{errors.customerName.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="customerAddress">Address</Label>
            <Textarea id="customerAddress" placeholder="Enter full postal address" rows={3} {...register("customerAddress")} />
            {errors.customerAddress && <p className="text-xs text-destructive">{errors.customerAddress.message}</p>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Freight Details</CardTitle>
            <CardDescription>Tabular lorry and consignment information</CardDescription>
          </div>
          <Button type="button" size="sm" onClick={() => append({ lrNumber: '', lrDate: new Date().toISOString().split('T')[0], lorryNumber: '', particulars: '', fromLocation: '', toLocation: '', weight: '', rate: '', freightAmount: 0 })}>
            <Plus className="w-4 h-4 mr-2" /> Add Row
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b text-sm font-medium text-muted-foreground">
                  <th className="text-left py-2 pr-4">L.R. No & Date</th>
                  <th className="text-left py-2 pr-4">Lorry No.</th>
                  <th className="text-left py-2 pr-4">Particulars</th>
                  <th className="text-left py-2 pr-4">From/To</th>
                  <th className="text-right py-2 pr-4">Wt/Rate</th>
                  <th className="text-right py-2 pr-4">Freight Charge</th>
                  <th className="w-10"></th>
                </tr>
              </thead>
              <tbody>
                {fields.map((field, index) => (
                  <tr key={field.id} className="border-b last:border-0 align-top">
                    <td className="py-3 pr-4 space-y-2">
                      <Input placeholder="LR No" {...register(`freightDetails.${index}.lrNumber`)} />
                      <Input type="date" {...register(`freightDetails.${index}.lrDate`)} />
                    </td>
                    <td className="py-3 pr-4">
                      <Input placeholder="Lorry No" {...register(`freightDetails.${index}.lorryNumber`)} />
                    </td>
                    <td className="py-3 pr-4">
                      <Input placeholder="Description" {...register(`freightDetails.${index}.particulars`)} />
                    </td>
                    <td className="py-3 pr-4 space-y-2">
                      <Input placeholder="From" {...register(`freightDetails.${index}.fromLocation`)} />
                      <Input placeholder="To" {...register(`freightDetails.${index}.toLocation`)} />
                    </td>
                    <td className="py-3 pr-4 space-y-2">
                      <Input placeholder="e.g. 10 MT" {...register(`freightDetails.${index}.weight`)} />
                      <Input placeholder="e.g. Fixed" {...register(`freightDetails.${index}.rate`)} />
                    </td>
                    <td className="py-3 pr-4 space-y-2">
                      <Input type="number" step="0.01" placeholder="Amount" {...register(`freightDetails.${index}.freightAmount`, { valueAsNumber: true })} />
                      <div className="flex gap-1">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                type="button" 
                                variant="outline" 
                                size="sm" 
                                className="h-7 px-2 flex-1 text-[10px]"
                                onClick={() => addToInsurance(getValues(`freightDetails.${index}.freightAmount`))}
                              >
                                <ShieldCheck className="w-3 h-3 mr-1" /> Ins.
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Add this row's charge to Transit Insurance</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                type="button" 
                                variant="outline" 
                                size="sm" 
                                className="h-7 px-2 flex-1 text-[10px]"
                                onClick={() => addToOtherCharges(getValues(`freightDetails.${index}.freightAmount`))}
                              >
                                <CreditCard className="w-3 h-3 mr-1" /> Other
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Add this row's charge to Other Charges</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </td>
                    <td className="py-3">
                      {fields.length > 1 && (
                        <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className="text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Company Details</CardTitle>
            <CardDescription>Tax and identity numbers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="panNo">PAN No.</Label>
              <Input id="panNo" placeholder="Enter PAN Number" {...register("panNo")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gstin">GSTIN</Label>
              <Input id="gstin" placeholder="Enter GST Number" {...register("gstin")} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-primary">Charges & Total</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 items-center gap-4">
              <Label htmlFor="transitInsurance">Transit Insurance</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="transitInsurance"
                  type="number"
                  step="0.01"
                  className="text-right font-bold"
                  disabled={watch("charges.transitInsuranceNA") === true}
                  {...register("charges.transitInsurance", { valueAsNumber: true })}
                />
                <label className="flex items-center gap-2 text-sm font-medium whitespace-nowrap cursor-pointer">
                  <input
                    type="checkbox"
                    className="rounded border-input"
                    {...register("charges.transitInsuranceNA")}
                  />
                  NA
                </label>
              </div>
            </div>
            <div className="grid grid-cols-2 items-center gap-4">
              <Label htmlFor="otherCharges">Other Charges (Excl. from Total)</Label>
              <Input id="otherCharges" type="number" step="0.01" className="text-right font-bold" {...register("charges.otherCharges", { valueAsNumber: true })} />
            </div>
            <Separator />
            <div className="flex justify-between items-center text-xl font-bold text-primary">
              <div className="flex flex-col">
                <span>Grand Total</span>
                <span className="text-[10px] text-muted-foreground font-normal">(Freight + Insurance)</span>
              </div>
              <span>₹ {totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="text-sm mt-4 italic font-medium p-3 bg-white rounded border border-dashed border-primary/20">
              {isConverting ? "Converting to words..." : amountInWords && `Amount in words: ${amountInWords}`}
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  );
}
