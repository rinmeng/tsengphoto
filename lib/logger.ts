type LogLevel = 'info' | 'warn' | 'error' | 'debug';

const COLORS = {
  info: '\x1b[36m', // cyan
  warn: '\x1b[33m', // yellow
  error: '\x1b[31m', // red
  debug: '\x1b[90m', // gray
  reset: '\x1b[0m',
};

function getCaller(): string {
  const stack = new Error().stack;
  if (!stack) return 'Unknown';

  // Stack lines: 0=Error, 1=getCaller, 2=log (internal), 3=actual caller
  const lines = stack.split('\n');
  const callerLine = lines[4]?.trim() ?? '';

  // Matches: "at functionName (file:line:col)" or "at ClassName.method (file:line:col)"
  const namedMatch = callerLine.match(/^at\s+([\w.<>$]+(?:\s+\[as\s+\w+\])?)\s+\(/);
  if (namedMatch) {
    // Clean up "async functionName" or "Object.functionName" → just the func name
    const raw = namedMatch[1];
    const parts = raw.split('.');
    return parts[parts.length - 1]; // last segment: "fetchUploads" from "UploadService.fetchUploads"
  }

  // Anonymous/arrow function — fall back to filename:line
  const fileMatch =
    callerLine.match(/\((.+):(\d+):\d+\)$/) ?? callerLine.match(/at\s+(.+):(\d+):\d+$/);
  if (fileMatch) {
    const filename =
      fileMatch[1]
        .split('/')
        .pop()
        ?.replace(/\.[tj]sx?$/, '') ?? 'unknown';
    return `${filename}:${fileMatch[2]}`;
  }

  return 'unknown';
}

function log(level: LogLevel, message: string, ...meta: unknown[]): void {
  // Only run on server
  if (typeof window !== 'undefined') return;

  const caller = getCaller();
  const label = `[${caller}]`;
  const color = COLORS[level];
  const reset = COLORS.reset;
  const timestamp = new Date().toISOString();

  const prefix = `${color}${label}${reset}`;

  if (meta.length > 0) {
    console[level](`${prefix} ${message}`, ...meta);
  } else {
    console[level](`${prefix} ${message}`);
  }

  // In production, swap above for your logging service (Datadog, Axiom, etc.)
  // e.g. logService.send({ level, caller, message, meta, timestamp });
  void timestamp; // suppress unused warning until wired up
}

export const Logger = {
  info: (message: string, ...meta: unknown[]) => log('info', message, ...meta),
  warn: (message: string, ...meta: unknown[]) => log('warn', message, ...meta),
  error: (message: string, ...meta: unknown[]) => log('error', message, ...meta),
  debug: (message: string, ...meta: unknown[]) => log('debug', message, ...meta),
};
