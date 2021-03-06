"use strict";
/*
const LOCKED = 1
const UNLOCKED = 0

// Using SPIN_LOCK Implementaion
class Mutex<T> {
  dataBuffer: SharedArrayBuffer
  dataType: string
  mutexBuffer: SharedArrayBuffer
  mutexBufferView: Int32Array

  constructor(data: T) {
    // Default, use spin lock
    // If spin lock, we need a mutexBuffer of size 4
    this.mutexBuffer = new SharedArrayBuffer(4)
    this.mutexBufferView = new Int32Array(this.mutexBuffer)
    // We need to store data in shared array buffer
    // Since shared array buffer is just a range of bytes,
    // We need to do some con

    }
    this.dataType = typeof data
    // this._sab = opt_sab || new SharedArrayBuffer(4);
    // this._mu = new Int32Array(this._sab);
  }

  // Lock =>
  lock() {
    while (Atomics.compareExchange(this.mutexBufferView, 0, UNLOCKED, LOCKED) === UNLOCKED) {
      Atomics.wait(this.mutexBufferView, 0, UNLOCKED);
    }
  }

  unlock() {
    Atomics.compareExchange(this.mutexBufferView, 0, LOCKED, UNLOCKED)
    Atomics.notify(this.mutexBufferView, 0, 1);
  }

  // Reads data
  read() {

  }
}*/
//# sourceMappingURL=mutex.js.map