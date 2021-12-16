"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseTask = exports.assignValueToContext = exports.evaluateValue = void 0;
const Task_1 = require("./Task");
function evaluateValue(ctx, value) {
    if (typeof value === 'function') {
        // @ts-expect-error https://github.com/microsoft/TypeScript/issues/37663
        return value(ctx);
    }
    return value;
}
exports.evaluateValue = evaluateValue;
function assignValueToContext(ctx, valueName, value) {
    if (ctx === undefined || valueName === undefined || value === undefined) {
        return ctx;
    }
    return Object.assign(Object.assign({}, ctx), { [valueName]: value });
}
exports.assignValueToContext = assignValueToContext;
class BaseTask {
    constructor() {
        this.status = Task_1.TaskStatus.PENDING;
    }
    isInState(state) {
        return this.status === state;
    }
    exec(ctx, callback) {
        this._ctx = ctx;
        this.setStatus(Task_1.TaskStatus.PENDING);
        this.setStatus(Task_1.TaskStatus.EXECUTING);
        if (callback != null) {
            this._exec(ctx, callback);
            return;
        }
        return new Promise((resolve, reject) => {
            this._exec(ctx, (msg) => {
                if (msg !== undefined && msg instanceof Error) {
                    reject(msg);
                }
                else {
                    resolve();
                }
            });
        });
    }
    stop() {
        this.setStatus(Task_1.TaskStatus.PENDING);
    }
    skip() {
        if (this.isInState(Task_1.TaskStatus.EXECUTING)) {
            this.onSkipRequested();
        }
    }
    get callback() {
        if (this._callback == null) {
            throw new Error('Task callback is not defined');
        }
        return this._callback;
    }
    get ctx() {
        if (this._ctx == null) {
            throw new Error('Task context is not defined');
        }
        return this._ctx;
    }
    setStatus(status) {
        if (this.status === status) {
            return;
        }
        this.validateTransition(status);
        const prevStatus = this.status;
        this.status = status;
        this.onStatusChanged(prevStatus);
    }
    onStatusChanged(prevStatus) {
        if (this.status === Task_1.TaskStatus.PENDING) {
            if (prevStatus === Task_1.TaskStatus.EXECUTING) {
                this.onStopped();
            }
            this.onReset();
        }
        else if (this.status === Task_1.TaskStatus.COMPLETED) {
            this.onCompleted();
        }
    }
    onReset() { }
    onCompleted() { }
    onStopped() { }
    onSkipRequested() { }
    forceComplete() {
        var _a;
        (_a = this._callback) === null || _a === void 0 ? void 0 : _a.call(this);
    }
    validateStatusAndCallback(callback) {
        if (this.status !== Task_1.TaskStatus.EXECUTING) {
            throw new Error(`Task is not executing`);
        }
        if (this._callback !== callback) {
            throw new Error('Task callback is invalid');
        }
    }
    validateTransition(newStatus) {
        if (!this.checkTransitionValidity(newStatus)) {
            const currStatusName = (0, Task_1.getTaskStatusName)(this.status);
            const newStatusName = (0, Task_1.getTaskStatusName)(newStatus);
            throw new Error(`Invalid transition from ${currStatusName} to ${newStatusName}`);
        }
    }
    checkTransitionValidity(newStatus) {
        if (this.status === Task_1.TaskStatus.PENDING) {
            return newStatus === Task_1.TaskStatus.EXECUTING;
        }
        if (this.status === Task_1.TaskStatus.EXECUTING) {
            return (newStatus === Task_1.TaskStatus.COMPLETED || newStatus === Task_1.TaskStatus.PENDING);
        }
        return newStatus === Task_1.TaskStatus.PENDING;
    }
    _exec(ctx, callback) {
        this._callback = (msg) => {
            if (this.isInState(Task_1.TaskStatus.EXECUTING)) {
                this.setStatus(Task_1.TaskStatus.COMPLETED);
                callback(msg);
            }
        };
        this.onExec(ctx, this._callback);
    }
}
exports.BaseTask = BaseTask;
