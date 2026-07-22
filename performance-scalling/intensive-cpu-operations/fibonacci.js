import EventEmitter from "node:events";

/**
 ** Fibonacci sequence
   In mathematics, the Fibonacci sequence is a sequence in which each number is the sum of the two numbers
   that precede it.
 */

export class Fibonacci extends EventEmitter {
  constructor(num) {
    super();
    this.num = num;
  }

  init() {
    const result = this._fib(this.num);
    this.emit("end", result);
  }

  _fib(n) {
    if (n < 2) return n;
    return this._fib(n - 1) + this._fib(n - 2);
  }
}
