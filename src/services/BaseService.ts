import sql from "@/lib/db";

export abstract class BaseService {
  protected get db() {
    return sql;
  }
}
