import { assert } from 'chai';
import { describe, it } from 'mocha';
import { spy } from 'sinon';
import { TaskFactory } from '../../src/TaskFactory';

describe('DelayTask', () => {
  let spyFunc = spy();
  beforeEach(() => {
    spyFunc = spy();
  });

  it('checks passing time directly', async () => {
    // prettier-ignore
    const task = new TaskFactory()
      .queue()
        .do(() => spyFunc(Date.now()))
        .delay(50)
        .do(() => spyFunc(Date.now()))
      .build();

    await task.exec();

    assert.isTrue(
      spyFunc.secondCall.firstArg - spyFunc.firstCall.firstArg >= 50
    );
  });

  it('checks passing time through function', async () => {
    // prettier-ignore
    const task = new TaskFactory()
      .queue()
        .do(() => spyFunc(Date.now()))
        .delay(() => 50)
        .do(() => spyFunc(Date.now()))
      .build();

    await task.exec();

    assert.isTrue(
      spyFunc.secondCall.firstArg - spyFunc.firstCall.firstArg >= 50
    );
  });

  it('checks context passing', async () => {
    // prettier-ignore
    const task = new TaskFactory()
      .queue<{ someProp: 'someValue' }>()
        .delay((ctx) => spyFunc(ctx) ?? 0)
      .build();

    await task.exec({ someProp: 'someValue' });

    assert.deepEqual(spyFunc.firstCall.firstArg, { someProp: 'someValue' });
  });
});
