/*

1. Brief Intro to the Chain of Responsibility  
   - This pattern chains multiple handlers in a sequence.
   - Each handler can either handle the request or pass it along to the next.
   - If no handler can handle it, the request ends unhandled.

2. Examine the “Before” Code  
   - It has `BasicSupport`, `TechnicalSupport`, `ManagerSupport`, but no generic `Handler` class.
   - Each support class tries to handle the request or logs that it’s passing it on, but the chaining itself is not fully abstract.

3. Look at the “After” Code  
   - There's now a `Handler` base class with `setNext(...)` and a `handle(...)`.
   - Each support class extends `Handler` and uses `super.handle(request)` to move to the next if it can’t handle the request.

4. Steps to Implement  
   1. Create a base `Handler` class or module. Give it:
      - a constructor that sets `this.nextHandler = null`.
      - a `setNext(handler)` method to wire the chain.
      - a `handle(request)` method that passes the request on if it can’t handle it.
   2. Make each support class (`BasicSupport`, etc.) inherit from `Handler`.
      - In their `handle(request)`, check if they can handle, else call `super.handle(request)`.
   3. In `index.js`, create instances of each support class, chain them (`basic.setNext(technical).setNext(manager)`), 
   then call `basic.handle(...)`.
   4. Test with known request types (`"basic"`, `"technical"`, `"manager"`) and an unknown type to ensure the chain works.

5. Verify and Adjust  
   - Confirm that requests flow in order.  
   - If a handler doesn’t handle it, it prints “passing request to the next...”, eventually reaching the “No handler was able...” message if no one can handle it.

*/
