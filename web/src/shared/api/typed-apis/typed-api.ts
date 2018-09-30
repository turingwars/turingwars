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

type HttpMethod = 'GET' | 'PUT' | 'POST' | 'DELETE';

export interface InitialEndpointDefinition<Params, METHOD extends HttpMethod | undefined> {
    path: string[];
    params: Params;
    method: METHOD;
}

export interface EmptyInitialEndpointDefinition<METHOD extends HttpMethod | undefined> {
    path: string[];
    method: METHOD;
}

function endpoint(pathOrStaticParts: TemplateStringsArray | string, ...params: string[]): EndpointBuilder<any> {
    if (typeof pathOrStaticParts === 'string') {
        return new EndpointBuilder({
            path: [ pathOrStaticParts ],
            params: []
        });
    }

    return new EndpointBuilder({
        path: pathOrStaticParts.slice(),
        params: params || []
    });
}

export function on(path: string | TemplateStringsArray): EndpointBuilder<EmptyInitialEndpointDefinition<undefined>>;
export function on<A extends string>(strings: TemplateStringsArray, a: A): EndpointBuilder<InitialEndpointDefinition<[A], undefined>>;
export function on<A extends string, B extends string>(strings: TemplateStringsArray, a: A, b: B): EndpointBuilder<InitialEndpointDefinition<[A, B], undefined>>;
export function on<A extends string, B extends string, C extends string>(strings: TemplateStringsArray, a: A, b: B, c: C): EndpointBuilder<InitialEndpointDefinition<[A, B, C], undefined>>;
export function on<A extends string, B extends string, C extends string, D extends string>(strings: TemplateStringsArray, a: A, b: B, c: C, d: D): EndpointBuilder<InitialEndpointDefinition<[A, B, C, D], undefined>>;
export function on<A extends string, B extends string, C extends string, D extends string, E extends string>(strings: TemplateStringsArray, a: A, b: B, c: C, d: D, e: E): EndpointBuilder<InitialEndpointDefinition<[A, B, C, D, E], undefined>>;
export function on<A extends string, B extends string, C extends string, D extends string, E extends string, F extends string>(strings: TemplateStringsArray, a: A, b: B, c: C, d: D, e: E, f: F): EndpointBuilder<InitialEndpointDefinition<[A, B, C, D, E, F], undefined>>;
export function on<A extends string, B extends string, C extends string, D extends string, E extends string, F extends string, G extends string>(strings: TemplateStringsArray, a: A, b: B, c: C, d: D, e: E, f: F, g: G): EndpointBuilder<InitialEndpointDefinition<[A, B, C, D, E, F, G], undefined>>;
export function on<A extends string, B extends string, C extends string, D extends string, E extends string, F extends string, G extends string, H extends string>(strings: TemplateStringsArray, a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H): EndpointBuilder<InitialEndpointDefinition<[A, B, C, D, E, F, G, H], undefined>>;
export function on(pathOrStaticParts: TemplateStringsArray | string, ...params: string[]): EndpointBuilder<InitialEndpointDefinition<string[], undefined>> {
    return endpoint(pathOrStaticParts, ...params);
}

