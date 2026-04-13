const {
  PayPalStrategy,
  CreditCardStrategy,
  BankTransferStrategy,
} = require("./strategies");
const PaymentProcessor = require("./payment-processor");

const processor = new PaymentProcessor();

const paymentStrategy = "paypal"; // This can be 'creditcard', 'banktransfer', etc.
const amountToPay = 100;

switch (paymentStrategy) {
  case "paypal":
    processor.setStrategy(new PayPalStrategy("user@example.com"));
    break;
  case "creditcard":
    processor.setStrategy(new CreditCardStrategy("1234-5678-9012-3456"));
    break;
  case "banktransfer":
    processor.setStrategy(new BankTransferStrategy("987654321"));
    break;
  default:
    console.log("Invalid payment method");
    break;
}

processor.processPayment(amountToPay);
