import { chai } from "../deps.ts";

import * as lexer from "../lexer/lexer.ts";
import * as ast from "../ast/ast.ts";
import * as parser from "../parser/parser.ts";
import { len } from "../deps.ts";

interface ExpectedIdentifier {
  expectedIdentifier: string;
}

Deno.test("parser 식별자, 예약자 없는 버전", async () => {
  const input = `
  let x = 5;
  let y = 10;
  let foobar = 838383;
  `;

  // const input = `
  // let x  5;
  // let = 10;
  // let 838383;
  // `;
  // 에러로깅 확인용
  //   parser has 3 errors
  // parser error: expected next token to be =, got INT
  // parser error: expected next token to be IDENT, got =
  // parser error: expected next token to be IDENT, got INT

  const l = lexer.New(input);

  const p = parser.New(l);

  const program = p.ParseProgram();
  checkParserErrors(p);

  // nil 세팅이 안되서 배열값으로 체크
  if (len(program.Statements) == 0) {
    chai.fail(`ParseProgram nil`);
  }

  if (len(program.Statements) != 3) {
    chai.fail(
      `프로그램 명령문 3개 명령문이 아님 len(program.Statements):${len(
        program.Statements
      )}`
    );
  }

  const tests: ExpectedIdentifier[] = [
    { expectedIdentifier: "x" },
    { expectedIdentifier: "y" },
    { expectedIdentifier: "foobar" },
  ];

  for (const index in tests) {
    const tt = tests[index];
    const stmt = program.Statements[index];
    // Golang 유연한 타입전환 안되서 단언 추가
    if (
      stmt.type == "LetStatement" &&
      !testLetStatement(stmt, tt.expectedIdentifier)
    ) {
    }
  }
});

function testLetStatement(s: ast.LetStatement, name: string): boolean {
  const t = chai;
  if (s.TokenLiteral() != "let") {
    t.fail(`s.TokenLiteral not 'let'. got=${s.TokenLiteral()}`);
    return false;
  }

  // (s.type == "Statement") 대신 속성 확인("statementNode" in s)으로 변경
  const ok = "statementNode" in s;
  if (!ok) {
    t.fail(`s not *ast.LetStatement. got=${s.type}`);
    return false;
  }

  if (s.Name && s.Name.Value != name) {
    t.fail(`letStmt.Name.Value not ${name}. got=${s.Name.Value}`);
    return false;
  }

  if (s.Name && s.Name.TokenLiteral() != name) {
    t.fail(`s.Name not ${name}. got=${s.Name}`);
    return false;
  }

  return true;
}

function checkParserErrors(p: parser.Parser) {
  const t = chai;
  const errors = p.Errors();
  if (len(errors) == 0) {
    return;
  }
  console.error(`parser has ${len(errors)} errors`);
  for (const msg of errors) {
    console.error(`parser error: ${msg}`);
  }
  t.fail("checkParserErrors..");
}

Deno.test("parser 리턴문 테스트 ", async () => {
  const input = `
  return 5;
  return 10;
  return 993322;
  `;

  const l = lexer.New(input);

  const p = parser.New(l);

  const program = p.ParseProgram();
  checkParserErrors(p);

  if (len(program.Statements) != 3) {
    chai.fail(
      `프로그램 명령문 3개 명령문이 아님 len(program.Statements):${len(
        program.Statements
      )}`
    );
  }

  for (const index in program.Statements) {
    const t = chai;
    const stmt = program.Statements[index];

    const ok = stmt.type === "ReturnStatement";
    if (!ok) {
      t.fail(`stmt not *ast.ReturnStatement. got=${stmt}`);
    }

    if (stmt.TokenLiteral() != "return") {
      t.fail(
        `returnStmt.TokenLiteral not 'return', got=${stmt.TokenLiteral()}`
      );
    }
  }
});

