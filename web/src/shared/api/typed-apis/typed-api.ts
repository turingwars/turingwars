import * as rt from 'runtypes';

interface PathWithParams<A> {
    base: string;
    params: A
}

// TODO: maybe extract to own file
export class EndpointBuilder<T> {

    constructor(public readonly def: Readonly<T>) {};

    public method<U extends HttpMethod>(method: U) {
        return new EndpointBuilder<T & { method: U }>(Object.assign({}, this.def, { method }));
    }
    
    public path<U extends PathWithParams<string[]>>(path: U) {
        return new EndpointBuilder<T & { path: U }>(Object.assign({}, this.def, { path }));
    }

    public response<U>(response: U) {
        return new EndpointBuilder<T & { response: U }>(Object.assign({}, this.def, { response }));
    }

    public body<U>(body: U) {
        return new EndpointBuilder<T & { body: U }>(Object.assign({}, this.def, { body }));
    }

    public query<U extends QueryParams>(query: U) {
        return new EndpointBuilder<T & { query: U }>(Object.assign({}, this.def, { query }));
    }
}

const defaultMethod: 'GET' = 'GET';

export interface InitialEndpointDefinition<Params> {
    path: string[];
    params: Params;
    method: typeof defaultMethod;
}

export interface EmptyInitialEndpointDefinition {
    path: string[];
    method: typeof defaultMethod;
}

