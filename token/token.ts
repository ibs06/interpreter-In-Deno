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

  // 최초 Null 설정값(타입단언을 계속 쓰지 않기 위해 추가)
  // p.curToken as Token
  NIL = "NIL",
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

export function tokenNew(Type: TokenType, Literal: string): Token {
  return {
    Type,
    Literal,
  };
}
