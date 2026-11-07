import type { TxKind } from "./types";

export type ParseResult = { ok: true; paise: bigint } | { ok: false; error: string };

const MAX_RUPEE_DIGITS = 11;

export function parseRupees(input: string, options: { allowZero?: boolean } = {}): ParseResult {
  const text = input.trim().replace(/^₹/, "").replace(/,/g, "").trim();
  if (text === "") return { ok: false, error: "Enter an amount." };
  if (text.startsWith("-") || text.startsWith("−")) {
    return { ok: false, error: "Enter the amount without a minus sign. Choose Expense or Income instead." };
  }
  const match = /^(\d*)(?:\.(\d*))?$/.exec(text);
  const whole = match?.[1] ?? "";
  const fraction = match?.[2] ?? "";
  if (!match || (whole === "" && fraction === "")) {
    return { ok: false, error: "Use digits only, for example 1250 or 1250.50." };
  }
  if (fraction.length > 2) return { ok: false, error: "Use at most two decimal places." };
  if (whole.replace(/^0+/, "").length > MAX_RUPEE_DIGITS) return { ok: false, error: "That amount is too large." };

  const paise = BigInt(whole || "0") * 100n + BigInt((fraction + "00").slice(0, 2));
  if (paise === 0n && !options.allowZero) return { ok: false, error: "Enter an amount greater than ₹0." };
  return { ok: true, paise };
}

export function formatRupees(paise: bigint): string {
  const negative = paise < 0n;
  const abs = negative ? -paise : paise;
  const rupees = (abs / 100n).toString();
  const cents = (abs % 100n).toString().padStart(2, "0");
  // Indian grouping: the last three digits, then pairs (1,24,500).
  const grouped =
    rupees.length > 3 ? `${rupees.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ",")},${rupees.slice(-3)}` : rupees;
  return `${negative ? "−" : ""}₹${grouped}.${cents}`;
}

export function formatSigned(kind: TxKind, paise: bigint): string {
  return `${kind === "income" ? "+" : "−"}${formatRupees(paise)}`;
}
