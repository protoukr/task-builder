export declare enum TaskStatus {
    PENDING = 0,
    EXECUTING = 1,
    COMPLETED = 2
}
export declare function getTaskStatusName(code: TaskStatus): string;
export interface TaskDesk {
    type: string;
}
export declare type TaskContext = void | Readonly<Record<string, unknown>>;
export declare type TaskCallback = (msg?: unknown) => void;
export interface Task<T extends TaskContext = void> {
    readonly status: TaskStatus;
    exec(ctx: T): Promise<void>;
    exec(ctx: T, callback: TaskCallback): void;
    stop(): void;
    skip(): void;
}
