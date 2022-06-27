import { Contract } from "ethers";

export function sameAddress(a: string, b: string): boolean {
  return a.toLowerCase() === b.toLowerCase();
}

export function shortAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export async function callContract<
  C extends Contract,
  M extends keyof C["functions"],
  P extends Parameters<C[M]>,
  R extends ReturnType<C[M]>,
>(contract: C, method: M, args: P): Promise<R> {
  return await contract[method](args);
}
