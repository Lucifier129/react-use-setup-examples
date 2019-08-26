export declare const isReactive: (input: any) => boolean;
export declare const getState: <T extends object>(input: T) => T;
export declare const reactive: <T extends object>(state: T) => T;
export declare type Unwatch = () => void;
export declare type Watcher<T> = (state: T) => void;
export declare const watch: <T extends object | any[] = any>(state$: T, watcher: Watcher<T>) => Unwatch;
export declare const remove: <T extends object | any[] = any>(state$: T) => boolean;
