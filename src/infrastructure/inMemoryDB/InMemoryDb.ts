import { injectable } from "inversify";
import { UUID } from "../../types/types.js";

@injectable()
export class InMemoryDb<T> {
  private collection: Map<UUID, T>;

  constructor() {
    this.collection = this.createCollection();
    console.log("InMemoryDatabase Up and Running...");
  }
  // async functions to make our memory database more real
  private createCollection(): Map<UUID, T> {
    const collection: Map<UUID, T> = new Map();
    return collection;
  }

  async getOneById(id: UUID): Promise<T | undefined> {
    const element = this.collection.get(id);
    if (!element) return;
    return this.copy(element);
  }

  async getAll(): Promise<Array<T>> {
    return [...this.collection.values()];
  }

  async upsert(element: T & { id: string }): Promise<void> {
    const elementId: UUID = element.id || this.generateUUID();
    this.collection.set(elementId, this.copy(element));
  }

  async delete(id: UUID): Promise<boolean> {
    return this.collection.delete(id);
  }

  async flushall(): Promise<void> {
    this.collection = this.createCollection();
  }

  private generateUUID() {
    return crypto.randomUUID();
  }

  private copy(element: T): T {
    return JSON.parse(JSON.stringify(element));
  }
}
