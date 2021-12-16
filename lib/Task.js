"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTaskStatusName = exports.TaskStatus = void 0;
var TaskStatus;
(function (TaskStatus) {
    TaskStatus[TaskStatus["PENDING"] = 0] = "PENDING";
    TaskStatus[TaskStatus["EXECUTING"] = 1] = "EXECUTING";
    TaskStatus[TaskStatus["COMPLETED"] = 2] = "COMPLETED";
})(TaskStatus = exports.TaskStatus || (exports.TaskStatus = {}));
function getTaskStatusName(code) {
    const name = TaskStatus[code];
    if (name === undefined) {
        throw new Error(`Unknown TaskStatus code: ${code}`);
    }
    return name;
}
exports.getTaskStatusName = getTaskStatusName;
