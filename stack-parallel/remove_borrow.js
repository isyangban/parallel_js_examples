var binaryen = require("binaryen");
var path = require("path");
var fs = require("fs");

let fp = path.resolve(__dirname, 'trieber_stack_bg.wasm');
const originBuffer = fs.readFileSync(fp);

const wasm = binaryen.readBinary(originBuffer);
const wast = wasm.emitText()
  .replace(/\(br_if \$label\$1[\s\n]+?\(i32.eq\n[\s\S\n]+?i32.const -1\)[\s\n]+\)[\s\n]+\)/g, '');
const distBuffer = binaryen.parseText(wast).emitBinary();

fs.writeFileSync(fp, distBuffer);