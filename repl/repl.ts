import * as lexer from "../lexer/lexer.ts";
import { token } from "../token/token.ts";

/*
deno run ./main.ts
Hello! This is the Monkey programming language!

Feel free to type in commands

>> let add = fn(x, y) {x + y;}; 
tok.Type:[LET] / tok.Literal:[let] 
tok.Type:[IDENT] / tok.Literal:[add]
tok.Type:[=] / tok.Literal:[=]
tok.Type:[FUNCTION] / tok.Literal:[fn]
tok.Type:[(] / tok.Literal:[(]
tok.Type:[IDENT] / tok.Literal:[x]
tok.Type:[,] / tok.Literal:[,]
tok.Type:[IDENT] / tok.Literal:[y]
tok.Type:[)] / tok.Literal:[)]
tok.Type:[{] / tok.Literal:[{]
tok.Type:[IDENT] / tok.Literal:[x]
tok.Type:[+] / tok.Literal:[+]
tok.Type:[IDENT] / tok.Literal:[y]
tok.Type:[;] / tok.Literal:[;]
tok.Type:[}] / tok.Literal:[}]
tok.Type:[;] / tok.Literal:[;]
>>
 */

const PROMPT = ">> ";

// 참고코드 > https://stackoverflow.com/a/61048983
export async function Start(
  stdin = Deno.stdin,
  stdout = Deno.stdout
): Promise<never> {
  while (true) {
    const buf = new Uint8Array(1024);
    // Write question to console
    await stdout.write(new TextEncoder().encode(PROMPT));
    const n = <number>await stdin.read(buf);
    const scanned = new TextDecoder().decode(buf.subarray(0, n));
    const line = scanned.trim();
    const l = lexer.New(line);

    for (let tok = l.NextToken(); tok.Type != token.EOF; tok = l.NextToken()) {
      await stdout.write(
        new TextEncoder().encode(
          `tok.Type:[${tok.Type}] / tok.Literal:[${tok.Literal}] \n`
        )
      );
    }
  }
}
