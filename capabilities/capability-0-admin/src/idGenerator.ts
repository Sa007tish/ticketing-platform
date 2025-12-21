/* ============================================================
 * Capability 0 — ID Generation Abstraction
 * ============================================================
 * All IDs must be generated via this interface.
 * No globals, no randomness inside business logic.
 * ============================================================
 */

/* -----------------------------
 * ID Generator Interface
 * -----------------------------
 */

export interface IdGenerator {
  nextId(): string;
}

/* -----------------------------
 * Runtime ID Generator
 * -----------------------------
 * Uses platform capabilities.
 * Inject at application boundaries only.
 */

export class RuntimeIdGenerator implements IdGenerator {
  nextId(): string {
    return crypto.randomUUID();
  }
}

/* -----------------------------
 * Deterministic ID Generator
 * -----------------------------
 * For tests only.
 */

export class DeterministicIdGenerator implements IdGenerator {
  private counter = 0;

  nextId(): string {
    this.counter += 1;
    return `test-id-${this.counter}`;
  }
}
