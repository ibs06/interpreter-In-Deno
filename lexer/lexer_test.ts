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
  
  let result = add(five, ten);
  !-/*5;
  5 < 10 > 5;
  
  if (5 < 10) {
    return true;
  } else {
    return false;
  }
  
  10 == 10;
  10 != 9;`;

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
    { expectedType: token.BANG, expectedLiteral: "!" },
    { expectedType: token.MINUS, expectedLiteral: "-" },
    { expectedType: token.SLASH, expectedLiteral: "/" },
    { expectedType: token.ASTERISK, expectedLiteral: "*" },
    { expectedType: token.INT, expectedLiteral: "5" },
    { expectedType: token.SEMICOLON, expectedLiteral: ";" },
    { expectedType: token.INT, expectedLiteral: "5" },
    { expectedType: token.LT, expectedLiteral: "<" },
    { expectedType: token.INT, expectedLiteral: "10" },
    { expectedType: token.GT, expectedLiteral: ">" },
    { expectedType: token.INT, expectedLiteral: "5" },
    { expectedType: token.SEMICOLON, expectedLiteral: ";" },
    { expectedType: token.IF, expectedLiteral: "if" },
    { expectedType: token.LPAREN, expectedLiteral: "(" },
    { expectedType: token.INT, expectedLiteral: "5" },
    { expectedType: token.LT, expectedLiteral: "<" },
    { expectedType: token.INT, expectedLiteral: "10" },
    { expectedType: token.RPAREN, expectedLiteral: ")" },
    { expectedType: token.LBRACE, expectedLiteral: "{" },
    { expectedType: token.RETURN, expectedLiteral: "return" },
    { expectedType: token.TRUE, expectedLiteral: "true" },
    { expectedType: token.SEMICOLON, expectedLiteral: ";" },
    { expectedType: token.RBRACE, expectedLiteral: "}" },
    { expectedType: token.ELSE, expectedLiteral: "else" },
    { expectedType: token.LBRACE, expectedLiteral: "{" },
    { expectedType: token.RETURN, expectedLiteral: "return" },
    { expectedType: token.FALSE, expectedLiteral: "false" },
    { expectedType: token.SEMICOLON, expectedLiteral: ";" },
    { expectedType: token.RBRACE, expectedLiteral: "}" },
    { expectedType: token.INT, expectedLiteral: "10" },
    { expectedType: token.EQ, expectedLiteral: "==" },
    { expectedType: token.INT, expectedLiteral: "10" },
    { expectedType: token.SEMICOLON, expectedLiteral: ";" },
    { expectedType: token.INT, expectedLiteral: "10" },
    { expectedType: token.NOT_EQ, expectedLiteral: "!=" },
    { expectedType: token.INT, expectedLiteral: "9" },
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
