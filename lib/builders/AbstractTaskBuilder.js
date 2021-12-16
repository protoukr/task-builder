"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractTaskBuilder = void 0;
const BaseTask_1 = require("../BaseTask");
const IllegalOperationError_1 = require("../IllegalOperationError");
class AbstractTaskBuilder {
    build() {
        throw this.createIllegalOperationError('build');
    }
    do(func) {
        throw this.createIllegalOperationError('do');
    }
    wait(promise, skipCallback, stopCallback) {
        throw this.createIllegalOperationError('wait');
    }
    break(label) {
        throw this.createIllegalOperationError('break');
    }
    continue(label) {
        throw this.createIllegalOperationError('continue');
    }
    delay(time) {
        throw this.createIllegalOperationError('delay');
    }
    hook(name) {
        throw this.createIllegalOperationError('hook');
    }
    task(task) {
        throw this.createIllegalOperationError('task');
    }
    parallelQueue() {
        throw this.createIllegalOperationError('parallelQueue');
    }
    queue() {
        throw this.createIllegalOperationError('queue');
    }
    forEach(collection, valueName) {
        throw this.createIllegalOperationError('forEach');
    }
    repeat(numIterations, valueName) {
        throw this.createIllegalOperationError('repeat');
    }
    while(condition) {
        throw this.createIllegalOperationError('while');
    }
    if(condition) {
        throw this.createIllegalOperationError('if');
    }
    elseif(condition) {
        throw this.createIllegalOperationError('elseif');
    }
    else() {
        throw this.createIllegalOperationError('else');
    }
    when(value) {
        throw this.createIllegalOperationError('when');
    }
    is(value) {
        throw this.createIllegalOperationError('is');
    }
    isEqual(value) {
        return this.is((_value, ctx) => _value === (0, BaseTask_1.evaluateValue)(ctx, value));
    }
    isNotEqual(value) {
        return this.is((_value, ctx) => _value !== (0, BaseTask_1.evaluateValue)(ctx, value));
    }
    otherwise() {
        throw this.createIllegalOperationError('default');
    }
    end() {
        throw this.createIllegalOperationError('end');
    }
    createIllegalOperationError(operation) {
        return new IllegalOperationError_1.IllegalOperationError(operation, this.getLegalOperations());
    }
    getLegalOperations() {
        return [];
    }
}
exports.AbstractTaskBuilder = AbstractTaskBuilder;
