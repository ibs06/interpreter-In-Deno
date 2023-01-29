import { Token } from "../token/token.ts";
import { len } from "../deps.ts";

// typescript 유니온타입(이거나 타입) 개념으로 해결
// 최상위 추상구문트리 노드 타입
export type Node = Program | Statement | Expression;

export interface NodeObj {
  TokenLiteral(): string;
}

export type Statement = LetStatement | ReturnStatement | ExpressionStatement;
export type Expression = Identifier | IntegerLiteral | PrefixExpression | InfixExpression;

// 메소드만 공통으로 가지고 있는 값
// Statement, Expression 두개의 구분은 statementNode, expressionNode 속성 보유여부로 구분하고 type으로 직접 개별 타입을 식별함.
export interface StatementObj extends NodeObj {
  statementNode(): void;
}

export interface ExpressionObj extends NodeObj {
  expressionNode(): void;
}

export interface Program extends NodeObj {
  type: "Program";
  Statements: Statement[];
}

// Go 인터페이스 구조체 생성직접 사용하는 코드 대신 사용
// golang : program := &ast.Program{} ->
// Deno : const program = ast.ProgramNew();
export function ProgramNew(): Program {
  return {
    type: "Program",
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

/** 선언문 */
export interface LetStatement extends StatementObj {
  type: "LetStatement";
  Token: Token;
  // token외에는 a.Name("nm"); a.Value("val"); 이런 식의 코드 진행이 가능하도록 선택변수로 처리
  Name?: Identifier;
  Value?: Expression;
}

export function LetStatementNew(token: Token): LetStatement {
  return {
    type: "LetStatement",
    Token: token,
    statementNode: function (this: LetStatement) {},
    TokenLiteral: function (this: LetStatement) {
      const ls = this;
      return ls.Token.Literal;
    },
  };
}

export interface ReturnStatement extends StatementObj {
  type: "ReturnStatement";
  Token: Token;
  ReturnValue?: Expression;
}

export function ReturnStatementNew(token: Token): ReturnStatement {
  return {
    type: "ReturnStatement",
    Token: token,
    statementNode: function (this: ReturnStatement) {},
    TokenLiteral: function (this: ReturnStatement) {
      const ls = this;
      return ls.Token.Literal;
    },
  };
}
export interface ExpressionStatement extends StatementObj {
  type: "ExpressionStatement";
  Token: Token;
  Expression?: Expression;
}

export function ExpressionStatementNew(token: Token): ExpressionStatement {
  return {
    type: "ExpressionStatement",
    Token: token,
    statementNode: function (this: ExpressionStatement) {},
    TokenLiteral: function (this: ExpressionStatement) {
      const ls = this;
      return ls.Token.Literal;
    },
  };
}

/** 표현식 */
export interface Identifier extends ExpressionObj {
  type: "Identifier";
  Token: Token;
  Value: string;
}

export function IdentifierNew(token: Token, value: string): Identifier {
  return {
    type: "Identifier",
    Token: token,
    Value: value,
    expressionNode: function (this: Identifier) {},
    TokenLiteral: function (this: Identifier) {
      const i = this;
      return i.Token.Literal;
    },
  };
}

export interface IntegerLiteral extends ExpressionObj {
  type: "IntegerLiteral";
  Token: Token;
  Value: number;
}
export function IntegerLiteralNew(token: Token, value: number): IntegerLiteral {
  return {
    type: "IntegerLiteral",
    Token: token,
    Value: value,
    expressionNode: function (this: Identifier) {},
    TokenLiteral: function (this: Identifier) {
      const i = this;
      return i.Token.Literal;
    },
  };
}

export interface PrefixExpression extends ExpressionObj {
  type: "PrefixExpression";
  Token: Token;
  Operator: string;
  Right?: Expression;
}

export function PrefixExpressionNew(
  token: Token,
  op: string
): PrefixExpression {
  return {
    type: "PrefixExpression",
    Token: token,
    Operator: op,
    expressionNode: function (this: Identifier) {},
    TokenLiteral: function (this: Identifier) {
      const i = this;
      return i.Token.Literal;
    },
  };
}

export interface InfixExpression extends ExpressionObj {
  type: "InfixExpression";
  Token: Token;
  Left?: Expression;
  Operator: string;
  Right?: Expression;
}

export function InfixExpressionNew(
  token: Token,
  op: string,
  left: Expression
): InfixExpression {
  return {
    type: "InfixExpression",
    Token: token,
    Operator: op,
    Left: left,
    expressionNode: function (this: Identifier) {},
    TokenLiteral: function (this: Identifier) {
      const i = this;
      return i.Token.Literal;
    },
  };
}
