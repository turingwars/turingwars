import * as express from 'express';

import { ApiDefinition, EndpointDefinition, getPathWithParams } from './typed-api';

/**
 * A promise of T or just T.
 */
type PromiseOrValue<T> = PromiseLike<T> | T;

/**
 * An express Request with proper typings.
 */
interface TypedRequest<T extends EndpointDefinition> extends Express.Request {
    body: T['body'];
    params: T['params'];
    query: T['query'];
}

export type RouteHandler<T extends EndpointDefinition> =
    (req: TypedRequest<T>, res: Express.Response) => PromiseOrValue<T['response']>;

export type RouterDefinition<T extends ApiDefinition> = {
    [K in keyof T]: RouteHandler<T[K]>;
};

export function createRouter<T extends ApiDefinition>(def: T, hash: RouterDefinition<T>): express.Router {
    const router = express.Router();
    for (const i of Object.keys(def)) {
        const endpoint = def[i];
        const path = getPathWithParams(endpoint);
        switch (endpoint.method) {
            case 'GET':
                router.get(path, makeHandler(hash[i].bind(hash)));
                break;
            case 'POST':
                router.post(path, makeHandler(hash[i].bind(hash)));
                break;
            case 'PUT':
                router.put(path, makeHandler(hash[i].bind(hash)));
                break;
            case 'DELETE':
                router.delete(path, makeHandler(hash[i].bind(hash)));
                break;
        }
    }
    return router;
}

export function makeHandler<T extends EndpointDefinition>(fn: RouteHandler<T>) {
    return (req: express.Request, res: express.Response, next: express.NextFunction) =>
        Promise.resolve(fn(req, res))
            .then((data) => {
                if (data !== undefined && !res.headersSent) {
                    res.send(data);
                } else {
                    next();
                }
            })
            .catch(next);
}
