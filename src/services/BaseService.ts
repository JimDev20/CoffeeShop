import getDb, { queryWithRetry } from "@/lib/db";

export abstract class BaseService {
  protected get db() {
    const rawSql = getDb();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (strings: TemplateStringsArray, ...values: any[]): Promise<any> =>
      queryWithRetry(() => rawSql(strings, ...values));
  }
}
