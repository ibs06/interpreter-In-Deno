import { Token } from "../token/token.ts";
import { len } from "../deps.ts";

// typescript 유니온타입(이거나 타입) 개념으로 해결
// 최상위 추상구문트리 노드 타입
export type Node = NodeImpl | Statement | Expression;

export interface NodeObj {
  //type: "NodeObj"시 오류발생하여 두단계로 나눔
  TokenLiteral(): string;
}

export interface NodeImpl extends NodeObj {
  type: "NodeImpl";
}

export type Statement = LetStatement;
export type Expression = Identifier;

// 메소드만 공통으로 가지고 있는 값
// Statement, Expression 두개의 구분은 statementNode, expressionNode 속성 보유여부로 구분하고 type으로 직접 개별 타입을 식별함.
export interface StatementObj extends NodeObj {
  statementNode(): void;
}

export interface ExpressionObj extends NodeObj {
  expressionNode(): void;
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
  if (len(p.Statements) > 0) {
    return p.Statements[0].TokenLiteral();
  } else {
    return "";
  }
}

export interface LetStatement extends StatementObj {
  type: "LetStatement";
  Token: Token;
  // token외에는 aa.Name(x); a.Value(x); 이런 식의 코드 진행이 가능하도록 선택변수로 처리
  Name?: Identifier;
  Value?: Expression;
}

export function LetStatementNew(token: Token): LetStatement {
  return {
    type: "LetStatement",
    Token: token,
    statementNode: ls_statementNode,
    TokenLiteral: ls_TokenLiteral,
  };
}

// 함수명 충돌발생
function ls_statementNode(this: LetStatement): void {}

function ls_TokenLiteral(this: LetStatement): string {
  const ls = this;
  return ls.Token.Literal;
}

export interface Identifier extends ExpressionObj {
  type: "Identifier";
  Token: Token;
  Value?: string;
}

export function IdentifierNew(token: Token): Identifier {
  return {
    type: "Identifier",
    Token: token,
    expressionNode: i_expressionNode,
    TokenLiteral: i_TokenLiteral,
  };
}

function i_expressionNode(this: Identifier): void {}
function i_TokenLiteral(this: Identifier): string {
  const i = this;
  return i.Token.Literal;
}
