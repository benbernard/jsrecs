import ololog from "ololog";

// This module exposes both a "log" export, which is a ololog logger and a
// bareLogger. Use bareLogger for performance critical applications (alias for
// console.log). Use log for all other applications.
//
// Both log and bareLogger may be override with corresponding push/pop methods,
// for testing purposes

let log = ololog.configure({ tag: true });
export default log;

export type Config = Parameters<ololog["configure"]>[0];

const stack: ololog[] = [];

export function pushLog(newLog: ololog): ololog {
  stack.push(log);
  log = newLog;
  return log;
}

export function popLog(): ololog {
  let oldLog = stack.pop();
  log = oldLog;
  return log;
}

export function pushLogConfig(opts: Config): ololog {
  return pushLog(log.configure(opts));
}

let bareLogger = function (...args: any[]): void {
  console.log(...args);
};
export type BareLogger = typeof bareLogger;
export { bareLogger };

let bareStack = [];

export function pushBareLogger(fn: BareLogger): BareLogger {
  bareStack.push(bareLogger);
  bareLogger = fn;
  return bareLogger;
}

export function popBareLogger(): BareLogger {
  let oldLogger = bareStack.pop();
  bareLogger = oldLogger;
  return bareLogger;
}

let bail = function (message: string): void {
  log.error(message);
  process.exit(1);
};
export { bail };
export type Bail = typeof bail;

let bailStack = [];

export function pushBail(fn: Bail): Bail {
  bailStack.push(bail);
  bail = fn;
  return bail;
}

export function popBail(): Bail {
  let oldBail = bailStack.pop();
  bail = oldBail;
  return bail;
}
