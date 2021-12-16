export enum TaskStatus {
  PENDING,
  EXECUTING,
  COMPLETED,
}

export function getTaskStatusName(code: TaskStatus): string {
  const name = TaskStatus[code];
  if (name === undefined) {
    throw new Error(`Unknown TaskStatus code: ${code}`);
  }
  return name;
}

export interface TaskDesk {
  type: string;
}

export type TaskContext = void | Readonly<Record<string, unknown>>;

export type TaskCallback = (msg?: unknown) => void;

export interface Task<T extends TaskContext = void> {
  readonly status: TaskStatus;

  exec(ctx: T): Promise<void>;

  exec(ctx: T, callback: TaskCallback): void;

  stop(): void;

  skip(): void;
}
