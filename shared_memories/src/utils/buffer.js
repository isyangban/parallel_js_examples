"use strict";
/*
function makeBuffer(data: any): SharedArrayBuffer {
  if (typeof data === "boolean") {
    let dataBuffer = new SharedArrayBuffer(4)
    let view = new Int32Array(dataBuffer)
    if (data === true) {
      view[0] = 1
    } else {
      view[0] = 0
    }
    return dataBuffer
  } else if (typeof data === "number") {
    this.dataBuffer = new SharedArrayBuffer(4)
  } else {
    // if (typeof data === "string" || typeof data === "object")
    let string_data: string
    if ((typeof data) !== "string") {
      string_data = JSON.stringify(data)
    } else {
      string_data = data
    }
    const buf = Buffer.from(string_data, 'utf8');
    let dataBuffer = new SharedArrayBuffer(buf.byteLength);
    let view = new Uint8Array(dataBuffer);
    // temp.
    // Copy contents to array once
    for (let i = 0; i < dataBuffer.length; i++) {
      view[i] = buf[i];
    }
    this.dataBuffer = dataBuffer;
}*/ 
//# sourceMappingURL=buffer.js.map