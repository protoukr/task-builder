"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IllegalOperationError = void 0;
class IllegalOperationError extends Error {
    constructor(op, validOperations) {
        const ops = validOperations.join(', ');
        super(`Illegal operation ${op}. The legal ones are: ${ops}`);
        this.name = 'IllegalOperationError';
    }
}
exports.IllegalOperationError = IllegalOperationError;
