export class CancelError extends Error {
  constructor() {
    super("Async operation was canceled.");
    this.name = "CancelError";
  }
}
