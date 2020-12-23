// Code from https://github.com/kaist-cp/cs492-concur/tree/master/lockfree
use wasm_bindgen::prelude::*;

use wasm_bindgen::prelude::*;
use core::mem::ManuallyDrop;
use core::ptr;
use core::sync::atomic::Ordering;
use core::mem::MaybeUninit;
use crossbeam_epoch::pin;

use crossbeam_epoch::{unprotected, Atomic, Guard, Owned, Shared};
use crossbeam_utils::CachePadded;
use etrace::some_or;

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
/// Michael-Scott queue.
// The representation here is a singly-linked list, with a sentinel node at the front. In general
// the `tail` pointer may lag behind the actual tail. Non-sentinel nodes are either all `Data` or
// all `Blocked` (requests for data from blocked threads).
#[wasm_bindgen]
#[derive(Debug)]
pub struct Queue {
    head: CachePadded<Atomic<Node>>,
    tail: CachePadded<Atomic<Node>>,
}

#[derive(Debug)]
struct Node {
    /// The slot in which a value of type `T` can be stored.
    ///
    /// The type of `data` is `ManuallyDrop<T>` because a `Node<T>` doesn't always contain a `T`.
    /// For example, the sentinel node in a queue never contains a value: its slot is always empty.
    /// Other nodes start their life with a push operation and contain a value until it gets popped
    /// out. After that such empty nodes get added to the collector for destruction.
    data: MaybeUninit<i32>,

    next: Atomic<Node>,
}

// Any particular `T` should never be accessed concurrently, so no need for `Sync`.
// unsafe impl<T: Send> Sync for Queue<T> {}
// unsafe impl<T: Send> Send for Queue<T> {}

impl Default for Queue {
    fn default() -> Self {
        let q = Self {
            head: CachePadded::new(Atomic::null()),
            tail: CachePadded::new(Atomic::null()),
        };
        // TODO(taiki-e): when the minimum supported Rust version is bumped to 1.36+,
        // replace this with `mem::MaybeUninit`.
        #[allow(deprecated)]
        let sentinel = Owned::new(Node {
            data: MaybeUninit::uninit(),
            next: Atomic::null(),
        });
        unsafe {
            let guard = &unprotected();
            let sentinel = sentinel.into_shared(guard);
            q.head.store(sentinel, Ordering::Relaxed);
            q.tail.store(sentinel, Ordering::Relaxed);
            q
        }
    }
}

#[wasm_bindgen]
impl Queue {
    /// Create a new, empty queue.
    pub fn new() -> Self {
        Self::default()
    }

    /// Adds `t` to the back of the queue, possibly waking up threads blocked on `pop`.
    pub fn push(&self, t: i32) {
        let guard = &pin();
        let new = Owned::new(Node {
            data: MaybeUninit::new(t),
            next: Atomic::null(),
        });
        let new = Owned::into_shared(new, guard);

        loop {
            // We push onto the tail, so we'll start optimistically by looking there first.
            let tail = self.tail.load(Ordering::Acquire, guard);

            // Attempt to push onto the `tail` snapshot; fails if `tail.next` has changed.
            let tail_ref = unsafe { tail.deref() };
            let next = tail_ref.next.load(Ordering::Acquire, guard);

            // If `tail` is not the actual tail, try to "help" by moving the tail pointer forward.
            if !next.is_null() {
                let _ = self
                    .tail
                    .compare_and_set(tail, next, Ordering::Release, guard);
                continue;
            }

            // looks like the actual tail; attempt to link at `tail.next`.
            if tail_ref
                .next
                .compare_and_set(Shared::null(), new, Ordering::Release, guard)
                .is_ok()
            {
                // try to move the tail pointer forward.
                let _ = self
                    .tail
                    .compare_and_set(tail, new, Ordering::Release, guard);
                break;
            }
        }
    }

    /// Attempts to dequeue from the front.
    ///
    /// Returns `None` if the queue is observed to be empty.
    pub fn try_pop(&self) -> Option<i32> {
        let guard = &pin();
        loop {
            let head = self.head.load(Ordering::Acquire, guard);
            let h = unsafe { head.deref() };
            let next = h.next.load(Ordering::Acquire, guard);
            let next_ref = some_or!(unsafe { next.as_ref() }, return None);

            // Moves `tail` if it's stale. Relaxed load is enough because if tail == head, then the
            // messages for that node are already acquired.
            let tail = self.tail.load(Ordering::Relaxed, guard);
            if tail == head {
                let _ = self
                    .tail
                    .compare_and_set(tail, next, Ordering::Release, guard);
            }

            if self
                .head
                .compare_and_set(head, next, Ordering::Release, guard)
                .is_ok()
            {
                unsafe {
                    guard.defer_destroy(head);
                    return Some(ptr::read(&next_ref.data).assume_init());
                }
            }
        }
    }
}

impl Drop for Queue {
    fn drop(&mut self) {
        unsafe {
            let guard = unprotected();

            while self.try_pop().is_some() {}

            // Destroy the remaining sentinel node.
            let sentinel = self.head.load(Ordering::Relaxed, guard);
            drop(sentinel.into_owned());
        }
    }
}