Deno.test("parser 식별자파서 테스트 ", async () => {
  const input = `foobar;`;

  const l = lexer.New(input);

  const p = parser.New(l);

  const program = p.ParseProgram();
  checkParserErrors(p);

  if (len(program.Statements) != 1) {
    chai.fail(
      `프로그램 명령문 1개 명령문이 아님 len(program.Statements):${len(
        program.Statements
      )}`
    );
  }

  for (const index in program.Statements) {
    const t = chai;
    const stmt = program.Statements[index];

    const ok = stmt.type === "ExpressionStatement";
    if (!ok) {
      t.fail(`stmt not *ast.ExpressionStatement. got=${stmt}`);
    } else {
      // console.log(`stmt`, stmt);
      // stmt {
      //   type: "ExpressionStatement",
      //   Token: { Type: "IDENT", Literal: "foobar" },
      //   statementNode: [Function: statementNode],
      //   TokenLiteral: [Function: TokenLiteral],
      //   Expression: {
      //     type: "Identifier",
      //     Token: { Type: "IDENT", Literal: "foobar" },
      //     Value: "foobar",
      //     expressionNode: [Function: expressionNode],
      //     TokenLiteral: [Function: TokenLiteral]
      //   }
      // }
      if (!stmt.Expression) {
        t.fail(`exp not *ast.Identifier, got=${stmt.Expression}`);
      } else {
        if (stmt.Expression.type !== "Identifier") {
          t.fail(`exp not Identifier got=${stmt.Expression.type}`);
        } else {
          if (stmt.Expression.Value !== "foobar") {
            t.fail(`ident.Value error, got=${stmt.Expression.Value}`);
          }
          if (stmt.Expression.TokenLiteral() !== "foobar") {
            t.fail(
              `ident.TokenLiteral() error, got=${stmt.Expression.TokenLiteral()}`
            );
          }
        }
      }
    }
  }
});

Deno.test("parser 정수표현식 파서 테스트 ", async () => {
  const input = `5;`;

  const l = lexer.New(input);

  const p = parser.New(l);

  const program = p.ParseProgram();
  checkParserErrors(p);

  if (len(program.Statements) != 1) {
    chai.fail(
      `프로그램 명령문 1개 명령문이 아님 len(program.Statements):${len(
        program.Statements
      )}`
    );
  }

  for (const index in program.Statements) {
    const t = chai;
    const stmt = program.Statements[index];

    const ok = stmt.type === "ExpressionStatement";
    if (!ok) {
      t.fail(`stmt not *ast.ExpressionStatement. got=${stmt}`);
    } else {
      console.log(`stmt`, stmt);
      // stmt {
      //   type: "ExpressionStatement",
      //   Token: { Type: "INT", Literal: "5" },
      //   statementNode: [Function: statementNode],
      //   TokenLiteral: [Function: TokenLiteral],
      //   Expression: {
      //     type: "IntegerLiteral",
      //     Token: { Type: "INT", Literal: "5" },
      //     Value: 5,
      //     expressionNode: [Function: expressionNode],
      //     TokenLiteral: [Function: TokenLiteral]
      //   }
      // }
      if (!stmt.Expression) {
        t.fail(`exp not *ast.Identifier, got=${stmt.Expression}`);
      } else {
        if (stmt.Expression.type !== "IntegerLiteral") {
          t.fail(`exp not IntegerLiteral got=${stmt.Expression.type}`);
        } else {
          if (stmt.Expression.Value !== 5) {
            t.fail(`ident.Value error, got=${stmt.Expression.Value}`);
          }
          if (stmt.Expression.TokenLiteral() !== "5") {
            t.fail(
              `ident.TokenLiteral() error, got=${stmt.Expression.TokenLiteral()}`
            );
          }
        }
      }
    }
  }
});

