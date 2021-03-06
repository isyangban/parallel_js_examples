// First up, but try to do feature detection to provide better error messages
function loadWasm() {
  let msg = 'This demo requires a current version of Firefox (e.g., 79.0)';
  if (typeof SharedArrayBuffer !== 'function') {
    alert('this browser does not have SharedArrayBuffer support enabled' + '\n\n' + msg);
    return
  }
  // Test for bulk memory operations with passive data segments
  //  (module (memory 1) (data passive ""))
  const buf = new Uint8Array([0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00,
    0x05, 0x03, 0x01, 0x00, 0x01, 0x0b, 0x03, 0x01, 0x01, 0x00]);
  if (!WebAssembly.validate(buf)) {
    alert('this browser does not support passive wasm memory, demo does not work' + '\n\n' + msg);
    return
  }

  wasm_bindgen('./trieber_stack_bg.wasm')
    .then(run)
    .catch(console.error);
}

loadWasm();

// const { Scene, WorkerPool } = wasm_bindgen;
const { Stack } = wasm_bindgen;

function run(data) {
  const stack = Stack.new()
  stack.push(30)
  stack.push(10)
  stack.push(20)
  let result = stack.pop()

  let memory = data.__wbindgen_export_0

  let worker = new Worker("worker.js")
  worker.postMessage(memory)
  worker.postMessage({stack: stack})
}
