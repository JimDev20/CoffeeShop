import "server-only";

import { neon } from "@neondatabase/serverless";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let sql: any;

function getDb() {
  if (!sql) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL is not configured");
    }
    sql = neon(connectionString);
  }
  return sql;
}

/**
 * Returns true when the error is a transient database connection failure
 * that is safe to retry (e.g. undici fetch timeout, TLS connect timeout).
 */
function isTransientDbError(err: unknown): boolean {
  if (!(err instanceof Error)) return false;
  const msg = err.message.toLowerCase();
  return (
    msg.includes("fetch failed") ||
    msg.includes("connect timeout") ||
    msg.includes("und_err_connect_timeout") ||
    err.name === "NeonDbError" ||
    (err as any)?.code === "UND_ERR_CONNECT_TIMEOUT"
  );
}

/**
 * Wraps an async database operation with exponential-backoff retry logic.
 * Transient connection failures are retried up to `maxRetries` times.
 */
export async function queryWithRetry<T>(
  fn: () => Promise<T>,
  { maxRetries = 3, baseDelayMs = 500 }: { maxRetries?: number; baseDelayMs?: number } = {}
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (!isTransientDbError(err) || attempt === maxRetries) break;
      const delay = baseDelayMs * 2 ** attempt;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw lastError;
}

export default getDb;