Deno.test("parser 전위연산자 파서 테스트 ", async () => {
  const tests: {
    input: string;
    operator: string;
    integerValue: number;
  }[] = [
    { input: "!5", operator: "!", integerValue: 5 },
    { input: "-15", operator: "-", integerValue: 15 },
  ];

  for (const tt of tests) {
    const l = lexer.New(tt.input);

    const p = parser.New(l);

    const program = p.ParseProgram();
    checkParserErrors(p);

    if (len(program.Statements) != 1) {
      chai.fail(
        `프로그램 명령문 1개 명령문이 아님 len(program.Statements):${len(
          program.Statements
        )}`
      );
    }
    for (const index in program.Statements) {
      const t = chai;
      const stmt = program.Statements[index];

      const ok = stmt.type === "ExpressionStatement";
      if (!ok) {
        t.fail(`stmt not *ast.ExpressionStatement. got=${stmt}`);
      } else {
        // console.log(`stmt`, stmt);
        // stmt {
        //   type: "ExpressionStatement",
        //   Token: { Type: "!", Literal: "!" },
        //   statementNode: [Function: statementNode],
        //   TokenLiteral: [Function: TokenLiteral],
        //   Expression: {
        //     type: "PrefixExpression",
        //     Token: { Type: "!", Literal: "!" },
        //     Operator: "!",
        //     expressionNode: [Function: expressionNode],
        //     TokenLiteral: [Function: TokenLiteral],
        //     Right: {
        //       type: "IntegerLiteral",
        //       Token: { Type: "INT", Literal: "5" },
        //       Value: 5,
        //       expressionNode: [Function: expressionNode],
        //       TokenLiteral: [Function: TokenLiteral]
        //     }
        //   }
        // }
        // stmt {
        //   type: "ExpressionStatement",
        //   Token: { Type: "-", Literal: "-" },
        //   statementNode: [Function: statementNode],
        //   TokenLiteral: [Function: TokenLiteral],
        //   Expression: {
        //     type: "PrefixExpression",
        //     Token: { Type: "-", Literal: "-" },
        //     Operator: "-",
        //     expressionNode: [Function: expressionNode],
        //     TokenLiteral: [Function: TokenLiteral],
        //     Right: {
        //       type: "IntegerLiteral",
        //       Token: { Type: "INT", Literal: "15" },
        //       Value: 15,
        //       expressionNode: [Function: expressionNode],
        //       TokenLiteral: [Function: TokenLiteral]
        //     }
        //   }
        // }
        if (!stmt.Expression) {
          t.fail(`exp not *ast.PrefixExpression, got=${stmt.Expression}`);
        } else {
          if (stmt.Expression.type !== "PrefixExpression") {
            t.fail(`exp not PrefixExpression got=${stmt.Expression.type}`);
          } else {
            if (stmt.Expression.Operator !== tt.operator) {
              t.fail(
                `exp.Operater is not ${tt.operator}, got=${stmt.Expression.Operator}`
              );
            }
            if (
              stmt.Expression.Right &&
              !testIntegerLiteral(stmt.Expression.Right, tt.integerValue)
            ) {
              t.fail(`ident.testIntegerLiteral() error}`);
            }
          }
        }
      }
    }
  }
});

function testIntegerLiteral(s: ast.Expression, value: number): boolean {
  const t = chai;
  if (s.type !== "IntegerLiteral") {
    t.fail(`testIntegerLiteral not 'IntegerLiteral'. got=${s.type}`);
    return false;
  } else {
    if (s.Value !== value) {
      t.fail(`integ.value not ${value}. got=${s.Value}`);
      return false;
    }
  }

  return true;
}

