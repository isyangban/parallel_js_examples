let wasm_bindgen;
(function() {
    const __exports = {};
    let wasm;

    let memory;

    let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

    cachedTextDecoder.decode();

    let cachegetUint8Memory0 = null;
    function getUint8Memory0() {
        if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== wasm.__wbindgen_export_0.buffer) {
            cachegetUint8Memory0 = new Uint8Array(wasm.__wbindgen_export_0.buffer);
        }
        return cachegetUint8Memory0;
    }

    function getStringFromWasm0(ptr, len) {
        return cachedTextDecoder.decode(getUint8Memory0().slice(ptr, ptr + len));
    }

    let cachegetInt32Memory0 = null;
    function getInt32Memory0() {
        if (cachegetInt32Memory0 === null || cachegetInt32Memory0.buffer !== wasm.__wbindgen_export_0.buffer) {
            cachegetInt32Memory0 = new Int32Array(wasm.__wbindgen_export_0.buffer);
        }
        return cachegetInt32Memory0;
    }
    /**
    * Michael-Scott queue.
    */
    class Queue {

        static __wrap(ptr) {
            const obj = Object.create(Queue.prototype);
            obj.ptr = ptr;

            return obj;
        }

        free() {
            const ptr = this.ptr;
            this.ptr = 0;

            wasm.__wbg_queue_free(ptr);
        }
        /**
        * Create a new, empty queue.
        * @returns {Queue}
        */
        static new() {
            var ret = wasm.queue_new();
            return Queue.__wrap(ret);
        }
        /**
        * Adds `t` to the back of the queue, possibly waking up threads blocked on `pop`.
        * @param {number} t
        */
        push(t) {
            wasm.queue_push(this.ptr, t);
        }
        /**
        * Attempts to dequeue from the front.
        *
        * Returns `None` if the queue is observed to be empty.
        * @returns {number | undefined}
        */
        try_pop() {
            try {
                const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
                wasm.queue_try_pop(retptr, this.ptr);
                var r0 = getInt32Memory0()[retptr / 4 + 0];
                var r1 = getInt32Memory0()[retptr / 4 + 1];
                return r0 === 0 ? undefined : r1;
            } finally {
                wasm.__wbindgen_add_to_stack_pointer(16);
            }
        }
    }
    __exports.Queue = Queue;

    async function load(module, imports, maybe_memory) {
        if (typeof Response === 'function' && module instanceof Response) {
            memory = imports.wbg.memory = new WebAssembly.Memory({initial:17,maximum:16384,shared:true});
            if (typeof WebAssembly.instantiateStreaming === 'function') {
                try {
                    return await WebAssembly.instantiateStreaming(module, imports);

                } catch (e) {
                    if (module.headers.get('Content-Type') != 'application/wasm') {
                        console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                    } else {
                        throw e;
                    }
                }
            }

            const bytes = await module.arrayBuffer();
            return await WebAssembly.instantiate(bytes, imports);

        } else {
            memory = imports.wbg.memory = maybe_memory;
            const instance = await WebAssembly.instantiate(module, imports);

            if (instance instanceof WebAssembly.Instance) {
                return { instance, module };

            } else {
                return instance;
            }
        }
    }

    async function init(input, maybe_memory) {
        if (typeof input === 'undefined') {
            let src;
            if (typeof document === 'undefined') {
                src = location.href;
            } else {
                src = document.currentScript.src;
            }
            input = src.replace(/\.js$/, '_bg.wasm');
        }
        const imports = {};
        imports.wbg = {};
        imports.wbg.__wbindgen_throw = function(arg0, arg1) {
            throw new Error(getStringFromWasm0(arg0, arg1));
        };

        if (typeof input === 'string' || (typeof Request === 'function' && input instanceof Request) || (typeof URL === 'function' && input instanceof URL)) {
            input = fetch(input);
        }

        const { instance, module } = await load(await input, imports, maybe_memory);

        wasm = instance.exports;
        init.__wbindgen_wasm_module = module;
        wasm.__wbindgen_start();
        return wasm;
    }

    wasm_bindgen = Object.assign(init, __exports);

})();
