import { Task, TaskContext, TaskDesk } from '../Task';
import { TaskInflater } from '../TaskInflater';
import { AbstractTaskBuilder } from './AbstractTaskBuilder';

export class RootTaskBuilder<
  T extends TaskContext
> extends AbstractTaskBuilder<T> {
  constructor(
    private readonly inflater: TaskInflater<T>,
    private readonly builder: AbstractTaskBuilder<T>
  ) {
    super();
  }

  getLegalOperations(): string[] {
    return ['build'];
  }

  getDesc(): TaskDesk {
    return this.builder.getDesc();
  }

  build(): Task<T> {
    return this.inflater.inflate(this.getDesc());
  }
}
