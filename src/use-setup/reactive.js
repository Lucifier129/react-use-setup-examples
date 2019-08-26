"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("./util");
var INTERNAL = Symbol('INTERNAL');
exports.isReactive = function (input) {
    return !!(input && input[INTERNAL]);
};
exports.getState = function (input) {
    if (!exports.isReactive(input)) {
        throw new Error("Expect " + input + " to be reactive");
    }
    return input[INTERNAL].compute();
};
var createImmutable = function (state$) {
    var isArrayType = util_1.isArray(state$);
    var immutableTarget = (isArrayType ? [] : {});
    var isDirty = false;
    var mark = function () {
        isDirty = true;
    };
    var computeArray = function () {
        immutableTarget = [];
        for (var i = 0; i < state$.length; i++) {
            var item = state$[i];
            if (exports.isReactive(item)) {
                immutableTarget[i] = exports.getState(item);
            }
            else {
                immutableTarget[i] = item;
            }
        }
    };
    var computeObject = function () {
        immutableTarget = {};
        for (var key in state$) {
            var value = state$[key];
            if (exports.isReactive(value)) {
                immutableTarget[key] = exports.getState(value);
            }
            else {
                immutableTarget[key] = value;
            }
        }
    };
    var compute = function () {
        if (!isDirty)
            return immutableTarget;
        isDirty = false;
        if (isArrayType) {
            computeArray();
        }
        else {
            computeObject();
        }
        return immutableTarget;
    };
    return {
        mark: mark,
        compute: compute
    };
};
exports.reactive = function (state) {
    if (!util_1.isObject(state) && !util_1.isArray(state)) {
        var message = "Expect state to be array or object, instead of " + state;
        throw new Error(message);
    }
    // return unconnected state
    if (exports.isReactive(state) && !state[INTERNAL].isConnected()) {
        return state;
    }
    var isArrayType = util_1.isArray(state);
    var target = isArrayType ? [] : {};
    var connection = {
        parent: null,
        key: null
    };
    var connect = function (parent, key) {
        connection.parent = parent;
        connection.key = key;
    };
    var disconnect = function () {
        connection.parent = null;
        connection.key = null;
    };
    var isConnected = function () {
        return !!connection.parent;
    };
    var remove = function () {
        if (!connection.parent)
            return false;
        var parent = connection.parent, key = connection.key;
        if (util_1.isArray(parent)) {
            var index = parent.indexOf(state$);
            parent.splice(index, 1);
        }
        else {
            delete parent[key];
        }
        return true;
    };
    var uid = 0;
    var consuming = false;
    var deferred = util_1.createDeferred();
    var doResolve = function (n) {
        if (n !== uid)
            return;
        deferred.resolve(exports.getState(state$));
        deferred = util_1.createDeferred();
        consuming = false;
    };
    var notify = function () {
        immutable.mark();
        if (consuming) {
            // tslint:disable-next-line: no-floating-promises
            Promise.resolve(++uid).then(doResolve); // debounced by promise
        }
        if (connection.parent) {
            connection.parent[INTERNAL].notify();
        }
    };
    var handlers = {
        get: function (target, key, receiver) {
            if (key === INTERNAL)
                return internal;
            return Reflect.get(target, key, receiver);
        },
        set: function (target, key, value, receiver) {
            var prevValue = target[key];
            if (prevValue === value)
                return true;
            if (typeof key === 'symbol') {
                return Reflect.set(target, key, value, receiver);
            }
            if (isArrayType && key === 'length' && value < target.length) {
                // disconnect coitem when reduce array.length
                for (var i = value; i < target.length; i++) {
                    var item = target[i];
                    if (exports.isReactive(item)) {
                        item[INTERNAL].disconnect();
                    }
                }
            }
            // connect current value
            if (util_1.isObject(value) || util_1.isArray(value)) {
                value = exports.reactive(value);
                value[INTERNAL].connect(state$, key);
            }
            // disconnect previous value
            if (exports.isReactive(prevValue)) {
                prevValue[INTERNAL].disconnect();
            }
            Reflect.set(target, key, value, receiver);
            notify();
            return true;
        },
        deleteProperty: function (target, key) {
            if (typeof key === 'symbol') {
                return Reflect.deleteProperty(target, key);
            }
            var value = target[key];
            if (exports.isReactive(value)) {
                value[INTERNAL].disconnect();
            }
            Reflect.deleteProperty(target, key);
            notify();
            return true;
        }
    };
    var state$ = new Proxy(target, handlers);
    var immutable = createImmutable(state$);
    var internal = {
        compute: immutable.compute,
        connect: connect,
        disconnect: disconnect,
        isConnected: isConnected,
        notify: notify,
        remove: remove,
        get promise() {
            consuming = true;
            return deferred.promise;
        }
    };
    util_1.merge(state$, state);
    return state$;
};
exports.watch = function (state$, watcher) {
    if (!exports.isReactive(state$)) {
        throw new Error("Expected reactive state, but received " + state$);
    }
    if (typeof watcher !== 'function') {
        throw new Error("Expected watcher to be a function, instead of " + watcher);
    }
    var unwatched = false;
    var consume = function (state) {
        if (unwatched)
            return;
        watcher(state);
        f();
    };
    var f = function () {
        if (unwatched)
            return;
        state$[INTERNAL].promise.then(consume);
    };
    f();
    return function () {
        unwatched = true;
    };
};
exports.remove = function (state$) {
    if (!exports.isReactive(state$)) {
        throw new Error("Expected reactive state, but got " + state$);
    }
    return state$[INTERNAL].remove();
};
//# sourceMappingURL=reactive.js.map