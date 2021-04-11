# parallel_js_examples

## Overview
This repo is a test repo for implementing lock-free data structures using 
[SharedArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer)
Implementation includes code for Michael-Scott lock-free queue and Treiber's lock-free stack.

## System Overview
There are practical difficulties while actually using shared memory within Javascript since native Javascript object are not addressable. 
So using Javscript alone with SharedArrayBuffer, it is almost impossible to create data strucutres that require pointer manipulation due to the
lack of pointer support. Without pointer support, desiging and implementing lock-free data strucures code requires saving and swapping memory addresses. 
Usage of locks are limited to just primite types with Javascript and SharedArrayBuffer.
However, it is possible to share memory between Javascript and WebAssembly by using SharedArrayBuffer. If we build lock-free datastructure using 
WebAssembly and share the datastructure using SharedArrayMemmory, it is possible to harness the power of lock-free data structure without writing
most code in low level language.

### Design
Lock-free data structures were implented in Rust and compiled using rustwasm. 
The resulting wasm code should be manipulated inorder to support SharedArrayMemmory that is actually sharable to external code. 
