import { BaseTask } from '../BaseTask';
import { TaskCallback, TaskContext } from '../Task';
import { Break } from './BreakTask';
import { Continue } from './ContinueTask';

export abstract class LoopLikeTask<T extends TaskContext> extends BaseTask<T> {
  constructor(private readonly label?: string) {
    super();
  }

  handleTaskMsg(callback: TaskCallback, msg?: unknown): boolean {
    if (typeof msg === 'object') {
      if (msg instanceof Error) {
        callback(msg);
        return true;
      }
      if (msg instanceof Break) {
        if (msg.label === undefined || msg.label === this.label) {
          callback();
        } else {
          callback(msg);
        }
        return true;
      }
      if (msg instanceof Continue) {
        if (msg.label !== undefined && msg.label !== this.label) {
          callback(msg);
          return true;
        }
      }
    }
    return false;
  }
}
