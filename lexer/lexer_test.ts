import { Token, token, TokenType } from "../token/token.ts";
import { New } from "./lexer.ts";

import { chai } from "../deps.ts";

interface ExpectedToken {
  expectedType: TokenType;
  expectedLiteral: string;
}

Deno.test("TestNextToken 식별자, 예약자 없는 버전", async () => {
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
    // console.log({ l, nextTokenLit: String.fromCharCode(l.ch) });
    if (tok.Type != tt.expectedType) {
      chai.fail(
        `tests[${tt.expectedLiteral}] - 토큰타입 틀림. 예상타입=[${tt.expectedType}] 결과타입=[${tok.Type}]`
      );
    } else {
      // console.log(
      //   `tests[${tt.expectedLiteral}] - 토큰타입 성공. 예상타입=[${tt.expectedType}] 결과타입=[${tok.Type}]`
      // );
    }
  }
});

Deno.test("TestNextToken 식별자 예약어 있는 버전", async () => {
  const input = `let five = 5;
  let ten = 10;
  
  let add = fn(x, y) {
    x + y;
  };
  
  let result = add(five, ten);`;

  const tests: ExpectedToken[] = [
    { expectedType: token.LET, expectedLiteral: "let" },
    { expectedType: token.IDENT, expectedLiteral: "five" },
    { expectedType: token.ASSIGN, expectedLiteral: "=" },
    { expectedType: token.INT, expectedLiteral: "5" },
    { expectedType: token.SEMICOLON, expectedLiteral: ";" },
    { expectedType: token.LET, expectedLiteral: "let" },
    { expectedType: token.IDENT, expectedLiteral: "ten" },
    { expectedType: token.ASSIGN, expectedLiteral: "=" },
    { expectedType: token.INT, expectedLiteral: "10" },
    { expectedType: token.SEMICOLON, expectedLiteral: ";" },
    { expectedType: token.LET, expectedLiteral: "let" },
    { expectedType: token.IDENT, expectedLiteral: "add" },
    { expectedType: token.ASSIGN, expectedLiteral: "=" },
    { expectedType: token.FUNCTION, expectedLiteral: "fn" },
    { expectedType: token.LPAREN, expectedLiteral: "(" },
    { expectedType: token.IDENT, expectedLiteral: "x" },
    { expectedType: token.COMMA, expectedLiteral: "," },
    { expectedType: token.IDENT, expectedLiteral: "y" },
    { expectedType: token.RPAREN, expectedLiteral: ")" },
    { expectedType: token.LBRACE, expectedLiteral: "{" },
    { expectedType: token.IDENT, expectedLiteral: "x" },
    { expectedType: token.PLUS, expectedLiteral: "+" },
    { expectedType: token.IDENT, expectedLiteral: "y" },
    { expectedType: token.SEMICOLON, expectedLiteral: ";" },
    { expectedType: token.RBRACE, expectedLiteral: "}" },
    { expectedType: token.SEMICOLON, expectedLiteral: ";" },
    { expectedType: token.LET, expectedLiteral: "let" },
    { expectedType: token.IDENT, expectedLiteral: "result" },
    { expectedType: token.ASSIGN, expectedLiteral: "=" },
    { expectedType: token.IDENT, expectedLiteral: "add" },
    { expectedType: token.LPAREN, expectedLiteral: "(" },
    { expectedType: token.IDENT, expectedLiteral: "five" },
    { expectedType: token.COMMA, expectedLiteral: "," },
    { expectedType: token.IDENT, expectedLiteral: "ten" },
    { expectedType: token.RPAREN, expectedLiteral: ")" },
    { expectedType: token.SEMICOLON, expectedLiteral: ";" },
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
