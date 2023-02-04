import { len } from "../deps.ts";
import * as token from "../token/token.ts";
import { Lexer } from "../lexer/lexer.ts";
import * as ast from "../ast/ast.ts";

export enum Precedences {
  LOWEST = 1,
  EQUALS,
  LESSGREATER,
  SUM,
  PRODUCT,
  PREFIX,
  CALL,
}

const precedenceOfToken = new Map<token.TokenType, Precedences>([
  [token.token.EQ, Precedences.EQUALS],
  [token.token.NOT_EQ, Precedences.EQUALS],
  [token.token.LT, Precedences.LESSGREATER],
  [token.token.GT, Precedences.LESSGREATER],
  [token.token.PLUS, Precedences.SUM],
  [token.token.MINUS, Precedences.SUM],
  [token.token.SLASH, Precedences.PRODUCT],
  [token.token.ASTERISK, Precedences.PRODUCT],
]);

type prefixParseFn = (p: Parser) => ast.Expression;
type infixParseFn = (p: Parser, left: ast.Expression) => ast.Expression;

export interface Parser {
  l: Lexer;

  errors: string[];
  curToken: token.Token;
  peekToken: token.Token;

  prefixParseFns: Map<token.TokenType, prefixParseFn>;
  infixParseFns: Map<token.TokenType, infixParseFn>;

  nextToken(): void;

  ParseProgram(): ast.Program;
  parseStatement(): ast.Statement | null;

  parseLetStatement(): ast.LetStatement | null;
  parseReturnStatement(): ast.ReturnStatement;
  parseExpressionStatement(): ast.ExpressionStatement;
  parseExpression(precedence: Precedences): ast.Expression | undefined;
  parseBlockStatement(): ast.BlockStatement;

  /**registerPrefix, registerInfix 등록함수는 추가하지 말 것! */

  curTokenIs(t: token.TokenType): boolean;
  peekTokenIs(t: token.TokenType): boolean;
  expectPeek(t: token.TokenType): boolean;
  Errors(): string[];
  peekError(t: token.TokenType): void;
  noPrefixParseFnError(t: token.TokenType): void;
  peekPrecedence(): Precedences;
  curPrecedence(): Precedences;

  registerPrefix(tokenType: token.TokenType, fn: prefixParseFn): void;
  registerInfix(tokenType: token.TokenType, fn: infixParseFn): void;
}

export function New(l: Lexer): Parser {
  const p = {
    l,

    errors: [],
    curToken: token.tokenNew(token.token.NIL, "NIL"),
    peekToken: token.tokenNew(token.token.NIL, "NIL"),

    prefixParseFns: new Map<token.TokenType, prefixParseFn>(),
    infixParseFns: new Map<token.TokenType, infixParseFn>(),

    nextToken,

    ParseProgram,
    parseStatement,

    parseLetStatement,
    parseReturnStatement,
    parseExpressionStatement,
    parseExpression,
    parseBlockStatement,

    curTokenIs,
    peekTokenIs,
    expectPeek,
    Errors,
    peekError,
    noPrefixParseFnError,
    peekPrecedence,
    curPrecedence,

    registerPrefix,
    registerInfix,
  };

  p.registerPrefix(token.token.IDENT, parseIdentifier);
  p.registerPrefix(token.token.INT, parseIntegerLiteral);
  p.registerPrefix(token.token.BANG, parsePrefixExpression);
  p.registerPrefix(token.token.MINUS, parsePrefixExpression);
  p.registerPrefix(token.token.TRUE, parseBoolean);
  p.registerPrefix(token.token.FALSE, parseBoolean);
  p.registerPrefix(token.token.LPAREN, parseGroupExpression);
  p.registerPrefix(token.token.IF, parseIfExpression);

  p.registerInfix(token.token.PLUS, parseInfixExpression);
  p.registerInfix(token.token.MINUS, parseInfixExpression);
  p.registerInfix(token.token.SLASH, parseInfixExpression);
  p.registerInfix(token.token.ASTERISK, parseInfixExpression);
  p.registerInfix(token.token.EQ, parseInfixExpression);
  p.registerInfix(token.token.NOT_EQ, parseInfixExpression);
  p.registerInfix(token.token.LT, parseInfixExpression);
  p.registerInfix(token.token.GT, parseInfixExpression);

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
    case token.token.RETURN:
      return p.parseReturnStatement();
    default:
      return p.parseExpressionStatement();
  }
}

function parseLetStatement(this: Parser): ast.LetStatement | null {
  const p = this;
  const stmt = ast.LetStatementNew(p.curToken);

  if (!p.expectPeek(token.token.IDENT)) {
    return null;
  }

  const identifier = ast.IdentifierNew(p.curToken, p.curToken.Literal);

  stmt.Name = identifier;

  if (!p.expectPeek(token.token.ASSIGN)) {
    return null;
  }

  while (!p.curTokenIs(token.token.SEMICOLON)) {
    p.nextToken();
  }

  return stmt;
}

function parseReturnStatement(this: Parser) {
  const p = this;
  const stmt = ast.ReturnStatementNew(p.curToken);
  p.nextToken();
  // TODO: 세미콜론을 만날 때까지 표현식을 건너띈다.
  while (!p.curTokenIs(token.token.SEMICOLON)) {
    p.nextToken();
  }
  return stmt;
}

function parseExpressionStatement(this: Parser): ast.ExpressionStatement {
  const p = this;
  const stmt = ast.ExpressionStatementNew(p.curToken);
  stmt.Expression = p.parseExpression(Precedences.LOWEST);

  if (p.peekTokenIs(token.token.SEMICOLON)) {
    p.nextToken();
  }

  return stmt;
}

