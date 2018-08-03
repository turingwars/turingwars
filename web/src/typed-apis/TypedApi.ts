import * as express from 'express';

// tslint:disable:interface-name
// tslint:disable:interface-over-type-literal
// tslint:disable:no-consecutive-blank-lines

// === TypeScript tricks

/**
 * A promise of T or just T.
 */
type PromiseOrValue<T> = PromiseLike<T> | T;

/**
 * The general form of a constructor
 */
type Construtor<T> = { new (...args: any[]): T };

/**
 * The instance type of a constructor or the identity if T is not a constructor.
 */
type UnwrapConstructor<T> = T extends Construtor<infer F> ? F : T;

/**
 * T without U.
 */
type Diff<T, U> = T extends U ? never : T;

/**
 * Removes key K from object T
 */
type RemoveKey<T, K> = { [Key in Diff<keyof T, K>]: T[Key]; };


// === API typings

interface EndpointDefinition {
    path: string;
    method: string;
    params?: { [K: string]: any };
    query?: string[];
    body?: any;
    response: any;
}

export interface ApiDefinition {
    [k: string]: EndpointDefinition;
}

export function createAPI<T extends ApiDefinition>(def: T): T {
    return def;
}

// === express-specific types

/**
 * An express Request with proper typings.
 */
interface TypedRequest<T extends EndpointDefinition> extends Express.Request {
    body: T['body'];
    params: T['params'];
    query: T['query'];
}

/**
 * Generic, typed, user-defined route handler.
 */
type RouteHandler<T extends EndpointDefinition> =
        (req: TypedRequest<T>, res: Express.Response) => PromiseOrValue<UnwrapConstructor<T['response']>>;

/**
 * Set of user-defined route handlers.
 */
type DefinedRouterRoutes<T extends ApiDefinition, K extends keyof T> = {
    [Key in K]: RouteHandler<T[Key]>
};

/**
 * A builder object to construct a fully typed router.
 */
type RouterBuilder<T extends ApiDefinition, Defined extends keyof T> = {
    [ K in Diff<keyof T, Defined> ]: RouterEndpointBuilder<T, K>;
} & {
    __routes: DefinedRouterRoutes<T, Defined>
};

type RouterEndpointBuilder<
    T extends ApiDefinition,
    K extends keyof T> =
        <DefKeys extends keyof T>(this: RouterBuilder<T, DefKeys>, h: RouteHandler<T[K]>) =>
        RouterBuilder<T, DefKeys | K>;

/**
 * A fully-defined router builder.
 */
interface CompleteRouterBuilder<T extends ApiDefinition> {
    __routes: {
        [K in keyof T]: RouteHandler<T[K]>;
    };
}

/**
 * A function where the user must define a fully typed router.
 */
type RouterDefinitionFn<T extends ApiDefinition> = (r: RouterBuilder<T, never>) => CompleteRouterBuilder<T>;

// === express-specific runtime

export function createRouter<T extends ApiDefinition>(_def: T, _fn: RouterDefinitionFn<T>): express.Router {
    // TODO
}

function makeRouterBuilder<T extends ApiDefinition>(def: T): RouterBuilder<T, never> {
    const ret: RouterBuilder<T, never> = {
        __routes: {}
    };

    const keys = Object.keys(def) as Array<keyof T>;
    for (const k of keys) {
        ret[k] = makeRouterRouteBuilder(k);
    }

    return ret;
}

function makeRouterRouteBuilder<
        T extends ApiDefinition,
        Defined extends keyof T,
        K extends Diff<keyof T, Defined>>(k: K) {
    return function(this: RouterBuilder<T, Defined>, handler: RouteHandler<T[K]>): RouterBuilder<T, Defined | K> {
        const ret: RouterBuilder<RemoveKey<T, K>, Defined & DefinedRouterRoutes<K, T>> = {} as any;
        Object.assign(ret, this);
        delete ret[k as any];
        ret.__routes = {};
        Object.assign(ret.__routes, this.__routes);
        ret.__routes[k] = handler;

        const partialRoute: DefinedRouterRoutes<T, K> = Object.defineProperty({}, k, handler);
        const routes: DefinedRouterRoutes<T, Defined | K> = Object.assign({}, this.__routes, partialRoute);


        const thisCopy = Object.assign({}, this);
        Object.defineProperties

        const builder: { [ Key in Diff<Diff<keyof T, Defined>, K> ]:
            RouterEndpointBuilder<T, Defined | K, Key> } =
            removeKey(this, k);

        delete builder[k];

        return {
            ...builder,
            __routes: routes
        };
    };
}


function removeKey<T, K extends keyof T>(t: T, k: K): { [Key in Diff<keyof T, K>]: T[Key]; } {
    const ret = Object.assign({}, t);
    delete ret[k];
    return ret;
}
