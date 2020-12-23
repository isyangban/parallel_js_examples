// Code from https://github.com/kaist-cp/cs492-concur/tree/master/lockfree
use wasm_bindgen::prelude::*;

use wasm_bindgen::prelude::*;
use core::mem::ManuallyDrop;
use core::ptr;
use core::sync::atomic::Ordering;

use crossbeam_epoch::{Atomic, Owned};

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

/*
#[wasm_bindgen]
extern {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet() {
    alert("Hello, wasm-test!");
}*/



/// Treiber's lock-free stack.
///
/// Usable with any number of producers and consumers.
#[wasm_bindgen]
#[derive(Debug)]
pub struct Stack {
    head: Atomic<Node>,
}

#[derive(Debug)]
struct Node {
    data: ManuallyDrop<i32>,
    next: Atomic<Node>,
}

impl Default for Stack {
    fn default() -> Self {
        Self {
            head: Atomic::null(),
        }
    }
}

#[wasm_bindgen]
impl Stack {
    /// Creates a new, empty stack.
    pub fn new() -> Stack {
        Self::default()
    }

    /// Pushes a value on top of the stack.
    pub fn push(&self, t: i32) {
        let mut n = Owned::new(Node {
            data: ManuallyDrop::new(t),
            next: Atomic::null(),
        });

        let guard = crossbeam_epoch::pin();

        loop {
            let head = self.head.load(Ordering::Relaxed, &guard);
            n.next.store(head, Ordering::Relaxed);

            match self
                .head
                .compare_and_set(head, n, Ordering::Release, &guard)
            {
                Ok(_) => break,
                Err(e) => n = e.new,
            }
        }
    }

    /// Attempts to pop the top element from the stack.
    ///
    /// Returns `None` if the stack is empty.
    pub fn pop(&self) -> Option<i32> {
        let guard = crossbeam_epoch::pin();
        loop {
            let head = self.head.load(Ordering::Acquire, &guard);

            match unsafe { head.as_ref() } {
                Some(h) => {
                    let next = h.next.load(Ordering::Relaxed, &guard);

                    if self
                        .head
                        .compare_and_set(head, next, Ordering::Relaxed, &guard)
                        .is_ok()
                    {
                        unsafe {
                            guard.defer_destroy(head);
                            return Some(ManuallyDrop::into_inner(ptr::read(&(*h).data)));
                        }
                    }
                }
                None => return None,
            }
        }
    }

    /// Returns `true` if the stack is empty.
    pub fn is_empty(&self) -> bool {
        let guard = crossbeam_epoch::pin();
        self.head.load(Ordering::Acquire, &guard).is_null()
    }
}

impl Drop for Stack {
    fn drop(&mut self) {
        while self.pop().is_some() {}
    }
}