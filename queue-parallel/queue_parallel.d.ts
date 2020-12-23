/* tslint:disable */
/* eslint-disable */
/**
* Michael-Scott queue.
*/
export class Queue {
  free(): void;
/**
* Create a new, empty queue.
* @returns {Queue}
*/
  static new(): Queue;
/**
* Adds `t` to the back of the queue, possibly waking up threads blocked on `pop`.
* @param {number} t
*/
  push(t: number): void;
/**
* Attempts to dequeue from the front.
*
* Returns `None` if the queue is observed to be empty.
* @returns {number | undefined}
*/
  try_pop(): number | undefined;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly __wbg_queue_free: (a: number) => void;
  readonly queue_new: () => number;
  readonly queue_push: (a: number, b: number) => void;
  readonly queue_try_pop: (a: number, b: number) => void;
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
        