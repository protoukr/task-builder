import { Task, TaskContext, TaskDesk } from '../Task';
import { TaskInflater } from '../TaskInflater';
import { AbstractTaskBuilder } from './AbstractTaskBuilder';
export declare class RootTaskBuilder<T extends TaskContext> extends AbstractTaskBuilder<T> {
    private readonly inflater;
    private readonly builder;
    constructor(inflater: TaskInflater<T>, builder: AbstractTaskBuilder<T>);
    getLegalOperations(): string[];
    getDesc(): TaskDesk;
    build(): Task<T>;
}
