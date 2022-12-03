export type TokenType = string;

export interface Token {
  Type: TokenType;
  Literal: string;
}

export enum token {
  ILLEGAL = "ILLEGAL",
  EOF = "EOF",
  // 식별자 + 리터럴
  IDENT = "IDENT",
  INT = "INT",

  // 연산자
  ASSIGN = "=",
  PLUS = "+",

  // 구분자
  COMMA = ",",
  SEMICOLON = ";",

  LPAREN = "(",
  RPAREN = ")",
  LBRACE = "{",
  RBRACE = "}",

  // 예약어
  FUNCTION = "FUNCTION",
  LET = "LET",
}

const keyword = new Map<string, TokenType>([
  ["fn", token.FUNCTION],
  ["let", token.LET],
]);

export function LookupIdent(ident: string): TokenType {
  return keyword.has(ident) ? (keyword.get(ident) as string) : token.IDENT;
}
