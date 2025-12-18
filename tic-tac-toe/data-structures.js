/**
 * Stack class implementation
 * Used for backward/undo functionality in the game
 */
class Stack {
    constructor() {
        this.items = []; // Array to store stack elements
    }

    // Add element to the top of the stack
    push(element) {
        this.items.push(element);
    }

    // Remove and return the top element from the stack
    pop() {
        if (this.isEmpty()) return null;
        return this.items.pop();
    }

    // Return the top element without removing it
    peek() {
        if (this.isEmpty()) return null;
        return this.items[this.items.length - 1];
    }

    // Check if the stack is empty
    isEmpty() {
        return this.items.length === 0;
    }

    // Return the number of elements in the stack
    size() {
        return this.items.length;
    }

    // Clear all elements from the stack
    clear() {
        this.items = [];
    }
}

/**
 * Queue class implementation
 * Used for forward/redo functionality in the game
 */
class Queue {
    constructor() {
        this.items = []; // Array to store queue elements
    }

    // Add element to the end of the queue
    enqueue(element) {
        this.items.push(element);
    }

    // Remove and return the front element from the queue
    dequeue() {
        if (this.isEmpty()) return null;
        return this.items.shift();
    }

    // Return the front element without removing it
    front() {
        if (this.isEmpty()) return null;
        return this.items[0];
    }

    // Check if the queue is empty
    isEmpty() {
        return this.items.length === 0;
    }

    // Return the number of elements in the queue
    size() {
        return this.items.length;
    }

    // Clear all elements from the queue
    clear() {
        this.items = [];
    }
}