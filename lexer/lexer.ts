import { len } from "../deps.ts";
import { Token, token, TokenType, LookupIdent } from "../token/token.ts";

export interface Lexer {
  input: string;
  position: number;
  readPosition: number;
  ch: number; // 타입단언을 써야되나?
  readChar(): void;
  NextToken(): Token;
  readIdentifier(): string;
  skipWhitespace(): void;
  readNumber(): string;
  peekChar(): number;
}

export function New(input: string): Lexer {
  const l = {
    input,
    position: 0,
    readPosition: 0,
    ch: 0,
    readChar,
    NextToken,
    readIdentifier,
    skipWhitespace,
    readNumber,
    peekChar,
  };
  l.readChar();
  return l;
}

function readChar(this: Lexer): void {
  const l = this;
  if (l.readPosition >= len(l.input)) {
    // TODO: Golang 8bit byte에 대응되는 타입?
    // javascript charCodeAt() utf-16 -> fromCharCode()를 사용해서 서로 변환
    l.ch = 0;
  } else {
    l.ch = l.input[l.readPosition].charCodeAt(0);
  }

  // 읽는 포지션 갱신
  l.position = l.readPosition;
  l.readPosition += 1;
}

function NextToken(this: Lexer): Token {
  const l = this;
  var tok: Token;

  l.skipWhitespace();

  switch (l.ch) {
    case "=".charCodeAt(0):
      // ==이면
      if (l.peekChar() == "=".charCodeAt(0)) {
        const ch = l.ch;
        l.readChar();
        const Literal = String.fromCharCode(ch) + String.fromCharCode(l.ch);
        tok = { Type: token.EQ, Literal };
      } else {
        tok = newToken(token.ASSIGN, l.ch);
      }

      break;

    case "+".charCodeAt(0):
      tok = newToken(token.PLUS, l.ch);
      break;

    case "-".charCodeAt(0):
      tok = newToken(token.MINUS, l.ch);
      break;

    case "!".charCodeAt(0):
      // !- 이면
      if (l.peekChar() == "=".charCodeAt(0)) {
        const ch = l.ch;
        l.readChar();
        const Literal = String.fromCharCode(ch) + String.fromCharCode(l.ch);
        tok = { Type: token.NOT_EQ, Literal };
      } else {
        tok = newToken(token.BANG, l.ch);
      }
      break;

    case "/".charCodeAt(0):
      tok = newToken(token.SLASH, l.ch);
      break;

    case "*".charCodeAt(0):
      tok = newToken(token.ASTERISK, l.ch);
      break;

    case "<".charCodeAt(0):
      tok = newToken(token.LT, l.ch);
      break;

    case ">".charCodeAt(0):
      tok = newToken(token.GT, l.ch);
      break;

    case ";".charCodeAt(0):
      tok = newToken(token.SEMICOLON, l.ch);
      break;

    case "(".charCodeAt(0):
      tok = newToken(token.LPAREN, l.ch);
      break;

    case ")".charCodeAt(0):
      tok = newToken(token.RPAREN, l.ch);
      break;

    case ",".charCodeAt(0):
      tok = newToken(token.COMMA, l.ch);
      break;

    case "{".charCodeAt(0):
      tok = newToken(token.LBRACE, l.ch);
      break;

    case "}".charCodeAt(0):
      tok = newToken(token.RBRACE, l.ch);
      break;

    case 0:
      tok = { Type: token.EOF, Literal: "" };
      break;

    default:
      if (isLetter(l.ch)) {
        const Literal = l.readIdentifier();
        // isLetter isDigit만 return문이 있다. readChar를 내부적으로 돌리기 때문
        return (tok = { Type: LookupIdent(Literal), Literal });
      } else if (isDigit(l.ch)) {
        return (tok = { Type: token.INT, Literal: l.readNumber() });
      } else {
        console.log("::: NextToken function l.ch is not found");
        tok = { Type: token.ILLEGAL, Literal: "ILLEGAL" };
      }
  }
  l.readChar();
  return tok;
}

function readIdentifier(this: Lexer): string {
  const l = this;
  const position = l.position;
  while (isLetter(l.ch)) {
    l.readChar();
  }
  return l.input.slice(position, l.position);
}

function readNumber(this: Lexer): string {
  const l = this;
  const position = l.position;
  while (isDigit(l.ch)) {
    l.readChar();
  }

  return l.input.slice(position, l.position);
}

function skipWhitespace(this: Lexer): void {
  const l = this;
  while (
    l.ch == " ".charCodeAt(0) ||
    l.ch == "\t".charCodeAt(0) ||
    l.ch == "\n".charCodeAt(0) ||
    l.ch == "\r".charCodeAt(0)
  ) {
    l.readChar();
  }
}
function peekChar(this: Lexer): number {
  const l = this;

  if (l.readPosition >= len(l.input)) {
    return 0;
  } else {
    return l.input[l.readPosition].charCodeAt(0);
  }
}

function isLetter(ch: number): boolean {
  return (
    ("a".charCodeAt(0) <= ch && ch <= "z".charCodeAt(0)) ||
    ("A".charCodeAt(0) <= ch && ch <= "Z".charCodeAt(0)) ||
    ch == "_".charCodeAt(0)
  );
}

function isDigit(ch: number): boolean {
  return "0".charCodeAt(0) <= ch && ch <= "9".charCodeAt(0);
}

function newToken(tokenType: TokenType, ch: number): Token {
  return { Type: tokenType, Literal: String.fromCharCode(ch) };
}