export function endpoint(path: string): EndpointBuilder<EmptyInitialEndpointDefinition>;
export function endpoint<A extends string>(strings: TemplateStringsArray, a: A): EndpointBuilder<InitialEndpointDefinition<[A]>>;
export function endpoint<A extends string, B extends string>(strings: TemplateStringsArray, a: A, b: B): EndpointBuilder<InitialEndpointDefinition<[A, B]>>;
export function endpoint<A extends string, B extends string, C extends string>(strings: TemplateStringsArray, a: A, b: B, c: C): EndpointBuilder<InitialEndpointDefinition<[A, B, C]>>;
export function endpoint<A extends string, B extends string, C extends string, D extends string>(strings: TemplateStringsArray, a: A, b: B, c: C, d: D): EndpointBuilder<InitialEndpointDefinition<[A, B, C, D]>>;
export function endpoint<A extends string, B extends string, C extends string, D extends string, E extends string>(strings: TemplateStringsArray, a: A, b: B, c: C, d: D, e: E): EndpointBuilder<InitialEndpointDefinition<[A, B, C, D, E]>>;
export function endpoint<A extends string, B extends string, C extends string, D extends string, E extends string, F extends string>(strings: TemplateStringsArray, a: A, b: B, c: C, d: D, e: E, f: F): EndpointBuilder<InitialEndpointDefinition<[A, B, C, D, E, F]>>;
export function endpoint<A extends string, B extends string, C extends string, D extends string, E extends string, F extends string, G extends string>(strings: TemplateStringsArray, a: A, b: B, c: C, d: D, e: E, f: F, g: G): EndpointBuilder<InitialEndpointDefinition<[A, B, C, D, E, F, G]>>;
export function endpoint<A extends string, B extends string, C extends string, D extends string, E extends string, F extends string, G extends string, H extends string>(strings: TemplateStringsArray, a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H): EndpointBuilder<InitialEndpointDefinition<[A, B, C, D, E, F, G, H]>>;
export function endpoint<A extends string, B extends string, C extends string, D extends string, E extends string, F extends string, G extends string, H extends string, I extends string>(strings: TemplateStringsArray, a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H, i: I): EndpointBuilder<InitialEndpointDefinition<[A, B, C, D, E, F, G, H, I]>>;
export function endpoint<A extends string, B extends string, C extends string, D extends string, E extends string, F extends string, G extends string, H extends string, I extends string, J extends string>(strings: TemplateStringsArray, a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H, i: I, j: J): EndpointBuilder<InitialEndpointDefinition<[A, B, C, D, E, F, G, H, I, J]>>;
export function endpoint<A extends string, B extends string, C extends string, D extends string, E extends string, F extends string, G extends string, H extends string, I extends string, J extends string, K extends string>(strings: TemplateStringsArray, a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H, i: I, j: J, k: K): EndpointBuilder<InitialEndpointDefinition<[A, B, C, D, E, F, G, H, I, J, K]>>;
export function endpoint<A extends string, B extends string, C extends string, D extends string, E extends string, F extends string, G extends string, H extends string, I extends string, J extends string, K extends string, L extends string>(strings: TemplateStringsArray, a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H, i: I, j: J, k: K, l: L): EndpointBuilder<InitialEndpointDefinition<[A, B, C, D, E, F, G, H, I, J, K, L]>>;
export function endpoint<A extends string, B extends string, C extends string, D extends string, E extends string, F extends string, G extends string, H extends string, I extends string, J extends string, K extends string, L extends string, M extends string>(strings: TemplateStringsArray, a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H, i: I, j: J, k: K, l: L, m: M): EndpointBuilder<InitialEndpointDefinition<[A, B, C, D, E, F, G, H, I, J, K, L, M]>>;
export function endpoint<A extends string, B extends string, C extends string, D extends string, E extends string, F extends string, G extends string, H extends string, I extends string, J extends string, K extends string, L extends string, M extends string, N extends string>(strings: TemplateStringsArray, a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H, i: I, j: J, k: K, l: L, m: M, n: N): EndpointBuilder<InitialEndpointDefinition<[A, B, C, D, E, F, G, H, I, J, K, L, M, N]>>;
export function endpoint<A extends string, B extends string, C extends string, D extends string, E extends string, F extends string, G extends string, H extends string, I extends string, J extends string, K extends string, L extends string, M extends string, N extends string, O extends string>(strings: TemplateStringsArray, a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H, i: I, j: J, k: K, l: L, m: M, n: N, o: O): EndpointBuilder<InitialEndpointDefinition<[A, B, C, D, E, F, G, H, I, J, K, L, M, N, O]>>;
export function endpoint<A extends string, B extends string, C extends string, D extends string, E extends string, F extends string, G extends string, H extends string, I extends string, J extends string, K extends string, L extends string, M extends string, N extends string, O extends string, P extends string>(strings: TemplateStringsArray, a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H, i: I, j: J, k: K, l: L, m: M, n: N, o: O, p: P): EndpointBuilder<InitialEndpointDefinition<[A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P]>>;
export function endpoint<A extends string, B extends string, C extends string, D extends string, E extends string, F extends string, G extends string, H extends string, I extends string, J extends string, K extends string, L extends string, M extends string, N extends string, O extends string, P extends string, Q extends string>(strings: TemplateStringsArray, a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H, i: I, j: J, k: K, l: L, m: M, n: N, o: O, p: P, q: Q): EndpointBuilder<InitialEndpointDefinition<[A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q]>>;
export function endpoint<A extends string, B extends string, C extends string, D extends string, E extends string, F extends string, G extends string, H extends string, I extends string, J extends string, K extends string, L extends string, M extends string, N extends string, O extends string, P extends string, Q extends string, R extends string>(strings: TemplateStringsArray, a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H, i: I, j: J, k: K, l: L, m: M, n: N, o: O, p: P, q: Q, r: R): EndpointBuilder<InitialEndpointDefinition<[A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R]>>;
export function endpoint<A extends string, B extends string, C extends string, D extends string, E extends string, F extends string, G extends string, H extends string, I extends string, J extends string, K extends string, L extends string, M extends string, N extends string, O extends string, P extends string, Q extends string, R extends string, S extends string>(strings: TemplateStringsArray, a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H, i: I, j: J, k: K, l: L, m: M, n: N, o: O, p: P, q: Q, r: R, s: S): EndpointBuilder<InitialEndpointDefinition<[A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S]>>;
export function endpoint<A extends string, B extends string, C extends string, D extends string, E extends string, F extends string, G extends string, H extends string, I extends string, J extends string, K extends string, L extends string, M extends string, N extends string, O extends string, P extends string, Q extends string, R extends string, S extends string, T extends string>(strings: TemplateStringsArray, a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H, i: I, j: J, k: K, l: L, m: M, n: N, o: O, p: P, q: Q, r: R, s: S, t: T): EndpointBuilder<InitialEndpointDefinition<[A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T]>>;
export function endpoint(pathOrStaticParts: TemplateStringsArray | string, ...params: string[]): EndpointBuilder<InitialEndpointDefinition<string[]>> {
    
    console.log("ENDPOINT")
    console.log(pathOrStaticParts)
    console.log(params);

    if (typeof pathOrStaticParts === 'string') {
        return new EndpointBuilder({
            path: [ pathOrStaticParts ],
            method: defaultMethod,
            params: []
        });
    }

    return new EndpointBuilder({
        path: pathOrStaticParts.slice(),
        params: params || [],
        method: defaultMethod
    });
}