export function GET(path: string | TemplateStringsArray): EndpointBuilder<EmptyInitialEndpointDefinition<'GET'>>;
export function GET<A extends string>(strings: TemplateStringsArray, a: A): EndpointBuilder<InitialEndpointDefinition<[A], 'GET'>>;
export function GET<A extends string, B extends string>(strings: TemplateStringsArray, a: A, b: B): EndpointBuilder<InitialEndpointDefinition<[A, B], 'GET'>>;
export function GET<A extends string, B extends string, C extends string>(strings: TemplateStringsArray, a: A, b: B, c: C): EndpointBuilder<InitialEndpointDefinition<[A, B, C], 'GET'>>;
export function GET<A extends string, B extends string, C extends string, D extends string>(strings: TemplateStringsArray, a: A, b: B, c: C, d: D): EndpointBuilder<InitialEndpointDefinition<[A, B, C, D], 'GET'>>;
export function GET<A extends string, B extends string, C extends string, D extends string, E extends string>(strings: TemplateStringsArray, a: A, b: B, c: C, d: D, e: E): EndpointBuilder<InitialEndpointDefinition<[A, B, C, D, E], 'GET'>>;
export function GET<A extends string, B extends string, C extends string, D extends string, E extends string, F extends string>(strings: TemplateStringsArray, a: A, b: B, c: C, d: D, e: E, f: F): EndpointBuilder<InitialEndpointDefinition<[A, B, C, D, E, F], 'GET'>>;
export function GET<A extends string, B extends string, C extends string, D extends string, E extends string, F extends string, G extends string>(strings: TemplateStringsArray, a: A, b: B, c: C, d: D, e: E, f: F, g: G): EndpointBuilder<InitialEndpointDefinition<[A, B, C, D, E, F, G], 'GET'>>;
export function GET<A extends string, B extends string, C extends string, D extends string, E extends string, F extends string, G extends string, H extends string>(strings: TemplateStringsArray, a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H): EndpointBuilder<InitialEndpointDefinition<[A, B, C, D, E, F, G, H], 'GET'>>;
export function GET(pathOrStaticParts: TemplateStringsArray | string, ...params: string[]): EndpointBuilder<InitialEndpointDefinition<string[], 'GET'>> {
    return endpoint(pathOrStaticParts, ...params).method('GET');
}

export function PUT(path: string | TemplateStringsArray): EndpointBuilder<EmptyInitialEndpointDefinition<'PUT'>>;
export function PUT<A extends string>(strings: TemplateStringsArray, a: A): EndpointBuilder<InitialEndpointDefinition<[A], 'PUT'>>;
export function PUT<A extends string, B extends string>(strings: TemplateStringsArray, a: A, b: B): EndpointBuilder<InitialEndpointDefinition<[A, B], 'PUT'>>;
export function PUT<A extends string, B extends string, C extends string>(strings: TemplateStringsArray, a: A, b: B, c: C): EndpointBuilder<InitialEndpointDefinition<[A, B, C], 'PUT'>>;
export function PUT<A extends string, B extends string, C extends string, D extends string>(strings: TemplateStringsArray, a: A, b: B, c: C, d: D): EndpointBuilder<InitialEndpointDefinition<[A, B, C, D], 'PUT'>>;
export function PUT<A extends string, B extends string, C extends string, D extends string, E extends string>(strings: TemplateStringsArray, a: A, b: B, c: C, d: D, e: E): EndpointBuilder<InitialEndpointDefinition<[A, B, C, D, E], 'PUT'>>;
export function PUT<A extends string, B extends string, C extends string, D extends string, E extends string, F extends string>(strings: TemplateStringsArray, a: A, b: B, c: C, d: D, e: E, f: F): EndpointBuilder<InitialEndpointDefinition<[A, B, C, D, E, F], 'PUT'>>;
export function PUT<A extends string, B extends string, C extends string, D extends string, E extends string, F extends string, G extends string>(strings: TemplateStringsArray, a: A, b: B, c: C, d: D, e: E, f: F, g: G): EndpointBuilder<InitialEndpointDefinition<[A, B, C, D, E, F, G], 'PUT'>>;
export function PUT<A extends string, B extends string, C extends string, D extends string, E extends string, F extends string, G extends string, H extends string>(strings: TemplateStringsArray, a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H): EndpointBuilder<InitialEndpointDefinition<[A, B, C, D, E, F, G, H], 'PUT'>>;
export function PUT(pathOrStaticParts: TemplateStringsArray | string, ...params: string[]): EndpointBuilder<InitialEndpointDefinition<string[], 'PUT'>> {
    return endpoint(pathOrStaticParts, ...params).method('PUT');
}

