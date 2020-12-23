import * as wasm from "wasm_test";

let stack = wasm.Stack.new()
stack.push(30)
stack.push(10)
stack.push(20)
let result = stack.pop()
console.log("result: ", result)