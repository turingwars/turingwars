
// tslint:disable:interface-name
// tslint:disable:interface-over-type-literal
// tslint:disable:no-consecutive-blank-lines

// === TypeScript tricks

/**
 * The general form of a constructor
 */
type Construtor<T> = { new (...args: any[]): T };

/**
 * The instance type of a constructor or the identity if T is not a constructor.
 */
type UnwrapConstructor<T> = T extends Construtor<infer F> ? F : T;

type UnwrapBlueprintType<T> = T extends Array<infer U> ? Array<UnwrapConstructor<U>> : UnwrapConstructor<T>;

type NotNullable<T> = T extends undefined ? never : T;

// === API typings

type HttpMethod = 'GET' | 'PUT' | 'POST' | 'DELETE';

export interface EndpointDefinition {
    path: string;
    method: HttpMethod;
    params?: { [K: string]: any };
    query?: { [K: string]: any };
    body?: any;
    response: any;
}

export interface ApiDefinition {
    [k: string]: EndpointDefinition;
}

type IsInRecord<T, Key extends keyof T> = T extends Record<Key, any> ? Key : never;
type KeyIfDefined<T, Key extends keyof T> = Key extends IsInRecord<T, Key> ? Key : never;

export type UnwrappedEndpoint<T extends EndpointDefinition> = {
    path: T['path'];
    method: T['method'];
} & {
    [K in KeyIfDefined<T, 'params' | 'query'>]: T[K];
} & {
    [K in KeyIfDefined<T, 'body' | 'response'>]: UnwrapBlueprintType<T[K]>;
};

export type UnwrappedApiDefinition<T extends ApiDefinition> = {
    [K in keyof T]: UnwrappedEndpoint<T[K]>;
};

export function createAPI<T extends ApiDefinition>(def: T): UnwrappedApiDefinition<T> {
    return def as any as UnwrappedApiDefinition<T>;
}

export function getPathWithParams(def: EndpointDefinition) {
    return def.path + trailingSlashIfNeeded(def.params) + Object.keys(def.params || {}).map((k) => `:${k}`).join('/');
}

export function makePathWithParams<T extends EndpointDefinition>(def: T, params: T['params']) {
    if (isNotUndefined(params)) {
        return def.path + trailingSlashIfNeeded(params) + Object.keys(params).map((k) => `${params[k]}`).join('/');
    }
    return def.path;
}

function trailingSlashIfNeeded(params?: {}) {
    if (params != null && Object.keys(params).length > 0) {
        return '/';
    }
    return '';
}

function isNotUndefined<T>(x: T): x is NotNullable<T> {
    return typeof x !== 'undefined';
}