type HttpMethod = 'GET' | 'PUT' | 'POST' | 'DELETE';

export const Api = <T extends ApiDefinition>(api: T) => api

export const Endpoint = <T extends EndpointDefinition>(def: T | EndpointDefinition): T => def as T

export type ArrayQueryParam = rt.Array<rt.String | rt.Number | rt.Array<rt.String | rt.Number>>;
export type QueryParam = rt.String | rt.Number | ArrayQueryParam | rt.Record<QueryParams>;
export type QueryParams = { [K: string]: QueryParam };

export interface EndpointDefinition {
    path: string[];
    method: HttpMethod;
    params?: string[];
    query?: QueryParams;
    body?: rt.Runtype;
    response: rt.Runtype;
}

export interface ApiDefinition {
    [k: string]: EndpointBuilder<EndpointDefinition>;
}

// TODO: Clean these methods

export function getPathWithParams(def: EndpointDefinition): string {
    let i = 1;
    return def.path[0] + trailingSlashIfNeeded(def.params) + Object.keys(def.params || {}).map((k) => `:${k}` + def.path[i++]).join('');
}

export function makePathWithParams<T extends EndpointDefinition>(def: T, params: {[key: string]: string} | undefined): string {
    if (isNotUndefined(def.params) && isNotUndefined(params) ) {
        let i = 1;
        return def.path[0] + trailingSlashIfNeeded(def.params) + def.params.map((p) => params[p] + def.path[i++]).join('');
    }
    return def.path[0];
}

function trailingSlashIfNeeded(params?: string[]) {
    if (params != null && params.length > 0) {
        return '/';
    }
    return '';
}

type NotUndefined<T> = T extends undefined ? never : T;
function isNotUndefined<T>(x: T): x is NotUndefined<T> {
    return typeof x !== 'undefined';
}


export type RealTypeBase<T> = T extends rt.Runtype ? rt.Static<T> : T;

export type RealType<T> =
        T extends rt.Runtype ? rt.Static<T> :
        T extends [ infer A ] ? [ RealTypeBase<A> ] :
        T extends [ infer A, infer B ] ? [ RealTypeBase<A>, RealTypeBase<B> ] :
        T extends [ infer A, infer B, infer C ] ? [ RealTypeBase<A>, RealTypeBase<B>, RealTypeBase<C> ] :
        T extends { [k: string]: any } ? { [K in keyof T]: RealType<T[K]> } :
        T;

export type Tuple2Dict<T> = T extends [ infer A ] ? A extends string ? { [key in A]: string } : never
    : T extends [ infer A, infer B ] ? A extends string ? B extends string ? { [key in A | B]: string } : never : never
    : T extends [ infer A, infer B, infer C ] ? A extends string ? B extends string ? C extends string ? { [key in A | B | C]: string } : never : never : never
    : T extends [ infer A, infer B, infer C, infer D ] ? A extends string ? B extends string ? C extends string ? D extends string ? { [key in A | B | C | D]: string } : never : never : never : never
    : T extends [ infer A, infer B, infer C, infer D, infer E ] ? A extends string ? B extends string ? C extends string ? D extends string ? E extends string ? { [key in A | B | C | D | E]: string } : never : never : never : never : never
    : T extends [ infer A, infer B, infer C, infer D, infer E, infer F ] ? A extends string ? B extends string ? C extends string ? D extends string ? E extends string ? F extends string ? { [key in A | B | C | D | E | F]: string } : never : never : never : never : never : never
    : T extends [ infer A, infer B, infer C, infer D, infer E, infer F, infer G ] ? A extends string ? B extends string ? C extends string ? D extends string ? E extends string ? F extends string ? G extends string ? { [key in A | B | C | D | E | F | G]: string } : never : never : never : never : never : never : never
    : T extends [ infer A, infer B, infer C, infer D, infer E, infer F, infer G, infer H ] ? A extends string ? B extends string ? C extends string ? D extends string ? E extends string ? F extends string ? G extends string ? H extends string ? { [key in A | B | C | D | E | F | G | H]: string } : never : never : never : never : never : never : never : never
    : { [key in string]: string };