Deno.test("parser 중위연산자 파서 테스트 ", async () => {
  const tests: {
    input: string;
    leftValue: number;
    operator: string;
    rightValue: number;
  }[] = [
    { input: "5 + 5", leftValue: 5, operator: "+", rightValue: 5 },
    { input: "5 - 5", leftValue: 5, operator: "-", rightValue: 5 },
    { input: "5 * 5", leftValue: 5, operator: "*", rightValue: 5 },
    { input: "5 / 5", leftValue: 5, operator: "/", rightValue: 5 },
    { input: "5 > 5", leftValue: 5, operator: ">", rightValue: 5 },
    { input: "5 < 5", leftValue: 5, operator: "<", rightValue: 5 },
    { input: "5 == 5", leftValue: 5, operator: "==", rightValue: 5 },
    { input: "5 != 5", leftValue: 5, operator: "!=", rightValue: 5 },
  ];

  for (const tt of tests) {
    const l = lexer.New(tt.input);

    const p = parser.New(l);

    const program = p.ParseProgram();
    checkParserErrors(p);

    if (len(program.Statements) != 1) {
      chai.fail(
        `프로그램 명령문 1개 명령문이 아님 len(program.Statements):${len(
          program.Statements
        )}`
      );
    }

    for (const index in program.Statements) {
      const t = chai;
      const stmt = program.Statements[index];

      const ok = stmt.type === "ExpressionStatement";
      if (!ok) {
        t.fail(`stmt not *ast.ExpressionStatement. got=${stmt}`);
      } else {
        if (!stmt.Expression) {
          t.fail(`exp not *ast.InfixExpression, got=${stmt.Expression}`);
        } else {
          if (stmt.Expression.type !== "InfixExpression") {
            t.fail(`exp not InfixExpression got=${stmt.Expression.type}`);
          } else {
            // console.log(`stmt`, stmt);
            if (
              stmt.Expression.Left &&
              !testIntegerLiteral(stmt.Expression.Left, tt.leftValue)
            ) {
              t.fail(`ident.testIntegerLiteral() left error}`);
            }
            if (stmt.Expression.Operator !== tt.operator) {
              t.fail(
                `exp.Operater is not ${tt.operator}, got=${stmt.Expression.Operator}`
              );
            }
            if (
              stmt.Expression.Right &&
              !testIntegerLiteral(stmt.Expression.Right, tt.rightValue)
            ) {
              t.fail(`ident.testIntegerLiteral() right error}`);
            }
          }
        }
      }
    }
  }
});

Deno.test("parser 불린중위연산자 파서 테스트 1", async () => {
  const tests: {
    input: string;
    leftValue: boolean;
    operator: string;
    rightValue: boolean;
  }[] = [
    {
      input: "true == true",
      leftValue: true,
      operator: "==",
      rightValue: true,
    },
    {
      input: "true != false",
      leftValue: true,
      operator: "!=",
      rightValue: false,
    },
    {
      input: "false == false",
      leftValue: false,
      operator: "==",
      rightValue: false,
    },
  ];
  // leftValue: false가 입력되면 토큰매칭에 의해
  // p.registerPrefix(token.token.TRUE, parseBoolean); 실행 후 type: "Boolean" 리턴됨

  for (const tt of tests) {
    const l = lexer.New(tt.input);

    const p = parser.New(l);

    const program = p.ParseProgram();
    checkParserErrors(p);

    if (len(program.Statements) != 1) {
      chai.fail(
        `프로그램 명령문 1개 명령문이 아님 len(program.Statements):${len(
          program.Statements
        )}`
      );
    }

    for (const index in program.Statements) {
      const t = chai;
      const stmt = program.Statements[index];

      const ok = stmt.type === "ExpressionStatement";
      if (!ok) {
        t.fail(`stmt not *ast.ExpressionStatement. got=${stmt}`);
      } else {
        if (!stmt.Expression) {
          t.fail(`exp not *ast.InfixExpression, got=${stmt.Expression}`);
        } else {
          if (stmt.Expression.type !== "InfixExpression") {
            t.fail(`exp not InfixExpression got=${stmt.Expression.type}`);
          } else {
            // console.log(`stmt`, stmt);
            // stmt {
            //   type: "ExpressionStatement",
            //   Token: { Type: "FALSE", Literal: "false" },
            //   statementNode: [Function: statementNode],
            //   TokenLiteral: [Function: TokenLiteral],
            //   Expression: {
            //     type: "InfixExpression",
            //     Token: { Type: "==", Literal: "==" },
            //     Operator: "==",
            //     Left: {
            //       type: "Boolean",
            //       Token: { Type: "FALSE", Literal: "false" },
            //       Value: false,
            //       expressionNode: [Function: expressionNode],
            //       TokenLiteral: [Function: TokenLiteral]
            //     },
            //     expressionNode: [Function: expressionNode],
            //     TokenLiteral: [Function: TokenLiteral],
            //     Right: {
            //       type: "Boolean",
            //       Token: { Type: "FALSE", Literal: "false" },
            //       Value: false,
            //       expressionNode: [Function: expressionNode],
            //       TokenLiteral: [Function: TokenLiteral]
            //     }
            //   }
            if (
              stmt.Expression.Left &&
              !testBooleanLiteral(stmt.Expression.Left, tt.leftValue)
            ) {
              t.fail(`ident.testIntegerLiteral() left error}`);
            }
            if (stmt.Expression.Operator !== tt.operator) {
              t.fail(
                `exp.Operater is not ${tt.operator}, got=${stmt.Expression.Operator}`
              );
            }
            if (
              stmt.Expression.Right &&
              !testBooleanLiteral(stmt.Expression.Right, tt.rightValue)
            ) {
              t.fail(`ident.testIntegerLiteral() right error}`);
            }
          }
        }
      }
    }
  }
});

