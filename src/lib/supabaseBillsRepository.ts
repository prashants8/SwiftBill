import type { Bill, FreightDetail, AdditionalCharges } from "@/types/bill"
import { supabase } from "@/lib/supabaseClient"

type BillRow = {
  id: string
  owner_id: string
  bill_number: string
  bill_date: string
  customer_name: string
  customer_address: string
  pan_no: string | null
  gstin: string | null
  total_amount: number | string | null
  amount_in_words: string | null
  created_at: string
  updated_at: string
  freight_details?: FreightDetailRow[] | null
  additional_charges?: AdditionalChargesRow[] | null
}

type FreightDetailRow = {
  id: string
  bill_id: string
  lr_number: string
  lr_date: string
  lorry_number: string
  particulars: string
  from_location: string
  to_location: string
  weight: string | null
  rate: string | null
  freight_amount: number | string | null
}

type AdditionalChargesRow = {
  bill_id: string
  transit_insurance: number | string | null
  transit_insurance_na: boolean | null
  other_charges: number | string | null
}

function toNumber(value: unknown): number {
  const n = typeof value === "string" ? Number(value) : (value as number)
  return Number.isFinite(n) ? n : 0
}

function mapRowToBill(row: BillRow): Bill {
  const freightRows = row.freight_details ?? []
  const chargesRow = row.additional_charges?.[0]

  const freightDetails: FreightDetail[] = (freightRows ?? []).map((d) => ({
    lrNumber: d.lr_number,
    lrDate: d.lr_date,
    lorryNumber: d.lorry_number,
    particulars: d.particulars,
    fromLocation: d.from_location,
    toLocation: d.to_location,
    weight: d.weight ?? "",
    rate: d.rate ?? "",
    freightAmount: toNumber(d.freight_amount),
  }))

  const charges: AdditionalCharges = {
    transitInsurance: toNumber(chargesRow?.transit_insurance),
    transitInsuranceNA: Boolean(chargesRow?.transit_insurance_na),
    otherCharges: toNumber(chargesRow?.other_charges),
  }

  return {
    id: row.id,
    ownerId: row.owner_id,
    billNumber: row.bill_number,
    billDate: row.bill_date,
    customerName: row.customer_name,
    customerAddress: row.customer_address,
    freightDetails,
    charges,
    totalAmount: toNumber(row.total_amount),
    amountInWords: row.amount_in_words ?? "",
    panNo: row.pan_no ?? "",
    gstin: row.gstin ?? "",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

async function requireUserId(): Promise<string> {
  const { data, error } = await supabase.auth.getUser()
  if (error) throw error
  const uid = data.user?.id
  if (!uid) throw new Error("Not authenticated")
  return uid
}

async function assertBillOwnership(billId: string, ownerId: string) {
  const { data, error } = await supabase
    .from("bills")
    .select("id")
    .eq("id", billId)
    .eq("owner_id", ownerId)
    .maybeSingle()

  if (error) throw error
  if (!data) throw new Error("Bill not found")
}

export async function createBill(input: Bill): Promise<Bill> {
  const ownerId = await requireUserId()
  const billId = input.id || crypto.randomUUID()

  const now = new Date().toISOString()
  const isInsuranceNA = input.charges?.transitInsuranceNA === true
  const transitInsurance = isInsuranceNA ? 0 : toNumber(input.charges?.transitInsurance)

  const billInsert = {
    id: billId,
    owner_id: ownerId,
    bill_number: input.billNumber,
    bill_date: input.billDate,
    customer_name: input.customerName,
    customer_address: input.customerAddress,
    pan_no: input.panNo || null,
    gstin: input.gstin || null,
    total_amount: toNumber(input.totalAmount),
    amount_in_words: input.amountInWords || "",
    created_at: now,
    updated_at: now,
  }

  const { error: billErr } = await supabase.from("bills").insert(billInsert)
  if (billErr) throw billErr

  const freightInserts = (input.freightDetails ?? []).map((d) => ({
    id: crypto.randomUUID(),
    bill_id: billId,
    lr_number: d.lrNumber,
    lr_date: d.lrDate,
    lorry_number: d.lorryNumber,
    particulars: d.particulars,
    from_location: d.fromLocation,
    to_location: d.toLocation,
    weight: d.weight || null,
    rate: d.rate || null,
    freight_amount: toNumber(d.freightAmount),
  }))

  if (freightInserts.length > 0) {
    const { error: freightErr } = await supabase.from("freight_details").insert(freightInserts)
    if (freightErr) throw freightErr
  }

  const chargesInsert = {
    bill_id: billId,
    transit_insurance: transitInsurance,
    transit_insurance_na: isInsuranceNA,
    other_charges: toNumber(input.charges?.otherCharges),
  }
  const { error: chargesErr } = await supabase.from("additional_charges").insert(chargesInsert)
  if (chargesErr) throw chargesErr

  const created = await getBillById(billId)
  if (!created) throw new Error("Failed to load created bill")
  return created
}

export async function updateBill(input: Bill): Promise<Bill> {
  const ownerId = await requireUserId()
  const billId = input.id
  if (!billId) throw new Error("Missing bill id")

  await assertBillOwnership(billId, ownerId)

  const now = new Date().toISOString()
  const isInsuranceNA = input.charges?.transitInsuranceNA === true
  const transitInsurance = isInsuranceNA ? 0 : toNumber(input.charges?.transitInsurance)

  const billUpdate = {
    bill_number: input.billNumber,
    bill_date: input.billDate,
    customer_name: input.customerName,
    customer_address: input.customerAddress,
    pan_no: input.panNo || null,
    gstin: input.gstin || null,
    total_amount: toNumber(input.totalAmount),
    amount_in_words: input.amountInWords || "",
    updated_at: now,
  }

  const { error: billErr } = await supabase
    .from("bills")
    .update(billUpdate)
    .eq("id", billId)
    .eq("owner_id", ownerId)
  if (billErr) throw billErr

  // Replace freight rows (simpler than patching per-row)
  const { error: delFreightErr } = await supabase.from("freight_details").delete().eq("bill_id", billId)
  if (delFreightErr) throw delFreightErr

  const freightInserts = (input.freightDetails ?? []).map((d) => ({
    id: crypto.randomUUID(),
    bill_id: billId,
    lr_number: d.lrNumber,
    lr_date: d.lrDate,
    lorry_number: d.lorryNumber,
    particulars: d.particulars,
    from_location: d.fromLocation,
    to_location: d.toLocation,
    weight: d.weight || null,
    rate: d.rate || null,
    freight_amount: toNumber(d.freightAmount),
  }))

  if (freightInserts.length > 0) {
    const { error: freightErr } = await supabase.from("freight_details").insert(freightInserts)
    if (freightErr) throw freightErr
  }

  const chargesUpsert = {
    bill_id: billId,
    transit_insurance: transitInsurance,
    transit_insurance_na: isInsuranceNA,
    other_charges: toNumber(input.charges?.otherCharges),
  }

  const { error: chargesErr } = await supabase.from("additional_charges").upsert(chargesUpsert)
  if (chargesErr) throw chargesErr

  const updated = await getBillById(billId)
  if (!updated) throw new Error("Failed to load updated bill")
  return updated
}

export async function deleteBill(billId: string): Promise<void> {
  const ownerId = await requireUserId()
  await assertBillOwnership(billId, ownerId)

  // Explicitly remove children for safety (in case DB doesn't cascade)
  const { error: fdErr } = await supabase.from("freight_details").delete().eq("bill_id", billId)
  if (fdErr) throw fdErr
  const { error: chErr } = await supabase.from("additional_charges").delete().eq("bill_id", billId)
  if (chErr) throw chErr

  const { error: billErr } = await supabase.from("bills").delete().eq("id", billId).eq("owner_id", ownerId)
  if (billErr) throw billErr
}

export async function getBills(): Promise<Bill[]> {
  const ownerId = await requireUserId()

  const { data, error } = await supabase
    .from("bills")
    .select(
      `id, owner_id, bill_number, bill_date, customer_name, customer_address, pan_no, gstin, total_amount, amount_in_words, created_at, updated_at,
       freight_details:freight_details (*),
       additional_charges:additional_charges (*)`
    )
    .eq("owner_id", ownerId)
    .order("created_at", { ascending: false })

  if (error) throw error
  return (data ?? []).map((row) => mapRowToBill(row as unknown as BillRow))
}

export async function getBillById(billId: string): Promise<Bill | null> {
  const ownerId = await requireUserId()

  const { data, error } = await supabase
    .from("bills")
    .select(
      `id, owner_id, bill_number, bill_date, customer_name, customer_address, pan_no, gstin, total_amount, amount_in_words, created_at, updated_at,
       freight_details:freight_details (*),
       additional_charges:additional_charges (*)`
    )
    .eq("id", billId)
    .eq("owner_id", ownerId)
    .maybeSingle()

  if (error) throw error
  if (!data) return null
  return mapRowToBill(data as unknown as BillRow)
}

