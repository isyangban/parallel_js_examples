// synchronously, using the browser, import out shim JS scripts
importScripts('trieber_stack.js');

// Wait for the main thread to send us the shared module/memory. Once we've got
// it, initialize it all with the `wasm_bindgen` global we imported via
// `importScripts`.
//
// After our first message all subsequent messages are an entry point to run,
// so we just do that.

const { Stack } = wasm_bindgen

self.onmessage = event => {
  console.log("event data", event.data)
  let initialised = wasm_bindgen('./trieber_stack_bg.wasm', event.data).catch(err => {
    // Propagate to main `onerror`:
    setTimeout(() => {
      throw err;
    });
    // Rethrow to keep promise rejected and prevent execution of further commands:
    throw err;
  });

  console.log("should be run2")
  self.onmessage = async event => {
    // This will queue further commands up until the module is fully initialised:
    await initialised;
    // wasm_bindgen.child_entry_point(event.data);
    console.log("should be run")
    
    let stack = Stack.__wrap(event.data.stack.ptr)
    // stack.push(32)
    let first = stack.pop()
    let second = stack.pop()
    console.log("worker stack", first, second)
  };
};
