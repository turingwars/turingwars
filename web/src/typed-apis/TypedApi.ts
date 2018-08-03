import * as express from 'express';


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
type DefinedRouterRoutes<K extends keyof T, T extends ApiDefinition> = {
    [Key in K]: RouteHandler<T[Key]>
};

/**
 * A builder object to construct a fully typed router.
 */
type RouterBuilder<T extends ApiDefinition, Defined extends { [K: string]: RouteHandler<any> }> = {
    [ K in keyof T ]: (h: RouteHandler<T[K]>) => RouterBuilder<RemoveKey<T, K>, Defined & DefinedRouterRoutes<K, T>>;
} & {
    __routes: Defined
};

/**
 * A fully-defined router builder.
 */
type CompleteRouterBuilder<T extends ApiDefinition> = {
    __routes: {
        [K in keyof T]: RouteHandler<T[K]>;
    };
};

/**
 * A function where the user must define a fully typed router.
 */
type RouterDefinitionFn<T extends ApiDefinition> = (r: RouterBuilder<T, {}>) => CompleteRouterBuilder<T>;

// === express-specific runtime

export function createRouter<T extends ApiDefinition>(_def: T, _fn: RouterDefinitionFn<T>): express.Router {
    // TODO
}
