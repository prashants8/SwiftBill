export interface FreightDetail {
  lrNumber: string;
  lrDate: string;
  lorryNumber: string;
  particulars: string;
  fromLocation: string;
  toLocation: string;
  weight: string; // Flexible text (e.g., "10 MT")
  rate: string;   // Flexible text (e.g., "Fixed" or "1500")
  freightAmount: number; // The actual charge
}

export interface AdditionalCharges {
  transitInsurance: number;
  /** When true, display "NA" for transit insurance and exclude from grand total (use 0). */
  transitInsuranceNA?: boolean;
  otherCharges: number;
}

export interface Bill {
  id: string;
  // Owner of this bill (local auth user id). Bills created
  // before auth was added may not have this set.
  ownerId?: string;
  billNumber: string;
  billDate: string;
  customerName: string;
  customerAddress: string;
  freightDetails: FreightDetail[];
  charges: AdditionalCharges;
  totalAmount: number; // Freight + Insurance
  amountInWords: string;
  panNo: string;
  gstin: string;
  createdAt: string;
  updatedAt: string;
}
