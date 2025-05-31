import type { Token, TokenType } from "@mojir/lits";

export interface LitsEditorAttributes {
  value?: string;
  "show-line-numbers"?: boolean;
  "show-errors"?: boolean;
  readonly?: boolean;
  placeholder?: string;
  theme?: string;
  "max-length"?: number;
}

export interface Theme {
  background: string;
  text: string;
  selection: string;
  cursor: string;
  lineNumber: string;
  lineNumberBg: string;
  keyword: string;
  string: string;
  number: string;
  comment: string;
  operator: string;
  symbol: string;
  regexp: string;
  error: string;
  errorBg: string;
  border: string;
}

export interface TokenInfo {
  type: TokenType;
  value: string;
  start: number;
  end: number;
}

export type { Token, TokenType };
