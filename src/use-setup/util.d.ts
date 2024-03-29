export declare const isArray: (arg: any) => arg is any[];
export declare const isFunction: (input: any) => boolean;
export declare const isObject: (obj: any) => boolean;
export declare const merge: <T = any>(target: object | T[], source: object | T[]) => object;
interface Deferred<T = any> {
    promise: Promise<T>;
    resolve: (value?: T) => void;
    reject: (reason?: any) => void;
}
export declare const createDeferred: <T>() => Deferred<T>;
export {};
