"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isArray = Array.isArray;
exports.isFunction = function (input) { return typeof input === 'function'; };
exports.isObject = function (obj) {
    if (typeof obj !== 'object' || obj === null)
        return false;
    var proto = obj;
    while (Object.getPrototypeOf(proto) !== null) {
        proto = Object.getPrototypeOf(proto);
    }
    return Object.getPrototypeOf(obj) === proto;
};
exports.merge = function (target, source) {
    if (exports.isArray(source) && exports.isArray(target)) {
        for (var i = 0; i < source.length; i++) {
            target[i] = source[i];
        }
        return target;
    }
    if (exports.isObject(source) && exports.isObject(target)) {
        for (var key in source) {
            var descriptor = Object.getOwnPropertyDescriptor(source, key);
            // normal value
            if (descriptor.hasOwnProperty('value')) {
                target[key] = descriptor.value;
            }
            else {
                // accessor
                Object.defineProperty(target, key, descriptor);
            }
        }
        return target;
    }
    throw new Error("target and source are not the same type of object or array, " + target + " " + source);
};
var noop = function () { };
exports.createDeferred = function () {
    var resolve = noop;
    var reject = noop;
    var promise = new Promise(function (a, b) {
        resolve = a;
        reject = b;
    });
    return { resolve: resolve, reject: reject, promise: promise };
};
//# sourceMappingURL=util.js.map