import type { Lits } from "@mojir/lits";
import type { TokenInfo } from "../types";

export function tokenizeCode(lits: Lits, code: string): TokenInfo[] {
  const result = lits.tokenize(code);
  const tokens: TokenInfo[] = [];
  let start = 0;
  for (const token of result.tokens) {
    const [type, value] = token;
    tokens.push({
      type,
      value,
      start,
      end: start + value.length,
    });
    start += value.length;
  }

  return tokens;
}
