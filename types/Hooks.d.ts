import { Task, TaskContext } from './Task';
declare type TaskProvider<T extends TaskContext> = () => Task<T>;
interface HookProps<T extends TaskContext> {
    hookName: string;
    taskProvider: TaskProvider<T>;
    owner?: unknown;
    cacheable?: boolean;
}
export declare class Hooks {
    private hooks;
    registerHook<T extends TaskContext>(info: HookProps<T>): void;
    unregisterOwnerHooks(owner: unknown): void;
    unregisterHooks(hookName: string): void;
    unregisterHook(hookName: string, taskProvider: TaskProvider<any>): void;
    hookTasks<T extends TaskContext>(hookName: string): Array<Task<T>>;
    private ensureHookNotExists;
    private checkIfHookExists;
}
export {};
