export interface FreightDetail {
  id: string;
  lrNumber: string;
  lrDate: string;
  lorryNumber: string;
  particulars: string;
  fromLocation: string;
  toLocation: string;
  weight: number;
  rate: number;
  freightAmount: number;
}

export interface AdditionalCharges {
  transitInsurance: number;
  otherCharges: number;
}

export interface Bill {
  id: string;
  billNumber: string;
  billDate: string;
  customerName: string;
  customerAddress: string;
  freightDetails: FreightDetail[];
  charges: AdditionalCharges;
  totalAmount: number;
  amountInWords: string;
  panNo: string;
  gstin: string;
  createdAt: string;
  updatedAt: string;
}