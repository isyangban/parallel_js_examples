/* tslint:disable */
/* eslint-disable */
/**
* Treiber's lock-free stack.
*
* Usable with any number of producers and consumers.
*/
export class Stack {
  free(): void;
/**
* Creates a new, empty stack.
* @returns {Stack}
*/
  static new(): Stack;
/**
* Pushes a value on top of the stack.
* @param {number} t
*/
  push(t: number): void;
/**
* Attempts to pop the top element from the stack.
*
* Returns `None` if the stack is empty.
* @returns {number | undefined}
*/
  pop(): number | undefined;
/**
* Returns `true` if the stack is empty.
* @returns {boolean}
*/
  is_empty(): boolean;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly __wbg_stack_free: (a: number) => void;
  readonly stack_new: () => number;
  readonly stack_push: (a: number, b: number) => void;
  readonly stack_pop: (a: number, b: number) => void;
  readonly stack_is_empty: (a: number) => number;
  readonly __wbindgen_export_0: WebAssembly.Memory;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_start: () => void;
}

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
* @param {WebAssembly.Memory} maybe_memory
*
* @returns {Promise<InitOutput>}
*/
export default function init (module_or_path?: InitInput | Promise<InitInput>, maybe_memory: WebAssembly.Memory): Promise<InitOutput>;
        