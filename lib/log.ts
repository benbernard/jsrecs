import ololog from "ololog";

// This module exposes both a "log" export, which is a ololog logger and a
// bareLogger. Use bareLogger for performance critical applications (alias for
// console.log). Use log for all other applications.
//
// Both log and bareLogger may be override with corresponding push/pop methods,
// for testing purposes

let log = ololog.configure({ tag: true });

export type Config = Parameters<ololog["configure"]>[0];

const stack: ololog[] = [];

let defautltBareLogger = function (...args: any[]): void {
  console.log(...args);
};
export type BareLogger = typeof defautltBareLogger;

const defaultBailHandler = function (message: string): void {
  log.error(message);
  process.exit(1);
};
export type BailHandler = typeof defaultBailHandler;

class PeekStack<T> {
  stack: T[] = [];
  constructor(public head: T) {
    this.stack.push(head);
  }

  push(newItem: T): T {
    this.stack.push(newItem);
    this.head = newItem;
    return newItem;
  }

  pop(): T {
    this.stack.pop();

    if (this.stack.length === 0) {
      throw new Error(`PeekStack down to 0 elements! Unbalanced push/pop?`);
    }

    this.head = this.stack[this.stack.length - 1];
    return this.head;
  }
}

export class Logger {
  logStack: PeekStack<ololog>;
  bareLoggerStack: PeekStack<BareLogger>;
  bailHandlerStack: PeekStack<BailHandler>;

  constructor() {
    this.logStack = new PeekStack(log);
    this.bareLoggerStack = new PeekStack(defautltBareLogger);
    this.bailHandlerStack = new PeekStack(defaultBailHandler);
  }

  pushLogConfig(opts: Config): ololog {
    return this.logStack.push(this.logStack.head.configure(opts));
  }

  get log(): ololog {
    return this.logStack.head;
  }

  get bareLogger(): BareLogger {
    return this.bareLoggerStack.head;
  }

  get bailHandler(): BailHandler {
    return this.bailHandlerStack.head;
  }

  get bail(): BailHandler {
    return this.bailHandler;
  }

  pushAll(
    opts: Partial<{
      log: ololog;
      config: Config;
      bareLogger: BareLogger;
      bailHandler: BailHandler;
    }>
  ): void {
    if (opts.log && opts.config)
      throw new Error("Only push one of log or config");

    if (opts.log) this.logStack.push(opts.log);
    if (opts.bareLogger) this.bareLoggerStack.push(opts.bareLogger);
    if (opts.bailHandler) this.bailHandlerStack.push(opts.bailHandler);
    if (opts.config) this.pushLogConfig(opts.config);
  }

  popAll(): void {
    this.logStack.pop();
    this.bareLoggerStack.pop();
    this.bailHandlerStack.pop();
  }
}

const logger = new Logger();
export default logger;
export { logger };
