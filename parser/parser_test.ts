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

  const l = lexer.New(input);

  const p = parser.New(l);

  const program = p.ParseProgram();

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
    if (!testLetStatement(stmt, tt.expectedIdentifier)) {
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
