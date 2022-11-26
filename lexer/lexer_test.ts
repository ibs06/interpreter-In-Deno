import { Token, token, TokenType } from "../token/token.ts";
import { New } from "./lexer.ts";

import * as chai from "https://deno.land/std@0.161.0/testing/asserts.ts";

interface ExpectedToken {
  expectedType: TokenType;
  expectedLiteral: string;
}

Deno.test("TestNextToken", async () => {
  const input = `=+(){},;`;

  const tests: ExpectedToken[] = [
    { expectedType: token.ASSIGN, expectedLiteral: "=" },
    { expectedType: token.PLUS, expectedLiteral: "+" },
    { expectedType: token.LPAREN, expectedLiteral: "(" },
    { expectedType: token.RPAREN, expectedLiteral: ")" },
    { expectedType: token.LBRACE, expectedLiteral: "{" },
    { expectedType: token.RBRACE, expectedLiteral: "}" },
    { expectedType: token.COMMA, expectedLiteral: "," },
    { expectedType: token.SEMICOLON, expectedLiteral: ";" },
    { expectedType: token.EOF, expectedLiteral: "" },
  ];
  const l = New(input);

  for (const tt of tests) {
    var tok = l.NextToken();
    console.log({ l, nextTokenLit: String.fromCharCode(l.ch) });
    if (tok.Type != tt.expectedType) {
      chai.fail(
        `tests[${tt.expectedLiteral}] - 토큰타입 틀림. 예상타입=[${tt.expectedType}] 결과타입=[${tok.Type}]`
      );
    } else {
      console.log(
        `tests[${tt.expectedLiteral}] - 토큰타입 성공. 예상타입=[${tt.expectedType}] 결과타입=[${tok.Type}]`
      );
    }
  }
});
