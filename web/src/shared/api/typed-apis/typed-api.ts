import { Runtype, Static } from 'runtypes';

// tslint:disable:interface-name
// tslint:disable:interface-over-type-literal
// tslint:disable:no-consecutive-blank-lines

// === API typings

type HttpMethod = 'GET' | 'PUT' | 'POST' | 'DELETE';

export const Api = <T extends ApiDefinition>(api: T) => api

export const Endpoint = <T extends EndpointDefinition>(def: T | EndpointDefinition): T => def as T

export interface EndpointDefinition {
    path: string;
    method: HttpMethod;
    params?: { [K: string]: any };
    query?: { [K: string]: any };
    body?: Runtype;
    response: Runtype;
}

export interface ApiDefinition {
    [k: string]: EndpointDefinition;
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

type NotUndefined<T> = T extends undefined ? never : T;
function isNotUndefined<T>(x: T): x is NotUndefined<T> {
    return typeof x !== 'undefined';
}

export type RealType<T> =
        T extends Runtype ? Static<T> :
        T extends { [k: string]: any} ? { [K in keyof T]: RealType<T[K]> } : T;
