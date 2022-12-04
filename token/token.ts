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
  MINUS = "-",
  BANG = "!",
  ASTERISK = "*",
  SLASH = "/",

  LT = "<",
  GT = ">",

  EQ = "==",
  NOT_EQ = "!=",

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
  TRUE = "TRUE",
  FALSE = "FALSE",
  IF = "IF",
  ELSE = "ELSE",
  RETURN = "RETURN",
}

const keyword = new Map<string, TokenType>([
  ["fn", token.FUNCTION],
  ["let", token.LET],
  ["true", token.TRUE],
  ["false", token.FALSE],
  ["if", token.IF],
  ["else", token.ELSE],
  ["return", token.RETURN],
]);

export function LookupIdent(ident: string): TokenType {
  return keyword.has(ident) ? (keyword.get(ident) as string) : token.IDENT;
}
