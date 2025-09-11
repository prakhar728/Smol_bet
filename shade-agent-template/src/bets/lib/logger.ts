type Level = "debugger" | "alert" | "info" | "success" | "error";

type LoggerOptions = {
  /** Minimum level to log. Defaults to "debugger" in dev, "info" otherwise. */
  level?: Level;
  /** Disable color (e.g., for CI). Defaults to auto based on TTY. */
  color?: boolean;
  /** Add ISO timestamp prefix. Default: true */
  timestamp?: boolean;
  /** Namespace label to prefix messages with (e.g., 'api/users'). */
  scope?: string;
};

const levels: Record<Level, { rank: number; label: string; symbol: string; color: (s: string) => string }> = {
  debugger: { rank: 10, label: "DEBUG",  symbol: "🐛", color: c("90") },      // gray
  info:     { rank: 20, label: "INFO",   symbol: "ℹ️", color: c("36") },      // cyan
  success:  { rank: 30, label: "OK",     symbol: "✅", color: c("32") },      // green
  alert:    { rank: 40, label: "ALERT",  symbol: "🚨", color: c("33") },      // yellow
  error:    { rank: 50, label: "ERROR",  symbol: "❌", color: c("31") },      // red
};

// Simple ANSI colorizer; turns off when not supported or disabled.
function c(code: string) {
  // If running in a browser, we'll style with CSS instead.
  return (s: string) => `\x1b[${code}m${s}\x1b[0m`;
}

const isBrowser = typeof window !== "undefined" && typeof window.document !== "undefined";
const isNode = !isBrowser;

// Basic TTY color detection (Node) – fall back to true in browsers.
const nodeColorOK =
  isNode &&
  // @ts-ignore
  !!(process.stdout && (process.stdout.isTTY || process.env.FORCE_COLOR));

function fmtTime() {
  return new Date().toISOString();
}

function pickMinLevel(envDefault: Level): Level {
  // Allow overriding via env in Node:
  // LOG_LEVEL=debugger|info|success|alert|error
  // DEBUG=true implies debugger in dev.
  if (isNode) {
    const envLevel = process.env.LOG_LEVEL as Level | undefined;
    if (envLevel && envLevel in levels) return envLevel;
    if (process.env.DEBUG?.toLowerCase() === "true") return "debugger";
    if (process.env.NODE_ENV === "development") return "debugger";
    return envDefault;
  }
  // In the browser, default to "info"
  return envDefault;
}

function shouldUseColor(explicit?: boolean) {
  if (typeof explicit === "boolean") return explicit;
  return isBrowser ? true : nodeColorOK;
}

/** Create a scoped logger */
export function createLogger(opts: LoggerOptions = {}) {
  const minLevel = pickMinLevel(opts.level ?? (isNode ? "info" : "info"));
  const useColor = shouldUseColor(opts.color);
  const showTs = opts.timestamp ?? true;
  const scope = opts.scope ? `[${opts.scope}]` : "";

  function log(level: Level, ...args: unknown[]) {
    const meta = levels[level];
    if (meta.rank < levels[minLevel].rank) return;

    const ts = showTs ? fmtTime() : "";
    const baseLabel = `${meta.symbol} ${meta.label}`;
    const label = useColor && isNode ? meta.color(baseLabel) : baseLabel;

    if (isBrowser) {
      // Browser console with CSS coloring
      const css =
        level === "error" ? "color:#d00" :
        level === "alert" ? "color:#c80" :
        level === "success" ? "color:#080" :
        level === "info" ? "color:#088" :
        "color:#666";
      // eslint-disable-next-line no-console
      (consoleFor(level) as any)(
        `%c${ts ? ts + " " : ""}${scope ? scope + " " : ""}${baseLabel}`,
        css,
        ...args
      );
    } else {
      // Node console with ANSI
      // eslint-disable-next-line no-console
      (consoleFor(level) as any)(
        `${ts ? ts + " " : ""}${scope ? scope + " " : ""}${label}`,
        ...args
      );
    }
  }

  return {
    log,
    debugger: (...a: unknown[]) => log("debugger", ...a),
    alert:    (...a: unknown[]) => log("alert", ...a),
    info:     (...a: unknown[]) => log("info", ...a),
    success:  (...a: unknown[]) => log("success", ...a),
    error:    (...a: unknown[]) => log("error", ...a),
    /** Create a child logger with an added scope label */
    withScope(childScope: string) {
      return createLogger({
        ...opts,
        scope: opts.scope ? `${opts.scope}:${childScope}` : childScope,
      });
    },
    /** Change minimum level at runtime */
    setLevel(next: Level) {
      (opts as any).level = next;
    },
  };
}

function consoleFor(level: Level) {
  switch (level) {
    case "error": return console.error;
    case "alert": return console.warn;
    case "success": return console.log;
    case "info": return console.info ?? console.log;
    case "debugger": return console.debug ?? console.log;
  }
}
