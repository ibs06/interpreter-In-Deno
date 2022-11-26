import { len } from "../util/help.ts";
import { Token, token, TokenType } from "../token/token.ts";

export interface Lexer {
  input: string;
  position: number;
  readPosition: number;
  ch: number; // 타입단언을 써야되나?
  readChar(): void;
  NextToken(): Token;
}

export function New(input: string): Lexer {
  const l = { input, position: 0, readPosition: 0, ch: 0, readChar, NextToken };
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
  switch (l.ch) {
    case "=".charCodeAt(0):
      tok = newToken(token.ASSIGN, l.ch);
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

    case "+".charCodeAt(0):
      tok = newToken(token.PLUS, l.ch);
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
      console.log("::: NextToken function l.ch is not found");
      tok = { Type: token.ILLEGAL, Literal: "ILLEGAL" };
  }
  l.readChar();
  return tok;
}

function newToken(tokenType: TokenType, ch: number): Token {
  return { Type: tokenType, Literal: String.fromCharCode(ch) };
}