function testBooleanLiteral(s: ast.Expression, value: boolean): boolean {
  const t = chai;
  if (s.type !== "Boolean") {
    t.fail(`testBooleanLiteral not 'Boolean'. got=${s.type}`);
    return false;
  } else {
    if (s.Value !== value) {
      t.fail(`boolean.value not ${value}. got=${s.Value}`);
      return false;
    }
  }

  return true;
}

Deno.test("parser 불린전위연산자 파서 테스트 ", async () => {
  const tests: {
    input: string;
    operator: string;
    value: boolean;
  }[] = [
    { input: "!true", operator: "!", value: true },
    { input: "!false", operator: "!", value: false },
  ];

  for (const tt of tests) {
    const l = lexer.New(tt.input);

    const p = parser.New(l);

    const program = p.ParseProgram();
    checkParserErrors(p);

    if (len(program.Statements) != 1) {
      chai.fail(
        `프로그램 명령문 1개 명령문이 아님 len(program.Statements):${len(
          program.Statements
        )}`
      );
    }
    for (const index in program.Statements) {
      const t = chai;
      const stmt = program.Statements[index];

      const ok = stmt.type === "ExpressionStatement";
      if (!ok) {
        t.fail(`stmt not *ast.ExpressionStatement. got=${stmt}`);
      } else {
        if (!stmt.Expression) {
          t.fail(`exp not *ast.PrefixExpression, got=${stmt.Expression}`);
        } else {
          if (stmt.Expression.type !== "PrefixExpression") {
            t.fail(`exp not PrefixExpression got=${stmt.Expression.type}`);
          } else {
            // console.log(`stmt`, stmt);
            // stmt {
            //   type: "ExpressionStatement",
            //   Token: { Type: "!", Literal: "!" },
            //   statementNode: [Function: statementNode],
            //   TokenLiteral: [Function: TokenLiteral],
            //   Expression: {
            //     type: "PrefixExpression",
            //     Token: { Type: "!", Literal: "!" },
            //     Operator: "!",
            //     expressionNode: [Function: expressionNode],
            //     TokenLiteral: [Function: TokenLiteral],
            //     Right: {
            //       type: "Boolean",
            //       Token: { Type: "FALSE", Literal: "false" },
            //       Value: false,
            //       expressionNode: [Function: expressionNode],
            //       TokenLiteral: [Function: TokenLiteral]
            //     }
            //   }
            // }
            if (stmt.Expression.Operator !== tt.operator) {
              t.fail(
                `exp.Operater is not ${tt.operator}, got=${stmt.Expression.Operator}`
              );
            }
            if (
              stmt.Expression.Right &&
              !testBooleanLiteral(stmt.Expression.Right, tt.value)
            ) {
              t.fail(`ident.testIntegerLiteral() error}`);
            }
          }
        }
      }
    }
  }
});

