import { len } from "../deps.ts";
import * as token from "../token/token.ts";
import { Lexer } from "../lexer/lexer.ts";
import * as ast from "../ast/ast.ts";

export interface Parser {
  l: Lexer;

  errors: string[];
  curToken: token.Token;
  peekToken: token.Token;
  nextToken(): void;
  ParseProgram(): ast.Program;
  parseStatement(): ast.Statement | null;
  parseLetStatement(): ast.LetStatement | null;
  curTokenIs(t: token.TokenType): boolean;
  peekTokenIs(t: token.TokenType): boolean;
  expectPeek(t: token.TokenType): boolean;
  Errors(): string[];
  peekError(t: token.TokenType): void;
}

export function New(l: Lexer): Parser {
  const p = {
    l,
    errors: [],
    curToken: token.tokenNew(token.token.NIL, "NIL"),
    peekToken: token.tokenNew(token.token.NIL, "NIL"),
    nextToken,
    ParseProgram,
    parseStatement,
    parseLetStatement,
    curTokenIs,
    peekTokenIs,
    expectPeek,
    Errors,
    peekError,
  };

  /*
  두번 호출 이유
  처음 상태     | nil  / nil 
  1.nextToken() | nil; / 0
  2.nextToken() | 0;   / 1
*/
  p.nextToken();
  p.nextToken();

  return p;
}

export function ParseProgram(this: Parser): ast.Program {
  const p = this;
  const program = ast.ProgramNew();

  while (p.curToken.Type != token.token.EOF) {
    const stmt = p.parseStatement();
    if (stmt != null) {
      program.Statements.push(stmt);
    }
    p.nextToken();
  }

  return program;
}

function nextToken(this: Parser): void {
  const p = this;
  p.curToken = p.peekToken;
  p.peekToken = p.l.NextToken();
}

function parseStatement(this: Parser): ast.Statement | null {
  const p = this;
  switch (p.curToken?.Type) {
    case token.token.LET:
      return p.parseLetStatement();
    default:
      return null;
  }
}

function parseLetStatement(this: Parser): ast.LetStatement | null {
  const p = this;
  const stmt = ast.LetStatementNew(p.curToken);

  if (!p.expectPeek(token.token.IDENT)) {
    return null;
  }

  // Go 처럼 유연하게 안된다.. ;;
  const identifier = ast.IdentifierNew(p.curToken);
  identifier.Value = p.curToken.Literal;

  stmt.Name = identifier;

  if (!p.expectPeek(token.token.ASSIGN)) {
    return null;
  }

  while (!p.curTokenIs(token.token.SEMICOLON)) {
    p.nextToken();
  }

  return stmt;
}

function curTokenIs(this: Parser, t: token.TokenType): boolean {
  const p = this;
  return p.curToken.Type == t;
}
function peekTokenIs(this: Parser, t: token.TokenType): boolean {
  const p = this;
  return p.peekToken.Type == t;
}
function expectPeek(this: Parser, t: token.TokenType): boolean {
  const p = this;

  if (p.peekTokenIs(t)) {
    // 토큰 예측 후 맞으면 다음 토큰 불러옴!
    p.nextToken();
    return true;
  } else {
    // 토큰 예측 오류시 에러 로깅 추가
    p.peekError(t);
    return false;
  }
}

function Errors(this: Parser): string[] {
  const p = this;
  return p.errors;
}

function peekError(this: Parser, t: token.TokenType) {
  const p = this;
  const msg = `expected next token to be ${t}, got ${p.peekToken.Type}`;
  p.errors.push(msg);
}
