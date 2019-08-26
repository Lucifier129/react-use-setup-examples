"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var reactive_1 = require("./reactive");
var useState = react_1.default.useState, useLayoutEffect = react_1.default.useLayoutEffect, useMemo = react_1.default.useMemo;
function useSetup(setup) {
    var state$ = useMemo(function () { return reactive_1.reactive(setup()); }, []);
    var state = useReactive(state$);
    return state;
}
exports.default = useSetup;
var useReactive = function (state$) {
    var _a = __read(useState(function () { return reactive_1.getState(state$); }), 2), state = _a[0], setState = _a[1];
    useLayoutEffect(function () { return reactive_1.watch(state$, setState); }, []);
    return state;
};
//# sourceMappingURL=use-setup.js.map