export function POST(path: string | TemplateStringsArray): EndpointBuilder<EmptyInitialEndpointDefinition<'POST'>>;
export function POST<A extends string>(strings: TemplateStringsArray, a: A): EndpointBuilder<InitialEndpointDefinition<[A], 'POST'>>;
export function POST<A extends string, B extends string>(strings: TemplateStringsArray, a: A, b: B): EndpointBuilder<InitialEndpointDefinition<[A, B], 'POST'>>;
export function POST<A extends string, B extends string, C extends string>(strings: TemplateStringsArray, a: A, b: B, c: C): EndpointBuilder<InitialEndpointDefinition<[A, B, C], 'POST'>>;
export function POST<A extends string, B extends string, C extends string, D extends string>(strings: TemplateStringsArray, a: A, b: B, c: C, d: D): EndpointBuilder<InitialEndpointDefinition<[A, B, C, D], 'POST'>>;
export function POST<A extends string, B extends string, C extends string, D extends string, E extends string>(strings: TemplateStringsArray, a: A, b: B, c: C, d: D, e: E): EndpointBuilder<InitialEndpointDefinition<[A, B, C, D, E], 'POST'>>;
export function POST<A extends string, B extends string, C extends string, D extends string, E extends string, F extends string>(strings: TemplateStringsArray, a: A, b: B, c: C, d: D, e: E, f: F): EndpointBuilder<InitialEndpointDefinition<[A, B, C, D, E, F], 'POST'>>;
export function POST<A extends string, B extends string, C extends string, D extends string, E extends string, F extends string, G extends string>(strings: TemplateStringsArray, a: A, b: B, c: C, d: D, e: E, f: F, g: G): EndpointBuilder<InitialEndpointDefinition<[A, B, C, D, E, F, G], 'POST'>>;
export function POST<A extends string, B extends string, C extends string, D extends string, E extends string, F extends string, G extends string, H extends string>(strings: TemplateStringsArray, a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H): EndpointBuilder<InitialEndpointDefinition<[A, B, C, D, E, F, G, H], 'POST'>>;
export function POST(pathOrStaticParts: TemplateStringsArray | string, ...params: string[]): EndpointBuilder<InitialEndpointDefinition<string[], 'POST'>> {
    return endpoint(pathOrStaticParts, ...params).method('POST');
}

export function DELETE(path: string): EndpointBuilder<EmptyInitialEndpointDefinition<'DELETE'>>;
export function DELETE<A extends string>(strings: TemplateStringsArray, a: A): EndpointBuilder<InitialEndpointDefinition<[A], 'DELETE'>>;
export function DELETE<A extends string, B extends string>(strings: TemplateStringsArray, a: A, b: B): EndpointBuilder<InitialEndpointDefinition<[A, B], 'DELETE'>>;
export function DELETE<A extends string, B extends string, C extends string>(strings: TemplateStringsArray, a: A, b: B, c: C): EndpointBuilder<InitialEndpointDefinition<[A, B, C], 'DELETE'>>;
export function DELETE<A extends string, B extends string, C extends string, D extends string>(strings: TemplateStringsArray, a: A, b: B, c: C, d: D): EndpointBuilder<InitialEndpointDefinition<[A, B, C, D], 'DELETE'>>;
export function DELETE<A extends string, B extends string, C extends string, D extends string, E extends string>(strings: TemplateStringsArray, a: A, b: B, c: C, d: D, e: E): EndpointBuilder<InitialEndpointDefinition<[A, B, C, D, E], 'DELETE'>>;
export function DELETE<A extends string, B extends string, C extends string, D extends string, E extends string, F extends string>(strings: TemplateStringsArray, a: A, b: B, c: C, d: D, e: E, f: F): EndpointBuilder<InitialEndpointDefinition<[A, B, C, D, E, F], 'DELETE'>>;
export function DELETE<A extends string, B extends string, C extends string, D extends string, E extends string, F extends string, G extends string>(strings: TemplateStringsArray, a: A, b: B, c: C, d: D, e: E, f: F, g: G): EndpointBuilder<InitialEndpointDefinition<[A, B, C, D, E, F, G], 'DELETE'>>;
export function DELETE<A extends string, B extends string, C extends string, D extends string, E extends string, F extends string, G extends string, H extends string>(strings: TemplateStringsArray, a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H): EndpointBuilder<InitialEndpointDefinition<[A, B, C, D, E, F, G, H], 'DELETE'>>;
export function DELETE(pathOrStaticParts: TemplateStringsArray | string, ...params: string[]): EndpointBuilder<InitialEndpointDefinition<string[], 'DELETE'>> {
    return endpoint(pathOrStaticParts, ...params).method('DELETE');
}

