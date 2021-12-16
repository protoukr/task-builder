"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RootTaskBuilder = void 0;
const AbstractTaskBuilder_1 = require("./AbstractTaskBuilder");
class RootTaskBuilder extends AbstractTaskBuilder_1.AbstractTaskBuilder {
    constructor(inflater, builder) {
        super();
        this.inflater = inflater;
        this.builder = builder;
    }
    getLegalOperations() {
        return ['build'];
    }
    getDesc() {
        return this.builder.getDesc();
    }
    build() {
        return this.inflater.inflate(this.getDesc());
    }
}
exports.RootTaskBuilder = RootTaskBuilder;
