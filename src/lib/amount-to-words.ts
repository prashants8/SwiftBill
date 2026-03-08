/**
 * Converts a numeric amount to words in Indian Rupees format.
 * Pure JavaScript - no AI/API required. Works reliably in production.
 *
 * Example: 173000 -> "Rupees One Lakh Seventy Three Thousand Only"
 */
const ones = [
  "",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
]
const teens = [
  "Ten",
  "Eleven",
  "Twelve",
  "Thirteen",
  "Fourteen",
  "Fifteen",
  "Sixteen",
  "Seventeen",
  "Eighteen",
  "Nineteen",
]
const tens = [
  "",
  "",
  "Twenty",
  "Thirty",
  "Forty",
  "Fifty",
  "Sixty",
  "Seventy",
  "Eighty",
  "Ninety",
]

function toWordsUnder1000(n: number): string {
  if (n === 0) return ""
  const parts: string[] = []
  const h = Math.floor(n / 100)
  const t = Math.floor((n % 100) / 10)
  const o = n % 10
  if (h > 0) parts.push(`${ones[h]} Hundred`)
  if (t === 1) {
    parts.push(teens[o])
  } else {
    if (t > 0) parts.push(tens[t])
    if (o > 0) parts.push(ones[o])
  }
  return parts.filter(Boolean).join(" ")
}

export function amountToWordsInr(amount: number): string {
  if (amount === 0) return "Rupees Zero Only"
  if (amount < 0 || !Number.isFinite(amount)) return ""

  const rupees = Math.floor(amount)
  const paise = Math.round((amount - rupees) * 100)

  const parts: string[] = []

  let n = rupees
  if (n >= 1_00_00_000) {
    const crore = Math.floor(n / 1_00_00_000)
    parts.push(toWordsUnder1000(crore) + " Crore")
    n %= 1_00_00_000
  }
  if (n >= 1_00_000) {
    const lakh = Math.floor(n / 1_00_000)
    parts.push(toWordsUnder1000(lakh) + " Lakh")
    n %= 1_00_000
  }
  if (n >= 1000) {
    const thousand = Math.floor(n / 1000)
    parts.push(toWordsUnder1000(thousand) + " Thousand")
    n %= 1000
  }
  if (n > 0) {
    parts.push(toWordsUnder1000(n))
  }

  let result = "Rupees " + parts.filter(Boolean).join(" ") + " Only"
  if (paise > 0) {
    result += ` And ${toWordsUnder1000(paise)} Paise Only`
  }
  return result
}
