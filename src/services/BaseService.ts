import getDb, { queryWithRetry } from "@/lib/db";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export abstract class BaseService {
  protected get db() {
    const rawSql = getDb();
    return (strings: TemplateStringsArray, ...values: any[]): Promise<any> =>
      queryWithRetry(() => rawSql(strings, ...values));
  }
}
