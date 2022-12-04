import * as repl from "./repl/repl.ts";

function main(): void {
  console.log("Hello! This is the Monkey programming language!\n");
  console.log("Feel free to type in commands\n");
  repl.Start(Deno.stdin, Deno.stdout);
}
main();
