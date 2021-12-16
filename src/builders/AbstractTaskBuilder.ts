import { evaluateValue } from '../BaseTask';
import { IllegalOperationError } from '../IllegalOperationError';
import { Task, TaskContext, TaskDesk } from '../Task';
import { TaskBuilder } from '../TaskBuilder';
import {
  DelayTaskDesk,
  DoTaskDesk,
  ForEachTaskDesk,
  HookTaskDesk,
  IfTaskDesk,
  PromiseTaskDesk,
  RepeatTaskDesk,
  WhenIsTaskCondition,
  WhenTaskDesk,
  WhileTaskDesk,
} from '../tasks';

export abstract class AbstractTaskBuilder<T extends TaskContext>
  implements TaskBuilder<T>
{
  build(): Task<T> {
    throw this.createIllegalOperationError('build');
  }

  do(func: DoTaskDesk<T>['func']): TaskBuilder<T> {
    throw this.createIllegalOperationError('do');
  }

  wait(
    promise: PromiseTaskDesk<T>['promise'],
    skipCallback?: PromiseTaskDesk<T>['skipCallback'],
    stopCallback?: PromiseTaskDesk<T>['stopCallback']
  ): TaskBuilder<T> {
    throw this.createIllegalOperationError('wait');
  }

  break(label?: string): TaskBuilder<T> {
    throw this.createIllegalOperationError('break');
  }

  continue(label?: string): TaskBuilder<T> {
    throw this.createIllegalOperationError('continue');
  }

  delay(time: DelayTaskDesk<T>['time']): TaskBuilder<T> {
    throw this.createIllegalOperationError('delay');
  }

  hook(name: HookTaskDesk['name']): TaskBuilder<T> {
    throw this.createIllegalOperationError('hook');
  }

  task(task: Task<T>): TaskBuilder<T> {
    throw this.createIllegalOperationError('task');
  }

  parallelQueue(): TaskBuilder<T> {
    throw this.createIllegalOperationError('parallelQueue');
  }

  queue(): TaskBuilder<T> {
    throw this.createIllegalOperationError('queue');
  }

  forEach(
    collection: ForEachTaskDesk<T>['values'],
    valueName: ForEachTaskDesk<T>['valueName']
  ): TaskBuilder<T> {
    throw this.createIllegalOperationError('forEach');
  }

  repeat(
    numIterations: RepeatTaskDesk<T>['numIterations'],
    valueName: RepeatTaskDesk<T>['valueName']
  ): TaskBuilder<T> {
    throw this.createIllegalOperationError('repeat');
  }

  while(condition: WhileTaskDesk<T>['condition']): TaskBuilder<T> {
    throw this.createIllegalOperationError('while');
  }

  if(condition: IfTaskDesk<T>['condition']): TaskBuilder<T> {
    throw this.createIllegalOperationError('if');
  }

  elseif(condition: IfTaskDesk<T>['condition']): TaskBuilder<T> {
    throw this.createIllegalOperationError('elseif');
  }

  else(): TaskBuilder<T> {
    throw this.createIllegalOperationError('else');
  }

  when(value: WhenTaskDesk<T>['value']): TaskBuilder<T> {
    throw this.createIllegalOperationError('when');
  }

  is(value: WhenIsTaskCondition<T>): TaskBuilder<T> {
    throw this.createIllegalOperationError('is');
  }

  isEqual(value: unknown | ((ctx: T) => unknown)): TaskBuilder<T> {
    return this.is((_value, ctx) => _value === evaluateValue(ctx, value));
  }

  isNotEqual(value: unknown | ((ctx: T) => unknown)): TaskBuilder<T> {
    return this.is((_value, ctx) => _value !== evaluateValue(ctx, value));
  }

  otherwise(): TaskBuilder<T> {
    throw this.createIllegalOperationError('default');
  }

  end(): TaskBuilder<T> {
    throw this.createIllegalOperationError('end');
  }

  protected createIllegalOperationError(operation: string): Error {
    return new IllegalOperationError(operation, this.getLegalOperations());
  }

  abstract getDesc(): TaskDesk;

  getLegalOperations(): string[] {
    return [];
  }
}