Deno.test("parser 그룹표현식 파서 테스트 ", async () => {
  const tests: {
    input: string;
    expected: string;
  }[] = [
    {
      input: "1 + (2 + 3) + 4",
      expected: "((1 + (2 + 3)) + 4)",
    },
    {
      input: "(5 + 5) * 2",
      expected: "((5 + 5) * 2)",
    },
    {
      input: "2 / (5 + 5)",
      expected: "(2 / (5 + 5))",
    },
    {
      input: "(5 + 5) * 2 * (5 + 5)",
      expected: "(((5 + 5) * 2) * (5 + 5))",
    },
    {
      input: "-(5 + 5)",
      expected: "(-(5 + 5))",
    },
    {
      input: "!(true == true)",
      expected: "(!(true == true))",
    },
  ];

  for (const tt of tests) {
    const l = lexer.New(tt.input);

    const p = parser.New(l);

    const program = p.ParseProgram();
    checkParserErrors(p);

    if (len(program.Statements) != 1) {
      chai.fail(
        `프로그램 명령문 1개 명령문이 아님 len(program.Statements):${len(
          program.Statements
        )}`
      );
    }
    for (const index in program.Statements) {
      const t = chai;
      const stmt = program.Statements[index];

      const ok = stmt.type === "ExpressionStatement";
      if (!ok) {
        t.fail(`stmt not *ast.ExpressionStatement. got=${stmt}`);
      } else {
        if (!stmt.Expression) {
          t.fail(`exp not *ast.PrefixExpression, got=${stmt.Expression}`);
        } else {
          if (
            stmt.Expression.type !== "InfixExpression" &&
            stmt.Expression.type !== "PrefixExpression"
          ) {
            t.fail(`exp not PrefixExpression got=${stmt.Expression.type}`);
          } else {
            // console.log(`stmt`, stmt);
            // stmt {
            //   type: "ExpressionStatement",
            //   Token: { Type: "-", Literal: "-" },
            //   statementNode: [Function: statementNode],
            //   TokenLiteral: [Function: TokenLiteral],
            //   Expression: {
            //     type: "PrefixExpression",
            //     Token: { Type: "-", Literal: "-" },
            //     Operator: "-",
            //     expressionNode: [Function: expressionNode],
            //     TokenLiteral: [Function: TokenLiteral],
            //     Right: {
            //       type: "InfixExpression",
            //       Token: { Type: "+", Literal: "+" },
            //       Operator: "+",
            //       Left: {
            //         type: "IntegerLiteral",
            //         Token: [Object],
            //         Value: 5,
            //         expressionNode: [Function: expressionNode],
            //         TokenLiteral: [Function: TokenLiteral]
            //       },
            //       expressionNode: [Function: expressionNode],
            //       TokenLiteral: [Function: TokenLiteral],
            //       Right: {
            //         type: "IntegerLiteral",
            //         Token: [Object],
            //         Value: 5,
            //         expressionNode: [Function: expressionNode],
            //         TokenLiteral: [Function: TokenLiteral]
            //       }
            //     }
            //   }
            // }
            // stmt {
            //   type: "ExpressionStatement",
            //   Token: { Type: "!", Literal: "!" },
            //   statementNode: [Function: statementNode],
            //   TokenLiteral: [Function: TokenLiteral],
            //   Expression: {
            //     type: "PrefixExpression",
            //     Token: { Type: "!", Literal: "!" },
            //     Operator: "!",
            //     expressionNode: [Function: expressionNode],
            //     TokenLiteral: [Function: TokenLiteral],
            //     Right: {
            //       type: "InfixExpression",
            //       Token: { Type: "==", Literal: "==" },
            //       Operator: "==",
            //       Left: {
            //         type: "Boolean",
            //         Token: [Object],
            //         Value: true,
            //         expressionNode: [Function: expressionNode],
            //         TokenLiteral: [Function: TokenLiteral]
            //       },
            //       expressionNode: [Function: expressionNode],
            //       TokenLiteral: [Function: TokenLiteral],
            //       Right: {
            //         type: "Boolean",
            //         Token: [Object],
            //         Value: true,
            //         expressionNode: [Function: expressionNode],
            //         TokenLiteral: [Function: TokenLiteral]
            //       }
            //     }
            //   }
            // }
          }
        }
      }
    }
  }
});