export const Api = <T extends ApiDefinition>(api: T) => api

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
        T extends [ infer A, infer B, infer C, infer D ] ? [ RealTypeBase<A>, RealTypeBase<B>, RealTypeBase<C>, RealTypeBase<D> ] :
        T extends [ infer A, infer B, infer C, infer D, infer E ] ? [ RealTypeBase<A>, RealTypeBase<B>, RealTypeBase<C>, RealTypeBase<D>, RealTypeBase<E> ] :
        T extends [ infer A, infer B, infer C, infer D, infer E, infer F ] ? [ RealTypeBase<A>, RealTypeBase<B>, RealTypeBase<C>, RealTypeBase<D>, RealTypeBase<E>, RealTypeBase<F> ] :
        T extends [ infer A, infer B, infer C, infer D, infer E, infer F, infer G ] ? [ RealTypeBase<A>, RealTypeBase<B>, RealTypeBase<C>, RealTypeBase<D>, RealTypeBase<E>, RealTypeBase<F>, RealTypeBase<G> ] :
        T extends [ infer A, infer B, infer C, infer D, infer E, infer F, infer G, infer H ] ? [ RealTypeBase<A>, RealTypeBase<B>, RealTypeBase<C>, RealTypeBase<D>, RealTypeBase<E>, RealTypeBase<F>, RealTypeBase<G>, RealTypeBase<H> ] :
        T extends { [k: string]: any } ? { [K in keyof T]: RealType<T[K]> } :
        T;

export type Tuple2Dict<T> = 
      T extends [ infer A ] ? A extends string ? { [key in A]: string } : never
    : T extends [ infer A, infer B ] ? A extends string ? B extends string ? { [key in A | B]: string } : never : never
    : T extends [ infer A, infer B, infer C ] ? A extends string ? B extends string ? C extends string ? { [key in A | B | C]: string } : never : never : never
    : T extends [ infer A, infer B, infer C, infer D ] ? A extends string ? B extends string ? C extends string ? D extends string ? { [key in A | B | C | D]: string } : never : never : never : never
    : T extends [ infer A, infer B, infer C, infer D, infer E ] ? A extends string ? B extends string ? C extends string ? D extends string ? E extends string ? { [key in A | B | C | D | E]: string } : never : never : never : never : never
    : T extends [ infer A, infer B, infer C, infer D, infer E, infer F ] ? A extends string ? B extends string ? C extends string ? D extends string ? E extends string ? F extends string ? { [key in A | B | C | D | E | F]: string } : never : never : never : never : never : never
    : T extends [ infer A, infer B, infer C, infer D, infer E, infer F, infer G ] ? A extends string ? B extends string ? C extends string ? D extends string ? E extends string ? F extends string ? G extends string ? { [key in A | B | C | D | E | F | G]: string } : never : never : never : never : never : never : never
    : T extends [ infer A, infer B, infer C, infer D, infer E, infer F, infer G, infer H ] ? A extends string ? B extends string ? C extends string ? D extends string ? E extends string ? F extends string ? G extends string ? H extends string ? { [key in A | B | C | D | E | F | G | H]: string } : never : never : never : never : never : never : never : never
    : { [key in string]: string };
