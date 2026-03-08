"use client"

import React from 'react';
import { Bill } from '@/types/bill';
import { ArcLogo } from './ArcLogo';
import { Button } from '@/components/ui/button';
import { Printer, Download, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function BillDocument({ bill }: { bill: Bill }) {
  const router = useRouter();

  const handlePrint = () => {
    window.print();
  };

  const totalFreight = bill.freightDetails.reduce((sum, item) => sum + (item.freightAmount || 0), 0);
  const isInsuranceNA = Boolean(bill.charges?.transitInsuranceNA);
  const transitInsuranceValue = isInsuranceNA ? 0 : (Number(bill.charges?.transitInsurance) || 0);
  const grandTotal =
    bill.totalAmount > 0
      ? bill.totalAmount
      : totalFreight + transitInsuranceValue;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center no-print bg-white p-4 rounded-lg shadow-sm border">
        <Button variant="ghost" onClick={() => router.push('/bills')}>
          <ArrowLeft className="w-4 h-4 mr-2" /> All Bills
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" /> Print Bill
          </Button>
          <Button onClick={handlePrint}>
            <Download className="w-4 h-4 mr-2" /> Download PDF
          </Button>
        </div>
      </div>

      <div className="bill-container font-body leading-tight text-black border-2 border-black">
        {/* Header section */}
        <div className="flex justify-between border-b-2 border-black p-4">
          <div className="flex gap-4">
            <ArcLogo className="flex-shrink-0" />
            <div className="space-y-1">
              <h1 className="text-2xl font-black text-[#CC1414] tracking-wider leading-none">ANJANEYA ROAD CARRIERS</h1>
              <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Specialist ODC Heavy Machinery Consignment for All Over India</p>
              <div className="text-[11px] text-black/80 mt-2">
                <p>3, 1st Floor, Krishna Commercial Centre, Nr. G.I.D.C. Colony,</p>
                <p>K-10, G.I.D.C. Kalol (N.G.) - 382721 (Dist. Gandhinagar)</p>
                <p>Mob.: 98250 17855, 98791 27855, 94260 21566</p>
              </div>
            </div>
          </div>
          <div className="w-48 border-l-2 border-black -my-4 p-4 flex flex-col justify-center">
            <div className="mb-2">
              <span className="font-bold text-sm block">Bill No.</span>
              <span className="text-lg font-bold text-primary">{bill.billNumber}</span>
            </div>
            <div>
              <span className="font-bold text-sm block">Date</span>
              <span className="text-lg font-bold">{new Date(bill.billDate).toLocaleDateString('en-GB')}</span>
            </div>
          </div>
        </div>

        {/* Customer section */}
        <div className="p-4 border-b-2 border-black bg-gray-50/50">
          <div className="flex gap-2">
            <span className="font-bold whitespace-nowrap">M/s.</span>
            <div className="flex-1">
              <h2 className="font-bold text-lg uppercase underline decoration-1 underline-offset-4">{bill.customerName}</h2>
              <p className="text-sm mt-2 whitespace-pre-wrap">{bill.customerAddress}</p>
            </div>
          </div>
        </div>

        {/* Table layout */}
        <div className="flex-1 min-h-[400px]">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-black text-[12px] font-black uppercase bg-gray-100">
                <th className="border-r-2 border-black py-2 px-1 w-[15%]">L.R. No. & Date</th>
                <th className="border-r-2 border-black py-2 px-1 w-[15%]">Lorry No.</th>
                <th className="border-r-2 border-black py-2 px-1 w-[30%]">Particulars</th>
                <th className="border-r-2 border-black py-2 px-1 w-[10%]">From</th>
                <th className="border-r-2 border-black py-2 px-1 w-[10%]">To</th>
                <th className="border-r-2 border-black py-2 px-1 w-[5%]">Weight</th>
                <th className="border-r-2 border-black py-2 px-1 w-[5%]">Rate</th>
                <th className="py-2 px-1 w-[10%] text-right">Freight</th>
              </tr>
            </thead>
            <tbody>
              {bill.freightDetails.map((detail, idx) => (
                <tr key={idx} className="text-[11px] border-b border-gray-200 h-10">
                  <td className="border-r-2 border-black px-1 py-2 text-center">
                    <div className="font-bold">{detail.lrNumber}</div>
                    <div className="text-[9px]">{new Date(detail.lrDate).toLocaleDateString('en-GB')}</div>
                  </td>
                  <td className="border-r-2 border-black px-1 py-2 text-center font-bold">{detail.lorryNumber}</td>
                  <td className="border-r-2 border-black px-1 py-2">{detail.particulars}</td>
                  <td className="border-r-2 border-black px-1 py-2 text-center uppercase">{detail.fromLocation}</td>
                  <td className="border-r-2 border-black px-1 py-2 text-center uppercase">{detail.toLocation}</td>
                  <td className="border-r-2 border-black px-1 py-2 text-center">{detail.weight}</td>
                  <td className="border-r-2 border-black px-1 py-2 text-center">{detail.rate}</td>
                  <td className="px-1 py-2 text-right font-bold">{detail.freightAmount.toFixed(2)}</td>
                </tr>
              ))}
              {/* Spacer rows */}
              {Array.from({ length: Math.max(0, 10 - bill.freightDetails.length) }).map((_, i) => (
                <tr key={`spacer-${i}`} className="h-10">
                  <td className="border-r-2 border-black"></td>
                  <td className="border-r-2 border-black"></td>
                  <td className="border-r-2 border-black"></td>
                  <td className="border-r-2 border-black"></td>
                  <td className="border-r-2 border-black"></td>
                  <td className="border-r-2 border-black"></td>
                  <td className="border-r-2 border-black"></td>
                  <td className=""></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Charges section */}
        <div className="border-t-2 border-black flex">
          <div className="flex-1 p-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <span className="font-black text-xs block uppercase mb-1">Rupees in words</span>
                <p className="font-bold italic text-sm p-2 bg-gray-50 border border-dashed border-gray-300 min-h-[40px]">{bill.amountInWords}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-[10px]">
                <div>
                  <span className="font-bold">PAN No.:</span> {bill.panNo}
                </div>
                <div>
                  <span className="font-bold">GSTIN:</span> {bill.gstin}
                </div>
              </div>
            </div>
          </div>
          <div className="w-64 border-l-2 border-black">
            <div className="border-b border-black flex justify-between p-2 text-xs">
              <span className="font-medium">Total Freight</span>
              <span className="font-bold">{totalFreight.toFixed(2)}</span>
            </div>
            <div className="border-b border-black flex justify-between p-2 text-xs">
              <span className="font-medium">Transit Insurance</span>
              <span className="font-bold">
                {isInsuranceNA ? "NA" : (bill.charges?.transitInsurance ?? 0).toFixed(2)}
              </span>
            </div>
            <div className="border-b border-black flex justify-between p-2 text-xs text-muted-foreground italic">
              <span className="font-medium">Other Charges*</span>
              <span className="font-bold">{bill.charges.otherCharges.toFixed(2)}</span>
            </div>
            <div className="flex justify-between p-2 text-sm font-black bg-gray-100">
              <span className="uppercase">Grand Total</span>
              <span className="text-primary underline decoration-double underline-offset-4">₹ {grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>

        {/* Footer section */}
        <div className="border-t-2 border-black grid grid-cols-3 divide-x-2 divide-black min-h-[80px]">
          <div className="p-2 flex flex-col justify-between">
            <span className="text-[10px] italic font-bold">Subject to Jurisdiction: KALOL</span>
          </div>
          <div className="p-2 flex flex-col justify-end items-center">
            <div className="border-t border-black w-2/3 text-center text-[10px] font-bold">Checked By</div>
          </div>
          <div className="p-2 flex flex-col justify-between text-center">
            <span className="text-[10px] font-black uppercase">For ANJANEYA ROAD CARRIERS</span>
            <div className="mt-8">
              <div className="border-t border-black w-3/4 mx-auto text-[10px] font-bold pt-1">Partner / Auth. Signatory</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
