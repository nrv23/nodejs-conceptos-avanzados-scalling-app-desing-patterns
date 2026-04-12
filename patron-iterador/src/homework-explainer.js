/*

1. Short Intro to the Iterator Pattern  
   - An Iterator provides a standard way to access items in a collection (such as a list of products) without revealing the internal structure.  
   - It typically has methods like `.next()`, `.prev()`, `.current()`, etc.

2. Look at the “Before” Code  
   - It has `index.js` reading keypresses and calling `products.next()`, `products.prev()`, etc.  
   - But there’s no separate module to encapsulate iteration logic. The code might keep index logic scattered or underdeveloped.

3. the desired Code  
   - There’s a new `iterator.js` file with a class `Iterator` that holds items and an index.
   - `.next()`, `.prev()`, `.first()`, `.last()`, etc. are well-defined.  
   - `index.js` remains small, just referencing the `Iterator`.

4. Steps to Implement  
   1. Extract iteration logic from the old code into a new `Iterator` class.  
   2. Provide methods in that class:  
      - `.first()` returns the first item,  
      - `.last()` returns the last item,  
      - `.next()` moves the index forward,  
      - `.prev()` moves backward,  
      - `.current()` gives the current item.  
   3. Keep any `Product` logic (like printing) the same, but in your `Iterator` class, you store and traverse an array of `Product`s.  
   4. Modify `index.js` so it creates an `Iterator` instance and uses `iteratorInstance.next()`, `.prev()`, etc. for arrow key events.  
   5. Test by pressing arrow keys and verifying you cycle through the items properly (loop or not?).  
   6. Ensure code remains tidy: `Product` handles product details, `Iterator` handles item movement, `index.js` only orchestrates user interaction.

5. Validate  
   - Confirm keypress logic calls the correct iterator methods.  
   - Confirm `.current()` or `.next()` are returning the right product.  
   - Check boundary conditions (when you’re at the first or last product).

*/
