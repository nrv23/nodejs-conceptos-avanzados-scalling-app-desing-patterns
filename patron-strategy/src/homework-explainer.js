/*

1. Intro to the Strategy Pattern  
   - The Strategy pattern separates how an operation is done (e.g., payment method) from the main code.  
   - You create different “strategy” objects (PayPal, CreditCard, BankTransfer) each with a common interface (like `.pay(amount)`).

2. Look at the “Before” Code  
   - `index.js` has a `PaymentProcessor` but no `.setStrategy(...)`.  
   - Different payment methods exist (`PayPalStrategy`, `CreditCardStrategy`, etc.), but they might just be placeholders.  
   - The actual `processPayment` logic is hardcoded in `PaymentProcessor`.

3. the desired Code  
   - `PaymentProcessor` now has `.setStrategy(...)`.  
   - Each strategy is in `payment-strategies.js`, with a `.pay(amount)` method.  
   - `index.js` picks a strategy based on config, then calls `processor.processPayment(amount)`.

4. Steps to Implement  
   1. Create a method in `PaymentProcessor` (like `setStrategy(strategy)`) that stores the chosen strategy internally.  
   2. Change how `processPayment(amount)` works so it calls `this.strategy.pay(amount)` instead of doing the payment itself.  
   3. Write separate strategy classes (e.g., `PayPalStrategy`, `CreditCardStrategy`) with a common `.pay(amount)` method.  
   4. In `index.js`, pick a strategy based on user input or config (like “paypal” or “creditcard”) and pass it to `processor.setStrategy(...)`.  
   5. Test by running different strategies to see if the console output changes accordingly.

5. Validation  
   - If no strategy is set, `PaymentProcessor` should error out.  
   - Each strategy should print a different message to confirm it was selected.  
   - The main code (`index.js`) should remain simple: choose a strategy, then call `processPayment(amount)`.

*/
