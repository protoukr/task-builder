import { Task, TaskCallback, TaskContext, TaskStatus } from './Task';
export declare function evaluateValue<T, V>(ctx: T, value: ((ctx: T) => V) | V): V;
export declare function assignValueToContext<T extends TaskContext, K extends keyof T>(ctx: T, valueName?: K, value?: unknown): T;
export declare abstract class BaseTask<T extends TaskContext = TaskContext> implements Task<T> {
    status: TaskStatus;
    private _callback?;
    private _ctx?;
    isInState(state: TaskStatus): boolean;
    exec(ctx: T): Promise<void>;
    exec(ctx: T, callback: (msg?: unknown) => void): void;
    stop(): void;
    skip(): void;
    protected get callback(): TaskCallback;
    protected get ctx(): T;
    protected abstract onExec(ctx: T, callback: TaskCallback): void;
    protected setStatus(status: TaskStatus): void;
    protected onStatusChanged(prevStatus: TaskStatus): void;
    protected onReset(): void;
    protected onCompleted(): void;
    protected onStopped(): void;
    protected onSkipRequested(): void;
    protected forceComplete(): void;
    protected validateStatusAndCallback(callback: TaskCallback): void;
    private validateTransition;
    protected checkTransitionValidity(newStatus: TaskStatus): boolean;
    private _exec;
}