function parseExpression(
  this: Parser,
  precedence: Precedences
): ast.Expression | undefined {
  const p = this;
  if (!p.prefixParseFns.has(p.curToken.Type)) {
    p.noPrefixParseFnError(p.curToken.Type);
    return undefined;
  } else {
    const prefix: prefixParseFn = p.prefixParseFns.get(p.curToken.Type)!;

    // prefix, infix호출시 Golang 리시버에 해당하는 *Parser p파라미터로 전달하기!
    let leftExp = prefix(p);
    while (
      !p.peekTokenIs(token.token.SEMICOLON) &&
      precedence < p.peekPrecedence()
    ) {
      if (!p.infixParseFns.has(p.peekToken.Type)) {
        return leftExp;
      } else {
        const infix: infixParseFn = p.infixParseFns.get(p.peekToken.Type)!;

        p.nextToken();

        leftExp = infix(p, leftExp);
      }
    }
    return leftExp;
  }
}

function parseBlockStatement(this: Parser): ast.BlockStatement {
  const p = this;

  const block = ast.BlockStatementNew(p.curToken, []);

  p.nextToken();

  while (
    !p.curTokenIs(token.token.RBRACE) &&
    p.curToken.Type != token.token.EOF
  ) {
    const stmt = p.parseStatement();
    if (stmt != null) {
      block.Statements.push(stmt);
    }
    p.nextToken();
  }

  return block;
}

// function parseIdentifier(this: Parser): ast.Expression {
//   const p = this;
//
//  오류 발생 맵에 함수를 넣었다가 복구 시키면 p가 살아나지 않음. Golang에서는 리시버로 인해서 가능한듯?  그냥 파라미터로 던져주자!!
//  Cannot read properties of undefined (reading 'p.curToken')
//
//   return ast.IdentifierNew(p.curToken, p.curToken.Literal);
// }
/** p: Parser 면 맵등록 대상, this:Parser면 인터페이스 등록대상 */
function parseIdentifier(p: Parser): ast.Expression {
  return ast.IdentifierNew(p.curToken, p.curToken.Literal);
}

function parseIntegerLiteral(p: Parser): ast.Expression {
  const value = parseInt(p.curToken.Literal);
  if (isNaN(value)) {
    const msg = `could not parse ${value} to integer`;
    p.errors.push(msg);
  }
  return ast.IntegerLiteralNew(p.curToken, value);
}

function parsePrefixExpression(p: Parser): ast.Expression {
  const expression = ast.PrefixExpressionNew(p.curToken, p.curToken.Literal);

  p.nextToken();
  expression.Right = p.parseExpression(Precedences.PREFIX);

  return expression;
}

function parseInfixExpression(p: Parser, left: ast.Expression): ast.Expression {
  const expression = ast.InfixExpressionNew(
    p.curToken,
    p.curToken.Literal,
    left
  );

  const precedence = p.curPrecedence();
  p.nextToken();
  expression.Right = p.parseExpression(precedence);

  return expression;
}

function parseBoolean(p: Parser): ast.Expression {
  return ast.BooleanNew(p.curToken, p.curTokenIs(token.token.TRUE));
}

function parseGroupExpression(p: Parser): ast.Expression {
  p.nextToken();
  const exp = p.parseExpression(Precedences.LOWEST)!;

  if (!p.expectPeek(token.token.RPAREN)) {
    const msg = `could not parse ${p.curToken} to parseGroupExpression`;
    p.errors.push(msg);
  }
  return exp;
}

function parseIfExpression(p: Parser): ast.Expression {
  const expression = ast.IfExpressionNew(p.curToken)!;

  if (!p.expectPeek(token.token.LPAREN)) {
    const msg = `could not parse ${p.curToken} to parseIfExpression`;
    p.errors.push(msg);
  }

  p.nextToken();

  expression.Condition = p.parseExpression(Precedences.LOWEST);

  if (!p.expectPeek(token.token.RPAREN)) {
    const msg = `could not parse ${p.curToken} to parseIfExpression`;
    p.errors.push(msg);
  }

  if (!p.expectPeek(token.token.LBRACE)) {
    const msg = `could not parse ${p.curToken} to parseIfExpression`;
    p.errors.push(msg);
  }

  expression.Consequence = p.parseBlockStatement();

  return expression;
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

function noPrefixParseFnError(this: Parser, t: token.TokenType) {
  const p = this;
  const msg = `no prefix parse function for ${t}`;
  p.errors.push(msg);
}

function peekPrecedence(this: Parser): Precedences {
  const p = this;
  return precedenceOfToken.has(p.peekToken.Type)
    ? (precedenceOfToken.get(p.peekToken.Type) as Precedences)
    : Precedences.LOWEST;
}

function curPrecedence(this: Parser): Precedences {
  const p = this;
  return precedenceOfToken.has(p.curToken.Type)
    ? (precedenceOfToken.get(p.curToken.Type) as Precedences)
    : Precedences.LOWEST;
}

function registerPrefix(
  this: Parser,
  tokenType: token.TokenType,
  fn: prefixParseFn
) {
  const p = this;
  p.prefixParseFns.set(tokenType, fn);
}
function registerInfix(
  this: Parser,
  tokenType: token.TokenType,
  fn: infixParseFn
) {
  const p = this;
  p.infixParseFns.set(tokenType, fn);
}
