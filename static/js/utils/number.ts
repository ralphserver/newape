import BN from "bignumber.js";

export function toPercent(n: number | string | BN, decimals = 2) {
  if (new BN(n).isZero()) return "0%";

  const p = new BN(n).multipliedBy(100);
  if (p.isZero()) return "0%";
  return p.toFormat(decimals) + "%";
}

export function commify(n: string | number) {
  if (new BN(n).isZero()) return "0";

  const parts = n.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return trimZero(parts.join("."));
}

export function toDigits(n: string | number | BN, digits: number, _commify = true): string {
  if (new BN(n).isZero()) return "0";

  const m = new BN(n).toFixed(digits);
  const r = _commify ? commify(m) : m;
  return trimZero(r);
}

export function trimZero(n: string): string {
  const parts = n.toString().split(".");

  if (parts.length < 2) return n;

  parts[1] = parts[1].replace(/0+$/, "");
  if (parts[1].length === 0) return parts[0];
  return parts.join(".");
}
