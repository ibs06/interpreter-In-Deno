// typescript 유니온타입(이거나 타입) 개념으로 해결
// 최상위 추상구문트리 노드 타입
type Node = NodeImpl | Statement | Expression;

interface NodeObj {
  //type: "NodeObj"시 오류발생하여 두단계로 나눔
  TokenLiteral(): string;
}

interface NodeImpl extends NodeObj {
  type: "NodeImpl";
  TokenLiteral(): string;
}

interface Statement extends NodeObj {
  type: "Statement";
  statementNode(): string;
}

interface Expression extends NodeObj {
  type: "Expression";
  expressionNode(): string;
}

export interface Program extends NodeImpl {
  Statements: Statement[];
}

// Go 인터페이스 구조체 생성직접 사용하는 코드 대신 사용
// golang : program := &ast.Program{} ->
// Deno : const program = ast.ProgramNew();
export function ProgramNew(): Program {
  return {
    type: "NodeImpl",
    Statements: [],
    TokenLiteral,
  };
}

function TokenLiteral(this: Program): string {
  const p = this;
  if (p.Statements.length > 0) {
    return p.Statements[0].TokenLiteral();
  } else {
    return "";
  }
}
