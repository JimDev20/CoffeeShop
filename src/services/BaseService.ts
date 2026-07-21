import getDb from "@/lib/db";

export abstract class BaseService {
  protected get db() {
    return getDb();
  }
}
